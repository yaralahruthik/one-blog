import { SignInButton, useAuth, UserButton } from '@clerk/clerk-react';
import { useAction, useQuery } from 'convex/react';
import { Lock, Sparkles, X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { api } from '@convex/_generated/api';

import DomainInputStep from './domain-input-step';
import GeneratingStep from './generating-step';
import PostDoneStep from './post-done-step';
import TopicListStep from './topic-list-step';

export type Topic = {
  name: string;
  searchVolume: string;
  trend: string;
  reason: string;
};

export type GeneratedPost = {
  _id: string;
  title: string;
  content: string;
  wordCount: number;
};

type Step = 'input' | 'topics' | 'generating' | 'done';

export default function AIGenerate() {
  const { isSignedIn, isLoaded } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [domain, setDomain] = React.useState('');
  const [step, setStep] = React.useState<Step>('input');
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [generatedPost, setGeneratedPost] = React.useState<GeneratedPost | null>(null);
  const [loading, setLoading] = React.useState(false);

  const findTrendingTopics = useAction(api.ai.findTrendingTopics);
  const generatePost = useAction(api.ai.generatePost);
  const recentDomains = useQuery(api.topics.recentDomains) ?? [];

  const reset = () => {
    setDomain('');
    setStep('input');
    setTopics([]);
    setError(null);
    setGeneratedPost(null);
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleFindTopics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await findTrendingTopics({ domain: domain.trim() });
      setTopics(result);
      setStep('topics');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find topics');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePost = async (topic: Topic) => {
    setStep('generating');
    setError(null);

    try {
      const result = await generatePost({
        topic: topic.name,
        domain: domain.trim(),
      });
      setGeneratedPost(result);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate post');
      setStep('topics');
    }
  };

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return (
      <div className="fixed right-4 bottom-4 z-50 flex items-center gap-2">
        <SignInButton mode="modal">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Lock className="size-4" />
            Sign in to Generate
          </Button>
        </SignInButton>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="fixed right-4 bottom-4 z-50 flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-1.5">
          <Sparkles className="size-4" />
          Generate
        </Button>
        <UserButton afterSignOutUrl="/" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background border-border w-full max-w-lg rounded-lg border shadow-lg">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">AI Blog Generator</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="p-4">
          {error && (
            <div className="bg-destructive/10 text-destructive mb-4 rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          {step === 'input' && (
            <DomainInputStep
              domain={domain}
              onDomainChange={setDomain}
              onSubmit={handleFindTopics}
              loading={loading}
              recentDomains={recentDomains}
            />
          )}

          {step === 'topics' && (
            <TopicListStep topics={topics} onSelect={handleGeneratePost} onReset={reset} />
          )}

          {step === 'generating' && <GeneratingStep />}

          {step === 'done' && generatedPost && (
            <PostDoneStep post={generatedPost} onGenerateAnother={reset} onClose={handleClose} />
          )}
        </div>
      </div>
    </div>
  );
}
