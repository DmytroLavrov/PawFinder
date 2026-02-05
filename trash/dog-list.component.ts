import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { DogService } from '@core/services/dog.service';
import { DogImage } from '@core/models/dog.model';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { DogCardComponent } from '@features/dog-list/components/dog-card/dog-card.component';
import { BreedFilterComponent } from '@features/dog-list/components/breed-filter/breed-filter.component';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  // Основні сигнали даних
  public dogs: WritableSignal<DogImage[]> = signal<DogImage[]>([]);
  public isLoading: WritableSignal<boolean> = signal<boolean>(true);
  public error: WritableSignal<string | null> = signal<string | null>(null);

  // Сигнал пошуку
  public searchQuery: WritableSignal<string> = signal<string>('');

  // Для дебаунсу введення (щоб не смикати API на кожну літеру миттєво)
  private searchSubject = new Subject<string>();

  // Пагінація (тільки для режиму Random)
  public currentPage: WritableSignal<number> = signal<number>(0);
  public isLoadingMore: WritableSignal<boolean> = signal<boolean>(false);
  public hasMoreData: WritableSignal<boolean> = signal<boolean>(true);

  @ViewChild('loadMoreSection') loadMoreSection?: ElementRef<HTMLElement>;

  constructor() {
    // Отримуємо початкове значення з URL
    const queryParam = this.route.snapshot.queryParamMap.get('q');
    if (queryParam) {
      this.searchQuery.set(queryParam);
      this.performSearch(queryParam);
    } else {
      this.loadRandomDogs();
    }

    // Підписка на зміни в інпуті з затримкою (debounce)
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((query) => {
        this.updateUrl(query);
        if (query.trim()) {
          this.performSearch(query);
        } else {
          this.loadRandomDogs();
        }
      });
  }

  // Метод, який викликається з компонента фільтру
  public onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.searchSubject.next(query);
  }

  private performSearch(query: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.hasMoreData.set(false); // Вимикаємо пагінацію для пошуку

    this.dogService.searchBreedsByName(query).subscribe({
      next: (data) => {
        this.dogs.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to search breeds');
        this.isLoading.set(false);
      },
    });
  }

  private loadRandomDogs(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.currentPage.set(0);
    this.hasMoreData.set(true);

    this.dogService.getRandomDogs(this.PAGE_SIZE, 0).subscribe({
      next: (data) => {
        this.dogs.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load dogs');
        this.isLoading.set(false);
      },
    });
  }

  public onLoadMore(): void {
    // Пагінація працює тільки якщо немає активного пошукового запиту
    if (this.isLoadingMore() || !this.hasMoreData() || this.searchQuery()) {
      return;
    }

    this.isLoadingMore.set(true);
    const nextPage = this.currentPage() + 1;

    this.dogService.getRandomDogs(this.PAGE_SIZE, nextPage).subscribe({
      next: (data) => {
        this.dogs.update((current) => [...current, ...data]);
        this.currentPage.set(nextPage);
        this.isLoadingMore.set(false);

        if (data.length < this.PAGE_SIZE) {
          this.hasMoreData.set(false);
        }
      },
      error: (err) => {
        console.error('Error loading more:', err);
        this.isLoadingMore.set(false);
      },
    });
  }

  private updateUrl(query: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: query || null },
      queryParamsHandling: 'merge',
    });
  }

  public onRetry(): void {
    const query = this.searchQuery();
    if (query) {
      this.performSearch(query);
    } else {
      this.loadRandomDogs();
    }
  }
}
