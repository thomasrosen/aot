import { User, UserRolePairing } from "@prisma/client";

export type UserFull = User & {
  userRolePairings: UserRolePairing[];
};
