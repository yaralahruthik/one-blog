import ThemeToggle from '@/components/theme-toggle';
import Tiptap from '@/components/tiptap';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

export default function App() {
  const [focusMode, setFocusMode] = React.useState(false);

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
          <ThemeToggle />
        </div>
        <div className={cn(focusMode && 'focus-mode')}>
          <Tiptap />
        </div>
      </div>
    </div>
  );
}
