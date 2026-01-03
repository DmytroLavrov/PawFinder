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
import { DogImage } from '@core/models/dog.model';
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

  public dog: WritableSignal<DogImage | null> = signal<DogImage | null>(null);
  public isLoading: WritableSignal<boolean> = signal<boolean>(true);
  public error: WritableSignal<string | null> = signal<string | null>(null);

  protected isFavorite: Signal<boolean> = computed(() => {
    const currentDog = this.dog();
    return currentDog ? this.favoritesService.isFavorite(currentDog.id) : false;
  });

  ngOnInit(): void {
    const dogId = this.route.snapshot.paramMap.get('id');

    if (!dogId) {
      this.router.navigate(['/dogs']);
      return;
    }

    this.loadDogDetails(dogId);
  }

  private loadDogDetails(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.dogService.getDogById(id).subscribe({
      next: (data) => {
        this.dog.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load dog details');
        this.isLoading.set(false);
        console.error('Error loading dog details:', err);
      },
    });
  }

  public onToggleFavorite(): void {
    const currentDog = this.dog();
    if (!currentDog) return;

    this.favoritesService.toggleFavorite(currentDog);
  }

  public onRetry(): void {
    const dogId = this.route.snapshot.paramMap.get('id');
    if (dogId) {
      this.loadDogDetails(dogId);
    }
  }

  public onBack(): void {
    this.router.navigate(['/dogs']);
  }
}
