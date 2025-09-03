import { Button } from '@/components/ui/button';

export default function ToolbarButton({
  label,
  action,
  isActive = false,
}: {
  label: string;
  action: () => void;
  isActive?: boolean;
}) {
  return (
    <Button
      size="sm"
      variant={isActive ? 'secondary' : 'ghost'}
      onClick={action}
    >
      {label}
    </Button>
  );
}
