import ToolbarButton from '@/components/toolbar-button';

export default function FocusModeButton({
  isActive,
  toggleFocus,
}: {
  isActive: boolean;
  toggleFocus: () => void;
}) {
  return (
    <ToolbarButton
      label={isActive ? 'Disable Focus Mode' : 'Enable Focus Mode'}
      action={toggleFocus}
      isActive={isActive}
    />
  );
}
