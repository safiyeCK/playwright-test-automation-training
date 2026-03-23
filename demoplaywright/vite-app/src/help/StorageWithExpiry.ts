type StoredItem<T> = {
  value: T;
  expiry: number;
};

export class StorageWithExpiry {
  /**
   * Set a value in localStorage with a time-to-live (TTL).
   * @param key - The key under which the value is stored.
   * @param value - The value to store.
   * @param ttl - Time to live in milliseconds.
   */
  static set<T>(key: string, value: T, ttl: number): void {
    const now = Date.now();
    const item: StoredItem<T> = {
      value,
      expiry: now + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  /**
   * Get a value from localStorage, checking if it has expired.
   * @param key - The key to retrieve.
   * @returns The stored value, or null if expired or not found.
   */
  static get<T>(key: string): T | null {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item: StoredItem<T> = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch (e) {
      console.warn(`Failed to parse item for key "${key}":`, e);
      return null;
    }
  }

  /**
   * Remove a key from localStorage.
   * @param key - The key to remove.
   */
  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all keys from localStorage.
   * Use with caution!
   */
  static clearAll(): void {
    localStorage.clear();
  }
}
