import { ConvexHttpClient } from 'convex/browser';
import { anyApi } from 'convex/server';
import { env } from './env';

const convex = new ConvexHttpClient(env.convexUrl);

export type PostStatus = 'draft' | 'generating' | 'published';
export type Provider = 'openai_web' | 'gsc';

export type Topic = {
  name: string;
  searchVolume: string;
  trend: string;
  reason: string;
};

type PostSummary = {
  _id: string;
  title: string;
  status: PostStatus;
  domain: string;
  topic: string;
  wordCount: number;
  generatedBy: string;
  createdAt: number;
  updatedAt: number;
};

type Post = PostSummary & {
  userId: string;
  content: string;
};

export const authWhoAmI = async (
  userId: string,
): Promise<{
  userId: string;
  authType: 'clerk';
}> => {
  return (await convex.query(anyApi.mcp.authWhoAmIForMcp, {
    serviceSecret: env.serviceSecret,
    userId,
  })) as {
    userId: string;
    authType: 'clerk';
  };
};

export const listRecentDomains = async (userId: string): Promise<{ domains: string[] }> => {
  return (await convex.query(anyApi.mcp.topicsRecentDomainsForMcp, {
    serviceSecret: env.serviceSecret,
    userId,
  })) as { domains: string[] };
};

export const findTrendingTopics = async ({
  userId,
  domain,
  limit,
  provider,
}: {
  userId: string;
  domain: string;
  limit?: number;
  provider?: Provider;
}): Promise<Topic[]> => {
  return (await convex.action(anyApi.ai.findTrendingTopicsForMcp, {
    serviceSecret: env.serviceSecret,
    userId,
    domain,
    limit,
    provider,
  })) as Topic[];
};

export const generatePostFromTopic = async ({
  userId,
  topic,
  domain,
  provider,
}: {
  userId: string;
  topic: string;
  domain: string;
  provider?: Provider;
}): Promise<{
  _id: string;
  title: string;
  content: string;
  wordCount: number;
}> => {
  return (await convex.action(anyApi.ai.generatePostForMcp, {
    serviceSecret: env.serviceSecret,
    userId,
    topic,
    domain,
    provider,
  })) as {
    _id: string;
    title: string;
    content: string;
    wordCount: number;
  };
};

export const listPosts = async ({
  userId,
  status,
  limit,
  cursor,
}: {
  userId: string;
  status?: PostStatus;
  limit?: number;
  cursor?: string;
}): Promise<{
  items: PostSummary[];
  nextCursor?: string;
}> => {
  return (await convex.query(anyApi.mcp.postsListForMcp, {
    serviceSecret: env.serviceSecret,
    userId,
    status,
    limit,
    cursor,
  })) as { items: PostSummary[]; nextCursor?: string };
};

export const getPost = async ({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}): Promise<Post | null> => {
  return (await convex.query(anyApi.mcp.postGetForMcp, {
    serviceSecret: env.serviceSecret,
    userId,
    postId,
  })) as Post | null;
};

export const createPost = async ({
  userId,
  title,
  content,
  status,
  domain,
  topic,
}: {
  userId: string;
  title: string;
  content: string;
  status?: PostStatus;
  domain: string;
  topic: string;
}): Promise<{
  postId: string;
  status: PostStatus;
  wordCount: number;
}> => {
  return (await convex.mutation(anyApi.mcp.postsCreateForMcp, {
    serviceSecret: env.serviceSecret,
    userId,
    title,
    content,
    status,
    generatedBy: 'mcp',
    domain,
    topic,
  })) as { postId: string; status: PostStatus; wordCount: number };
};

export const updatePost = async ({
  userId,
  postId,
  title,
  content,
  status,
}: {
  userId: string;
  postId: string;
  title?: string;
  content?: string;
  status?: PostStatus;
}): Promise<{ success: true }> => {
  return (await convex.mutation(anyApi.mcp.postsUpdateForMcp, {
    serviceSecret: env.serviceSecret,
    userId,
    postId,
    title,
    content,
    status,
  })) as { success: true };
};

export const deletePost = async ({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}): Promise<{ success: true }> => {
  return (await convex.mutation(anyApi.mcp.postsDeleteForMcp, {
    serviceSecret: env.serviceSecret,
    userId,
    postId,
  })) as { success: true };
};
