import { z } from 'zod';
import { type InferSchema, type ToolMetadata } from 'xmcp';
import { deletePost } from '../lib/convex-client';
import { requireSessionUserId } from '../lib/clerk-session';
import { toToolResult } from '../lib/tool-result';

export const schema = {
  postId: z.string().min(1),
};

export const metadata: ToolMetadata = {
  name: 'posts_delete',
  description: 'Delete a post for the authenticated user.',
  annotations: {
    readOnlyHint: false,
    idempotentHint: true,
    destructiveHint: true,
  },
};

export default async function postsDeleteTool({ postId }: InferSchema<typeof schema>) {
  const userId = await requireSessionUserId();

  const result = await deletePost({
    userId,
    postId,
  });

  return toToolResult(result, `Deleted post: ${postId}.`);
}
