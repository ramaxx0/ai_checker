const emojiRegex = /[\p{Extended_Pictographic}\u200D\uFE0F]/gu

export function stripEmojis(input) {
  if (!input) return input
  return input.replace(emojiRegex, '')
}

export function sanitizeTextNode(node) {
  if (!node || node.nodeType !== Node.TEXT_NODE) return
  const cleaned = stripEmojis(node.nodeValue || '')
  if (cleaned !== node.nodeValue) node.nodeValue = cleaned
}

export function sanitizeDOM(root = document.body) {
  if (!root) return
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null)
  let current = walker.nextNode()
  while (current) {
    if (!current.parentElement || ['SCRIPT', 'STYLE'].includes(current.parentElement.tagName)) {
      current = walker.nextNode()
      continue
    }
    sanitizeTextNode(current)
    current = walker.nextNode()
  }
  const inputs = root.querySelectorAll('input, textarea')
  inputs.forEach(el => {
    if (el.placeholder) el.placeholder = stripEmojis(el.placeholder)
    if (el.value) el.value = stripEmojis(el.value)
  })
}

