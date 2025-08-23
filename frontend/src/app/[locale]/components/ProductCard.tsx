import Image from "next/image";
import Link from "next/link";
import { Product } from "../admin/models/Product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const imageUrl = product.productImages.length > 0 
    ? `${BASE_URL}${product.productImages[0].filePath}` 
    : "/images/kayra_export.webp";


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/products/${product.slug}/${product.id}`} className="block">
        <Image
          src={imageUrl}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-[320px] object-cover rounded-t-lg mb-4"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
          <p className="mt-2 text-xl font-bold text-blue-600">
            {product.price.toLocaleString("tr-TR", {
              style: "currency",
              currency: "TRY",
            })}
          </p>
        </div>
      </Link>
    </div>
  );
}
