import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.db
      .query('posts')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .order('desc')
      .collect();
  },
});

export const get = query({
  args: { id: v.id('posts') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const post = await ctx.db.get(args.id);
    if (!post || post.userId !== identity.subject) {
      return null;
    }

    return post;
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    status: v.union(v.literal('draft'), v.literal('generating'), v.literal('published')),
    generatedBy: v.string(),
    domain: v.string(),
    topic: v.string(),
    wordCount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.userId) {
      throw new Error('Unauthorized');
    }

    const now = Date.now();
    return await ctx.db.insert('posts', {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('posts'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal('draft'), v.literal('generating'), v.literal('published')),
    ),
    wordCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const post = await ctx.db.get(args.id);
    if (!post || post.userId !== identity.subject) {
      throw new Error('Unauthorized');
    }

    const { id, ...fields } = args;
    await ctx.db.patch(id, {
      ...fields,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id('posts') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const post = await ctx.db.get(args.id);
    if (!post || post.userId !== identity.subject) {
      throw new Error('Unauthorized');
    }

    await ctx.db.delete(args.id);
  },
});
