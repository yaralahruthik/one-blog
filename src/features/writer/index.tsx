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
  const [isToolbarVisible, setIsToolbarVisible] = React.useState(true);

  const hasUserStartedTypingRef = React.useRef(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleFocus = () => {
    setFocusMode((prev) => !prev);
  };

  const toggleFillerHighlight = () => {
    setFillerHighlight((prev) => !prev);
  };

  const startAutoHideTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsToolbarVisible(false);
    }, 2000);
  };

  const showToolbar = () => {
    setIsToolbarVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const hideToolbar = () => {
    if (!hasUserStartedTypingRef.current) return;
    startAutoHideTimer();
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex h-svh flex-col">
      <div
        className={cn(
          'h-full overflow-y-auto',
          focusMode && 'focus-mode',
          fillerHighlight && 'filler-highlight',
        )}
      >
        <Tiptap
          onUpdate={(json) => {
            setJSON(json);
            if (json && json.content && json.content.length > 0) {
              hasUserStartedTypingRef.current = true;
              startAutoHideTimer();
            }
          }}
        />
      </div>

      <div
        className="relative overflow-hidden"
        onMouseEnter={showToolbar}
        onMouseLeave={hideToolbar}
      >
        <div
          className={cn(
            'flex w-full justify-end gap-1 border-t py-2 transition-all duration-300 ease-in-out',
            isToolbarVisible ? 'translate-y-0' : 'translate-y-full',
          )}
        >
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
    </div>
  );
}
