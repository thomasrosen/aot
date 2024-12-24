"use client";

import Link from "next/link";
import { ObjectCard } from "../ObjectCard";
import { useGlobalStore } from "./GlobalStoreProvider";
import { useLocale } from "./Translation";

export function ObjectsList() {
  const { objects } = useGlobalStore();
  const locale = useLocale();

  return (
    <div className="flex flex-col gap-4">
      {objects.map((object) => (
        <Link key={object.id} href={`/objects/${object.code}`}>
          <ObjectCard data={object} locale={locale} />
        </Link>
      ))}
    </div>
  );
}
