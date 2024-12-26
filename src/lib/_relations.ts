import {
  LocationFull,
  ObjectFull,
  PermissionFull,
  RoleFull,
  RolePermissionPairingFull,
  UserFull,
  UserRolePairingFull,
} from "@/prisma_types";
import {
  Expand,
  PossibleProperties,
  PossiblePropertiesNames,
  PossibleRelationsTables,
  PublicQuery,
  possibleRelations,
} from "./_relationsTypes";

type AnyTableWithData = {
  objects?: ObjectFull[];
  locations?: LocationFull[];
  users?: UserFull[];
  userRolePairings?: UserRolePairingFull[];
  roles?: RoleFull[];
  rolePermissionPairings?: RolePermissionPairingFull[];
  permissions?: PermissionFull[];
};

export function includeRelations({
  query,
  data,
}: {
  query: Expand<PublicQuery>;
  data?: AnyTableWithData;
}) {
  if (!query || !data) {
    return data;
  }

  const combinedData: Record<string, any> = {};

  for (const tableName in query) {
    const castedTableName = tableName as keyof typeof query;
    let foundData = data[castedTableName];

    if (foundData) {
      const filterableData = structuredClone(foundData);
      const tableQuery = query[castedTableName];

      if (!tableQuery) {
        continue;
      }
      if (typeof tableQuery === "boolean") {
        continue;
      }

      if (tableQuery.where) {
        // filter the filterableData
      }

      const tableQueryInclude =
        tableQuery?.include as unknown as PossibleProperties<
          typeof castedTableName
        >;
      if (tableQueryInclude) {
        // include sub relations on the data

        for (const propertyName in tableQueryInclude) {
          const castedPropertyName = propertyName as PossiblePropertiesNames<
            typeof castedTableName
          >;
          const value = tableQueryInclude[castedPropertyName];

          // @ts-expect-error - I know this is a possible property
          const relation = possibleRelations[castedTableName][
            castedPropertyName
          ] as any;

          let subData: AnyTableWithData | undefined = undefined;
          if (relation.fromTable) {
            subData = includeRelationsInner({
              query: {
                [relation.fromTable]: value,
              },
              data,
            });
          } else if (relation.toTable) {
            subData = includeRelationsInner({
              query: {
                [relation.toTable]: value,
              },
              data,
            });
          }
        }
      }

      // add the foundData to the combinedData
      combinedData[tableName] = filterableData;
    }
  }

  return combinedData as AnyTableWithData;
}

export function includeRelationsInner({
  query,
  data,
}: {
  query: Expand<PublicQuery>;
  data?: AnyTableWithData;
}) {
  if (!query || !data) {
    return data;
  }

  const combinedData: Record<string, any> = {};

  for (const tableName in query) {
    const castedTableName = tableName as keyof typeof query;
    let foundData = data[castedTableName];

    if (foundData) {
      const filterableData = structuredClone(foundData);
      const tableQuery = query[castedTableName];

      if (!tableQuery) {
        continue;
      }
      if (typeof tableQuery === "boolean") {
        continue;
      }

      if (tableQuery.where) {
        // filter the filterableData
      }

      const tableQueryInclude =
        tableQuery?.include as unknown as PossibleProperties<
          typeof castedTableName
        >;
      if (tableQueryInclude) {
        // include sub relations on the data

        for (const propertyName in tableQueryInclude) {
          const castedPropertyName = propertyName as PossiblePropertiesNames<
            typeof castedTableName
          >;
          const value = tableQueryInclude[castedPropertyName];

          // @ts-expect-error - I know this is a possible property
          const relation = possibleRelations[castedTableName][
            castedPropertyName
          ] as any;

          // if (relation.fromTable) {

          //   // get data from the fromTable
          //   const newValue = data[relation.fromTable];
          // }

          // if (relation.toTable) {
          //   const newValue = includeRelations({
          //     query: {
          //       [relation.toTable]: value,
          //     },
          //     data,
          //   });
          // } else if (relation.fromTable) {
          //   const newValue = includeRelations({
          //     query: {
          //       [relation.toTable]: value,
          //     },
          //     data,
          //   });
          // }

          // const newValue = includeRelations({
          //   query: value,
          //   data,
          // });
        }
      }

      // add the foundData to the combinedData
      combinedData[tableName] = filterableData;
    }
  }

  return combinedData as AnyTableWithData;
}

// Type guard to ensure tableName is a PossibleRelationsTable
function isPossibleRelationsTable(
  tableName: string
): tableName is PossibleRelationsTables {
  return tableName in possibleRelations;
}
function isPossibleProperty(
  tableName: PossibleRelationsTables,
  propertyName: string
): propertyName is PossiblePropertiesNames<typeof tableName> {
  if (!isPossibleRelationsTable(tableName)) {
    return false;
  }
  return propertyName in possibleRelations[tableName];
}
