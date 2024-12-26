import type PrismaTypes from "@prisma/client";

export type RequiredProperties = { id: string };

export type LocationFull = Partial<PrismaTypes.Location> & RequiredProperties;

export type RolePermissionPairingsFull = Partial<
  PrismaTypes.RolePermissionPairing & {
    role: RoleFull | null;
    permission: PermissionFull | null;
  }
> &
  RequiredProperties;

export type PermissionFull = Partial<
  PrismaTypes.Permission & {
    rolePermissionPairings: RolePermissionPairingFull[];
  }
> &
  RequiredProperties;

export type RolePermissionPairingFull = Partial<
  PrismaTypes.RolePermissionPairing & {
    role: RoleFull | null;
    permission: PermissionFull | null;
  }
> &
  RequiredProperties;

export type RoleFull = Partial<
  PrismaTypes.Role & {
    rolePermissionPairings: RolePermissionPairingFull[];
  }
> &
  RequiredProperties;

export type UserRolePairingFull = Partial<
  PrismaTypes.UserRolePairing & {
    role: RoleFull | null;
    user: UserFull | null;
  }
> &
  RequiredProperties;

export type UserFull = Partial<
  PrismaTypes.User & {
    userRolePairings: UserRolePairingFull[];
  }
> &
  RequiredProperties;

export type ObjectHistoryFull = Partial<
  PrismaTypes.ObjectHistory & {
    location: LocationFull | null;
    user: UserFull | null;
  }
> &
  RequiredProperties;

export type ObjectFull = Partial<
  PrismaTypes.Object & {
    history: ObjectHistoryFull[];
  }
> &
  RequiredProperties;
