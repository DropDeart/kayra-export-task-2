import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

interface Props {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  const messages = await getMessages({ locale: params.locale });

  return (
    <NextIntlClientProvider messages={messages} locale={params.locale}>
      {children}
    </NextIntlClientProvider>
  );
}