import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
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
    this.favoriteClick.emit(this.dog);
  }
}
