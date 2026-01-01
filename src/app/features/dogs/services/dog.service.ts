import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Breed, DogImage } from '@shared/models/dog.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DogService {
  private readonly apiUrl: string = environment.dogApiUrl;
  private readonly apiKey: string = environment.dogApiKey;

  public readonly http: HttpClient = inject(HttpClient);

  public getRandomDogs(limit: number = 10): Observable<DogImage[]> {
    const params = new HttpParams().set('limit', limit.toString()).set('has_breeds', '1');

    return this.http.get<DogImage[]>(`${this.apiUrl}/images/search`, {
      params,
      headers: this.getHeaders(),
    });
  }

  public getBreeds(): Observable<Breed[]> {
    return this.http.get<Breed[]>(`${this.apiUrl}/breeds`, {
      headers: this.getHeaders(),
    });
  }

  public searchByBreed(breedId: number, limit: number = 10): Observable<DogImage[]> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('breed_ids', breedId.toString());

    return this.http.get<DogImage[]>(`${this.apiUrl}/images/search`, {
      params,
      headers: this.getHeaders(),
    });
  }
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'x-api-key': this.apiKey,
    });
  }
}
