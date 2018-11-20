import { Series } from "../models/series";
import { Category } from "../models/category";

export class FunkoPop {
    id: string;
    name: string;
    series: Series;
    category: Category;
    number: number;
    image: string;
  }