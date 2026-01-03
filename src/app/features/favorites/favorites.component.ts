import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { FavoritesService } from './services/favorites.service';
import { DogCardComponent } from '@features/dogs/components/dog-card/dog-card.component';

@Component({
  selector: 'app-favorites',
  imports: [DogCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent {
  private favoriteService: FavoritesService = inject(FavoritesService);

  protected favorites = this.favoriteService.favorites;
  protected favoritesCount = this.favoriteService.favoritesCount;

  protected isEmpty: Signal<boolean> = computed(() => this.favoritesCount() === 0);

  public onClearAll(): void {
    this.favoriteService.clearAllFavorites();
  }
}
