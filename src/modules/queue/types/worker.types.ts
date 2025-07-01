export interface JobWorker<T> {
  handle(data: T): Promise<void> | void;
}
