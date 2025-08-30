import { Focus } from '@tiptap/extensions';
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function Tiptap({
  onUpdate,
}: {
  onUpdate: (content: JSONContent) => void;
}) {
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
    },
  });

  return (
    <div className="font-ibm-sans h-full">
      <EditorContent
        editor={editor}
        className="prose dark:prose-invert prose-sm mx-auto h-full"
      />
    </div>
  );
}
