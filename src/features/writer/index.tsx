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
      <ScrollArea
        className={cn('flex-1 overflow-y-auto', focusMode && 'focus-mode')}
      >
        <Tiptap onUpdate={setJSON} />
      </ScrollArea>

      <div className="flex w-full shrink-0 justify-end gap-1 border-t">
        <FocusModeButton isActive={focusMode} toggleFocus={toggleFocus} />
        <ExportMarkdownButtonWithDialog json={curJSON} />
        <FullscreenModeButton />
        <ThemeToggle />
      </div>
    </div>
  );
}
