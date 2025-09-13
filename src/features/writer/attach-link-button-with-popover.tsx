import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { type Editor } from '@tiptap/react';
import React from 'react';

export default function AttachLinkButton({ editor }: { editor: Editor }) {
  const [url, setUrl] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    setUrl('');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm">Attach Link</Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={10} className="px-3 py-2">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            type="url"
            value={url}
            autoFocus
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
          />
          <Button type="submit">Add</Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
