import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dogs',
    pathMatch: 'full',
  },
  {
    path: 'dogs',
    loadComponent: () =>
      import('./features//dog-list/dog-list.component').then((m) => m.DogListComponent),
    title: 'Browse Dogs',
  },
  {
    path: 'dogs/:id',
    loadComponent: () =>
      import('./features/dog-details/dog-details.component').then((m) => m.DogDetailsComponent),
    title: 'Dog Details',
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites.component').then((m) => m.FavoritesComponent),
    title: 'My Favorites',
  },
  {
    path: '**',
    redirectTo: 'dogs',
  },
];
