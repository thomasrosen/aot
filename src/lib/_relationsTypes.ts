export const possibleRelations = {
  users: {
    userRolePairings: {
      fromTable: "userRolePairings",
    },
  },
  userRolePairings: {
    users: {
      from: "userId",
      to: "id",
      toTable: "users",
    },
    roles: {
      from: "roleName",
      to: "name",
      toTable: "roles",
    },
  },
  roles: {
    userRolePairings: {
      fromTable: "userRolePairings",
    },
    rolePermissionPairings: {
      fromTable: "rolePermissionPairings",
    },
  },
  rolePermissionPairings: {
    roles: {
      from: "roleName",
      to: "name",
      toTable: "roles",
    },
    permissions: {
      from: "permissionName",
      to: "name",
      toTable: "permissions",
    },
  },
  permissions: {
    rolePermissionPairings: {
      fromTable: "rolePermissionPairings",
    },
  },
} as const;
type ReadonlyPossibleRelations = typeof possibleRelations;
export type PossibleRelations = Mutable<ReadonlyPossibleRelations>;

export type PossibleRelationsTables = keyof PossibleRelations;

export type PossiblePropertiesNames<K extends keyof PossibleRelations> = Expand<
  keyof Pick<PossibleRelations, K>
>;

export type PossibleProperties<K extends PossibleRelationsTables> = Expand<
  Pick<PossibleRelations, K>
>;

type Mutable<T> = {
  -readonly [K in keyof T]: T[K] extends Record<string, any>
    ? Mutable<T[K]>
    : T[K];
};
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type IncludeRelations<K extends PossibleRelationsTables> = {
  [R in keyof PossibleRelations[K]]?:
    | boolean
    | (PossibleRelations[K][R] extends {
        toTable: PossibleRelationsTables;
      }
        ? PublicSubQuery<PossibleRelations[K][R]["toTable"]>
        : never)
    | (PossibleRelations[K][R] extends {
        fromTable: PossibleRelationsTables;
      }
        ? PublicSubQuery<PossibleRelations[K][R]["fromTable"]>
        : never);
};
export type PublicSubQuery<K extends PossibleRelationsTables> =
  | {
      include?: Expand<IncludeRelations<K>>;
      where?: Expand<PublicWhere[Extract<K, keyof PublicWhere>]>;
    }
  | boolean;

export type PublicQuery = {
  [K in PossibleRelationsTables]?: Expand<PublicSubQuery<K>>;
};
