import { auth } from "@/auth";
import { PublicStartPage } from "@/components/pages/PublicStartPage";
import { SignedInStartPage } from "@/components/pages/SignedInStartPage";

export default async function App() {
  const session = await auth();

  if (session) {
    return <SignedInStartPage />;
  }

  return <PublicStartPage />;
}
