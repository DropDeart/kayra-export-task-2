/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import Image from "next/image";
import { XIcon, PlusIcon } from "lucide-react";
import { ProductImage } from "../models/ProductImage";

interface DropzoneFieldProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  retainedImages: ProductImage[];
  deletedImageIds: string[];
}

interface FileWithPreview {
  file: File;
  preview: string;
}

export function DropzoneField({
  setFieldValue,
  retainedImages,
  deletedImageIds,
}: DropzoneFieldProps) {
  const [newFilesWithPreviews, setNewFilesWithPreviews] = useState<FileWithPreview[]>([]);

  const mappedRetainedImages = useMemo(
    () =>
      retainedImages.map(img => ({
        id: img.id,
        fileName: img.fileName,
        fileUrl: img.filePath,
      })),
    [retainedImages]
  );

  const updateFormikImageFiles = useCallback(() => {
    setFieldValue("imageFiles", newFilesWithPreviews.map(f => f.file), false);
  }, [newFilesWithPreviews, setFieldValue]);

  useEffect(() => {
    updateFormikImageFiles();
    return () => {
      newFilesWithPreviews.forEach(fwp => URL.revokeObjectURL(fwp.preview));
    };
  }, [newFilesWithPreviews, updateFormikImageFiles]);

  const allDisplayImages = [
    ...mappedRetainedImages.filter(img => !deletedImageIds.includes(img.id)),
    ...newFilesWithPreviews.map(fwp => ({
      id: fwp.file.name,
      fileUrl: fwp.preview,
      fileName: fwp.file.name,
    })),
  ];

  const onDrop = (acceptedFiles: File[]) => {
    const currentCount = mappedRetainedImages.length - deletedImageIds.length + newFilesWithPreviews.length;
    if (currentCount + acceptedFiles.length > 5) {
      toast.error("Maksimum 5 resim yükleyebilirsiniz.");
      return;
    }

    const newWithPreviews: FileWithPreview[] = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewFilesWithPreviews(prev => [...prev, ...newWithPreviews]);
  };

  const handleRemoveImage = (imageToRemove: { id: string; fileUrl: string }) => {
    const isBlob = imageToRemove.fileUrl.startsWith("blob:");

    if (isBlob) {
      setNewFilesWithPreviews(prev => {
        const filtered = prev.filter(fwp => fwp.preview !== imageToRemove.fileUrl);
        URL.revokeObjectURL(imageToRemove.fileUrl);
        return filtered;
      });
    } else {
      setFieldValue("deletedImageIds", [...deletedImageIds, imageToRemove.id], false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
    },
    maxSize: 2 * 1024 * 1024,
    onDrop,
    onDropRejected: fileRejections => {
      fileRejections.forEach(({ errors }) => {
        errors.forEach(err => {
          if (err.code === "file-too-large") {
            toast.error("Resim çok büyük. Maksimum 2MB.");
          } else if (err.code === "file-invalid-type") {
            toast.error("Geçersiz dosya tipi.");
          } else {
            toast.error(`Hata: ${err.message}`);
          }
        });
      });
    },
  });

  return (
    <div className="flex flex-wrap items-center space-x-2">
      {allDisplayImages.map(image => (
        <div key={image.id || image.fileUrl} className="relative w-24 h-24 border rounded-md overflow-hidden">
          <Image src={image.fileUrl} alt={image.fileName} fill className="object-cover" />
          <button
            type="button"
            onClick={() => handleRemoveImage(image)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
          >
            <XIcon size={16} />
          </button>
        </div>
      ))}

      <div
        {...getRootProps()}
        className="w-24 h-24 border border-dashed rounded-md flex items-center justify-center cursor-pointer hover:border-blue-500"
      >
        <input {...getInputProps()} />
        <PlusIcon size={32} className="text-gray-400" />
      </div>
    </div>
  );
}