import { z } from 'zod';
import { type InferSchema, type ToolMetadata } from 'xmcp';
import { findTrendingTopics, type Provider } from '../lib/convex-client';
import { requireSessionUserId } from '../lib/clerk-session';
import { toToolResult } from '../lib/tool-result';

export const schema = {
  domain: z.string().min(1),
  limit: z.number().int().min(1).max(10).optional(),
  provider: z.enum(['openai_web', 'gsc']).optional(),
};

export const metadata: ToolMetadata = {
  name: 'topics_find_trending',
  description: 'Find trending blog topics for a domain and persist them to One Blog.',
  annotations: {
    readOnlyHint: false,
    idempotentHint: false,
    destructiveHint: false,
  },
};

export default async function topicsFindTrendingTool({
  domain,
  limit,
  provider,
}: InferSchema<typeof schema>) {
  const userId = await requireSessionUserId();

  const topics = await findTrendingTopics({
    userId,
    domain,
    limit,
    provider: provider as Provider | undefined,
  });

  const result = {
    topics,
    providerUsed: provider ?? 'openai_web',
    dataScope: 'app',
    fetchedAt: Date.now(),
  };

  return toToolResult(result, `Found ${topics.length} trending topic(s) for "${domain}".`);
}
