function deepMerge(a, b) {
  const result = { ...a }
  for (const [k, v] of Object.entries(b)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && a[k]) {
      result[k] = deepMerge(a[k], v)
    } else {
      result[k] = v
    }
  }
  return result
}

function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function generateHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}

module.exports = { deepMerge, kebabToCamel, generateHash }
