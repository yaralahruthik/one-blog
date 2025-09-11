import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { type Editor } from '@tiptap/react';

export default function AttachLinkButton({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');

  const handleOpen = () => {
    const previousUrl = editor.getAttributes('link').href;
    setUrl(previousUrl || '');
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    editor.chain().focus().blur().run();
  };

  const handleConfirm = () => {
    if (url === '') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
    handleClose();
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button onClick={handleOpen}>Attach Link</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Attach Link</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the URL you want to link to. Leave empty to remove the link.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          type="url"
          placeholder="https://app.oneblog.dev/"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleConfirm();
            }
            if (e.key === 'Escape') {
              handleClose();
            }
          }}
          autoFocus
          data-testid="py-2"
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Add Link
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
