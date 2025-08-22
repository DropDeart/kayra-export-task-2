'use client';

import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { fetchFromApi } from '@/lib/api';

const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email('Geçerli bir e-posta adresi girin.')
    .required('E-posta adresi zorunludur.'),
  password: Yup.string()
    .min(6, 'Şifreniz en az 6 karakter olmalıdır.')
    .required('Şifre zorunludur.'),
    name: Yup.string().required('İsim zorunludur.')
});

export default function RegisterPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      name:''
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
        const { name, email, password } = values;
        const role = isAdmin ? 2 : 1;

        try {
            const payload = { name, email, password, role };
            const response = await fetchFromApi('auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            toast.success('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
            router.push('/login');
        } catch (error: unknown) {
            let errorMessage = 'Kayıt işlemi başarısız.';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        }
    },
    });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle>Kayıt Ol</CardTitle>
          <CardDescription>Yeni bir hesap oluşturun.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="name">Ad ve Soyad</Label>
              <Input
                id="name"
                type="text"
                placeholder="Lütfen adınızı girin"
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm">{formik.errors.name}</div>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@mail.com"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm">{formik.errors.email}</div>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="Şifreniz"
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm">{formik.errors.password}</div>
              ) : null}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="admin-checkbox"
                checked={isAdmin}
                onCheckedChange={(checked: boolean) => setIsAdmin(Boolean(checked))}
              />
              <Label htmlFor="admin-checkbox">Yönetici Hesabı Oluştur</Label>
            </div>
            <Button type="submit" className="w-full">
              Kayıt Ol
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}