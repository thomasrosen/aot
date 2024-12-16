import { Locale } from "@@/i18n-config";
import type PrismaTypes from "@prisma/client";

export type PageParams = Promise<{
  locale: Locale;
}>;

export type LocationFull = Partial<PrismaTypes.Location>;

export type PermissionFull = Partial<PrismaTypes.Permission>;

export type RoleFull = Partial<
  PrismaTypes.Role & {
    permissions: PermissionFull[];
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
