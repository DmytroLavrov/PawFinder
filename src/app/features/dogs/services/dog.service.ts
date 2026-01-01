import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Breed, DogImage } from '@shared/models/dog.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DogService {
  private readonly apiUrl: string = environment.dogApiUrl;
  private readonly apiKey: string = environment.dogApiKey;

  private readonly http: HttpClient = inject(HttpClient);

  private readonly headers = new HttpHeaders({
    'x-api-key': this.apiKey,
  });

  public getRandomDogs(limit: number = 10, hasBreeds: boolean = true): Observable<DogImage[]> {
    const params = new HttpParams({
      fromObject: {
        limit,
        ...(hasBreeds && { has_breeds: 1 }),
      },
    });

    return this.http
      .get<DogImage[]>(`${this.apiUrl}/images/search`, {
        params,
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  public getBreeds(): Observable<Breed[]> {
    return this.http
      .get<Breed[]>(`${this.apiUrl}/breeds`, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  public searchByBreed(breedId: number, limit: number = 10): Observable<DogImage[]> {
    const params = new HttpParams({
      fromObject: {
        limit,
        breed_ids: breedId,
      },
    });

    return this.http
      .get<DogImage[]>(`${this.apiUrl}/images/search`, {
        params,
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  public getDogById(imageId: string): Observable<DogImage> {
    return this.http
      .get<DogImage>(`${this.apiUrl}/images/${imageId}`, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('Dog API Error:', error);

    const message = error.error?.message || 'Failed to load data from Dog API';
    return throwError(() => new Error(message));
  }
}
