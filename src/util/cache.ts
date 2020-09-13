import NodeCache from 'node-cache';

class CacheUtil {
  constructor(protected cacheService = new NodeCache()) {}

  // TTL in seconds
  public set<T>(key: string, value: T, ttl = 3600): boolean {
    return this.cacheService.set(key, value, ttl);
  }

  public get<T>(key: string): T | undefined {
    return this.cacheService.get<T>(key);
  }

  public clearAllCache(): void {
    return this.cacheService.flushAll();
  }
}

export default new CacheUtil();
