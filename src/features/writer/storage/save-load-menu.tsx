import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { StoredEntry } from '@/lib/storage';
import { isStorageFull } from '@/lib/storage';
import type { JSONContent } from '@tiptap/react';
import { useMutation, useQuery } from 'convex/react';
import { Trash2Icon } from 'lucide-react';
import React from 'react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import GeneratedPostsList from './generated-posts-list';
import LoadConfirmationDialog from './load-confirmation-dialog';
import ReplaceEntryDialog from './replace-entry-dialog';

export default function SaveLoadMenu({
  onLoadEntry,
  onSave,
}: {
  onLoadEntry: (content: JSONContent | string, entryId?: string) => void;
  onSave: (replaceEntryId?: string) => void;
}) {
  const [entries, setEntries] = React.useState<StoredEntry[]>([]);
  const [replaceDialogOpen, setReplaceDialogOpen] = React.useState(false);
  const [loadConfirmOpen, setLoadConfirmOpen] = React.useState(false);
  const [selectedEntry, setSelectedEntry] = React.useState<StoredEntry | null>(null);
  const [selectedGeneratedPost, setSelectedGeneratedPost] = React.useState<{
    title: string;
    content: string;
  } | null>(null);

  const generatedPosts = useQuery(api.posts.list);
  const removePost = useMutation(api.posts.remove);

  const handleDeleteGeneratedPost = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    removePost({ id: postId as Id<'posts'> }).catch(console.error);
  };

  const loadEntries = React.useCallback(() => {
    const stored = localStorage.getItem('one-blog-entries');
    setEntries(stored ? JSON.parse(stored) : []);
  }, []);

  React.useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleSave = () => {
    if (isStorageFull()) {
      setReplaceDialogOpen(true);
    } else {
      onSave(undefined);
      loadEntries();
    }
  };

  const handleReplaceEntry = (entryId: string) => {
    onSave(entryId);
    loadEntries();
  };

  const handleLoadClick = (entry: StoredEntry) => {
    setSelectedGeneratedPost(null);
    setSelectedEntry(entry);
    setLoadConfirmOpen(true);
  };

  const handleLoadConfirm = () => {
    if (selectedEntry) {
      onLoadEntry(selectedEntry.content, selectedEntry.id);
      setLoadConfirmOpen(false);
      setSelectedEntry(null);
    } else if (selectedGeneratedPost) {
      onLoadEntry(selectedGeneratedPost.content);
      setLoadConfirmOpen(false);
      setSelectedGeneratedPost(null);
    }
  };

  const handleGeneratedPostClick = (post: { title: string; content: string }) => {
    setSelectedEntry(null);
    setSelectedGeneratedPost(post);
    setLoadConfirmOpen(true);
  };

  const handleDeleteEntry = (e: React.MouseEvent, entryId: string) => {
    e.stopPropagation();
    const updated = entries.filter((ent) => ent.id !== entryId);
    localStorage.setItem('one-blog-entries', JSON.stringify(updated));
    setEntries(updated);
  };

  return (
    <>
      <DropdownMenu onOpenChange={(open) => open && loadEntries()}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span className="sr-only">Save & Load</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72" align="end">
          <DropdownMenuLabel>Save & Load</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleSave}>Save Current</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Saved Entries ({entries.length}/10)</DropdownMenuLabel>
          <ScrollArea className="max-h-64">
            {entries.length === 0 ? (
              <div className="text-muted-foreground p-4 text-center text-sm">
                No saved entries yet
              </div>
            ) : (
              <div className="grid gap-1 p-2">
                {entries.map((entry) => (
                  <DropdownMenuItem
                    key={entry.id}
                    className="flex-col items-start gap-1 p-3"
                    onSelect={() => handleLoadClick(entry)}
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <span className="text-sm font-medium">{entry.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-destructive size-6 shrink-0 opacity-50 hover:opacity-100"
                        onClick={(e) => handleDeleteEntry(e, entry.id)}
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {entry.wordCount.wordsCount} words • {entry.wordCount.charactersCount}{' '}
                      characters
                    </span>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </ScrollArea>
          <GeneratedPostsList
            posts={generatedPosts ?? []}
            onSelect={handleGeneratedPostClick}
            onDelete={handleDeleteGeneratedPost}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <ReplaceEntryDialog
        open={replaceDialogOpen}
        onOpenChange={setReplaceDialogOpen}
        entries={entries}
        onReplace={handleReplaceEntry}
      />

      <LoadConfirmationDialog
        open={loadConfirmOpen}
        onOpenChange={setLoadConfirmOpen}
        entryTitle={selectedEntry?.title || selectedGeneratedPost?.title || ''}
        onConfirm={handleLoadConfirm}
      />
    </>
  );
}
