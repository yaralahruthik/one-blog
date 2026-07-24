import { Loader2 } from 'lucide-react';

export default function GeneratingStep() {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <Loader2 className="text-muted-foreground size-8 animate-spin" />
      <p className="text-muted-foreground text-sm">Researching and writing your blog post...</p>
      <p className="text-muted-foreground text-xs">This may take a minute.</p>
    </div>
  );
}
