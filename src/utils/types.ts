export interface Restaurant {
  name: string;
  zomatoLink: string;
  googleMapsLink: string;
}

export interface FoodItem {
  name: string;
  ingredients: string[];
  diet: 'vegetarian' | 'non vegetarian';
  prep_time: number;
  cook_time: number;
  flavor_profile: string;
  course: string;
  state: string;
  region: string;
  img_url: string;
  restaurant: string;
  zomato_link: string;
} 