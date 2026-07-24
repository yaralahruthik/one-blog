import { z } from 'zod';
import { type InferSchema, type ToolMetadata } from 'xmcp';
import { generatePostFromTopic, type Provider } from '../lib/convex-client';
import { requireSessionUserId } from '../lib/clerk-session';
import { toToolResult } from '../lib/tool-result';

export const schema = {
  topic: z.string().min(1),
  domain: z.string().min(1),
  provider: z.enum(['openai_web', 'gsc']).optional(),
};

export const metadata: ToolMetadata = {
  name: 'post_generate_from_topic',
  description: 'Research and generate a full blog post for a domain/topic, then save it.',
  annotations: {
    readOnlyHint: false,
    idempotentHint: false,
    destructiveHint: false,
  },
};

export default async function postGenerateFromTopicTool({
  topic,
  domain,
  provider,
}: InferSchema<typeof schema>) {
  const userId = await requireSessionUserId();

  const generated = await generatePostFromTopic({
    userId,
    topic,
    domain,
    provider: provider as Provider | undefined,
  });

  const result = {
    postId: generated._id,
    title: generated.title,
    content: generated.content,
    wordCount: generated.wordCount,
    status: 'published',
    providerUsed: provider ?? 'openai_web',
    dataScope: 'app',
  };

  return toToolResult(result, `Post generated successfully: ${generated.title}`);
}
