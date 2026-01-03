import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  Signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '@features/favorites/services/favorites.service';
import { DogImage } from '@shared/models/dog.model';

@Component({
  selector: 'app-dog-card',
  imports: [RouterLink],
  templateUrl: './dog-card.component.html',
  styleUrl: './dog-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DogCardComponent {
  @Input({ required: true }) dog!: DogImage;

  private favoriteService: FavoritesService = inject(FavoritesService);

  public isFavorite: Signal<boolean> = computed(() => this.favoriteService.isFavorite(this.dog.id));

  @Output() public favoriteClick = new EventEmitter<DogImage>();

  protected get breedName(): string {
    return this.dog.breeds?.[0]?.name || 'Mixed Breed';
  }

  protected get temperament(): string {
    return this.dog.breeds?.[0]?.temperament || 'Friendly';
  }

  protected get lifeSpan(): string {
    return this.dog.breeds?.[0]?.life_span || '';
  }

  public onFavoriteClick(event: Event): void {
    event.preventDefault(); // To prevent routerLink from working
    event.stopPropagation();

    this.favoriteService.toggleFavorite(this.dog);
  }
}
