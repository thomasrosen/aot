import { useGlobalStore } from "@/components/client/GlobalStoreProvider";
import {
  LocationFull,
  ObjectFull,
  ObjectHistoryFull,
  PermissionFull,
  RoleFull,
  RolePermissionPairingsFull,
  UserFull,
  UserRolePairingFull,
} from "@/prisma_types";
import { useMemo } from "react";
import { z } from "zod";

export const publicWhereSchema = z.object({
  userRolePairings: z
    .object({
      userId: z.union([z.string(), z.array(z.string())]).optional(),
    })
    .optional(),
});

export type PublicWhere = z.infer<typeof publicWhereSchema>;

type TableName = string;
type PropertyName = string;
type Properties = Record<PropertyName, SubQuery | boolean>;
export type SubQuery = {
  tableName?: TableName;
  include?: Properties;
  // where?: Partial<PublicWhere>;
};
// type Query = Record<TableName, SubQuery>;

type ConnectsToRelation = {
  connectsTo: string;
};
type ToRelation = {
  from: string;
  to: string;
  toTable: string;
};
type TableInfo = Record<string, ConnectsToRelation | ToRelation>;
type RelationInfo = Record<string, TableInfo>;
const possibleRelations: RelationInfo = {
  users: {
    userRolePairings: {
      connectsTo: "userRolePairings",
    },
    objectHistory: {
      connectsTo: "objectHistory",
    },
  },
  userRolePairings: {
    user: {
      from: "userId",
      to: "id",
      toTable: "users",
    },
    role: {
      from: "roleName",
      to: "name",
      toTable: "roles",
    },
  },
  roles: {
    userRolePairings: {
      connectsTo: "userRolePairings",
    },
    rolePermissionPairings: {
      connectsTo: "rolePermissionPairings",
    },
  },
  rolePermissionPairings: {
    role: {
      from: "roleName",
      to: "name",
      toTable: "roles",
    },
    permission: {
      from: "permissionName",
      to: "name",
      toTable: "permissions",
    },
  },
  permissions: {
    rolePermissionPairings: {
      connectsTo: "rolePermissionPairings",
    },
  },
  objectHistory: {
    object: {
      from: "objectCode",
      to: "code",
      toTable: "objects",
    },
    location: {
      from: "locationId",
      to: "id",
      toTable: "locations",
    },
    user: {
      from: "email",
      to: "email",
      toTable: "users",
    },
  },
  objects: {
    history: {
      connectsTo: "objectHistory",
    },
  },
  locations: {
    History: {
      connectsTo: "objectHistory",
    },
  },
};

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type DataOptions = {
  objects?: ObjectFull[];
  objectHistory?: ObjectHistoryFull[];
  locations?: LocationFull[];
  users?: UserFull[];
  userRolePairings?: UserRolePairingFull[];
  roles?: RoleFull[];
  rolePermissionPairings?: RolePermissionPairingsFull[];
  permissions?: PermissionFull[];
};
type TableNames = keyof DataOptions;

export function connectRelations<T>({
  query,
  data,
}: {
  query: SubQuery;
  data: DataOptions;
}): T[] {
  let dataTwoReturn:
    | ObjectFull[]
    | ObjectHistoryFull[]
    | LocationFull[]
    | UserFull[]
    | UserRolePairingFull[]
    | RoleFull[]
    | RolePermissionPairingsFull[]
    | PermissionFull[]
    | undefined = [];

  const tableName = query.tableName;
  if (!tableName) {
    return [];
  }

  const castedTableName = tableName as TableNames;
  dataTwoReturn = data[castedTableName];

  if (!Array.isArray(dataTwoReturn)) {
    return [];
  }

  dataTwoReturn = includeRelations({
    query,
    data,
    dataTwoReturn: structuredClone(dataTwoReturn),
  });

  if (!Array.isArray(dataTwoReturn)) {
    return [];
  }

  return dataTwoReturn as T[];
}

function includeRelations({
  query,
  data,
  dataTwoReturn,
}: {
  query: SubQuery;
  data: DataOptions;
  dataTwoReturn?:
    | ObjectFull[]
    | ObjectHistoryFull[]
    | LocationFull[]
    | UserFull[]
    | UserRolePairingFull[]
    | RoleFull[]
    | RolePermissionPairingsFull[]
    | PermissionFull[];
}): any {
  if (!Array.isArray(dataTwoReturn) || !dataTwoReturn.length) {
    return [];
  }

  const tableName = query.tableName;
  if (!tableName) {
    return dataTwoReturn;
  }

  if (query.include) {
    for (const propertyName in query.include) {
      const subQuery = query.include[propertyName];

      const relationInfo = possibleRelations[tableName][propertyName];
      if (!relationInfo) {
        continue;
      }

      if (relationInfo.hasOwnProperty("toTable")) {
        const c_relationInfo = relationInfo as ToRelation;
        const c_toTable = c_relationInfo.toTable as TableNames;
        const from = c_relationInfo.from;
        const to = c_relationInfo.to;

        dataTwoReturn = connectFromTo({
          dataTwoReturn,
          data,
          connectsTo: c_toTable,
          propertyName,
          from: to,
          to: from,
          subQuery,
          shouldBeArray: false,
        });
      } else if (relationInfo.hasOwnProperty("connectsTo")) {
        const c_relationInfo = relationInfo as ConnectsToRelation;
        const connectsTo = c_relationInfo.connectsTo;
        const c_connectsTo = c_relationInfo.connectsTo as TableNames;

        // find out how the tables connect by getting the information from the related table
        const table_2 = possibleRelations[connectsTo];
        for (const p in table_2) {
          const relationInfo_2 = table_2[p];

          if (relationInfo_2.hasOwnProperty("toTable")) {
            const c_relationInfo_2 = relationInfo_2 as ToRelation;
            const toTable = c_relationInfo_2.toTable as TableNames;

            if (toTable === tableName) {
              const to = c_relationInfo_2.to;
              const from = c_relationInfo_2.from;

              dataTwoReturn = connectFromTo({
                dataTwoReturn,
                data,
                connectsTo: c_connectsTo,
                propertyName,
                from,
                to,
                subQuery,
                shouldBeArray: true,
              });

              break;
            }
          }
        }
      }
    }
  }

  return dataTwoReturn.sort((a, b) => a.id.localeCompare(b.id));
}

function connectFromTo({
  dataTwoReturn,
  data,
  connectsTo,
  propertyName,
  from,
  to,
  subQuery,
  shouldBeArray,
}: {
  dataTwoReturn:
    | ObjectFull[]
    | ObjectHistoryFull[]
    | LocationFull[]
    | UserFull[]
    | UserRolePairingFull[]
    | RoleFull[]
    | RolePermissionPairingsFull[]
    | PermissionFull[]
    | undefined;
  data: DataOptions;
  connectsTo: TableNames;
  propertyName: string;
  from: string;
  to: string;
  subQuery: SubQuery | boolean;
  shouldBeArray: boolean;
}) {
  if (!Array.isArray(dataTwoReturn) || !dataTwoReturn.length) {
    return [];
  }

  const tableWithValues = data[connectsTo];
  if (tableWithValues?.length) {
    dataTwoReturn = dataTwoReturn.map((item_to: Record<string, any>) => {
      const cloned_item_to = structuredClone(item_to);

      cloned_item_to[propertyName] = tableWithValues.filter(
        (item_from: Record<string, any>) => {
          return cloned_item_to[to] === item_from[from];
        }
      );

      if (typeof subQuery === "object") {
        cloned_item_to[propertyName] = includeRelations({
          query: {
            ...subQuery,
            tableName: connectsTo,
          },
          data,
          dataTwoReturn: cloned_item_to[propertyName],
        });
      }

      if (!shouldBeArray) {
        if (Array.isArray(cloned_item_to[propertyName])) {
          cloned_item_to[propertyName] = cloned_item_to[propertyName].at(0);
        }
      }

      return cloned_item_to as any;
    });
  }

  return dataTwoReturn;
}

export function useRelations<T>({ query }: { query: SubQuery }) {
  const {
    objects,
    objectHistory,
    locations,
    users,
    userRolePairings,
    roles,
    rolePermissionPairings,
    permissions,
  } = useGlobalStore((state) => ({
    objects: state.objects,
    objectHistory: state.objectHistory,
    locations: state.locations,
    users: state.users,
    userRolePairings: state.userRolePairings,
    roles: state.roles,
    rolePermissionPairings: state.rolePermissionPairings,
    permissions: state.permissions,
  }));

  const data = useMemo(() => {
    return connectRelations<T>({
      query,
      data: {
        objects,
        objectHistory,
        locations,
        users,
        userRolePairings,
        roles,
        rolePermissionPairings,
        permissions,
      },
    });
  }, [
    query,
    objects,
    objectHistory,
    locations,
    users,
    userRolePairings,
    roles,
    rolePermissionPairings,
    permissions,
  ]);

  return data;
}
