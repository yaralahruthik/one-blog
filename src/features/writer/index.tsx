import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { saveEntry } from '@/lib/storage';
import type { JSONContent } from '@tiptap/react';
import React from 'react';
import { useDebounceFn } from 'rooks';
import SettingsMenu from './settings/settings-menu';
import SaveLoadMenu from './storage/save-load-menu';
import Tiptap, { type TiptapRef } from './tiptap';

export default function Writer() {
  const [focusMode, setFocusMode] = React.useState(true);
  const [fillerHighlight, setFillerHighlight] = React.useState(true);
  const [curJSON, setJSON] = React.useState<JSONContent | null>(null);
  const [wordCount, setWordCount] = React.useState({
    charactersCount: 0,
    wordsCount: 0,
  });
  const [currentEntryId, setCurrentEntryId] = React.useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle');
  const tiptapRef = React.useRef<TiptapRef>(null);
  const toggleFocus = () => setFocusMode((prev) => !prev);
  const toggleFillerHighlight = () => setFillerHighlight((prev) => !prev);

  const handleSave = (replaceEntryId?: string) => {
    if (curJSON) {
      const { entryId } = saveEntry(curJSON, wordCount, replaceEntryId);
      setCurrentEntryId(entryId);
    }
  };

  const performAutoSave = () => {
    if (!curJSON) return;

    setAutoSaveStatus('saving');
    const { entryId } = saveEntry(curJSON, wordCount, currentEntryId || undefined);
    setCurrentEntryId(entryId);
    setAutoSaveStatus('saved');

    setTimeout(() => {
      setAutoSaveStatus('idle');
    }, 2000);
  };

  const [debouncedAutoSave] = useDebounceFn(performAutoSave, 3000);

  React.useEffect(() => {
    if (curJSON && (curJSON.content?.length ?? 0) > 0) {
      debouncedAutoSave();
    }
  }, [curJSON, wordCount, debouncedAutoSave]);

  const handleLoadEntry = (content: JSONContent | string, entryId?: string) => {
    if (tiptapRef.current) {
      tiptapRef.current.loadContent(content);
    }
    setCurrentEntryId(entryId || null);
  };

  return (
    <ScrollArea className="h-svh">
      <div
        className={cn(
          'relative h-full',
          focusMode && 'focus-mode',
          fillerHighlight && 'filler-highlight',
        )}
      >
        <div className="fixed top-0 right-2 flex gap-2">
          {autoSaveStatus !== 'idle' && (
            <div className="text-muted-foreground flex items-center px-3 py-2 text-sm">
              {autoSaveStatus === 'saving' ? 'Saving...' : 'Saved'}
            </div>
          )}
          <SaveLoadMenu onLoadEntry={handleLoadEntry} onSave={handleSave} />
          <SettingsMenu
            fillerHighlight={fillerHighlight}
            toggleFillerHighlight={toggleFillerHighlight}
            focusMode={focusMode}
            toggleFocus={toggleFocus}
            curJSON={curJSON}
            wordCount={wordCount}
          />
        </div>
        <Tiptap ref={tiptapRef} onUpdate={setJSON} onWordCountUpdate={setWordCount} />
      </div>
    </ScrollArea>
  );
}
