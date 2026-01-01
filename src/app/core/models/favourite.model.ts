import { DogImage } from './dog-image.model';

export interface Favourite {
  id: number;
  image_id: string;
  user_id: string;
  created_at: string;
  image?: DogImage;
}
