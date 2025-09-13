import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useFullscreen } from 'rooks';

export default function FullscreenModeDropdownButton() {
  const { toggleFullscreen, isFullscreenAvailable } = useFullscreen();

  if (!isFullscreenAvailable) {
    return null;
  }

  return (
    <DropdownMenuItem onClick={toggleFullscreen}>
      Toggle Fullscreen
    </DropdownMenuItem>
  );
}
