export default class Func<TIn, TOut> {
  private constructor(private func: (value: TIn) => TOut) { }

  public pipe<T>(func: (value: TOut) => T): Func<TIn, T> {
    let composition = (value: TIn) => {
      return func(this.func(value))
    };
    return Func.from(composition);
  }

  public done() {
    return this.func;
  }

  public static from<TIn, TOut>(func: (value: TIn) => TOut) {
    return new Func(func);
  }
}