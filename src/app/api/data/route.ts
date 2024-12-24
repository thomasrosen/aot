import { auth } from "@/auth";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import {
  LocationFull,
  ObjectFull,
  RoleFull,
  UserFull,
  UserRolePairingFull,
} from "@/prisma_types";
import { z } from "zod";
import { getChangedRevalidationKeys } from "./getChangedRevalidationKeys";
import { loadLocations } from "./loadLocations";
import { loadObjects } from "./loadObjects";
import { loadRoles } from "./loadRoles";
import { loadUserRolePairings } from "./loadUserRolePairings";
import { loadUsers } from "./loadUsers";

const filtersSchema = z.object({
  userIds: z.array(z.string()),
});

export type Filters = z.infer<typeof filtersSchema>;

export async function GET(request: Request): Promise<Response> {
  // get lastRevalidatedAt from query params
  const url = new URL(request.url);
  const lastRevalidatedAt = url.searchParams.get("lastRevalidatedAt");
  const tables = (url.searchParams.get("tables") || "").split(",");
  const filters = url.searchParams.get("filters") || undefined;
  let parsedFilters: Filters | undefined = undefined;
  if (filters) {
    try {
      parsedFilters = JSON.parse(filters);
    } catch (error) {}
  }
  parsedFilters = filtersSchema.safeParse(parsedFilters).data;

  // check if signed in
  const session = await auth();
  const isAllowed = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["trusted"],
  });
  if (!isAllowed) {
    throw new Error("Not allowed");
  }

  // get data
  const data: {
    objects?: ObjectFull[];
    locations?: LocationFull[];
    users?: UserFull[];
    userRolePairings?: UserRolePairingFull[];
    roles?: RoleFull[];
  } = {};

  try {
    if (tables.includes("object")) {
      data.objects = await loadObjects();
    }
    if (tables.includes("location")) {
      data.locations = await loadLocations();
    }
    if (tables.includes("user")) {
      data.users = await loadUsers();
    }
    if (tables.includes("userRolePairing")) {
      data.userRolePairings = await loadUserRolePairings({
        filters: parsedFilters,
      });
    }
    if (tables.includes("role")) {
      data.roles = await loadRoles();
    }
  } catch (error) {
    console.error(
      "ERROR_3I22mkDD",
      error instanceof Error ? error.message : error
    );
  }

  // get revalidationKeys
  const revalidationKeys = await getChangedRevalidationKeys({
    lastRevalidatedAt,
  });

  // return data
  return Response.json({
    ...data,
    revalidationKeys,
  });
}
