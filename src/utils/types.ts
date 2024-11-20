export interface Recipe {
  title: string;
  category: string[];
  ingredients: string[];
  directions: string[];
}

export interface ScrapingResult {
  success: boolean;
  message: string;
  count?: number;
}