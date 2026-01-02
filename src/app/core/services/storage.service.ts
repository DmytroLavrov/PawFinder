import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }

  public getItem<T>(key: string): T | null {
    try {
      const storedItem = localStorage.getItem(key);
      return storedItem ? JSON.parse(storedItem) : null;
    } catch (error) {
      // If JSON.parse() crashed — clean up the corrupted data
      localStorage.removeItem(key);
      console.error(error);
      return null;
    }
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
