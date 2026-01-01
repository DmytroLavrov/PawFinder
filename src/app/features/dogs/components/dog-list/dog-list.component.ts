import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { DogService } from '@features/dogs/services/dog.service';
import { DogImage } from '@shared/models/dog.model';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { DogCardComponent } from '../dog-card/dog-card.component';

@Component({
  selector: 'app-dog-list',
  imports: [LoaderComponent, ErrorMessageComponent, DogCardComponent],
  templateUrl: './dog-list.component.html',
  styleUrl: './dog-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DogListComponent {
  private dogService: DogService = inject(DogService);

  public dogs: WritableSignal<DogImage[]> = signal<DogImage[]>([]);
  public isLoading: WritableSignal<boolean> = signal<boolean>(true);
  public error: WritableSignal<string | null> = signal<string | null>(null);

  constructor() {
    this.loadDogs();
  }

  private loadDogs(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.dogService.getRandomDogs(21).subscribe({
      next: (data) => {
        this.dogs.set(data);
        this.isLoading.set(false);
        console.log(this.dogs());
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load dogs');
        this.isLoading.set(false);
        console.error('Error loading dogs:', err);
      },
    });
  }

  public onFavoriteClick(dog: DogImage): void {
    console.log('Added to favorites:', dog);
  }

  public onRetry(): void {
    this.loadDogs();
  }
}
