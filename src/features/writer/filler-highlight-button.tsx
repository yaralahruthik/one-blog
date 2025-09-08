import ToolbarButton from '@/components/toolbar-button';

export default function FillerHighlightButton({
  isActive,
  toggleFillerHighlight,
}: {
  isActive: boolean;
  toggleFillerHighlight: () => void;
}) {
  return (
    <ToolbarButton
      label={isActive ? 'Disable Filler Highlight' : 'Enable Filler Highlight'}
      action={toggleFillerHighlight}
      isActive={isActive}
    />
  );
}
