import NodeCache from 'node-cache';

export class CacheUtil {
  constructor(protected cacheService = new NodeCache()) {}

  // TTL in seconds
  public set<T>(key: string, value: T, ttl = 3600): boolean {
    return this.cacheService.set(key, value, ttl);
  }

  public get<T>(key: string): T {
    const value = this.cacheService.get(key);

    return value as T;
  }
}
