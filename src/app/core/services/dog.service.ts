import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Breed, DogImage } from '@core/models/dog.model';
import { Observable } from 'rxjs';

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

  public getRandomDogs(
    limit: number = 10,
    page: number = 0,
    hasBreeds: boolean = true,
  ): Observable<DogImage[]> {
    const params = new HttpParams({
      fromObject: {
        limit,
        page,
        ...(hasBreeds && { has_breeds: 1 }),
      },
    });

    return this.http.get<DogImage[]>(`${this.apiUrl}/images/search`, {
      params,
      headers: this.headers,
    });
  }

  public getBreeds(): Observable<Breed[]> {
    return this.http.get<Breed[]>(`${this.apiUrl}/breeds`, {
      headers: this.headers,
    });
  }

  public searchByBreed(
    breedId: number,
    limit: number = 10,
    page: number = 0,
  ): Observable<DogImage[]> {
    const params = new HttpParams({
      fromObject: {
        limit,
        page,
        breed_ids: breedId,
      },
    });

    return this.http.get<DogImage[]>(`${this.apiUrl}/images/search`, {
      params,
      headers: this.headers,
    });
  }

  public getDogById(imageId: string): Observable<DogImage> {
    return this.http.get<DogImage>(`${this.apiUrl}/images/${imageId}`, {
      headers: this.headers,
    });
  }
}
