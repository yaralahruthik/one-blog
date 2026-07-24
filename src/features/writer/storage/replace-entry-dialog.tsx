import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { StoredEntry } from '@/lib/storage';

export default function ReplaceEntryDialog({
  open,
  onOpenChange,
  entries,
  onReplace,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entries: StoredEntry[];
  onReplace: (entryId: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Storage Full</DialogTitle>
          <DialogDescription>
            You can only save up to 10 entries. Choose an entry to replace, or cancel to keep the
            current entries.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-80">
          <div className="grid gap-2 pr-4">
            {entries.map((entry) => (
              <Button
                key={entry.id}
                variant="outline"
                className="h-auto justify-start px-4 py-3 text-left"
                onClick={() => {
                  onReplace(entry.id);
                  onOpenChange(false);
                }}
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{entry.title}</span>
                  <span className="text-muted-foreground text-xs">
                    {entry.wordCount.wordsCount} words • {entry.wordCount.charactersCount}{' '}
                    characters
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
