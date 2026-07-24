import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Topic } from './index';

export default function TopicListStep({
  topics,
  onSelect,
  onReset,
}: {
  topics: Topic[];
  onSelect: (topic: Topic) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">Select a topic to generate a blog post:</p>
      <div className="max-h-96 space-y-2 overflow-y-auto">
        {topics.map((topic, i) => (
          <button
            key={i}
            onClick={() => onSelect(topic)}
            className={cn(
              'hover:bg-accent border-border w-full rounded-md border p-3 text-left transition-colors',
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium">{topic.name}</span>
              <span className="text-muted-foreground shrink-0 text-xs">{topic.searchVolume}</span>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">{topic.reason}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">{topic.trend}</p>
          </button>
        ))}
      </div>
      <Button variant="ghost" size="sm" onClick={onReset} className="mt-2">
        Start over
      </Button>
    </div>
  );
}
