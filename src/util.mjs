export function makeSelector (key) {
  return typeof key === 'function' ? key : record => record[key]
}

export function allSame (vals) {
  for (let i = 1; i < vals.length; i++) {
    if (vals[i] !== vals[0]) return false
  }
  return true
}

export function earliest (vals) {
  let ret
  for (let i = 0; i < vals.length; i++) {
    if (!ret || vals[i] < ret) ret = vals[i]
  }
  return ret
}

export function uniq (arrs) {
  return [...new Set([].concat(...arrs))]
}
