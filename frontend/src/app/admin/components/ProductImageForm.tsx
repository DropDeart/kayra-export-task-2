/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";

import { ProductImage } from "../models/ProductImage";
import { fetchFromApi } from "@/lib/api";
import { Product } from "../models/Product";
import { DropzoneField } from "./DropzoneField";

interface MyImageFormValues {
  imageFiles: File[];
  deletedImageIds: string[];
}

interface ProductImageFormProps {
  product: Product;
  onSuccess: () => void;
}

const validationSchema = Yup.object({
  imageFiles: Yup.array().of(
    Yup.mixed()
      .test("fileSize", "Dosya boyutu max 2MB olmalı", (file: any) => {
        return file ? file.size <= 2 * 1024 * 1024 : true;
      })
      .test("fileFormat", "Geçersiz dosya tipi. JPG, PNG veya GIF olmalı", (file: any) => {
        return file ? ["image/jpeg", "image/png", "image/gif"].includes(file.type) : true;
      })
  ),
  deletedImageIds: Yup.array().of(Yup.string()),
});

export function ProductImageForm({ product, onSuccess }: ProductImageFormProps) {
  const { data: session } = useSession();

  const memoizedInitialValues = useMemo(() => {
    return {
      imageFiles: [],
      deletedImageIds: [],
    };
  }, [product.id]);

  const handleSubmit = async (values: MyImageFormValues, actions: any) => {
    if (!session?.token) {
        toast.error("Oturum doğrulanamadı.");
        return;
    }

    const formData = new FormData();

    values.imageFiles.forEach(file => {
      formData.append("Files", file);
    });

    if (values.deletedImageIds && values.deletedImageIds.length > 0) {
      formData.append("DeletedImageIds", JSON.stringify(values.deletedImageIds));
    }

    try {
      await fetchFromApi<any>(`products/${product.id}/images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.token}` },
        body: formData,
      });
      toast.success("Resimler başarıyla güncellendi!");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Resim işlemi başarısız.");
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik<MyImageFormValues>
      initialValues={memoizedInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ setFieldValue, values, isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <Label>Ürün Görselleri (max 5)</Label>
            <DropzoneField
              setFieldValue={setFieldValue}
              retainedImages={product.productImages || []}
              deletedImageIds={values.deletedImageIds}
            />
            <ErrorMessage name="imageFiles" component="div" className="text-red-500 text-xs mt-1" />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            Resimleri Güncelle
          </Button>
        </Form>
      )}
    </Formik>
  );
}