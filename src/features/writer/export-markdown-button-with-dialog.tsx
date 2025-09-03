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
import {
  createFilename,
  createFrontmatter,
  type Frontmatter,
} from '@/lib/yaml-utils';
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

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();

    onExport(title.trim() || '', description.trim() || undefined);
    setTitle('');
    setDescription('');
    onOpenChange(false);
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
            Optionally add a title and description. These details will be saved
            in your markdown file.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleExport} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button" onClick={handleCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction type="submit">Export</AlertDialogAction>
          </AlertDialogFooter>
        </form>
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
    if (!json) return;

    const markdown = renderToMarkdown({
      content: json,
      extensions: [StarterKit],
    });

    const metadata: Frontmatter = {};
    if (title.trim()) metadata.title = title.trim();
    if (description?.trim()) metadata.description = description.trim();

    const yamlFrontmatter = createFrontmatter(metadata);
    const fullContent = yamlFrontmatter + markdown;

    const filename = createFilename(metadata.title);

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
