import { AddToObjecthistoryFormForStartPage } from "@/components/client/AddToObjecthistoryFormForStartPage";
import { SUPPORTED_LOCALES } from "@@/i18n-config";

export function generateStaticParams() {
  // Generate static params for all locales
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function StartPage() {
  return <AddToObjecthistoryFormForStartPage />;
}
