import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { renderToMarkdown } from '@tiptap/static-renderer';
import React from 'react';

function createFrontmatter(metadata: { title?: string; description?: string }) {
  const { title, description } = metadata;
  const parts: string[] = [];
  if (title) parts.push(`title: "${escapeYamlString(title)}"`);
  if (description)
    parts.push(`description: "${escapeYamlString(description)}"`);
  return parts.length ? `---\n${parts.join('\n')}\n---\n\n` : '';
}

function escapeYamlString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

function createFilename(title?: string) {
  const documentDate = new Date().toISOString().split('T')[0];
  const safeTitle = title?.trim() || 'untitled';
  const filenameSafeTitle = safeTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `blog-post-${documentDate}-${filenameSafeTitle}.md`;
}

export default function ExportMarkdownDialog({
  json,
  open,
  onOpenChange,
}: {
  json: JSONContent | null;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!json) return;

    const markdown = renderToMarkdown({
      content: json,
      extensions: [StarterKit],
    });

    const metadata: { title?: string; description?: string } = {};
    if (title.trim()) metadata.title = title.trim();
    if (description.trim()) metadata.description = description.trim();

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

    setTitle('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Document</DialogTitle>
          <DialogDescription>
            Optionally add a title and description. These will be saved in the
            markdown frontmatter.
          </DialogDescription>
        </DialogHeader>

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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTitle('');
                setDescription('');
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Export</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
