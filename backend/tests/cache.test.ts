import { MemoryCache } from '../src/utils/cache';

describe('MemoryCache Utility', () => {
  it('should store and retrieve cached values', () => {
    const cache = MemoryCache.getInstance();
    cache.set('test-key', { score: 98 }, 60);
    const retrieved = cache.get<{ score: number }>('test-key');
    expect(retrieved?.score).toBe(98);
  });

  it('should return null for deleted keys', () => {
    const cache = MemoryCache.getInstance();
    cache.set('temp-key', 'temp-value', 60);
    cache.del('temp-key');
    expect(cache.get('temp-key')).toBeNull();
  });
});
