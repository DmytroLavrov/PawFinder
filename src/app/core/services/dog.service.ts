import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Breed } from '@core/models/dog.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DogService {
  private readonly apiUrl: string = environment.dogApiUrl;
  private readonly http: HttpClient = inject(HttpClient);

  private readonly CDN_URL = 'https://cdn2.thedogapi.com/images';

  public getBreeds(limit: number = 10, page: number = 0): Observable<Breed[]> {
    const params = new HttpParams({
      fromObject: {
        limit,
        page,
      },
    });

    return this.http.get<any[]>(`${this.apiUrl}/breeds`, { params }).pipe(
      map((breeds) =>
        breeds
          .filter((breed) => breed.reference_image_id || breed.image?.id)
          .map((breed) => {
            const imageId = breed.reference_image_id || breed.image?.id;
            const imageUrl = breed.image?.url || `${this.CDN_URL}/${imageId}.jpg`;

            return {
              ...breed,
              image: {
                id: imageId,
                url: imageUrl,
              },
            } as Breed;
          }),
      ),
    );
  }

  public searchBreedsByName(query: string): Observable<Breed[]> {
    const params = new HttpParams().set('q', query);

    return this.http.get<any[]>(`${this.apiUrl}/breeds/search`, { params }).pipe(
      map((breeds) =>
        breeds
          .filter((breed) => breed.reference_image_id || breed.image?.id)
          .map((breed) => {
            const imageId = breed.reference_image_id || breed.image?.id;
            const imageUrl = breed.image?.url || `${this.CDN_URL}/${imageId}.jpg`;

            return {
              ...breed,
              image: {
                id: imageId,
                url: imageUrl,
              },
            } as Breed;
          }),
      ),
    );
  }

  public getBreedById(id: number | string): Observable<Breed> {
    return this.http.get<any>(`${this.apiUrl}/breeds/${id}`).pipe(
      map((breed) => {
        const imageId = breed.reference_image_id || breed.image?.id;
        const imageUrl = breed.image?.url || `${this.CDN_URL}/${imageId}.jpg`;

        return {
          ...breed,
          image: {
            id: imageId,
            url: imageUrl,
          },
        } as Breed;
      }),
    );
  }
}
