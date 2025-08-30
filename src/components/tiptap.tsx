import { Focus } from '@tiptap/extensions';
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import nlp from 'compromise';
import { useState, useEffect } from 'react';

type POSTerm = {
  text: string;
  tags: string[];
  normal: string;
  index: [number, number];
  id: string;
  chunk: string;
  dirty: boolean;
  switch?: string;
  confidence?: number;
  implicit?: string;
  machine?: string;
};

type POSSentence = {
  text: string;
  terms: POSTerm[];
};

import type { POSOptionType } from '@/types/pos';

export default function Tiptap({
  onUpdate,
  grammarMode,
  selectedPOSOptions,
  posOptionsList,
}: {
  onUpdate: (content: JSONContent) => void;
  grammarMode: boolean;
  selectedPOSOptions: string[];
  posOptionsList: POSOptionType[];
}) {
  const [posData, setPosData] = useState<POSSentence[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Focus.configure({
        mode: 'deepest',
      }),
    ],
    content: `<p>I am building a new project to help me write better, I mean a lot better.</p>

    <p>This editor you see is part of the experience. Why don't you try out the focus mode?</p>

    <p>It will dim out everything except for the focused paragraph.</p>`,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON());

      const textContent = editor.getText();

      const doc = nlp(textContent);
      const posTagged = doc.json();

      setPosData(posTagged);
    },
  });

  const applyHighlights = () => {
    if (!editor || posData.length === 0) return;

    clearHighlights();

    let htmlContent = editor.getHTML();

    posData.forEach((sentence) => {
      sentence.terms.forEach((term) => {
        const termText = term.text.trim();
        if (!termText) return;

        const termTags = term.tags || [];

        const shouldHighlight = selectedPOSOptions.some((option) => {
          const posOption = posOptionsList.find((opt) => opt.posTag === option);
          return posOption ? termTags.includes(posOption.posTag) : false;
        });

        if (shouldHighlight) {
          const matchingOption = posOptionsList.find((opt) =>
            termTags.includes(opt.posTag),
          );

          if (matchingOption) {
            const escapedText = termText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedText}\\b`, 'gi');

            htmlContent = htmlContent.replace(
              regex,
              `<span class="pos-highlight ${matchingOption.class}" data-pos="${termTags.join(' ')}">${termText}</span>`,
            );
          }
        }
      });
    });

    editor.commands.setContent(htmlContent);
  };

  const clearHighlights = () => {
    if (!editor) return;

    let htmlContent = editor.getHTML();

    htmlContent = htmlContent.replace(
      /<span class="pos-highlight[^"]*"[^>]*>(.*?)<\/span>/g,
      '$1',
    );

    editor.commands.setContent(htmlContent);
  };

  useEffect(() => {
    if (posData.length > 0 && grammarMode && selectedPOSOptions.length > 0) {
      applyHighlights();
    } else if (posData.length > 0) {
      clearHighlights();
    }
  }, [posData, grammarMode, selectedPOSOptions, clearHighlights]);

  return (
    <div className="font-ibm-sans h-full">
      <EditorContent
        editor={editor}
        className="prose dark:prose-invert prose-sm mx-auto h-full"
      />
    </div>
  );
}
