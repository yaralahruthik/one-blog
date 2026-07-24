import { CharacterCount, Focus, Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { forwardRef, useImperativeHandle } from 'react';
import { Markdown } from 'tiptap-markdown';
import AttachLinkButton from './attach-link-button-with-popover';
import FillerWordHighlight from './extensions/filler-word-highlight';

export interface TiptapRef {
  loadContent: (content: JSONContent | string) => void;
}

const Tiptap = forwardRef<
  TiptapRef,
  {
    onUpdate: (content: JSONContent) => void;
    onWordCountUpdate: (wordCount: { charactersCount: number; wordsCount: number }) => void;
    initialContent?: JSONContent;
  }
>(({ onUpdate, onWordCountUpdate, initialContent }, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Focus.configure({
        mode: 'all',
      }),
      Placeholder.configure({
        placeholder: 'Start writing whatever you feel...',
      }),
      FillerWordHighlight,
      CharacterCount.configure({
        wordCounter: (text) => (text.match(/\b\w+\b/g) || []).length,
      }),
      Markdown,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON());
      onWordCountUpdate({
        charactersCount: editor.storage.characterCount.characters(),
        wordsCount: editor.storage.characterCount.words(),
      });
    },
  });

  useImperativeHandle(ref, () => ({
    loadContent: (content: JSONContent | string) => {
      if (editor) {
        editor.commands.setContent(content);
      }
    },
  }));

  return (
    <div className="h-full">
      {editor && (
        <BubbleMenu editor={editor}>
          <AttachLinkButton editor={editor} />
        </BubbleMenu>
      )}

      <EditorContent
        editor={editor}
        className="prose font-ibm-sans dark:prose-invert mx-auto h-full max-w-4xl p-6"
      />
    </div>
  );
});

Tiptap.displayName = 'Tiptap';

export default Tiptap;
