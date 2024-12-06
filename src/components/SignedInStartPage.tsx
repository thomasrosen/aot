import { listObjects } from "@/actions/listObjects";
import { SearchInput } from "@/components/SearchInput";

export async function SignedInStartPage() {
  const objects = await listObjects();

  return (
    <div>
      <SearchInput />

      <pre>{JSON.stringify(objects, null, 2)}</pre>
    </div>
  );
}
