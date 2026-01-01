import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-message',
  imports: [],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {
  @Input({ required: true }) message!: string;
  @Output() retry = new EventEmitter<void>();
}
