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
import { FavoritesService } from '@core/services/favorites.service';
import { Breed } from '@core/models/dog.model';

@Component({
  selector: 'app-dog-card',
  imports: [RouterLink],
  templateUrl: './dog-card.component.html',
  styleUrl: './dog-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DogCardComponent {
  @Input({ required: true }) breed!: Breed;

  private favoriteService: FavoritesService = inject(FavoritesService);

  public isFavorite: Signal<boolean> = computed(() =>
    this.favoriteService.isFavorite(this.breed.id.toString()),
  );

  @Output() public favoriteClick = new EventEmitter<Breed>();

  public onFavoriteClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteService.toggleFavorite(this.breed);
    this.favoriteClick.emit(this.breed);
  }
}
