import { auth } from "@/auth";
import { PublicStartPage } from "@/components/pages/PublicStartPage";
import { SignedInStartPage } from "@/components/pages/SignedInStartPage";

export default async function Home() {
  const session = await auth();

  if (session) {
    return <SignedInStartPage />;
  }

  return <PublicStartPage />;
}
