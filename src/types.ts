import type PrismaTypes from "@prisma/client";

export type ObjectFull = Partial<
  PrismaTypes.Object & {
    history: Array<Partial<PrismaTypes.ObjectHistory>>;
  }
>;

export type UserFull = PrismaTypes.User & {
  userRolePairings: PrismaTypes.UserRolePairing[];
};
