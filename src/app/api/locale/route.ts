"use server";

import { getLocale } from "@/lib/server/getLocale";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const locale = await getLocale(request);

  return Response.json({ locale });
}
