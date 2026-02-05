import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Breed, DogImage } from '@core/models/dog.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DogService {
  private readonly apiUrl: string = environment.dogApiUrl;
  private readonly http: HttpClient = inject(HttpClient);

  public getRandomDogs(limit: number = 10, page: number = 0): Observable<DogImage[]> {
    const params = new HttpParams({
      fromObject: {
        limit,
        page,
        has_breeds: true, // Гарантуємо, що приходять собаки з інформацією про породу
      },
    });

    return this.http.get<any[]>(`${this.apiUrl}/images/search`, { params }).pipe(
      map((dogs) =>
        dogs.map((dog) => {
          // ВАЖЛИВО: Якщо є інформація про породу, використовуємо ID породи як основний ID.
          // Це змінить посилання в картці з /dogs/imageId на /dogs/breedId
          const breed = dog.breeds?.[0];
          return {
            ...dog,
            id: breed ? breed.id.toString() : dog.id,
            // url картинки вже є в об'єкті dog, залишаємо його
          };
        }),
      ),
    );
  }

  public searchBreedsByName(query: string): Observable<DogImage[]> {
    const params = new HttpParams().set('q', query);

    return this.http.get<any[]>(`${this.apiUrl}/breeds/search`, { params }).pipe(
      map((breeds) =>
        breeds
          // Фільтруємо тих, у кого є картинка (reference_image_id або об'єкт image)
          .filter((breed) => breed.reference_image_id || breed.image)
          .map((breed) => ({
            id: breed.id.toString(), // Тут завжди ID породи
            // Якщо API повернуло об'єкт image з url - беремо його, інакше формуємо посилання
            url:
              breed.image?.url ||
              `https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg`,
            width: breed.image?.width || 0,
            height: breed.image?.height || 0,
            breeds: [breed],
          })),
      ),
    );
  }

  // public getDogById(imageId: string): Observable<DogImage> {
  //   return this.http.get<DogImage>(`${this.apiUrl}/images/${imageId}`);
  // }

  // public getDogById(breedId: string): Observable<Breed> {
  //   return this.http.get<Breed>(`${this.apiUrl}/breeds/${breedId}`);
  // }

  public getDogById(id: string): Observable<DogImage> {
    // Перевіряємо, чи це числовий ID (порода) чи рядковий хеш (картинка)
    const isBreedId = /^\d+$/.test(id);

    if (isBreedId) {
      // Завантажуємо деталі ПОРОДИ
      return this.http.get<any>(`${this.apiUrl}/breeds/${id}`).pipe(
        map((breed) => ({
          id: breed.id.toString(),
          // Беремо url з об'єкта image (як у вашому прикладі з Bull Terrier)
          url:
            breed.image?.url || `https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg`,
          width: breed.image?.width || 0,
          height: breed.image?.height || 0,
          breeds: [breed],
        })),
      );
    }

    // Фоллбек для старих посилань (якщо раптом прийде ID картинки)
    return this.http.get<DogImage>(`${this.apiUrl}/images/${id}`).pipe(
      map((dog) => {
        // Навіть тут спробуємо повернути ID породи, щоб інтерфейс був консистентним
        const breed = dog.breeds?.[0];
        return {
          ...dog,
          id: breed ? breed.id.toString() : dog.id,
        };
      }),
    );
  }
}
