const commonWords = [
  'password','qwerty','abc123','letmein','iloveyou','admin','welcome','monkey','dragon','football','baseball','sunshine','flower','shadow','master','hello','freedom','whatever','qwertyuiop','123456','123456789','12345678','111111','000000'
]

export function hasCommonWord(pw) {
  const low = pw.toLowerCase()
  return commonWords.some(w => low.includes(w))
}

export function hasRepeatedChars(pw) {
  return /(.)\1{2,}/.test(pw)
}

export function hasSequence(pw) {
  const sequences = ['abcdefghijklmnopqrstuvwxyz', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm', '0123456789']
  const low = pw.toLowerCase()
  for (const seq of sequences) {
    for (let i = 0; i < seq.length - 2; i++) {
      const sub = seq.slice(i, i + 3)
      if (low.includes(sub)) return true
    }
    const rev = seq.split('').reverse().join('')
    for (let i = 0; i < rev.length - 2; i++) {
      const sub = rev.slice(i, i + 3)
      if (low.includes(sub)) return true
    }
  }
  return false
}

export function charClasses(pw) {
  return {
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    digit: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  }
}

