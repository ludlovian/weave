export default async function * makeStream(iterable) {
  for (const value of iterable) {
    yield Promise.resolve().then(() => value)
  }
}
