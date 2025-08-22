export interface Category {
    id:string
    name: string
    description: string
    slug:string;
}

export interface NewCategory {
  name: string;
  description?: string;
  slug:string;
}