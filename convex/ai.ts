'use node';

import { anyApi } from 'convex/server';
import { v } from 'convex/values';
import OpenAI from 'openai';
import { action } from './_generated/server';
import { api } from './_generated/api';

type Provider = 'openai_web' | 'gsc';

type TopicCandidate = {
  name: string;
  searchVolume: string;
  trend: string;
  reason: string;
};

type GeneratedPost = {
  _id: string;
  title: string;
  content: string;
  wordCount: number;
};

const providerValidator = v.optional(v.union(v.literal('openai_web'), v.literal('gsc')));

const getClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not set. Run: npx convex env set OPENAI_API_KEY <key>');
  }
  return new OpenAI({ apiKey });
};

const assertServiceSecret = (provided: string) => {
  const expected = process.env.MCP_SERVICE_SECRET;
  if (!expected || provided !== expected) {
    throw new Error('Unauthorized');
  }
};

const resolveProvider = (provider?: Provider): Provider => {
  const selected = provider ?? 'openai_web';
  if (selected === 'gsc') {
    throw new Error('Provider "gsc" is not configured yet. Use "openai_web" for now.');
  }
  return selected;
};

const extractText = (response: OpenAI.Responses.Response): string => {
  const textItems = response.output.filter(
    (item): item is OpenAI.Responses.ResponseOutputMessage => item.type === 'message',
  );
  return textItems
    .flatMap((item) =>
      item.content
        .filter((c): c is OpenAI.Responses.ResponseOutputText => c.type === 'output_text')
        .map((c) => c.text),
    )
    .join('\n')
    .trim();
};

const parseTopics = (jsonText: string, limit: number): TopicCandidate[] => {
  let normalized = jsonText;
  const fenceMatch = normalized.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    normalized = fenceMatch[1].trim();
  }

  const parsed = JSON.parse(normalized);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('Invalid topics response');
  }

  return parsed.slice(0, limit).map((item: unknown): TopicCandidate => {
    if (!item || typeof item !== 'object') {
      throw new Error('Invalid topics response');
    }
    const candidate = item as Record<string, unknown>;
    if (
      typeof candidate.name !== 'string' ||
      typeof candidate.searchVolume !== 'string' ||
      typeof candidate.trend !== 'string' ||
      typeof candidate.reason !== 'string'
    ) {
      throw new Error('Invalid topics response');
    }
    return {
      name: candidate.name,
      searchVolume: candidate.searchVolume,
      trend: candidate.trend,
      reason: candidate.reason,
    };
  });
};

const findTrendingTopicsWithOpenAI = async ({
  client,
  domain,
  limit,
}: {
  client: OpenAI;
  domain: string;
  limit: number;
}): Promise<TopicCandidate[]> => {
  const response = await client.responses.create({
    model: 'gpt-4o',
    tools: [{ type: 'web_search_preview' }],
    input: `Find ${limit} trending topics in the "${domain}" domain that would make great blog posts right now. Use web search to find current trends, popular discussions, and emerging topics.

      Return ONLY a JSON array with exactly ${limit} objects, each having:
      - "name": the topic title (concise, blog-post-ready)
      - "searchVolume": estimated relative search interest ("high", "medium", or "rising")
      - "trend": brief trend description (e.g., "Growing 40% month-over-month")
      - "reason": why this topic is trending now (1 sentence)

      Return ONLY the JSON array, no markdown fences or other text.`,
  });

  return parseTopics(extractText(response), limit);
};

const generatePostWithOpenAI = async ({
  client,
  topic,
  domain,
}: {
  client: OpenAI;
  topic: string;
  domain: string;
}): Promise<{
  title: string;
  content: string;
  wordCount: number;
}> => {
  const researchResponse = await client.responses.create({
    model: 'gpt-4o',
    tools: [{ type: 'web_search_preview' }],
    input: `Research the topic "${topic}" in the "${domain}" domain. Use web search to find:
      - Key facts and statistics
      - Recent developments
      - Expert opinions
      - Practical examples

      Provide a comprehensive research summary with sources.`,
  });

  const research = extractText(researchResponse);

  const writeResponse = await client.responses.create({
    model: 'gpt-4o',
    input: `Using this research, write a comprehensive blog post:

      Research:
      ${research}

      Requirements:
      - Topic: "${topic}"
      - Domain: "${domain}"
      - Length: 2000+ words
      - Format: Markdown
      - Include: engaging introduction, clear headings (##), practical examples, statistics where relevant, actionable conclusion
      - Tone: professional but accessible
      - Do NOT include a title heading (it will be added separately)

      Write the blog post now.`,
  });

  const content = extractText(writeResponse);
  if (!content) {
    throw new Error('No content generated');
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  const titleResponse = await client.responses.create({
    model: 'gpt-4o',
    input: `Generate a single compelling blog post title for this content about "${topic}". Return ONLY the title text, nothing else.`,
  });

  const titleText = extractText(titleResponse);
  const title = titleText ? titleText.replace(/^["']|["']$/g, '') : topic;

  return { title, content, wordCount };
};

export const findTrendingTopics = action({
  args: {
    domain: v.string(),
    limit: v.optional(v.number()),
    provider: providerValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized: Please sign in to use AI features');
    }

    resolveProvider(args.provider);
    const limit = Math.min(Math.max(Math.floor(args.limit ?? 5), 1), 10);
    const client = getClient();

    const topics = await findTrendingTopicsWithOpenAI({
      client,
      domain: args.domain,
      limit,
    });

    await ctx.runMutation(api.topics.createBatch, {
      userId: identity.subject,
      domain: args.domain,
      topics,
    });

    return topics;
  },
});

export const findTrendingTopicsForMcp = action({
  args: {
    serviceSecret: v.string(),
    userId: v.string(),
    domain: v.string(),
    limit: v.optional(v.number()),
    provider: providerValidator,
  },
  handler: async (ctx, args) => {
    assertServiceSecret(args.serviceSecret);
    resolveProvider(args.provider);

    const limit = Math.min(Math.max(Math.floor(args.limit ?? 5), 1), 10);
    const client = getClient();

    const topics = await findTrendingTopicsWithOpenAI({
      client,
      domain: args.domain,
      limit,
    });

    await ctx.runMutation(anyApi.mcp.topicsCreateBatchForMcp, {
      serviceSecret: args.serviceSecret,
      userId: args.userId,
      domain: args.domain,
      topics,
    });

    return topics;
  },
});

export const generatePost = action({
  args: {
    topic: v.string(),
    domain: v.string(),
    provider: providerValidator,
  },
  handler: async (ctx, args): Promise<GeneratedPost> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized: Please sign in to use AI features');
    }

    resolveProvider(args.provider);
    const client = getClient();
    const generated = await generatePostWithOpenAI({
      client,
      topic: args.topic,
      domain: args.domain,
    });

    const postId = await ctx.runMutation(api.posts.create, {
      userId: identity.subject,
      title: generated.title,
      content: generated.content,
      status: 'published',
      generatedBy: 'ai',
      domain: args.domain,
      topic: args.topic,
      wordCount: generated.wordCount,
    });

    return {
      _id: postId,
      title: generated.title,
      content: generated.content,
      wordCount: generated.wordCount,
    };
  },
});

export const generatePostForMcp = action({
  args: {
    serviceSecret: v.string(),
    userId: v.string(),
    topic: v.string(),
    domain: v.string(),
    provider: providerValidator,
  },
  handler: async (ctx, args): Promise<GeneratedPost> => {
    assertServiceSecret(args.serviceSecret);
    resolveProvider(args.provider);

    const client = getClient();
    const generated = await generatePostWithOpenAI({
      client,
      topic: args.topic,
      domain: args.domain,
    });

    const created = await ctx.runMutation(anyApi.mcp.postsCreateForMcp, {
      serviceSecret: args.serviceSecret,
      userId: args.userId,
      title: generated.title,
      content: generated.content,
      status: 'published',
      generatedBy: 'ai',
      domain: args.domain,
      topic: args.topic,
    });

    return {
      _id: created.postId,
      title: generated.title,
      content: generated.content,
      wordCount: generated.wordCount,
    };
  },
});
