export type Generator<T> = { next: () => T };

export class CyclicGenerator implements Generator<string> {
  private sequence: string;
  private index: number;

  constructor(sequence: string) {
    this.sequence = sequence;
    this.index = 0;
  }

  next(): string {
    const n = this.sequence.charAt(this.index);
    this.index = (this.index + 1) % this.sequence.length;
    return n;
  }
}
