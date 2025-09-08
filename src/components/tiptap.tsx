import { Focus } from '@tiptap/extensions';
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import FillerWordHighlight from '../lib/filler-word-highlight';

export default function Tiptap({
  onUpdate,
}: {
  onUpdate: (content: JSONContent) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Focus.configure({
        mode: 'all',
      }),
      FillerWordHighlight,
    ],
    content: `<p>I am building a new project to help me write better, I mean a lot better.</p>

    <p>This editor you see is part of the experience. Why don't you try out the focus mode?</p>

    <p>It will dim out everything except for the focused paragraph.</p>`,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON());
    },
  });

  return (
    <div className="h-full">
      <EditorContent
        editor={editor}
        className="prose font-ibm-sans dark:prose-invert prose-sm mx-auto h-full max-w-4xl"
      />
    </div>
  );
}
