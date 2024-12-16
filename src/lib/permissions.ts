import { UserRolePairingFull } from "@/prisma_types";

export function userRolePairingsIncludesPermissions({
  userRolePairings,
  permissionNames,
}: {
  userRolePairings?: UserRolePairingFull[];
  permissionNames: string[];
}) {
  return (userRolePairings || []).some((userRolePairing) =>
    (userRolePairing.role?.permissions || []).some(
      (permission) =>
        permission.name && permissionNames.includes(permission.name)
    )
  );
}
