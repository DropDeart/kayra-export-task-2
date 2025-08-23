"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { Product } from "@/app/[locale]/admin/models/Product";
import { Button } from "@/components/ui/button";
import CartSidebar from "../../../components/CartSidebar";
import { useTranslations } from "next-intl";

interface Props {
  product: Product;
}

export default function ProductDetailClient({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    setIsCartOpen(true);
  };

  const t = useTranslations("ProductDetailClient");

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-xl font-semibold text-blue-600">
        {product.price.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
      </p>
      <p className="text-gray-700">{product.description}</p>

      <div className="flex items-center gap-4 mt-4">
        <label>{t("quantity")}</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="border rounded px-2 py-1 w-20"
        />
      </div>

      <Button onClick={handleAddToCart} className="mt-4 w-40">
        {t("addToCart")}
      </Button>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => alert("Ödeme modali açılacak!")}
      />
    </div>
  );
}
