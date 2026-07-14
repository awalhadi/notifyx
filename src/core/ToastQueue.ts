import type { NormalizedToastOptions, QueueEntry, ToastPriority } from "../types";

/** Maps priority strings to numeric weights (higher = more urgent) */
const PRIORITY_WEIGHT: Record<ToastPriority, number> = {
  critical: 4,
  high: 3,
  normal: 2,
  low: 1,
};

/**
 * ToastQueue — Min-heap priority queue for toast scheduling.
 * Toasts with higher priority bubble up; ties broken by timestamp (FIFO).
 * @internal
 */
export class ToastQueue {
  private heap: QueueEntry[] = [];
  private maxSize: number;

  constructor(maxSize = 50) {
    this.maxSize = maxSize;
  }

  /** Current queue depth */
  get size(): number {
    return this.heap.length;
  }

  /** True when no queued items remain */
  get isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * Enqueue a toast entry.
   * Drops oldest low-priority item if at capacity.
   */
  enqueue(options: NormalizedToastOptions): string {
    const id = options.id ?? this.generateId();
    const entry: QueueEntry = {
      options: { ...options, id },
      priority: PRIORITY_WEIGHT[options.priority ?? "normal"],
      timestamp: Date.now(),
      id,
    };

    if (this.heap.length >= this.maxSize) {
      // Evict the lowest-priority / oldest item
      const lowestIdx = this.findLowestPriorityIndex();
      if (this.heap[lowestIdx].priority >= entry.priority) {
        // Incoming is not better — discard it
        return id;
      }
      this.heap.splice(lowestIdx, 1);
    }

    this.heap.push(entry);
    this.bubbleUp(this.heap.length - 1);
    return id;
  }

  /** Dequeue the highest-priority entry */
  dequeue(): QueueEntry | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const top = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.sinkDown(0);
    return top;
  }

  /** Peek without removing */
  peek(): QueueEntry | undefined {
    return this.heap[0];
  }

  /** Remove a specific entry by id */
  remove(id: string): boolean {
    const idx = this.heap.findIndex((e) => e.id === id);
    if (idx === -1) return false;

    if (idx === this.heap.length - 1) {
      this.heap.pop();
    } else {
      this.heap[idx] = this.heap.pop()!;
      this.bubbleUp(idx);
      this.sinkDown(idx);
    }
    return true;
  }

  /** Clear entire queue */
  clear(): void {
    this.heap = [];
  }

  // ─── Heap internals ────────────────────────────────────────────────

  private bubbleUp(idx: number): void {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.compare(this.heap[idx], this.heap[parent]) > 0) {
        [this.heap[idx], this.heap[parent]] = [this.heap[parent], this.heap[idx]];
        idx = parent;
      } else break;
    }
  }

  private sinkDown(idx: number): void {
    const n = this.heap.length;
    while (true) {
      let largest = idx;
      const l = 2 * idx + 1;
      const r = 2 * idx + 2;

      if (l < n && this.compare(this.heap[l], this.heap[largest]) > 0) largest = l;
      if (r < n && this.compare(this.heap[r], this.heap[largest]) > 0) largest = r;

      if (largest === idx) break;
      [this.heap[idx], this.heap[largest]] = [this.heap[largest], this.heap[idx]];
      idx = largest;
    }
  }

  /** Higher priority wins; ties go to earlier timestamp */
  private compare(a: QueueEntry, b: QueueEntry): number {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return b.timestamp - a.timestamp; // earlier = bigger wins
  }

  private findLowestPriorityIndex(): number {
    let idx = 0;
    for (let i = 1; i < this.heap.length; i++) {
      if (this.compare(this.heap[i], this.heap[idx]) < 0) idx = i;
    }
    return idx;
  }

  private generateId(): string {
    return `nx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }
}
