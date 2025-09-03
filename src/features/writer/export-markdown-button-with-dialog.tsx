import ToolbarButton from '@/components/toolbar-button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createFilename, createFrontmatter } from '@/lib/yaml-utils';
import type { JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { renderToMarkdown } from '@tiptap/static-renderer';
import React from 'react';

type ExportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (title: string, description?: string) => void;
};

function ExportDialog({ open, onOpenChange, onExport }: ExportDialogProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleExport = () => {
    if (title.trim()) {
      onExport(title.trim(), description.trim() || undefined);
      setTitle('');
      setDescription('');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Export Document</AlertDialogTitle>
          <AlertDialogDescription>
            Add a title and description for your document. These details will be
            saved with your markdown file.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Amazing Blog Post"
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief summary of what this post is about..."
              rows={3}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleExport} disabled={!title.trim()}>
            Export
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function ExportMarkdownButtonWithDialog({
  json,
}: {
  json: JSONContent | null;
}) {
  const [showExportDialog, setShowExportDialog] = React.useState(false);

  const handleExport = (title: string, description?: string) => {
    if (!json) {
      return;
    }

    const markdown = renderToMarkdown({
      content: json,
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
    if (!json) {
      // TODO: Toast Message
      return;
    }
    setShowExportDialog(true);
  };

  return (
    <>
      <ToolbarButton label="Export Markdown" action={openExportDialog} />
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={handleExport}
      />
    </>
  );
}
