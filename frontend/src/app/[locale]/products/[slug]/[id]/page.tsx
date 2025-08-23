// src/app/[locale]/products/[id]/page.tsx
import { Product } from "@/app/[locale]/admin/models/Product";
import { fetchFromApi } from "@/lib/api";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ProductDetailClient from "./ProductDetailClient";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

interface Params {
  id: string; // Sadece 'id' parametresini alıyoruz
}

const getProductData = async (id: string): Promise<Product | null> => {
  try {
    const product: Product = await fetchFromApi(`Product/${id}`);
    return product;
  } catch (error) {
    console.error("Failed to fetch product data:", error);
    return null;
  }
};

export async function generateMetadata({ params }: { params: Params }) {
  const product = await getProductData(params.id);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  if (!product) {
    return {
      title: "Ürün Bulunamadı",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        product.productImages.length > 0
          ? `${BASE_URL}${product.productImages[0].filePath}`
          : "/images/kayra_export.webp",
      ],
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = await getProductData(params.id);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const t = await getTranslations("ProductPage");

  if (!product) {
    return <div>{t("productNotFound")}</div>;
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto p-8 mt-16 sm:mt-24 flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 h-96 relative">
            <Image
              src={
                product.productImages.length > 0
                  ? `${BASE_URL}${product.productImages[0].filePath}`
                  : "/images/kayra_export.webp"
              }
              alt={product.name}
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="w-full md:w-1/2">
            <ProductDetailClient product={product} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}