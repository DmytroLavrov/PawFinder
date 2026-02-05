import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FavoritesService } from '@core/services/favorites.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private favoritesService: FavoritesService = inject(FavoritesService);

  public favoritesCount: Signal<number> = this.favoritesService.favoritesCount;
}
