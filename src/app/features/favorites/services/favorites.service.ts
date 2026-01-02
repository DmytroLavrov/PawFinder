import {
  computed,
  effect,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { StorageService } from '@core/services/storage.service';
import { DogImage } from '@shared/models/dog.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'dog-favorites';

  private storageService: StorageService = inject(StorageService);

  private favoritesSignal: WritableSignal<DogImage[]> = signal<DogImage[]>([]);

  public favorites = this.favoritesSignal.asReadonly();

  public favoritesCount: Signal<number> = computed(() => this.favoritesSignal().length);

  constructor() {
    // Load from localStorage at startup
    this.loadFromStorage();

    // Automatically save with any change
    effect(() => {
      const favorites = this.favoritesSignal();
      this.saveToStorage(favorites);
    });
  }

  public isFavorite(dogId: string): boolean {
    return this.favoritesSignal().some((dog) => dog.id === dogId);
  }

  public addFavorite(dog: DogImage): void {
    if (this.isFavorite(dog.id)) {
      console.warn('Dog already in favorites');
      return;
    }

    this.favoritesSignal.update((currentFavorites) => [dog, ...currentFavorites]);
  }

  public removeFromFavorites(dogId: string): void {
    this.favoritesSignal.update((currentFavorites) =>
      currentFavorites.filter((dog) => dog.id !== dogId),
    );
  }

  public toggleFavorite(dog: DogImage): void {
    if (this.isFavorite(dog.id)) {
      this.removeFromFavorites(dog.id);
    } else {
      this.addFavorite(dog);
    }
  }

  public clearAllFavorites(): void {
    this.favoritesSignal.set([]);
  }

  private loadFromStorage(): void {
    try {
      const storedFavorites = this.storageService.getItem<DogImage[]>(this.STORAGE_KEY);

      if (storedFavorites) {
        this.favoritesSignal.set(storedFavorites);
      }
    } catch (error) {
      // If there is a parsing error, we clear it.
      this.storageService.removeItem(this.STORAGE_KEY);
    }
  }

  private saveToStorage(favorites: DogImage[]): void {
    try {
      this.storageService.setItem(this.STORAGE_KEY, favorites);
    } catch (error) {
      console.error('Failed to save favorites to storage:', error);
    }
  }
}
