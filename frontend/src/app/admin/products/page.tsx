/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  Row,
} from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import {
  MoreVerticalIcon,
  EditIcon,
  Trash2Icon,
  ArrowRightFromLine,
  SearchIcon,
  ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Category } from "../models/Category";
import { Product, CreateProduct } from "../models/Product";
import { ProductImage } from "../models/ProductImage";
import { fetchFromApi } from "@/lib/api";
import { NewProductForm } from "../components/NewProductForm";
import { EditProductForm } from "../components/EditProductForm";
import { ProductImageForm } from "../components/ProductImageForm";

export default function ProductPage() {
  const router = useRouter(); 

  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<(CreateProduct & { id: string }) | null>(null);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [searchText, setSearchText] = useState("");

  const token = session?.token;

  const fetchData = async (text = "") => {
    if (status !== "authenticated" || !token) {
        console.log('Session is not authenticated, skipping data fetch.');
        return;
    }

    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        fetchFromApi<Product[]>(`Product/filter?searchText=${text}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetchFromApi<Category[]>("Category", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setProducts(productsRes);
      setCategories(categoriesRes);
    } catch (err: any) {
      console.error('Data fetch error:', err);
      toast.error(err.message || "Veriler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(searchText);
  }, [status, token]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchData(searchText);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchText]); 

  const columns: ColumnDef<Product>[] = [
    { accessorKey: "id", header: "Id" },
    { accessorKey: "name", header: "Ürün Adı" },
    { accessorKey: "slug", header: "Slug" },
    { accessorKey: "description", header: "Açıklama" },
    { accessorKey: "price", header: "Fiyat" },
    { accessorKey: "stock", header: "Stok" },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }: { row: Row<Product> }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => startEdit(row.original)}>
              <EditIcon className="mr-2 h-4 w-4" /> Düzenle
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => startImageManagement(row.original)}>
              <ImageIcon className="mr-2 h-4 w-4" /> Resim Ekle
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => confirmDelete(row.original)}>
              <Trash2Icon className="mr-2 h-4 w-4" /> Sil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${row.original.id}`} className="flex items-center">
                <ArrowRightFromLine className="mr-2 h-4 w-4" />
                Detay
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  async function handleAdd(product: CreateProduct) {
    if (!token) return;
    try {
      const newProduct = await fetchFromApi<Product>("Product", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      setProducts((prev) => [...prev, newProduct]);
      toast.success("Ürün başarıyla eklendi");
      setIsAddOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Ürün eklenirken hata oluştu");
    }
  }

  async function startEdit(product: Product) {
    if (!token) return;
    try {
      const data = await fetchFromApi<Product>(`Product/${product.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedProduct(data);
      setIsEditOpen(true);
    } catch (err: any) {
      toast.error(err.message || "Güncelleme sırasında hata");
    }
  }

  async function handleUpdate(updatedProduct: Product) {
    if (!token) return;
    try {
      const updatedResponse = await fetchFromApi<Product>("Product", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? { ...p, ...updatedResponse } : p))
      );
      toast.success("Ürün güncellendi!");
      setIsEditOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Güncelleme sırasında hata");
    }
  }

  async function startImageManagement(product: Product) {
    if (!token) return;
    try {
      const images = await fetchFromApi<ProductImage[]>(`GetProductImages/${product.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedProduct(product);
      setProductImages(images);
      setIsImageModalOpen(true);
    } catch (err: any) {
      toast.error(err.message || "Resimler yüklenirken hata oluştu");
      setProductImages([]);
    }
  }

  function confirmDelete(product: Product) {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!productToDelete || !token) return;

    try {
      await fetchFromApi(`Product/${productToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      toast.success("Ürün silindi!");
    } catch (err: any) {
      toast.error(err.message || "Silme işlemi başarısız");
    } finally {
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ürünler</h1>
        <div className="flex justify-center w-full">
          <div className="relative w-2/3">
            <input
              type="text"
              placeholder="Ara..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full border border-gray-300 rounded-3xl pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e5e7eb]"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>Yeni Ürün Ekle</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle>Yeni Ürün Ekle</DialogTitle>
            </DialogHeader>
            <NewProductForm onSubmit={handleAdd} categories={categories} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center h-24">
                  {loading ? "Yükleniyor..." : "Gösterilecek ürün yok"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Ürünü Düzenle</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <EditProductForm
              onSubmit={handleUpdate}
              categories={categories}
              initialValues={selectedProduct}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Resim Yönetimi</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ProductImageForm
              product={{ ...selectedProduct, productImages: productImages }}
              onSuccess={() => {
                setIsImageModalOpen(false);
                fetchData(searchText);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Silme Onayı</DialogTitle>
          </DialogHeader>
          <p>
            “{productToDelete?.name}” adlı ürünü silmek istediğinize emin misiniz?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
  );
}