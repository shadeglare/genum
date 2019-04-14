export type Primitive = string | number | boolean;

export function* where<T>(
  generator: () => IterableIterator<T>,
  predicate: (value: T, index: number) => boolean
) {
  let index = 0;
  for (let item of generator()) {
    if (predicate(item, index)) {
      yield item;
    }
    index++;
  }
}

export function* select<TIn, TOut>(
  generator: () => IterableIterator<TIn>,
  selector: (value: TIn, index: number) => TOut
) {
  let index = 0;
  for (let item of generator()) {
    yield selector(item, index);
    index++;
  }
}

export function* selectMany<TSource, TResult>(
  generator: () => IterableIterator<TSource>,
  selector: (value: TSource, index: number) => IterableIterator<TResult>
): IterableIterator<TResult> {
  let index = 0;
  for (let item of generator()) {
    yield* selector(item, index);
    index++;
  }
}

export function* join<TLeft, TRight, TKey extends Primitive, TResult>(
  leftGenerator: () => IterableIterator<TLeft>,
  rightGenerator: () => IterableIterator<TRight>,
  leftKeySelector: (left: TLeft) => TKey,
  rightKeySelector: (right: TRight) => TKey,
  resultSelector: (left: TLeft, right: TRight) => TResult
): IterableIterator<TResult> {
  let leftKey: TKey;
  let rightKey: TKey;
  for (let left of leftGenerator()) {
    leftKey = leftKeySelector(left);
    for (let right of rightGenerator()) {
      rightKey = rightKeySelector(right);
      if (leftKey === rightKey) {
        yield resultSelector(left, right);
      }
    }
  }
}

export function* values<T>(array: T[]) {
  for (let x of array) {
    yield x;
  }
}

export function* range(start: number, count: number) {
  for (let x = 0; x < count; x++) {
    yield (start + x);
  }
}

export function* skip<T>(generator: () => IterableIterator<T>, count: number) {
  let index = 0;
  for (let item of generator()) {
    if (index >= count) {
      yield item;
    }
    index++;
  }
}

export function* take<T>(generator: () => IterableIterator<T>, count: number) {
  let index = 0;
  for (let item of generator()) {
    if (index < count) {
      yield item;
    }
    index++;
  }
}

export function* concat<T>(
  leftGenerator: () => IterableIterator<T>,
  rightGenerator: () => IterableIterator<T>
) {
  for (let left of leftGenerator()) {
    yield left;
  }
  for (let right of rightGenerator()) {
    yield right;
  }
}

export function* lookup<T, TKey extends Primitive, TElement, TResult>(
  generator: () => IterableIterator<T>,
  keySelector: (value: T) => TKey,
  elementSelector: (value: T) => TElement
): IterableIterator<[TKey, TElement[]]> {
  let map = new Map<TKey, TElement[]>();
  for (let x of generator()) {
    let key = keySelector(x);
    let group = map.get(key);
    if (!group) {
      group = [];
      map.set(key, group);
    }
    group.push(elementSelector(x));
  }
  yield* map.entries();
}

export function* zip<TLeft, TRight, TResult>(
  leftGenerator: () => IterableIterator<TLeft>,
  rightGenerator: () => IterableIterator<TRight>,
  resultSelector: (left: TLeft, right: TRight) => TResult
) {
  let leftIterator = leftGenerator();
  let rightIterator = rightGenerator();
  while (true) {
    let left = leftIterator.next();
    let right = rightIterator.next();
    if (left.done || right.done) {
      break;
    }
    yield resultSelector(left.value, right.value);
  }
}

export function count<T>(generator: () => IterableIterator<T>): number {
  let count = 0;
  for (let item of generator()) {
    count++;
  }
  return count;
}