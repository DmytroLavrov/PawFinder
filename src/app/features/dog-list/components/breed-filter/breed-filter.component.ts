import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  Input,
  Output,
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

  protected selectedValue: WritableSignal<string> = signal<string>('all');

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
}
