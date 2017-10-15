Genum
=====

[![Version](http://img.shields.io/npm/v/genum.svg)](https://www.npmjs.org/package/genum)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://badges.mit-license.org)
[![Downloads](http://img.shields.io/npm/dm/genum.svg)](https://npmjs.org/package/genum)
[![Downloads](http://img.shields.io/npm/dt/genum.svg)](https://npmjs.org/package/genum)


The ES Next tools to process data in a LINQ manner.

## Examples
```ts
let output = Enumerable
  .fromArray([1, 2, 3]) 
  .where(x => x % 2 === 0)
  .select(x => x * 2)
  .select(x => `It's ${x}`);

console.log("example");
console.log(output.toArray());

let seq = Enumerable
  .range(5, 10)
  .where(x => x % 2 === 0);

console.log("range");
console.log(seq.toArray());

let empty = Enumerable.empty().toArray();

console.log("empty");
console.log(empty);

let after5 = Enumerable
  .range(1, 10)
  .skip(5)
  .take(2);

console.log("skip take");
console.log(after5.toArray());

let nums = Enumerable.range(1, 10);
console.log("range");
console.log(nums.contains(5));

let objs1 = Enumerable.fromArray([{ x: 1, y: 2 }, { x: 3, y: 5 }]);
console.log("contains");
console.log(objs1.contains({ x: 3, y: 5 }, (left, right) => left.x === right.x && left.y === right.y));
console.log(objs1.contains({ x: 1, y: 2 }, (left, right) => left.x === right.x && left.y === right.y));

let grouped = Enumerable
  .fromArray([{ tag: "foo", value: 1 }, { tag: "foo", value: 2 }, { tag: "bar", value: 3 }])
  .groupBy(x => x.tag, x => x.value, (k, e) => e)

console.log("grouped");
console.log(grouped.toArray());

let rand = Enumerable
  .fromGenerator(function*() {
    yield Math.round(Math.random() * 100);
    yield Math.round(Math.random() * 100);
    yield Math.round(Math.random() * 100);
    yield Math.round(Math.random() * 100);
  })
  .groupBy(x => x % 2, x => x, (k, e) => e);

console.log("grouped random");
console.log(rand.toArray());

let many = Enumerable
  .fromArray([[1, 2, 3], [4, 5, 6]])
  .selectMany(x => Enumerable.fromArray(x));

console.log("many");
console.log(many.toArray());

let left = Enumerable.fromArray([{ name: "foo" }, { name: "bar" }]);
let right = Enumerable.fromArray([
  { name: "foo", values: [1, 2] }, 
  { name: "foo", values: [2, 3] },
  { name: "bar", values: [2, 3] },
  { name: "foobar", values: [2, 3] },
]);

let inner = left
  .join(
    right,
    l => l.name, 
    r => r.name, 
    (l, r) => r);

console.log("join");
console.log(inner.toArray());

let chunk1 = Enumerable.fromArray([1, 2, 3]);
let chunk2 = Enumerable.fromArray([4, 5, 6]);
let whole = chunk1.concat(chunk2);

console.log("concat");
console.log(whole.toArray());
```