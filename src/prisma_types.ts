import type PrismaTypes from "@prisma/client";

export type LocationFull = Partial<PrismaTypes.Location>;

export type PermissionFull = Partial<
  PrismaTypes.Permission & {
    rolePermissionPairings: RolePermissionPairingFull[];
  }
>;

export type RolePermissionPairingFull = Partial<
  PrismaTypes.RolePermissionPairing & {
    role: RoleFull | null;
    permission: PermissionFull | null;
  }
>;

export type RoleFull = Partial<
  PrismaTypes.Role & {
    rolePermissionPairings: RolePermissionPairingFull[];
  }
>;

export type UserRolePairingFull = Partial<
  PrismaTypes.UserRolePairing & {
    role: RoleFull | null;
    user: UserFull | null;
  }
>;

export type UserFull = Partial<
  PrismaTypes.User & {
    userRolePairings: UserRolePairingFull[];
  }
>;

export type ObjectHistoryFull = Partial<
  PrismaTypes.ObjectHistory & {
    location: LocationFull | null;
    user: UserFull | null;
  }
>;

export type ObjectFull = Partial<
  PrismaTypes.Object & {
    history: ObjectHistoryFull[];
  }
>;
