import Stream from './stream.mjs'
import { makeSelector, allSame, earliest, uniq } from './util.mjs'

export default async function * weave (keyFunc, ...sources) {
  if (!sources.length) return
  const selector = makeSelector(keyFunc)
  const streams = sources.map(source => new Stream(source, selector))

  await read(streams)
  while (!streams.every(stream => stream.done)) {
    const keys = streams.map(stream => stream.key)
    if (allSame(keys)) {
      const key = keys[0]
      yield valueFor(streams, key)
      await read(streams)
    } else {
      const key = earliest(keys)
      if (streams.every(stream => stream.has(key))) {
        yield valueFor(streams, key)
        await read(streams, key)
      } else {
        await read(streams, key, true)
      }
    }
  }

  const keys = uniq(streams.map(stream => stream.keys()))
  for (const key of keys) {
    yield valueFor(streams, key)
  }
}

function read (streams, key, store) {
  if (key) {
    return Promise.all(streams.map(stream => stream.readIfOn(key, store)))
  } else {
    return Promise.all(streams.map(stream => stream.read()))
  }
}

function valueFor (streams, key) {
  return [key, ...streams.map(stream => stream.get(key))]
}
