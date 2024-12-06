import { listObjects } from "@/actions/listObjects";
import { SearchInput } from "@/components/SearchInput";
import { H2 } from "@/components/Typography";
import Link from "next/link";

export async function SignedInStartPage() {
  const objects = await listObjects();

  return (
    <div>
      <SearchInput className="mb-8" />

      <H2>temporäre übersicht über alle objekte fürs entwickeln</H2>
      {Array.isArray(objects)
        ? objects.map((object) => (
            <Link
              href={`/object/${object.code}`}
              className="hover:underline mb-4 block"
            >
              <pre>{JSON.stringify(object, null, 2)}</pre>
            </Link>
          ))
        : null}
    </div>
  );
}
