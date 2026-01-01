export interface Breed {
  id: number;
  name: string;
  bred_for?: string; // "Companionship"
  breed_group?: string; // "Toy"
  life_span: string; // "12 - 15 years"
  temperament?: string; // "Friendly, Intelligent"
  weight: {
    imperial: string; // "6 - 13"
    metric: string; // "3 - 6"
  };
  height: {
    imperial: string;
    metric: string;
  };
  image?: {
    id: string;
    url: string;
  };
}
