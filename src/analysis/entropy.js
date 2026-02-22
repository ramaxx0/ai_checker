export function estimatePool(password) {
  let pool = 0
  if (/[a-z]/.test(password)) pool += 26
  if (/[A-Z]/.test(password)) pool += 26
  if (/[0-9]/.test(password)) pool += 10
  if (/[^A-Za-z0-9]/.test(password)) pool += 33
  return Math.max(pool, 1)
}

export function entropyBits(password) {
  const pool = estimatePool(password)
  return password.length * Math.log2(pool)
}

