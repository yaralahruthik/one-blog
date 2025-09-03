import ToolbarButton from '@/components/toolbar-button';
import { useFullscreen } from 'rooks';

export default function FullscreenModeButton() {
  const {
    isFullscreenEnabled,
    enableFullscreen,
    disableFullscreen,
    isFullscreenAvailable,
  } = useFullscreen();

  if (!isFullscreenAvailable) {
    return null;
  }

  if (isFullscreenEnabled) {
    return <ToolbarButton label="Exit Fullscreen" action={disableFullscreen} />;
  }

  return <ToolbarButton label="Enter Fullscreen" action={enableFullscreen} />;
}
