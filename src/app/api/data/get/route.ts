import { auth } from "@/auth";
import { PublicWhere, publicWhereSchema } from "@/lib/relations";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import {
  LocationFull,
  ObjectFull,
  ObjectHistoryFull,
  PermissionFull,
  RoleFull,
  RolePermissionPairingFull,
  UserFull,
  UserRolePairingFull,
} from "@/prisma_types";
import { getChangedRevalidationKeys } from "./getChangedRevalidationKeys";
import { loadLocations } from "./loadLocations";
import { loadObjectHistory } from "./loadObjectHistory";
import { loadObjects } from "./loadObjects";
import { loadPermissions } from "./loadPermissions";
import { loadRolePermissionPairing } from "./loadRolePermissionPairings";
import { loadRoles } from "./loadRoles";
import { loadUserRolePairings } from "./loadUserRolePairings";
import { loadUsers } from "./loadUsers";

export async function GET(request: Request): Promise<Response> {
  // get lastRevalidatedAt from query params
  const url = new URL(request.url);
  const lastRevalidatedAt = url.searchParams.get("lastRevalidatedAt");

  // get tables from query params
  const tables = (url.searchParams.get("tables") || "").split(",");

  // get and parse the where-options
  const publicWhere = url.searchParams.get("where") || undefined;
  let parsedPublicWhere: PublicWhere | undefined = undefined;
  if (publicWhere) {
    try {
      parsedPublicWhere = JSON.parse(publicWhere);
    } catch (error) {}
  }
  parsedPublicWhere = publicWhereSchema.safeParse(parsedPublicWhere).data;

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
    objectHistory?: ObjectHistoryFull[];
    locations?: LocationFull[];
    users?: UserFull[];
    userRolePairings?: UserRolePairingFull[];
    roles?: RoleFull[];
    rolePermissionPairings?: RolePermissionPairingFull[];
    permissions?: PermissionFull[];
  } = {};

  try {
    if (tables.includes("object")) {
      data.objects = await loadObjects();
    }
    if (tables.includes("objectHistory")) {
      data.objectHistory = await loadObjectHistory();
    }
    if (tables.includes("location")) {
      data.locations = await loadLocations();
    }
    if (tables.includes("user")) {
      data.users = await loadUsers();
    }
    if (tables.includes("userRolePairing")) {
      data.userRolePairings = await loadUserRolePairings({
        where: parsedPublicWhere,
      });
    }
    if (tables.includes("role")) {
      data.roles = await loadRoles();
    }
    if (tables.includes("rolePermissionPairing")) {
      data.rolePermissionPairings = await loadRolePermissionPairing();
    }
    if (tables.includes("permission")) {
      data.permissions = await loadPermissions();
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
