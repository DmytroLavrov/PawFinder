import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-breed-filter',
  imports: [FormsModule],
  templateUrl: './breed-filter.component.html',
  styleUrl: './breed-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreedFilterComponent {
  // Використовуємо model() для двостороннього зв'язку або просто Input/Output
  // Для простоти залишимо Input/Output патерн, як було, але змінимо типи
  @Input() public searchQuery: () => string = () => '';
  @Output() public searchChange = new EventEmitter<string>();

  public onSearch(value: string): void {
    this.searchChange.emit(value);
  }

  public onClear(): void {
    this.searchChange.emit('');
  }
}
