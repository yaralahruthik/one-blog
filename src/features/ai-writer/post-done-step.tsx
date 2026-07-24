import { Button } from '@/components/ui/button';
import type { GeneratedPost } from './index';

export default function PostDoneStep({
  post,
  onGenerateAnother,
  onClose,
}: {
  post: GeneratedPost;
  onGenerateAnother: () => void;
  onClose: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
        Post generated successfully!
      </div>
      <div className="space-y-1">
        <p className="font-medium">{post.title}</p>
        <p className="text-muted-foreground text-sm">{post.wordCount.toLocaleString()} words</p>
      </div>
      <p className="text-muted-foreground text-xs">Saved to Convex database.</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onGenerateAnother}>
          Generate Another
        </Button>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
