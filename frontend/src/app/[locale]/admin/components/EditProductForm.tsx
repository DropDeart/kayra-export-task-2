/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CurrencyInput from "react-currency-input-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { ComboBox } from "./ComboBox";
import { useMemo } from "react";

interface EditProductFormProps {
  onSubmit: (values: Product) => void;
  categories: Category[];
  initialValues: Product;
}

export function EditProductForm({ onSubmit, categories, initialValues }: EditProductFormProps) {
  const validationSchema = Yup.object({
    name: Yup.string().required("Ürün adı zorunludur"),
    slug: Yup.string().required("Slug zorunludur"),
    description: Yup.string().nullable(),
    price: Yup.number()
      .typeError("Fiyat sayı olmalıdır")
      .positive("Pozitif sayı olmalı")
      .required("Fiyat zorunludur"),
    stock: Yup.number()
      .typeError("Stok sayı olmalıdır")
      .min(0, "Stok negatif olamaz")
      .required("Stok zorunludur"),
    categoryId: Yup.string().required("Kategori seçimi zorunludur"),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        onSubmit(values);
        actions.setSubmitting(false);
      }}
    >
      {({ setFieldValue, values, isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <Label htmlFor="name">Ürün Adı</Label>
            <Field as={Input} id="name" name="name" placeholder="Ürün adı giriniz" />
            <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Field as={Input} id="slug" name="slug" placeholder="slug giriniz" />
            <ErrorMessage name="slug" component="div" className="text-red-500 text-xs mt-1" />
          </div>

          <div>
            <Label htmlFor="description">Açıklama</Label>
            <Field
              as="textarea"
              id="description"
              name="description"
              rows={4}
              placeholder="Açıklama giriniz"
              className="border rounded p-2 w-full"
            />
            <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1" />
          </div>

          <div>
            <Label htmlFor="price">Fiyat</Label>
            <Field name="price">
              {({ field, form }: any) => (
                <CurrencyInput
                  id="price"
                  name="price"
                  prefix="₺ "
                  decimalSeparator=","
                  groupSeparator="."
                  decimalsLimit={2}
                  allowNegativeValue={false}
                  className="border rounded p-2 w-full"
                  value={field.value ?? ""}
                  onValueChange={(value, name, values) => {
                    const floatValue = values?.float ?? null;
                    form.setFieldValue("price", floatValue);
                  }}
                  placeholder="Fiyat giriniz"
                />
              )}
            </Field>
            <ErrorMessage name="price" component="div" className="text-red-500 text-xs mt-1" />
          </div>

          <div>
            <Label htmlFor="stock">Stok</Label>
            <Field as={Input} id="stock" name="stock" type="number" placeholder="Stok adedi" />
            <ErrorMessage name="stock" component="div" className="text-red-500 text-xs mt-1" />
          </div>

          <div>
            <Label htmlFor="categoryId">Kategori</Label>
            <ComboBox
              items={categories.map(cat => ({
                label: cat.name,
                value: cat.id,
              }))}
              selectedValue={values.categoryId}
              onChange={(val) => setFieldValue("categoryId", val)}
              placeholder="Kategori seçin"
            />
            <ErrorMessage name="categoryId" component="div" className="text-red-500 text-xs mt-1" />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            Güncelle
          </Button>
        </Form>
      )}
    </Formik>
  );
}