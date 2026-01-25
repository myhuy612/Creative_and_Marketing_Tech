export async function poll<T>(
  fn: () => Promise<T>,
  isDone: (v: T) => boolean,
  opts?: { intervalMs?: number; timeoutMs?: number }
) {
  const intervalMs = opts?.intervalMs ?? 1200;
  const timeoutMs = opts?.timeoutMs ?? 120000;
  const start = Date.now();

  while (true) {
    const v = await fn();
    if (isDone(v)) return v;
    if (Date.now() - start > timeoutMs) return v;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}
