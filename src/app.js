import './app-basic.js'
import { stripEmojis, sanitizeDOM } from './utils/sanitize.js'

const pwd = document.getElementById('password')
const toggle = document.getElementById('toggleVisibility')
const strengthLabel = document.getElementById('strengthLabel')
const strengthBar = document.getElementById('strengthBar')
const reasons = document.getElementById('reasons')
const suggestions = document.getElementById('suggestions')
const entropy = document.getElementById('entropy')
const timeToCrack = document.getElementById('timeToCrack')
const checklist = document.getElementById('checklist')

if (toggle && pwd) {
  toggle.addEventListener('click', () => {
    pwd.type = pwd.type === 'password' ? 'text' : 'password'
    toggle.textContent = pwd.type === 'password' ? 'Show' : 'Hide'
    sanitizeDOM()
  })
}

const setInitial = () => {
  if (strengthLabel) strengthLabel.textContent = '—'
  if (strengthBar) {
    strengthBar.style.width = '0%'
    strengthBar.className = 'progress-bar'
  }
  if (reasons) reasons.innerHTML = ''
  if (suggestions) suggestions.innerHTML = ''
  if (entropy) entropy.textContent = '—'
  if (timeToCrack) timeToCrack.textContent = '—'
  if (checklist) checklist.innerHTML = ''
}

setInitial()

let worker
try {
  worker = new Worker('src/analysisWorker.js', { type: 'module' })
} catch (e) {
  worker = null
}

const render = (data) => {
  const { score, level, barClass, reasons: rs, suggestions: sg, entropyBits, crackTime, checklist: cl } = data
  if (strengthLabel) strengthLabel.textContent = level
  if (strengthBar) {
    strengthBar.style.width = `${score}%`
    strengthBar.className = `progress-bar ${barClass}`
  }
  if (reasons) {
    reasons.innerHTML = ''
    rs.forEach(t => {
      const li = document.createElement('li')
      li.textContent = t
      reasons.appendChild(li)
    })
  }
  if (suggestions) {
    suggestions.innerHTML = ''
    sg.forEach(t => {
      const li = document.createElement('li')
      li.textContent = t
      suggestions.appendChild(li)
    })
  }
  if (entropy) entropy.textContent = `${entropyBits.toFixed(1)} bits`
  if (timeToCrack) timeToCrack.textContent = crackTime
  if (checklist) {
    checklist.innerHTML = ''
    cl.forEach(item => {
      const li = document.createElement('li')
      li.textContent = stripEmojis(item.label)
      li.className = item.ok ? 'ok' : (item.warn ? 'warn' : 'bad')
      checklist.appendChild(li)
    })
  }
  sanitizeDOM()
}

if (pwd) {
  const handle = () => {
    const value = stripEmojis(pwd.value || '')
    if (pwd.value !== value) pwd.value = value
    if (!value) {
      setInitial()
      return
    }
    if (worker) {
      worker.postMessage({ password: value })
    }
  }
  pwd.addEventListener('input', handle)
}

if (worker) {
  worker.onmessage = (e) => render(e.data)
}
