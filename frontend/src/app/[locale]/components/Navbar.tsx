"use client";

import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState } from "react";
import CartSidebar from "./CartSidebar";

export default function Navbar() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300"
          >
            E-Commerce App
          </Link>

          <div className="flex items-center space-x-6">
            <button
              className="relative text-gray-600 hover:text-blue-600 transition-colors duration-300"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {totalQuantity}
                </span>
              )}
            </button>

            <Link
              href="/login"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </nav>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => alert("Ödeme modalı açılacak")}
      />
    </>
  );
}
