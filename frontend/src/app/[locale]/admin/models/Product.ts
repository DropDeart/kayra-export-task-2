import { ProductImage } from "./ProductImage";
export interface Product{
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    productImages: ProductImage[];
    slug:string;
}

export interface CreateProduct {
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  description: string;
  productImages: ProductImage[];  
  slug:string;
}
export interface UpdateProduct extends CreateProduct {
  id: string;
}