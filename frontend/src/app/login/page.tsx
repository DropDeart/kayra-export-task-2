'use client';

import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signIn } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import Image from 'next/image'
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link'
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

// Yup ile doğrulama şemasını tanımla
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Geçerli bir e-posta adresi girin.')
    .required('E-posta adresi zorunludur.'),
  password: Yup.string()
    .min(6, 'Şifreniz en az 6 karakter olmalıdır.')
    .required('Şifre zorunludur.'),
});

export default function LoginPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const { email, password } = values;

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error('Giriş Başarısız! E-posta veya şifreniz hatalı.');
      } else {
        toast.success('Giriş işlemi başarılı. Yönlendiriliyorsunuz...');
        router.push('/');
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[380px]">
        <CardHeader>
          <div className='flex align-items-center justify-center'>
            <Image
              src="/images/kayra_export.webp"
              width={120}
              height={120}
              alt="Picture of the author"
            />
          </div>
          
          <CardTitle className='text-left mt-5'>Giriş Yap</CardTitle>
          <CardDescription>
            <div className='flex justify-between'>
              Hesabınız yoksa kayıt olabilirsiniz.
               
                <Link className='text-black font-semibold' href="/register">Kayıt Ol</Link>
              </div>
            </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
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
            <Button type="submit" className="w-full">
              Giriş Yap
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}