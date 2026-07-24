import { z } from 'zod';
import { type InferSchema, type ToolMetadata } from 'xmcp';
import { getPost } from '../lib/convex-client';
import { requireSessionUserId } from '../lib/clerk-session';
import { toToolResult } from '../lib/tool-result';

export const schema = {
  postId: z.string().min(1),
};

export const metadata: ToolMetadata = {
  name: 'posts_get',
  description: 'Get a single post by id for the authenticated user.',
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    destructiveHint: false,
  },
};

export default async function postsGetTool({ postId }: InferSchema<typeof schema>) {
  const userId = await requireSessionUserId();
  const post = await getPost({ userId, postId });
  if (!post) {
    throw new Error('Post not found');
  }
  return toToolResult(post, `Loaded post: ${post.title}`);
}
