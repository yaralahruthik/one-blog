export type Frontmatter = {
  title?: string;
  description?: string;
};

export function createFrontmatter(metadata: Frontmatter): string {
  const { title, description } = metadata;

  const hasTitle = Boolean(title?.trim());
  const hasDescription = Boolean(description?.trim());

  if (!hasTitle && !hasDescription) {
    return '';
  }

  const frontmatterFields: string[] = [];

  if (hasTitle) {
    frontmatterFields.push(`title: "${escapeYamlString(title!)}"`);
  }

  if (hasDescription) {
    frontmatterFields.push(`description: "${escapeYamlString(description!)}"`);
  }

  return `---\n${frontmatterFields.join('\n')}\n---\n\n`;
}

function escapeYamlString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

export function createFilename(title?: string): string {
  const documentDate = new Date().toISOString().split('T')[0];
  const safeTitle = title?.trim() || 'untitled';

  const filenameSafeTitle = safeTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `blog-post-${documentDate}-${filenameSafeTitle}.md`;
}
