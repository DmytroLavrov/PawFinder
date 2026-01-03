import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
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

  private readonly PAGE_SIZE = 21;

  public dogs: WritableSignal<DogImage[]> = signal<DogImage[]>([]);
  public isLoadingDogs: WritableSignal<boolean> = signal<boolean>(true);
  public dogsError: WritableSignal<string | null> = signal<string | null>(null);

  public breeds: WritableSignal<Breed[]> = signal<Breed[]>([]);
  public isLoadingBreeds: WritableSignal<boolean> = signal<boolean>(true);
  public breedsError: WritableSignal<string | null> = signal<string | null>(null);

  public selectedBreedId: WritableSignal<number | null> = signal<number | null>(null);

  public currentPage: WritableSignal<number> = signal<number>(0);
  public itemsPerPage: WritableSignal<number> = signal<number>(this.PAGE_SIZE);
  public isLoadingMore: WritableSignal<boolean> = signal<boolean>(false);
  public hasMoreData: WritableSignal<boolean> = signal<boolean>(true); // Is there any more data to download?

  @ViewChild('loadMoreSection') loadMoreSection?: ElementRef<HTMLElement>;

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
    this.currentPage.set(0);
    this.hasMoreData.set(true);

    const breedId = this.selectedBreedId();

    const request$ = breedId
      ? this.dogService.searchByBreed(breedId, this.itemsPerPage(), 0)
      : this.dogService.getRandomDogs(this.itemsPerPage(), 0);

    request$.subscribe({
      next: (data) => {
        this.dogs.set(data);
        this.isLoadingDogs.set(false);

        // If you received less than limit, there is no more data.
        if (data.length < this.itemsPerPage()) {
          this.hasMoreData.set(false);
        }
      },
      error: (err) => {
        this.dogsError.set(err.message || 'Failed to load dogs');
        this.isLoadingDogs.set(false);
      },
    });
  }

  public onLoadMore(): void {
    if (this.isLoadingMore() || !this.hasMoreData()) {
      // Preventing double calling
      return;
    }

    this.isLoadingMore.set(true);
    const nextPage = this.currentPage() + 1;
    const breedId = this.selectedBreedId();

    const request$ = breedId
      ? this.dogService.searchByBreed(breedId, this.itemsPerPage(), nextPage)
      : this.dogService.getRandomDogs(this.itemsPerPage(), nextPage);

    request$.subscribe({
      next: (data) => {
        this.dogs.update((currentDogs) => [...currentDogs, ...data]);
        this.currentPage.set(nextPage);
        this.isLoadingMore.set(false);

        // If you received less than limit, there is no more data.
        if (data.length < this.itemsPerPage()) {
          this.hasMoreData.set(false);
        }

        this.scrollToNewContent();
      },
      error: (err) => {
        console.error('Error loading more dogs:', err);
        this.isLoadingMore.set(false);
      },
    });
  }

  private scrollToNewContent(): void {
    setTimeout(() => {
      if (this.loadMoreSection) {
        this.loadMoreSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
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

  public onRetry(): void {
    this.loadDogs();
  }
}
