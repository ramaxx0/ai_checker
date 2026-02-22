import { analyze } from './analysis/score.js'

self.onmessage = (e) => {
  const pw = e.data && e.data.password ? String(e.data.password) : ''
  const data = analyze(pw)
  postMessage(data)
}
