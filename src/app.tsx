import ThemeToggle from '@/components/theme-toggle';
import Tiptap from '@/components/tiptap';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { renderToMarkdown } from '@tiptap/static-renderer';
import React from 'react';

export default function App() {
  const [focusMode, setFocusMode] = React.useState(false);
  const [curJSON, setJSON] = React.useState<JSONContent | null>(null);

  const exportMarkdown = () => {
    if (!curJSON) {
      return;
    }

    const markdown = renderToMarkdown({
      content: curJSON,
      extensions: [StarterKit],
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `blog-post-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative container mx-auto h-svh p-4">
      <div className="flex h-full flex-col gap-4">
        <div className="absolute right-0 bottom-2 flex justify-end gap-2">
          <Button
            size="sm"
            variant={focusMode ? 'secondary' : 'outline'}
            onClick={() => setFocusMode((prev) => !prev)}
          >
            {focusMode ? 'Disable Focus Mode' : 'Enable Focus Mode'}
          </Button>
          <Button size="sm" variant="outline" onClick={exportMarkdown}>
            Export Markdown
          </Button>
          <ThemeToggle />
        </div>
        <div className={cn(focusMode && 'focus-mode')}>
          <Tiptap onUpdate={setJSON} />
        </div>
      </div>
    </div>
  );
}
