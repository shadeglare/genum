import * as Iters from "./iters";

export type Primitive = Iters.Primitive;

export class Enumerable<T> {
  public readonly generator: () => IterableIterator<T>;

  protected constructor(generator: () => IterableIterator<T>) {
    this.generator = generator;
  }

  public where(predicate: (value: T, index: number) => boolean): Enumerable<T> {
    let generator = () => Iters.where(this.generator, predicate);
    return Enumerable.fromGenerator(generator);
  }

  public select<TResult>(selector: (value: T, index: number) => TResult): Enumerable<TResult> {
    let generator = () => Iters.select(this.generator, selector);
    return Enumerable.fromGenerator(generator);
  }

  public selectMany<TResult>(selector: (value: T, index: number) => Enumerable<TResult>): Enumerable<TResult> {
    let generator = () => Iters.selectMany(this.generator, (value, index) => selector(value, index).generator());
    return Enumerable.fromGenerator(generator);
  }

  public skip(count: number): Enumerable<T> {
    let generator = () => Iters.skip(this.generator, count);
    return Enumerable.fromGenerator(generator);
  }

  public take(count: number): Enumerable<T> {
    let generator = () => Iters.take(this.generator, count);
    return Enumerable.fromGenerator(generator);
  }

  public groupBy<TKey extends Primitive, TElement>(
    keySelector: (value: T) => TKey,
    elementSelector: (value: T) => TElement,
  ): Enumerable<Grouping<TKey, TElement>>;

  public groupBy<TKey extends Primitive, TElement, TResult>(
    keySelector: (value: T) => TKey,
    elementSelector: (value: T) => TElement,
    resultSelector: (key: TKey, elements: TElement[]) => TResult
  ): Enumerable<TResult>;

  public groupBy<TKey extends Primitive, TElement, TResult>(
    keySelector: (value: T) => TKey,
    elementSelector: (value: T) => TElement,
    resultSelector?: (key: TKey, elements: TElement[]) => TResult
  ): Enumerable<TResult> | Enumerable<Grouping<TKey, TElement>> {
    let lookup = () => Iters.lookup(this.generator, keySelector, elementSelector);
    if (resultSelector) {
      let generator = () => Iters.select(lookup, ([key, values]) => resultSelector(key, values));
      return Enumerable.fromGenerator(generator);
    } else {
      let generator = () => Iters.select(lookup, ([key, values]) => Grouping.fromKeyedArray(key, values));
      return Enumerable.fromGenerator(generator);
    }
  }

  public join<TRight, TKey extends Primitive, TResult>(
    right: Enumerable<TRight>,
    leftKeySelector: (value: T) => TKey,
    rightKeySelector: (value: TRight) => TKey,
    resultSelector: (left: T, right: TRight) => TResult
  ): Enumerable<TResult> {
    let generator = () => Iters.join(this.generator, right.generator, leftKeySelector, rightKeySelector, resultSelector);
    return Enumerable.fromGenerator(generator);
  }

  public concat(right: Enumerable<T>): Enumerable<T> {
    let generator = () => Iters.concat(this.generator, right.generator);
    return Enumerable.fromGenerator(generator);
  }

  public contains(value: T, comparer?: (left: T, right: T) => boolean): boolean {
    comparer = comparer ? comparer : (left, right) => left === right;
    for (let x of this.generator()) {
      if (comparer(x, value)) {
        return true;
      }
    }
    return false;
  }

  public toArray() {
    return Array.from(this.generator());
  }

  public static range(start: number, count: number): Enumerable<number> {
    let generator = () => Iters.range(start, count);
    return new Enumerable(generator);
  }

  public static empty<T>(): Enumerable<T> {
    let generator = () => Iters.values([]);
    return new Enumerable(generator);
  }

  public static fromGenerator<T>(generator: () => IterableIterator<T>): Enumerable<T> {
    return new Enumerable(generator);
  }

  public static fromArray<T>(array: T[]): Enumerable<T> {
    let generator = () => Iters.values(array);
    return Enumerable.fromGenerator(generator);
  }
}

export class Grouping<TKey extends Primitive, TElement> extends Enumerable<TElement> {
  public readonly key: TKey;

  protected constructor(key: TKey, generator: () => IterableIterator<TElement>) {
    super(generator);
    this.key = key;
  }

  public static fromKeyedArray<TKey extends Primitive, TElement>(key: TKey, values: TElement[]) {
    return new Grouping(key, () => Iters.values(values));
  }
}