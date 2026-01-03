import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { FavoritesService } from '@core/services/favorites.service';
import { DogCardComponent } from '@features/dog-list/components/dog-card/dog-card.component';
import { DogImage } from '@core/models/dog.model';

@Component({
  selector: 'app-favorites',
  imports: [DogCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent {
  private favoriteService: FavoritesService = inject(FavoritesService);

  protected favorites: Signal<DogImage[]> = this.favoriteService.favorites;
  protected favoritesCount: Signal<number> = this.favoriteService.favoritesCount;

  protected isEmpty: Signal<boolean> = computed(() => this.favoritesCount() === 0);

  public onClearAll(): void {
    this.favoriteService.clearAllFavorites();
  }
}
