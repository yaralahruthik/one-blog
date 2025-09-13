import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { JSONContent } from '@tiptap/react';
import React from 'react';
import SettingsMenu from './settings/settings-menu';
import Tiptap from './tiptap';

export default function Writer() {
  const [focusMode, setFocusMode] = React.useState(true);
  const [fillerHighlight, setFillerHighlight] = React.useState(true);
  const [curJSON, setJSON] = React.useState<JSONContent | null>(null);

  const toggleFocus = () => setFocusMode((prev) => !prev);
  const toggleFillerHighlight = () => setFillerHighlight((prev) => !prev);

  return (
    <ScrollArea className="h-svh">
      <div
        className={cn(
          'relative h-full',
          focusMode && 'focus-mode',
          fillerHighlight && 'filler-highlight',
        )}
      >
        <div className="fixed top-0 right-2">
          <SettingsMenu
            fillerHighlight={fillerHighlight}
            toggleFillerHighlight={toggleFillerHighlight}
            focusMode={focusMode}
            toggleFocus={toggleFocus}
            curJSON={curJSON}
          />
        </div>
        <Tiptap onUpdate={setJSON} />
      </div>
    </ScrollArea>
  );
}
