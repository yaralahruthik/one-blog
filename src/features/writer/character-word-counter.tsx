import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type CounterItemProps = {
  count: number;
  label: string;
};

type CharacterWordCounterProps = {
  charactersCount: number;
  wordsCount: number;
  className?: string;
};

function CounterItem({ count, label }: CounterItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium tabular-nums">{count}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}

export default function CharacterWordCounter({
  charactersCount,
  wordsCount,
  className = '',
}: CharacterWordCounterProps) {
  return (
    <div
      className={cn(
        'text-muted-foreground flex w-full items-center justify-center gap-6 p-2 text-sm',
        className,
      )}
    >
      <CounterItem count={wordsCount} label="words" />
      <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
      <CounterItem count={charactersCount} label="characters" />
    </div>
  );
}
