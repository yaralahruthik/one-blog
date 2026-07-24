import { z } from 'zod';
import { type InferSchema, type ToolMetadata } from 'xmcp';
import { listPosts, type PostStatus } from '../lib/convex-client';
import { requireSessionUserId } from '../lib/clerk-session';
import { toToolResult } from '../lib/tool-result';

export const schema = {
  status: z.enum(['draft', 'generating', 'published']).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  cursor: z.string().optional(),
};

export const metadata: ToolMetadata = {
  name: 'posts_list',
  description: 'List posts for the authenticated user.',
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    destructiveHint: false,
  },
};

export default async function postsListTool({ status, limit, cursor }: InferSchema<typeof schema>) {
  const userId = await requireSessionUserId();

  const result = await listPosts({
    userId,
    status: status as PostStatus | undefined,
    limit,
    cursor,
  });

  return toToolResult(result, `Loaded ${result.items.length} post(s).`);
}
