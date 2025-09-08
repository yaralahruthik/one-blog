import ThemeToggle from '@/components/theme-toggle';
import Tiptap from '@/components/tiptap';
import { cn } from '@/lib/utils';
import type { JSONContent } from '@tiptap/react';
import React from 'react';
import ExportMarkdownButtonWithDialog from './export-markdown-button-with-dialog';
import FillerHighlightButton from './filler-highlight-button';
import FocusModeButton from './focus-mode-button';
import FullscreenModeButton from './fullscreen-mode-button';

export default function Writer() {
  const [focusMode, setFocusMode] = React.useState(false);
  const [fillerHighlight, setFillerHighlight] = React.useState(true);
  const [curJSON, setJSON] = React.useState<JSONContent | null>(null);

  const toggleFocus = () => {
    setFocusMode((prev) => !prev);
  };

  const toggleFillerHighlight = () => {
    setFillerHighlight((prev) => !prev);
  };

  return (
    <div className="flex h-svh flex-col">
      <div
        className={cn(
          'h-full overflow-y-auto',
          focusMode && 'focus-mode',
          fillerHighlight && 'filler-highlight',
        )}
      >
        <Tiptap onUpdate={setJSON} />
      </div>

      <div className="flex w-full shrink-0 justify-end gap-1 border-t">
        <FillerHighlightButton
          isActive={fillerHighlight}
          toggleFillerHighlight={toggleFillerHighlight}
        />
        <FocusModeButton isActive={focusMode} toggleFocus={toggleFocus} />
        <ExportMarkdownButtonWithDialog json={curJSON} />
        <FullscreenModeButton />
        <ThemeToggle />
      </div>
    </div>
  );
}
