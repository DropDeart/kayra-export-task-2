"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { SlidersHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductGrid from "./components/ProductGrid";
import FilterSidebar from "./components/FilterSidebar";
import { toast } from "react-toastify";
import { fetchFromApi } from "@/lib/api";
import { Product } from "./admin/models/Product";
import { useTranslations } from "next-intl";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchText, setSearchText] = useState("");
  const t = useTranslations("ProductsPage");

  const handleFilterChange = (
    newMinPrice: number | "",
    newMaxPrice: number | "",
    newSortOrder: "asc" | "desc" | ""
  ) => {
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
    setSortOrder(newSortOrder);
    setPageNumber(1);
    setIsSidebarOpen(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (minPrice) queryParams.append("minPrice", minPrice.toString());
      if (maxPrice) queryParams.append("maxPrice", maxPrice.toString());

      if (sortOrder === "asc") queryParams.append("sortBy", "price_asc");
      else if (sortOrder === "desc") queryParams.append("sortBy", "price_desc");

      queryParams.append("pageNumber", pageNumber.toString());
      queryParams.append("pageSize", pageSize.toString());

      if (searchText.trim()) queryParams.append("searchText", searchText.trim());

      const url = `Product/filter?${queryParams.toString()}`;
      const productList = await fetchFromApi<Product[]>(url, { method: "GET" });
      setProducts(productList);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error(t("productLoadingError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [minPrice, maxPrice, sortOrder, pageNumber, pageSize, searchText]);

  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-grow p-8 mt-16 sm:mt-24">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{t("products")}</h1>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("productSearch")}
                  value={searchText}
                  onChange={(e) => {
                    setPageNumber(1);
                    setSearchText(e.target.value);
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <Button variant="outline" onClick={() => setIsSidebarOpen(true)}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {t("filters")}
              </Button>
            </div>
          </div>

          <ProductGrid products={products} loading={loading} />

          {products.length >= pageSize && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                disabled={pageNumber === 1}
                onClick={() => setPageNumber((prev) => prev - 1)}
              >
                {t("beforePage")}
              </Button>
              <span className="text-gray-600">{t("page")} {pageNumber}</span>
              <Button
                variant="outline"
                onClick={() => setPageNumber((prev) => prev + 1)}
              >
                {t("nextPage")}
              </Button>
            </div>
          )}

          <FilterSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            minPrice={minPrice}
            maxPrice={maxPrice}
            sortOrder={sortOrder}
            onApplyFilters={handleFilterChange}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
