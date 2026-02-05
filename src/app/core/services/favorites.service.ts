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
import { Breed } from '@core/models/dog.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'dog-favorites';

  private storageService: StorageService = inject(StorageService);

  private favoritesSignal: WritableSignal<Breed[]> = signal<Breed[]>([]);

  public favorites = this.favoritesSignal.asReadonly();

  public favoritesCount: Signal<number> = computed(() => this.favoritesSignal().length);

  constructor() {
    this.loadFromStorage();

    effect(() => {
      const favorites = this.favoritesSignal();
      this.saveToStorage(favorites);
    });
  }

  public isFavorite(dogId: string): boolean {
    return this.favoritesSignal().some((dog) => dog.id.toString() === dogId);
  }

  public addFavorite(dog: Breed): void {
    if (this.isFavorite(dog.id.toString())) {
      return;
    }
    this.favoritesSignal.update((currentFavorites) => [dog, ...currentFavorites]);
  }

  public removeFromFavorites(dogId: string): void {
    this.favoritesSignal.update((currentFavorites) =>
      currentFavorites.filter((dog) => dog.id.toString() !== dogId),
    );
  }

  public toggleFavorite(dog: Breed): void {
    if (this.isFavorite(dog.id.toString())) {
      this.removeFromFavorites(dog.id.toString());
    } else {
      this.addFavorite(dog);
    }
  }

  public clearAllFavorites(): void {
    this.favoritesSignal.set([]);
  }

  private loadFromStorage(): void {
    try {
      const storedFavorites = this.storageService.getItem<Breed[]>(this.STORAGE_KEY);
      if (storedFavorites) {
        this.favoritesSignal.set(storedFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites', error);
    }
  }

  private saveToStorage(favorites: Breed[]): void {
    this.storageService.setItem(this.STORAGE_KEY, favorites);
  }
}
