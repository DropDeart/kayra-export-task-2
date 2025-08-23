/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useReactTable, getCoreRowModel, getPaginationRowModel, ColumnDef, flexRender } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category, NewCategory } from "../models/Category";
import { toast, ToastContainer } from "react-toastify";
import { useSession } from 'next-auth/react';
import { MoreVerticalIcon, EditIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; 
import { fetchFromApi } from "@/lib/api";

export default function CategoryPage() {
    const { data: session, status } = useSession();
    const router = useRouter(); 

    const [data, setData] = useState<Category[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    const token = session?.token; 

    const fetchData = async () => {
      if (status !== "authenticated" || !token) {
        console.log('Session is not authenticated, skipping data fetch.');
        return;
      }
      try {
        setLoading(true);
        const url = `Category`;
        const categoryList: Category[] = await fetchFromApi(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(categoryList);
      } catch (err: any) {
        console.error('Data fetch error:', err);
        toast.error(err.message || "Kategori listesi yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchData();
    }, [status, token]);


    const columns: ColumnDef<Category>[] = [
      { accessorKey: "id", header: "Id" },
      { accessorKey: "name", header: "Kategori Adı" },
      { accessorKey: "description", header: "Açıklama" },  
      { accessorKey: "slug", header:"Slug"},
      {
        id: "actions",
        header: "İşlemler",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                size="icon"
              >
                <MoreVerticalIcon className="h-4 w-4" />
                <span className="sr-only">Menüyü aç</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                <div className="flex items-center"> 
                  <EditIcon className="mr-2 h-4 w-4" />
                  <span>Düzenle</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeleteClick(row.original)}>
                <div className="flex items-center">
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  <span>Sil</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ]

    const table = useReactTable({
      data: data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      initialState: { pagination: { pageSize: 10 } }
    });

    async function handleAdd(category: NewCategory) {
      try {
        await fetchFromApi("Category", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(category),
        });
        
        toast.success("Yeni kategori başarıyla eklendi!");
        setIsAddOpen(false);
        fetchData();

      } catch (err: any) {
        toast.error(err.message || "Kategori eklenirken bir hata oluştu");
      }
    }   

    async function handleEdit(category: Category) {
      setSelectedCategory(category);
      setIsEditOpen(true);
    }

    async function handleUpdate(updatedCategory: Category) {
      try {
        await fetchFromApi("Category", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedCategory),
        });
        
        toast.success("Kategori başarıyla güncellendi");
        setIsEditOpen(false);
        fetchData();
      } catch (err: any) {
        toast.error(err.message || "Kategori güncellenirken hata oluştu");
      }
    }

    function handleDeleteClick(category: Category) {
      setCategoryToDelete(category);
      setDeleteConfirmOpen(true);
    }

    async function handleDeleteConfirm() {
      if (!categoryToDelete || !token) return;
      try {
        await fetchFromApi(`Category/${categoryToDelete.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Kategori başarıyla silindi!");
        setDeleteConfirmOpen(false);
        setCategoryToDelete(null);
        fetchData();
      } catch (err: any) {
        toast.error(err.message || "Kategori silinirken hata oluştu");
      }
    }

    const handleUpdateCategory = async (updatedCategory: Category) => {
      await handleUpdate(updatedCategory);
      setData(prev => prev.map(c => (c.id === updatedCategory.id ? updatedCategory : c)));
    };

    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-3xl">Kategoriler</h1>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>Yeni Kategori Ekle</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Kategori</DialogTitle>
              </DialogHeader>
              <NewCategoryForm onSubmit={handleAdd} />
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kategoriyi Düzenle</DialogTitle>
            </DialogHeader>
            <FormikUpdateCategory
              category={selectedCategory}
              onClose={() => setIsEditOpen(false)}
              onUpdated={handleUpdateCategory}
            />
          </DialogContent>
        </Dialog>

        <ConfirmDeleteDialog
          isOpen={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleDeleteConfirm}
          categoryName={categoryToDelete?.name || ""}
        />

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map(row => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                  </TableRow>
                  ))
              ) : (
                  <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                      Gösterilecek kategori bulunamadı.
                  </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end items-center gap-2">
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Önceki
          </Button>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sonraki
          </Button>
        </div>
        <ToastContainer />
      </div>
    )
  }
  
interface NewCategoryFormProps {
  onSubmit: (p: NewCategory) => void;
}

export function NewCategoryForm({ onSubmit }: NewCategoryFormProps) {
  const initialValues = {
    name: "",
    description: "",
    slug:""
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Kategori adı zorunludur"),
    description: Yup.string().nullable(),
    slug: Yup.string().required("Slug zorunludur")
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        onSubmit({
          name: values.name,
          description: values.description,
          slug: values.slug
        });
        actions.resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <Label htmlFor="name">Kategori Adı</Label>
            <Field
              as={Input}
              name="name"
              id="name"
              placeholder="Örn: Elektronik"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-xs"
            />
          </div>
          <div>
            <Label htmlFor="description">Kategori Açıklaması</Label>
            <Field
              as="textarea"
              name="description"
              rows={4}
              placeholder="Açıklama giriniz..."
              className="border rounded p-2 w-full"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-xs"
            />
          </div>
        <div>
            <Label htmlFor="slug">Kategori Slug</Label>
            <Field
              as={Input}
              name="slug"
              id="slug"
              placeholder="Kıslatma metnini girin"
            />
            <ErrorMessage
              name="slug"
              component="div"
              className="text-red-500 text-xs"
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            Kaydet
          </Button>
        </Form>
      )}
    </Formik>
  );
}

interface FormikUpdateCategoryProps {
  category: Category | null;
  onClose: () => void;
  onUpdated?: (updated: Category) => void;
}

export function FormikUpdateCategory({
  category,
  onClose,
  onUpdated,
}: FormikUpdateCategoryProps) {

  const { data: session } = useSession();
  const token = session?.token;
  const router = useRouter();

  if (!category) return null;

  const initialValues = {
    name: category.name,
    description: category.description || "",
    id: category.id,
    slug: category.slug || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Kategori adı zorunludur"),
    description: Yup.string().nullable(),
    slug: Yup.string().required("Slug zorunludur"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const updatedCategory: Category = { ...values, slug: values.slug || "" };

      await fetchFromApi("Category", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCategory),
      });

      toast.success("Kategori başarıyla güncellendi");
      onClose();
      if (onUpdated) {
        onUpdated(updatedCategory);
      }
    } catch (err: any) {
      toast.error(err.message || "Kategori güncellenirken hata oluştu");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <Label htmlFor="name">Kategori Adı</Label>
            <Field as={Input} name="name" />
            <ErrorMessage name="name" component="div" className="text-red-500 text-xs" />
          </div>
          <div>
            <Label htmlFor="description">Açıklama</Label>
            <Field
              as="textarea"
              name="description"
              rows={4}
              className="border rounded p-2 w-full"
            />
            <ErrorMessage name="description" component="div" className="text-red-500 text-xs" />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Field as={Input} name="slug" />
            <ErrorMessage name="slug" component="div" className="text-red-500 text-xs" />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            Güncelle
          </Button>
        </Form>
      )}
    </Formik>
  );
}

function ConfirmDeleteDialog({ isOpen, onClose, onConfirm, categoryName }: {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  categoryName: string
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Silme Onayı</DialogTitle>
        </DialogHeader>
        <p>“{categoryName}” kategorisini silmek istediğinize emin misiniz?</p>
        <DialogFooter className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>İptal</Button>
          <Button variant="destructive" onClick={() => {
            onConfirm();
            onClose();
          }}>
            Sil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}