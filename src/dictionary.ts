import * as HashHelpers from "./hash_helpers";

export default class Dictionary<TKey, TValue> implements IDictionary<TKey, TValue> {
  public constructor(
    hashCodeFn: (key: TKey) => number,
    equalsFn: (left: TKey, right: TKey) => boolean
  ) {
    this._hashCodeFn = hashCodeFn;
    this._equalsFn = equalsFn;
    this._initialize(0);
  }

  public get size() { return this._count; }

  public set(key: TKey, value: TValue): this {
    let hashCode = this._hashCodeFn(key) & 0x7FFFFFFF;
    let targetBucket = hashCode % this._buckets.length;
    let collisionCount = 0;

    if (!isNaN(targetBucket)) {
      for (let i = this._buckets[targetBucket]; i >= 0; i = this._entries[i].next) {
        if (this._entries[i].hashCode === hashCode && this._equalsFn(key, this._entries[i].key)) {
          this._entries[i].value = value;
          return this;
        }
        collisionCount++;
      }
    }

    let index;
    if (this._freeCount > 0) {
      index = this._freeList;
      this._freeList = this._entries[index].next;
      this._freeCount--;
    } else {
      if (this._count === this._entries.length) {
        this._resize();
        targetBucket = hashCode % this._buckets.length;
      }
      index = this._count;
      this._count++;
    }

    let entry = { hashCode, next: this._buckets[targetBucket], key, value };
    this._entries[index] = entry;
    this._buckets[targetBucket] = index;

    return this;
  }

  public get(key: TKey): TValue | undefined {
    let i = this._findEntry(key);
    if (i >= 0) {
      return this._entries[i].value;
    }
  }

  public delete(key: TKey): boolean {
    if (this._buckets.length > 0) {
      let hashCode = this._hashCodeFn(key) & 0x7FFFFFFF;
      let bucket = hashCode % this._buckets.length;
      let last = -1;
      for (let i = this._buckets[bucket]; i >= 0; last = i, i = this._entries[i].next) {
        if (this._entries[i].hashCode == hashCode && this._equalsFn(this._entries[i].key, key)) {
          if (last < 0) {
            this._buckets[bucket] = this._entries[i].next;
          } else {
            this._entries[last].next = this._entries[i].next;
          }
          this._entries[i].hashCode = -1;
          this._entries[i].next = this._freeList;
          this._entries[i].key = <any>null;
          this._entries[i].value = <any>null;
          this._freeList = i;
          this._freeCount++;
          return true;
        }
      }
    }
    return false;
  }

  public clear(): void {
    if (this._count > 0) {
      for (let i = 0; i < this._buckets.length; i++) this._buckets[i] = -1;
      for (let i = 0; i < this._entries.length; i++) {
        if (this._entries[i]) {
          this._entries[i].hashCode = 0;
          this._entries[i].next = 0;
          this._entries[i].key = <any>null;
          this._entries[i].value = <any>null;
        }
      }
      this._freeList = -1;
      this._count = 0;
      this._freeCount = 0;
    }
  }

  public has(key: TKey): boolean {
    return this._findEntry(key) >= 0;
  }

  private _initialize(capacity: number) {
    let size = HashHelpers.getPrime(capacity);
    this._buckets = Array.from({ length: size }, () => -1);
    this._entries = Array.from({ length: size }, () => ({ hashCode: 0, next: 0, key: <any>null, value: <any>null }));
    this._freeList = -1;
    this._count = 0;
    this._freeCount = 0;
  }

  private _findEntry(key: TKey): number {
    if (this._buckets.length > 0) {
      let hashCode = this._hashCodeFn(key) & 0x7FFFFFFF;
      for (let i = this._buckets[hashCode % this._buckets.length]; i >= 0; i = this._entries[i].next) {
        if (this._entries[i].hashCode == hashCode && this._equalsFn(key, this._entries[i].key)) return i;
      }
    }
    return -1;
  }

  private _resize() {
    let newSize = HashHelpers.expandPrime(this._count);
    let newBuckets = Array.from({ length: newSize }, () => -1);
    let newEntries = Array.from({ length: newSize }, (v, i) => 
      this._entries[i] || { hashCode: 0, next: 0, key: null, value: null });
    for (let i = 0; i < this._count; i++) {
      if (newEntries[i].hashCode >= 0) {
        let bucket = newEntries[i].hashCode % newSize;
        newEntries[i].next = newBuckets[bucket];
        newBuckets[bucket] = i;
      }
    }
    this._buckets = newBuckets;
    this._entries = newEntries;
  }

  private _count: number;
  private _freeList: number;
  private _freeCount: number;
  private _buckets: number[];
  private _entries: IEntry<TKey, TValue>[];

  private _hashCodeFn: (key: TKey) => number;
  private _equalsFn: (left: TKey, right: TKey) => boolean;
}

interface IEntry<TKey, TValue> {
  hashCode: number;
  next: number;
  key: TKey;
  value: TValue;
}

export interface IDictionary<TKey, TValue> {
  set(key: TKey, value: TValue): this;
  get(key: TKey): TValue | undefined;
  delete(key: TKey): boolean;
  clear(): void;
  has(key: TKey): boolean;
  readonly size: number;
}