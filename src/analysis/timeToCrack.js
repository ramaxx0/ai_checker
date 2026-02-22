function fmtSeconds(s) {
  const units = [
    ['year', 31557600],
    ['day', 86400],
    ['hour', 3600],
    ['min', 60],
    ['sec', 1],
  ]
  for (const [name, sec] of units) {
    if (s >= sec) {
      const v = s / sec
      const fixed = v >= 100 ? Math.round(v) : v >= 10 ? v.toFixed(1) : v.toFixed(2)
      return `${fixed} ${name}${v >= 2 ? 's' : ''}`
    }
  }
  return '0 sec'
}

export function estimateCrackTime(entropyBits) {
  const guessesPerSec = 1e10
  const seconds = Math.pow(2, entropyBits) / guessesPerSec
  if (seconds < 1) return '< 1 sec'
  if (seconds > 1e20) return 'many centuries'
  return fmtSeconds(seconds)
}

