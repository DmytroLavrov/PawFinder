import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DogService } from '@core/services/dog.service';
import { Breed } from '@core/models/dog.model';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { FavoritesService } from '@core/services/favorites.service';

@Component({
  selector: 'app-dog-details',
  imports: [LoaderComponent, ErrorMessageComponent],
  templateUrl: './dog-details.component.html',
  styleUrl: './dog-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DogDetailsComponent implements OnInit {
  private dogService: DogService = inject(DogService);
  private favoritesService: FavoritesService = inject(FavoritesService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  public breed: WritableSignal<Breed | null> = signal<Breed | null>(null);
  public isLoading: WritableSignal<boolean> = signal<boolean>(true);
  public error: WritableSignal<string | null> = signal<string | null>(null);

  protected isFavorite: Signal<boolean> = computed(() => {
    const currentBreed = this.breed();
    return currentBreed ? this.favoritesService.isFavorite(currentBreed.id.toString()) : false;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/dogs']);
      return;
    }

    this.loadBreedDetails(id);
  }

  private loadBreedDetails(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.dogService.getBreedById(id).subscribe({
      next: (data) => {
        this.breed.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load details');
        this.isLoading.set(false);
      },
    });
  }

  public onToggleFavorite(): void {
    const currentBreed = this.breed();
    if (currentBreed) {
      this.favoritesService.toggleFavorite(currentBreed);
    }
  }

  public onBack(): void {
    this.router.navigate(['/dogs']);
  }

  public onRetry(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadBreedDetails(id);
  }
}
