'use client';

import { signIn } from 'next-auth/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Geçerli bir email adresi girin').required('Email alanı zorunludur'),
  password: Yup.string().required('Şifre alanı zorunludur'),
});

export default function LoginPage() {
  const router = useRouter();

  const initialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values: typeof initialValues) => {
    const res = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    
    if (res?.error) {
      toast.error('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } else {
      toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
      router.push('/');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-8 border rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Girişi</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">Email</label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700">Şifre</label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                Giriş Yap
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}