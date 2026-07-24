import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const assertServiceSecret = (provided: string) => {
  const expected = process.env.MCP_SERVICE_SECRET;
  if (!expected || provided !== expected) {
    throw new Error('Unauthorized');
  }
};

const postStatusValidator = v.union(
  v.literal('draft'),
  v.literal('generating'),
  v.literal('published'),
);

const countWords = (content: string): number => {
  return content.split(/\s+/).filter(Boolean).length;
};

const parseLimit = (value?: number): number => {
  if (!value) {
    return 20;
  }
  return Math.min(Math.max(Math.floor(value), 1), 100);
};

const parseCursor = (value?: string): number => {
  if (!value) {
    return 0;
  }
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
};

export const authWhoAmIForMcp = query({
  args: {
    serviceSecret: v.string(),
    userId: v.string(),
  },
  handler: async (_ctx, args) => {
    assertServiceSecret(args.serviceSecret);
    return {
      userId: args.userId,
      authType: 'clerk' as const,
    };
  },
});

export const topicsRecentDomainsForMcp = query({
  args: {
    serviceSecret: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    assertServiceSecret(args.serviceSecret);

    const topics = await ctx.db
      .query('topics')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect();

    const seen = new Set<string>();
    const domains: string[] = [];

    for (const topic of topics) {
      if (seen.has(topic.domain)) {
        continue;
      }
      seen.add(topic.domain);
      domains.push(topic.domain);
      if (domains.length >= 5) {
        break;
      }
    }

    return { domains };
  },
});

export const topicsCreateBatchForMcp = mutation({
  args: {
    serviceSecret: v.string(),
    userId: v.string(),
    domain: v.string(),
    topics: v.array(
      v.object({
        name: v.string(),
        searchVolume: v.string(),
        trend: v.string(),
        reason: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    assertServiceSecret(args.serviceSecret);

    const now = Date.now();
    for (const topic of args.topics) {
      await ctx.db.insert('topics', {
        userId: args.userId,
        domain: args.domain,
        name: topic.name,
        searchVolume: topic.searchVolume,
        trend: topic.trend,
        reason: topic.reason,
        createdAt: now,
      });
    }

    return { success: true };
  },
});

export const postsListForMcp = query({
  args: {
    serviceSecret: v.string(),
    userId: v.string(),
    status: v.optional(postStatusValidator),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    assertServiceSecret(args.serviceSecret);

    const posts = await ctx.db
      .query('posts')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect();

    const filtered = args.status ? posts.filter((post) => post.status === args.status) : posts;
    const limit = parseLimit(args.limit);
    const offset = parseCursor(args.cursor);
    const window = filtered.slice(offset, offset + limit);

    const items = window.map((post) => ({
      _id: post._id,
      title: post.title,
      status: post.status,
      domain: post.domain,
      topic: post.topic,
      wordCount: post.wordCount,
      generatedBy: post.generatedBy,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    const nextOffset = offset + limit;
    const nextCursor = nextOffset < filtered.length ? String(nextOffset) : undefined;

    return {
      items,
      nextCursor,
    };
  },
});

export const postGetForMcp = query({
  args: {
    serviceSecret: v.string(),
    userId: v.string(),
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    assertServiceSecret(args.serviceSecret);

    const post = await ctx.db.get(args.postId);
    if (!post || post.userId !== args.userId) {
      return null;
    }

    return post;
  },
});

export const postsCreateForMcp = mutation({
  args: {
    serviceSecret: v.string(),
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    status: v.optional(postStatusValidator),
    generatedBy: v.optional(v.string()),
    domain: v.string(),
    topic: v.string(),
  },
  handler: async (ctx, args) => {
    assertServiceSecret(args.serviceSecret);

    const now = Date.now();
    const wordCount = countWords(args.content);
    const status = args.status ?? 'draft';
    const generatedBy = args.generatedBy ?? 'mcp';

    const postId = await ctx.db.insert('posts', {
      userId: args.userId,
      title: args.title.trim(),
      content: args.content,
      status,
      generatedBy,
      domain: args.domain.trim(),
      topic: args.topic.trim(),
      wordCount,
      createdAt: now,
      updatedAt: now,
    });

    return {
      postId,
      status,
      wordCount,
    };
  },
});

export const postsUpdateForMcp = mutation({
  args: {
    serviceSecret: v.string(),
    userId: v.string(),
    postId: v.id('posts'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    status: v.optional(postStatusValidator),
  },
  handler: async (ctx, args) => {
    assertServiceSecret(args.serviceSecret);

    const post = await ctx.db.get(args.postId);
    if (!post || post.userId !== args.userId) {
      throw new Error('Unauthorized');
    }

    const patch: {
      title?: string;
      content?: string;
      status?: 'draft' | 'generating' | 'published';
      wordCount?: number;
      updatedAt: number;
    } = {
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) {
      patch.title = args.title.trim();
    }

    if (args.content !== undefined) {
      patch.content = args.content;
      patch.wordCount = countWords(args.content);
    }

    if (args.status !== undefined) {
      patch.status = args.status;
    }

    await ctx.db.patch(args.postId, patch);

    return { success: true };
  },
});

export const postsDeleteForMcp = mutation({
  args: {
    serviceSecret: v.string(),
    userId: v.string(),
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    assertServiceSecret(args.serviceSecret);

    const post = await ctx.db.get(args.postId);
    if (!post || post.userId !== args.userId) {
      throw new Error('Unauthorized');
    }

    await ctx.db.delete(args.postId);
    return { success: true };
  },
});
