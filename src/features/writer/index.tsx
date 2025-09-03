import ThemeToggle from '@/components/theme-toggle';
import Tiptap from '@/components/tiptap';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { JSONContent } from '@tiptap/react';
import React from 'react';
import ExportMarkdownButtonWithDialog from './export-markdown-button-with-dialog';
import FocusModeButton from './focus-mode-button';
import FullscreenModeButton from './fullscreen-mode-button';

export default function Writer() {
  const [focusMode, setFocusMode] = React.useState(false);
  const [curJSON, setJSON] = React.useState<JSONContent | null>(null);

  const toggleFocus = () => {
    setFocusMode((prev) => !prev);
  };

  return (
    <div className="flex h-svh flex-col">
      <div className="container mx-auto flex-1 overflow-hidden">
        <div className={cn('h-full', focusMode && 'focus-mode')}>
          <ScrollArea className="h-full">
            <Tiptap onUpdate={setJSON} />
          </ScrollArea>
        </div>
      </div>

      <div className="bg-background flex w-full justify-end gap-1 p-2">
        <FocusModeButton isActive={focusMode} toggleFocus={toggleFocus} />
        <ExportMarkdownButtonWithDialog json={curJSON} />
        <FullscreenModeButton />
        <ThemeToggle />
      </div>
    </div>
  );
}
