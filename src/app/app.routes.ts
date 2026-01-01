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
    path: 'dogs/:id',
    loadComponent: () =>
      import('./features/dogs/components/dog-details/dog-details.component').then(
        (m) => m.DogDetailsComponent,
      ),
    title: 'Dog Details',
  },
  {
    path: '**',
    redirectTo: 'dogs',
  },
];
