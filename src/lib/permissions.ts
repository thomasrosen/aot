import { UserRolePairingFull } from "@/prisma_types";

export function userRolePairingsIncludesPermissions({
  userRolePairings,
  permissionNames = [],
}: {
  userRolePairings?: UserRolePairingFull[];
  permissionNames: string[];
}) {
  if (!userRolePairings) {
    return false;
  }

  permissionNames.push("admin");

  return (userRolePairings || []).some((userRolePairing) => {
    return (userRolePairing.role?.rolePermissionPairings || []).some(
      (rolePermissionPairing) => {
        return (
          rolePermissionPairing.permission?.name &&
          permissionNames.includes(rolePermissionPairing.permission.name)
        );
      }
    );
  });
}
