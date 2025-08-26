import { Button } from '@/components/ui/button';

export default function App() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button size="sm">Export Markdown</Button>
          <Button size="sm">Focus Mode</Button>
          <Button size="sm">Syntax Highlighting</Button>
        </div>
        <div>Editor Goes here</div>
      </div>
    </div>
  );
}
