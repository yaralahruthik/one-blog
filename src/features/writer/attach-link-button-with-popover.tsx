import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { type Editor } from '@tiptap/react';
import { useState } from 'react';

export default function AttachLinkButton({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');

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
    // Fix: this is used to remove the text selection and remove the 'Attach Link' button,
    // but the popover is flashing while being closed
    editor.commands.blur();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="sm">Attach Link</Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={10} className="px-3 py-2">
        <div className="flex gap-3">
          <Input
            type="url"
            placeholder="https://app.oneblog.dev/"
            value={url}
            autoFocus
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleConfirm();
              }
            }}
          />
          <Button onClick={handleConfirm}>Add</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
