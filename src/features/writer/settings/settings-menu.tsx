import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { JSONContent } from '@tiptap/react';
import { SettingsIcon } from 'lucide-react';
import React from 'react';
import ExportMarkdownDialog from './export-markdown-dialog';
import FullscreenModeDropdownButton from './fullscreen-mode-dropdown-button';
import ThemeToggle from './theme-toggle';

export default function SettingsMenu({
  fillerHighlight,
  toggleFillerHighlight,
  focusMode,
  toggleFocus,
  curJSON,
}: {
  fillerHighlight: boolean;
  toggleFillerHighlight: () => void;
  focusMode: boolean;
  toggleFocus: () => void;
  curJSON: JSONContent | null;
}) {
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <SettingsIcon className="size-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setExportDialogOpen(true)}>
              Export Markdown
            </DropdownMenuItem>
            <ThemeToggle />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuCheckboxItem
              checked={fillerHighlight}
              onCheckedChange={toggleFillerHighlight}
            >
              Highlight Fillers
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={focusMode}
              onCheckedChange={toggleFocus}
            >
              Focus Mode
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <FullscreenModeDropdownButton />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ExportMarkdownDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        json={curJSON}
      />
    </>
  );
}
