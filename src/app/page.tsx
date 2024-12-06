import { auth } from "@/auth";
import { PublicStartPage } from "@/components/PublicStartPage";
import { SignedInStartPage } from "@/components/SignedInStartPage";

export default async function Home() {
  const session = await auth();

  if (session) {
    return <SignedInStartPage />;
  }

  return <PublicStartPage />;
}
