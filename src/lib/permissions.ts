import { UserRolePairingFull } from "@/prisma_types";

export function userRolePairingsIncludesPermissions({
  userRolePairings,
  permissionNames,
}: {
  userRolePairings?: UserRolePairingFull[];
  permissionNames: string[];
}) {
  return (userRolePairings || []).some((userRolePairing) =>
    (userRolePairing.role?.rolePermissionPairings || []).some(
      (rolePermissionPairing) =>
        rolePermissionPairing.permission?.name &&
        permissionNames.includes(rolePermissionPairing.permission.name)
    )
  );
}
