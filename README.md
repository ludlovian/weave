# weaver
Weaves multiple async streams into a single one

## API
```
import weave from 'weave'

for (const tuple from weave(key, stream1, stream2, ...)) {...}
```

The streams are aligned to the same key - which can be a simple property name or `record => key` function.

The woven stream yields tuples `[rec1, rec2, ...]` of the matching records

If a stream is missing a record for a given key, then the tuple has `undefined` in its place.

It works best if all the streams are sorted in the same order, but can cope with unordered streams.
