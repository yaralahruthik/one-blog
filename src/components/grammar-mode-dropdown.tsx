import React from 'react';
import { Button } from '@/components/ui/button';
import type { POSOptionType } from '@/types/pos';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

interface GrammarModeDropdownProps {
  grammarMode: boolean;
  setGrammarMode: (value: boolean) => void;
  selectedPOSOptions: string[];
  setSelectedPOSOptions: (value: string[]) => void;
  posOptionsList: POSOptionType[];
}

export default function GrammarModeDropdown({
  grammarMode,
  setGrammarMode,
  selectedPOSOptions,
  setSelectedPOSOptions,
  posOptionsList,
}: GrammarModeDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Grammar Mode</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Switch checked={grammarMode} onCheckedChange={setGrammarMode} />
          Syntax Control
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {posOptionsList.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.posTag}
            checked={selectedPOSOptions.includes(option.posTag)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedPOSOptions([...selectedPOSOptions, option.posTag]);
              } else {
                setSelectedPOSOptions(
                  selectedPOSOptions.filter((value) => value !== option.posTag),
                );
              }
            }}
            disabled={!grammarMode}
            className="group hover:text-white"
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
