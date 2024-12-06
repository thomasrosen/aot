import { auth } from "@/auth";
import { PublicStartPage } from "@/components/client/PublicStartPage";
import { SignedInStartPage } from "@/components/server/SignedInStartPage";

export default async function App() {
  const session = await auth();

  if (session) {
    return <SignedInStartPage />;
  }

  return <PublicStartPage />;
}
