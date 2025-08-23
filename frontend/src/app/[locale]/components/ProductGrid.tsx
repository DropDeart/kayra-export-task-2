import Image from "next/image";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { Product } from "../admin/models/Product";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="text-center text-lg font-medium">Ürünler yükleniyor...</div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-10 text-lg text-gray-500">
        Gösterilecek ürün bulunamadı.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
