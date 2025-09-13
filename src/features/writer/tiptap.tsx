import { Focus, Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import AttachLinkButton from './attach-link-button-with-popover';
import FillerWordHighlight from './extensions/filler-word-highlight';

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
      Placeholder.configure({
        placeholder: 'Start writing whatever you feel...',
      }),
      FillerWordHighlight,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON());
    },
  });

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
}
