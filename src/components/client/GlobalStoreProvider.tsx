"use client";

import { hashRevalidationKey } from "@/lib/hashRevalidationKey";
import { AnyData, onlyIfChanged } from "@/lib/onlyIfChanged";
import { PublicWhere } from "@/lib/relations";
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
import isEqual from "lodash.isequal";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import { createStore } from "zustand/vanilla";

type GlobalState = {
  _hasHydrated: boolean;
  objects: ObjectFull[];
  objectHistory: ObjectHistoryFull[];
  locations: LocationFull[];
  users: UserFull[];
  userRolePairings: UserRolePairingFull[];
  roles: RoleFull[];
  rolePermissionPairings: RolePermissionPairingsFull[];
  permissions: PermissionFull[];
  lastRevalidatedAt?: string;
  revalidationKeys: string[];
};

type GlobalActions = {
  setHydrated: (value: boolean) => void;
  fetchData: ({
    tables,
    where,
  }: {
    tables?: (
      | "object"
      | "objectHistory"
      | "location"
      | "user"
      | "userRolePairing"
      | "role"
      | "rolePermissionPairing"
      | "permission"
    )[];
    where?: PublicWhere;
  }) => Promise<void>;
  fetchRolesForUsers: (userIds: string[]) => Promise<void>;

  withUserRolePairings: (users: UserFull[]) => Promise<UserFull[]>;
  withPermissions: (roles: RoleFull[]) => Promise<RoleFull[]>;
};

type GlobalStore = GlobalState & GlobalActions;

const defaultInitState: GlobalState = {
  _hasHydrated: false,
  objects: [],
  objectHistory: [],
  locations: [],
  users: [],
  userRolePairings: [],
  roles: [],
  rolePermissionPairings: [],
  permissions: [],
  lastRevalidatedAt: undefined,
  revalidationKeys: [],
};

const createGlobalStore = (initState?: GlobalState) => {
  return createStore<GlobalStore>()(
    persist(
      (set, get) => ({
        ...defaultInitState,
        ...initState,
        setHydrated: (value) => set({ _hasHydrated: value }),
        withPermissions: async (roles) => {
          return roles;
        },
        withUserRolePairings: async (users) => {
          // get missing user role pairings
          const userIds = users
            .map((user) => user?.id)
            .filter((id) => id) as string[];
          await get().fetchRolesForUsers(userIds);

          // return mapped users
          const userRolePairings = get().userRolePairings;
          users = users.map((user) => ({
            ...user,
            userRolePairings: userRolePairings.filter(
              (userRolePairing) => userRolePairing.userId === user.id
            ),
          }));

          return users;
        },
        fetchRolesForUsers: async (userIds: string[]) => {
          if (!userIds.length) {
            return;
          }

          const userRolePairings = get().userRolePairings;
          const revalidationKeys = get().revalidationKeys;

          const neededUserIds = userIds.filter((userId) => {
            const alreadyExists = userRolePairings.find(
              (a) => a.userId === userId
            );
            const shouldRevalidate = revalidationKeys.includes(
              hashRevalidationKey(`userRolePairing:${userId}`)
            );

            return !alreadyExists || shouldRevalidate;
          });

          // fetch roles for users
          if (neededUserIds.length) {
            await get().fetchData({
              tables: ["userRolePairing"],
              where: { userRolePairings: { userId: neededUserIds } },
            });
          }
        },
        fetchData: async ({ tables = [], where }) => {
          // START build the url for fetching
          const url = new URL("/api/data/get", window.location.origin);
          const query: Record<string, string> = {};

          // tell which tables to query
          if (tables.length) {
            query.tables = tables.join(",");
          }
          if (where) {
            query.where = JSON.stringify(where);
          }

          // tell which revalidation history should be included
          const lastRevalidatedAt = get().lastRevalidatedAt;
          if (lastRevalidatedAt) {
            query.lastRevalidatedAt = new Date(lastRevalidatedAt).toISOString();
          }

          url.search = new URLSearchParams(query).toString();
          // END build the url for fetching

          // fetch the new data
          const {
            objects = [],
            objectHistory = [],
            locations = [],
            users = [],
            userRolePairings = [],
            roles = [],
            rolePermissionPairings = [],
            permissions = [],
            revalidationKeys = [],
          }: {
            objects: ObjectFull[];
            objectHistory: ObjectHistoryFull[];
            locations: LocationFull[];
            users: UserFull[];
            userRolePairings: UserRolePairingFull[];
            roles: RoleFull[];
            rolePermissionPairings: RolePermissionPairingsFull[];
            permissions: PermissionFull[];
            revalidationKeys: string[];
          } = await fetch(url)
            .then((res) => res.json())
            .catch(() => ({})); // ignore errors

          // create the initial newData object
          let newData: Partial<GlobalState> = {
            _hasHydrated: true,
            lastRevalidatedAt: new Date().toISOString(),
          };

          // add the revalidation keys that are not revalidated yet
          function getRevalidationKeys(prefix: string = "", data?: AnyData[]) {
            if (!data || !data.length) {
              return [hashRevalidationKey(`${prefix}:`)];
            }
            return data.map((a) => hashRevalidationKey(`${prefix}:${a.id}`));
          }
          const nealyRevalidatedKeys = [
            ...getRevalidationKeys("object", objects),
            ...getRevalidationKeys("objectHistory", objectHistory),
            ...getRevalidationKeys("location", locations),
            ...getRevalidationKeys("user", users),
            ...getRevalidationKeys("role", roles),
            ...getRevalidationKeys("userRolePairing", userRolePairings),
            ...getRevalidationKeys(
              "rolePermissionPairing",
              rolePermissionPairings
            ),
            ...getRevalidationKeys("permission", permissions),
          ];
          const oldRevalidationKeys = get().revalidationKeys;
          const newRevalidationKeys = [
            ...new Set([...oldRevalidationKeys, ...revalidationKeys]),
          ]
            .filter((key) => !nealyRevalidatedKeys.includes(key))
            .sort();
          if (!isEqual(revalidationKeys, newRevalidationKeys)) {
            newData.revalidationKeys = newRevalidationKeys;
          }

          // add the new data if it has changed
          newData = {
            ...newData,
            ...onlyIfChanged("objects", objects, () => get().objects),
            ...onlyIfChanged(
              "objectHistory",
              objectHistory,
              () => get().objectHistory
            ),
            ...onlyIfChanged("locations", locations, () => get().locations),
            ...onlyIfChanged("users", users, () => get().users),
            ...onlyIfChanged(
              "userRolePairings",
              userRolePairings,
              () => get().userRolePairings
            ),
            ...onlyIfChanged("roles", roles, () => get().roles),
            ...onlyIfChanged(
              "rolePermissionPairings",
              rolePermissionPairings,
              () => get().rolePermissionPairings
            ),
            ...onlyIfChanged(
              "permissions",
              permissions,
              () => get().permissions
            ),
          };

          // push new data to the store
          set(newData);
        },
      }),
      {
        name: "global-store",
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => {
          return async (state) => {
            if (state && !state._hasHydrated) {
              state.setHydrated(true);
              state.fetchData({
                tables: [
                  "object",
                  "objectHistory",
                  "location",
                  "user",
                  "userRolePairing",
                  "role",
                  "rolePermissionPairing",
                  "permission",
                ],
              });
            }
          };
        },
      }
    )
  );
};

type GlobalStoreApi = ReturnType<typeof createGlobalStore>;

export const GlobalStoreContext = createContext<GlobalStoreApi | undefined>(
  undefined
);

export const GlobalStoreProvider = ({ children }: { children: ReactNode }) => {
  const [store, setStore] = useState<GlobalStoreApi | undefined>();

  useEffect(() => {
    if (!store) {
      let initState: GlobalState | undefined = undefined;

      try {
        const localStorageGlobalStore =
          localStorage.getItem("global-store") || undefined;

        if (localStorageGlobalStore) {
          initState = JSON.parse(localStorageGlobalStore)?.state;
        }
      } catch (error) {
        console.error("ERROR_9v9w3fj", error);
      }

      setStore(createGlobalStore(initState));
    }
  }, [store]);

  return (
    <GlobalStoreContext.Provider value={store}>
      {store ? children : null}
    </GlobalStoreContext.Provider>
  );
};

const fallbackSelector = (store: GlobalStore) => store;
export function useGlobalStore(
  selector: (store: GlobalStore) => any = fallbackSelector
): GlobalStore {
  const globalStoreContext = useContext(GlobalStoreContext);

  if (!globalStoreContext) {
    throw new Error(`useGlobalStore must be used within GlobalStoreProvider`);
  }

  return useStore(globalStoreContext, useShallow(selector));
}
