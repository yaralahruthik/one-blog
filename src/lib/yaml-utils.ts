export interface DocumentMetadata {
  title: string;
  description?: string;
  date?: string;
}

export function createFrontmatter(metadata: DocumentMetadata): string {
  const { title, description, date } = metadata;

  const frontmatterFields: string[] = [];

  frontmatterFields.push(`title: "${escapeYamlString(title)}"`);

  if (description) {
    frontmatterFields.push(`description: "${escapeYamlString(description)}"`);
  }

  if (date) {
    frontmatterFields.push(`date: "${date}"`);
  } else {
    const currentDate = new Date().toISOString().split('T')[0];
    frontmatterFields.push(`date: "${currentDate}"`);
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

export function createFilename(title: string, date?: string): string {
  const documentDate = date || new Date().toISOString().split('T')[0];
  const filenameSafeTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `blog-post-${documentDate}-${filenameSafeTitle}.md`;
}
