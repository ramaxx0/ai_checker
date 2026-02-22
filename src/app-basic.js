import { sanitizeDOM } from './utils/sanitize.js'

const yearEl = document.getElementById('year')
if (yearEl) yearEl.textContent = String(new Date().getFullYear())

const themeToggle = document.getElementById('themeToggle')
const applyTheme = (mode) => {
  document.documentElement.dataset.theme = mode
  localStorage.setItem('psc-theme', mode)
  if (themeToggle) themeToggle.textContent = mode === 'dark' ? 'Dark' : 'Light'
  sanitizeDOM()
}
const preferred = localStorage.getItem('psc-theme')
if (preferred) applyTheme(preferred)
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    applyTheme(current === 'dark' ? 'light' : 'dark')
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => sanitizeDOM())
} else {
  sanitizeDOM()
}
