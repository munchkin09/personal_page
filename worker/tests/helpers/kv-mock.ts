export function makeKVMock(initial: Record<string, string> = {}): KVNamespace {
  const store = new Map<string, string>(Object.entries(initial));
  return {
    async get(key: string) { return store.get(key) ?? null; },
    async put(key: string, value: string) { store.set(key, value); },
    async delete(key: string) { store.delete(key); },
    async list() { return { keys: [], list_complete: true, cacheStatus: null }; },
    async getWithMetadata(key: string) { return { value: store.get(key) ?? null, metadata: null, cacheStatus: null }; },
  } as unknown as KVNamespace;
}
