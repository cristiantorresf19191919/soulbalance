/**
 * Strips HTML tags from a string and returns plain text
 * Useful for displaying rich text content in previews/listings
 */
export function stripHtml(html: string): string {
  if (typeof window === 'undefined') {
    // SSR fallback: simple regex to remove HTML tags
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
  }
  
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

/**
 * Truncates text to a specified length and adds ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

