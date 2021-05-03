export default class Stream {
  constructor (source, selector) {
    Object.assign(this, {
      source,
      selector,
      done: false,
      value: undefined,
      key: undefined,
      missed: new Map()
    })
  }

  async read () {
    if (this.done) return
    const { done, value } = await this.source.next()
    if (done) {
      this.done = true
      this.value = this.key = null
    } else {
      this.value = value
      this.key = this.selector(value)
    }
    return this.value
  }

  async readIfOn (key, store) {
    if (this.key !== key) return this.value
    if (store) this.missed.set(this.key, this.value)
    return this.read()
  }

  has (key) {
    // do we have this, either missed or current
    return this.key === key || this.missed.has(key)
  }

  get (key) {
    // return the item (current or missed)
    if (this.key === key) return this.value
    const value = this.missed.get(key)
    this.missed.delete(key)
    return value || null
  }

  keys () {
    return [...this.missed.keys()]
  }
}
