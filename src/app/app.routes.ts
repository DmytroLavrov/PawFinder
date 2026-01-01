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
      import('./features/dogs/components/dog-list/dog-list.component').then(
        (m) => m.DogListComponent,
      ),
    title: 'Browse Dogs',
  },
  {
    path: '**',
    redirectTo: 'dogs',
  },
];
