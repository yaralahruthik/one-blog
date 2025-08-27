import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function Tiptap() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World!</p>',
  });

  return (
    <div className="font-ibm-sans h-full p-4">
      <EditorContent editor={editor} className="h-full" />
    </div>
  );
}
