import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  Input,
  Output,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Breed } from '@core/models/dog.model';

@Component({
  selector: 'app-breed-filter',
  imports: [],
  templateUrl: './breed-filter.component.html',
  styleUrl: './breed-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreedFilterComponent {
  @Input({ required: true }) public breeds: Breed[] = [];
  @Input() public selectedBreedId: number | null = null;
  @Input() public isLoading: boolean = false;

  @Output() public breedChange = new EventEmitter<number | null>();

  protected searchQuery: WritableSignal<string> = signal<string>('');
  protected selectedValue: WritableSignal<string> = signal<string>('all');

  protected filteredBreeds: Signal<Breed[]> = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();

    if (!query) {
      return this.breeds;
    }

    return this.breeds.filter((breed) => breed.name.toLowerCase().includes(query));
  });

  protected noResults: Signal<boolean> = computed(
    () => this.searchQuery().trim() !== '' && this.filteredBreeds().length === 0,
  );

  constructor() {
    effect(() => {
      const breedId = this.selectedBreedId;
      const value = breedId ? breedId.toString() : 'all';

      this.selectedValue.set(value);
    });
  }

  public onBreedChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    const breedId = value === 'all' ? null : parseInt(value, 10);

    this.selectedValue.set(value);
    this.breedChange.emit(breedId);
  }

  public onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  public onClearSearch(): void {
    this.searchQuery.set('');
  }
}
