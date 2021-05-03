import { test } from 'uvu'
import * as assert from 'uvu/assert'

import makeStream from './helpers/makeStream.mjs'
import testdata from './helpers/testdata.mjs'

import Stream from '../src/stream.mjs'

const DATA = testdata.basic

const nameFunc = ({ name }) => name

test('construction', () => {
  assert.not.throws(() => new Stream(makeStream(DATA), nameFunc))
})

test('read', async () => {
  const s = new Stream(makeStream(DATA), nameFunc)
  assert.is(s.done, false)
  assert.is(s.value, undefined)

  await s.read()
  assert.is(s.done, false)
  assert.is(s.key, 'foo')
  assert.equal(s.value, { name: 'foo', value: 1 })

  await s.read()
  assert.is(s.done, false)
  assert.is(s.key, 'bar')
  assert.equal(s.value, { name: 'bar', value: 2 })

  await s.read()
  assert.is(s.done, true)
  assert.is(s.key, null)
  assert.is(s.value, null)
})

test('read beyond end', async () => {
  const s = new Stream(makeStream(DATA), nameFunc)
  await s.read()
  await s.read()
  await s.read()
  assert.is(s.done, true)
  await s.read().catch(assert.unreachable)
  assert.is(s.done, true)
})

test('read if has key', async () => {
  const s = new Stream(makeStream(DATA), nameFunc)
  await s.read()
  assert.is(s.key, 'foo')

  await s.readIfOn('bar')
  assert.is(s.key, 'foo')

  await s.readIfOn('foo')
  assert.is(s.key, 'bar')

  assert.equal(s.keys(), []) // nothing stored
})

test('read and store', async () => {
  const s = new Stream(makeStream(DATA), nameFunc)
  await s.read()
  assert.is(s.key, 'foo')

  await s.readIfOn('bar', true)
  assert.is(s.key, 'foo')
  assert.equal(s.keys(), []) // nothing stored

  await s.readIfOn('foo', true)
  assert.is(s.key, 'bar')

  assert.ok(s.has('bar'))
  assert.ok(s.has('foo'))

  assert.equal(s.keys().sort(), ['foo'])
})

test('recover from store', async () => {
  const s = new Stream(makeStream(DATA), nameFunc)
  await s.read()

  await s.readIfOn('foo', true)
  assert.equal(s.keys().sort(), ['foo'])

  assert.equal(s.get('bar'), { name: 'bar', value: 2 })
  assert.equal(s.get('foo'), { name: 'foo', value: 1 })
  assert.equal(s.keys().length, 0)

  assert.equal(s.get('foo'), null)
  assert.equal(s.get('bar'), { name: 'bar', value: 2 })
})

test.run()
