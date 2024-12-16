import { AddToObjecthistoryFormForStartPage } from "@/components/client/AddToObjecthistoryFormForStartPage";
import { SUPPORTED_LOCALES } from "@@/i18n-config";

export default async function StartPage() {
  return <AddToObjecthistoryFormForStartPage />;
}

export function generateStaticParams() {
  // Generate static params for all locales
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}
