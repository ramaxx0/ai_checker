import { charClasses, hasCommonWord, hasRepeatedChars, hasSequence } from './patterns.js'
import { entropyBits as entropyCalc } from './entropy.js'
import { estimateCrackTime } from './timeToCrack.js'

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)) }

function baseScore(pw) {
  let score = 0
  const len = pw.length
  if (len >= 20) score += 35
  else if (len >= 16) score += 28
  else if (len >= 12) score += 22
  else if (len >= 10) score += 16
  else if (len >= 8) score += 10
  else if (len >= 6) score += 6

  const classes = charClasses(pw)
  const variety = [classes.lower, classes.upper, classes.digit, classes.special].filter(Boolean).length
  if (variety === 4) score += 28
  else if (variety === 3) score += 20
  else if (variety === 2) score += 12
  else if (variety === 1) score += 4

  return score
}

function penalties(pw) {
  let pen = 0
  if (hasCommonWord(pw)) pen += 30
  if (hasRepeatedChars(pw)) pen += 12
  if (hasSequence(pw)) pen += 14
  if (/^[A-Za-z]+$/.test(pw) || /^[0-9]+$/.test(pw)) pen += 12
  return pen
}

function bonuses(pw) {
  let bonus = 0
  if (pw.length >= 24) bonus += 8
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) bonus += 6
  return bonus
}

function levelFromScore(s) {
  if (s < 20) return { level: 'Very Weak', barClass: 'bar-very-weak' }
  if (s < 40) return { level: 'Weak', barClass: 'bar-weak' }
  if (s < 60) return { level: 'Medium', barClass: 'bar-medium' }
  if (s < 80) return { level: 'Strong', barClass: 'bar-strong' }
  return { level: 'Very Strong', barClass: 'bar-very-strong' }
}

function reasonsList(pw) {
  const out = []
  if (pw.length < 8) out.push('Too short')
  if (pw.length >= 8 && pw.length < 12) out.push('Short length')
  if (/^[A-Za-z]+$/.test(pw)) out.push('Only letters')
  if (/^[0-9]+$/.test(pw)) out.push('Only numbers')
  if (hasCommonWord(pw)) out.push('Contains common word or pattern')
  if (hasSequence(pw)) out.push('Contains sequential characters')
  if (hasRepeatedChars(pw)) out.push('Has repeated characters')
  const classes = charClasses(pw)
  if (!classes.upper) out.push('No uppercase letters')
  if (!classes.lower) out.push('No lowercase letters')
  if (!classes.digit) out.push('No numbers')
  if (!classes.special) out.push('No special characters')
  if (out.length === 0) out.push('Good mix of length and variety')
  return out
}

function suggestionsList(pw) {
  const out = []
  if (pw.length < 12) out.push('Increase length to 12+ characters')
  if (pw.length < 16) out.push('Aim for 16+ characters for stronger security')
  const classes = charClasses(pw)
  if (!classes.upper) out.push('Add uppercase letters')
  if (!classes.lower) out.push('Add lowercase letters')
  if (!classes.digit) out.push('Add numbers')
  if (!classes.special) out.push('Add special characters')
  if (hasCommonWord(pw)) out.push('Avoid common words or phrases')
  if (hasSequence(pw)) out.push('Avoid sequences like abc or 123')
  if (hasRepeatedChars(pw)) out.push('Avoid repeating characters')
  if (out.length === 0) out.push('Keep it unique and avoid reuse across sites')
  return Array.from(new Set(out))
}

function checklist(pw) {
  const classes = charClasses(pw)
  return [
    { label: 'Length ≥ 12', ok: pw.length >= 12 },
    { label: 'Includes uppercase', ok: classes.upper },
    { label: 'Includes lowercase', ok: classes.lower },
    { label: 'Includes number', ok: classes.digit },
    { label: 'Includes special character', ok: classes.special },
    { label: 'No common words', ok: !hasCommonWord(pw), warn: hasCommonWord(pw) },
    { label: 'No sequences', ok: !hasSequence(pw), warn: hasSequence(pw) },
    { label: 'No repeats', ok: !hasRepeatedChars(pw), warn: hasRepeatedChars(pw) },
  ]
}

export function analyze(pw) {
  const base = baseScore(pw)
  const scoreRaw = base + bonuses(pw) - penalties(pw)
  const score = clamp(Math.round(scoreRaw), 0, 100)
  const { level, barClass } = levelFromScore(score)
  const reasons = reasonsList(pw)
  const suggestions = suggestionsList(pw)
  const entropyBits = entropyCalc(pw)
  const crackTime = estimateCrackTime(entropyBits)
  const list = checklist(pw)
  return { score, level, barClass, reasons, suggestions, entropyBits, crackTime, checklist: list }
}

