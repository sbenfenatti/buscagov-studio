export interface Food {
  fdcId: number;
  description: string;
  dataType: string;
  publicationDate: string;
  foodCode?: string;
  brandOwner?: string;
  gtinUpc?: string;
  ingredients?: string;
  foodNutrients: FoodNutrient[];
  score: number;
}

export interface FoodNutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  value: number;
}

export interface SearchResponse {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: Food[];
}
