// Simple markdown utility functions
export function parseMarkdown(content: string): string {
  // Basic markdown parsing - in a real app you'd use a library like marked or remark
  return content
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.*)$/gim, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p><li>/g, '<ul><li>')
    .replace(/<\/li><\/p>/g, '</li></ul>');
}

export function extractFirstParagraph(content: string): string {
  const paragraphs = content.split('\n\n');
  return paragraphs[0]?.replace(/^#+\s+/, '') || '';
}
