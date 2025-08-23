export default function Footer() {
  return (
    <footer className="w-full mt-auto py-8 text-center text-gray-500 text-sm">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} E-Commerce App. Tüm hakları saklıdır.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:underline">Gizlilik Politikası</a>
          <a href="#" className="hover:underline">Hizmet Şartları</a>
        </div>
      </div>
    </footer>
  );
}