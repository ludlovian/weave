import { test } from 'uvu'
import * as assert from 'uvu/assert'

import makeStream from './helpers/makeStream.mjs'
import testdata from './helpers/testdata.mjs'
import snapshot from './helpers/snapshot.mjs'

import weave from '../src/index.mjs'

test('basic weave', async () => {
  const s1 = makeStream(testdata.stream1)
  const s2 = makeStream(testdata.stream2)
  const s3 = makeStream(testdata.stream3)

  const items = []
  for await (const item of weave('name', s1, s2, s3)) {
    items.push(item)
  }

  snapshot('basic.json', items)
})

test('single source', async () => {
  const s1 = makeStream(testdata.stream1)
  const items = []
  for await (const item of weave(({ name }) => name, s1)) {
    items.push(item)
  }

  snapshot('single.json', items)
})

test('empty source', async () => {
  const it = weave('name')
  const { done } = await it.next()
  assert.is(done, true)
})

test.run()
