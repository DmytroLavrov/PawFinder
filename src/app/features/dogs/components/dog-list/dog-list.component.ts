import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { DogService } from '@features/dogs/services/dog.service';
import { Breed, DogImage } from '@shared/models/dog.model';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { DogCardComponent } from '../dog-card/dog-card.component';
import { BreedFilterComponent } from '../breed-filter/breed-filter.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dog-list',
  imports: [LoaderComponent, ErrorMessageComponent, DogCardComponent, BreedFilterComponent],
  templateUrl: './dog-list.component.html',
  styleUrl: './dog-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DogListComponent {
  private dogService: DogService = inject(DogService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  public dogs: WritableSignal<DogImage[]> = signal<DogImage[]>([]);
  public isLoadingDogs: WritableSignal<boolean> = signal<boolean>(true);
  public dogsError: WritableSignal<string | null> = signal<string | null>(null);

  public breeds: WritableSignal<Breed[]> = signal<Breed[]>([]);
  public isLoadingBreeds: WritableSignal<boolean> = signal<boolean>(true);
  public breedsError: WritableSignal<string | null> = signal<string | null>(null);

  public selectedBreedId: WritableSignal<number | null> = signal<number | null>(null);

  constructor() {
    this.loadBreeds();

    const breedId = this.route.snapshot.queryParamMap.get('breed');
    if (breedId) {
      this.selectedBreedId.set(parseInt(breedId, 10));
    }

    this.loadDogs();
  }

  private loadBreeds(): void {
    this.isLoadingBreeds.set(true);
    this.breedsError.set(null);

    this.dogService.getBreeds().subscribe({
      next: (data) => {
        this.breeds.set(data);
        this.isLoadingBreeds.set(false);
      },
      error: (err) => {
        this.breedsError.set(err.message || 'Failed to load breeds');
        this.isLoadingBreeds.set(false);
      },
    });
  }

  private loadDogs(): void {
    this.isLoadingDogs.set(true);
    this.dogsError.set(null);

    const breedId = this.selectedBreedId();

    const request$ = breedId
      ? this.dogService.searchByBreed(breedId, 21)
      : this.dogService.getRandomDogs(21);

    request$.subscribe({
      next: (data) => {
        this.dogs.set(data);
        this.isLoadingDogs.set(false);
      },
      error: (err) => {
        this.dogsError.set(err.message || 'Failed to load dogs');
        this.isLoadingDogs.set(false);
      },
    });
  }

  public onBreedChange(breedId: number | null): void {
    this.selectedBreedId.set(breedId);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        breed: breedId,
      },
      queryParamsHandling: 'merge',
    });

    this.loadDogs();
  }

  public onFavoriteClick(dog: DogImage): void {
    console.log('Added to favorites:', dog);
  }

  public onRetry(): void {
    this.loadDogs();
  }
}
