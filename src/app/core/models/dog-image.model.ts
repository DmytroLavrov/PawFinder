import { Breed } from './breed.model';

export interface DogImage {
  id: string;
  url: string;
  width: number;
  height: number;
  breeds?: Breed[]; // May be empty
}
