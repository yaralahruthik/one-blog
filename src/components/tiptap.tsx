import FillerWordHighlight from '@/features/writer/extensions/filler-word-highlight';
import { Focus } from '@tiptap/extensions';
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRef } from 'react';

export default function Tiptap({
  onUpdate,
}: {
  onUpdate: (content: JSONContent) => void;
}) {
  const savedContent =
    useRef<string>(`<p>I am building a new project to help me write better, I mean a lot better.</p>
<p>This editor you see is part of the experience. Why don't you try out the focus mode?</p>
<p>It will dim out everything except for the focused paragraph.</p>`);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Focus.configure({
        mode: 'all',
      }),
      FillerWordHighlight,
    ],
    content: savedContent.current,
    onUpdate: ({ editor }) => {
      savedContent.current = editor.getHTML();
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
