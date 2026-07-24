import { type InferSchema, type ToolMetadata } from 'xmcp';
import { listRecentDomains } from '../lib/convex-client';
import { requireSessionUserId } from '../lib/clerk-session';
import { toToolResult } from '../lib/tool-result';

export const schema = {};

export const metadata: ToolMetadata = {
  name: 'topics_list_recent_domains',
  description: "List the authenticated user's most recent searched domains.",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    destructiveHint: false,
  },
};

export default async function topicsListRecentDomainsTool(_: InferSchema<typeof schema>) {
  const userId = await requireSessionUserId();
  const result = await listRecentDomains(userId);
  return toToolResult(result, `Loaded ${result.domains.length} recent domain(s).`);
}
