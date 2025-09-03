import ThemeToggle from '@/components/theme-toggle';
import Tiptap from '@/components/tiptap';
import ExportDialog from '@/components/export-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createFrontmatter, createFilename } from '@/lib/yaml-utils';
import { useFullscreen } from 'rooks';
import type { JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { renderToMarkdown } from '@tiptap/static-renderer';
import React from 'react';

export default function App() {
  const [focusMode, setFocusMode] = React.useState(false);
  const [curJSON, setJSON] = React.useState<JSONContent | null>(null);
  const [showExportDialog, setShowExportDialog] = React.useState(false);

  const { isFullscreenEnabled, enableFullscreen, disableFullscreen } =
    useFullscreen();

  const handleExport = (title: string, description?: string) => {
    if (!curJSON) {
      return;
    }

    const markdown = renderToMarkdown({
      content: curJSON,
      extensions: [StarterKit],
    });

    const yamlFrontmatter = createFrontmatter({
      title,
      description,
    });

    const fullContent = yamlFrontmatter + markdown;
    const filename = createFilename(title);

    const blob = new Blob([fullContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openExportDialog = () => {
    if (!curJSON) {
      return;
    }
    setShowExportDialog(true);
  };

  return (
    <div className="relative container mx-auto h-svh p-4">
      <div className="flex h-full flex-col gap-4">
        {!isFullscreenEnabled && (
          <div className="absolute right-0 bottom-2 flex justify-end gap-2">
            <Button
              size="sm"
              variant={focusMode ? 'secondary' : 'outline'}
              onClick={() => setFocusMode((prev) => !prev)}
            >
              {focusMode ? 'Disable Focus Mode' : 'Enable Focus Mode'}
            </Button>
            <Button size="sm" variant="outline" onClick={openExportDialog}>
              Export Markdown
            </Button>
            <Button
              size="sm"
              variant={isFullscreenEnabled ? 'secondary' : 'outline'}
              onClick={enableFullscreen}
            >
              Enter Fullscreen
            </Button>
            <ThemeToggle />
          </div>
        )}
        {isFullscreenEnabled && (
          <div className="absolute top-4 right-4">
            <Button size="sm" variant="secondary" onClick={disableFullscreen}>
              Exit Fullscreen (Esc)
            </Button>
          </div>
        )}
        <div className={cn(focusMode && 'focus-mode')}>
          <Tiptap onUpdate={setJSON} />
        </div>
      </div>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={handleExport}
      />
    </div>
  );
}
