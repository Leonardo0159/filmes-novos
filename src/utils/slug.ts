export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[:\/?#\[\]@!$&'()*+,;=%"]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
