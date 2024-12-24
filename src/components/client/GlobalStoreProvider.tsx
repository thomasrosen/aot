"use client";

import { Filters } from "@/app/api/data/route";
import { hashRevalidationKey } from "@/lib/hashRevalidationKey";
import {
  LocationFull,
  ObjectFull,
  RoleFull,
  UserFull,
  UserRolePairingFull,
} from "@/prisma_types";
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
  locations: LocationFull[];
  users: UserFull[];
  userRolePairings: UserRolePairingFull[];
  roles: RoleFull[];
  lastRevalidatedAt?: string;
  revalidationKeys: string[];
};

type GlobalActions = {
  setHydrated: (value: boolean) => void;
  fetchMany: ({
    tables,
    filters,
  }: {
    tables?: ("object" | "location" | "user" | "userRolePairing" | "role")[];
    filters?: Filters;
  }) => Promise<void>;
  fetchRolesForUsers: (userIds: string[]) => Promise<void>;

  withUserRolePairings: (users: UserFull[]) => Promise<UserFull[]>;
  withPermissions: (roles: RoleFull[]) => Promise<RoleFull[]>;
};

type GlobalStore = GlobalState & GlobalActions;

const defaultInitState: GlobalState = {
  _hasHydrated: false,
  objects: [],
  locations: [],
  users: [],
  userRolePairings: [],
  roles: [],
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
            await get().fetchMany({
              tables: ["userRolePairing"],
              filters: { userIds: neededUserIds },
            });
          }
        },
        fetchMany: async ({ tables = [], filters }) => {
          const url = new URL("/api/data", window.location.origin);
          const query: Record<string, string> = {};

          // tell which tables to query
          if (tables.length) {
            query.tables = tables.join(",");
          }
          if (filters) {
            query.filters = JSON.stringify(filters);
          }

          // tell which revalidation history should be included
          const lastRevalidatedAt = get().lastRevalidatedAt;
          if (lastRevalidatedAt) {
            query.lastRevalidatedAt = new Date(lastRevalidatedAt).toISOString();
          }

          url.search = new URLSearchParams(query).toString();

          const {
            objects = [],
            locations = [],
            users = [],
            userRolePairings = [],
            roles = [],
            revalidationKeys = [],
          }: {
            objects: ObjectFull[];
            locations: LocationFull[];
            users: UserFull[];
            userRolePairings: UserRolePairingFull[];
            roles: RoleFull[];
            revalidationKeys: string[];
          } = await fetch(url)
            .then((res) => res.json())
            .catch(() => ({}));

          const loadedKeys = [
            ...objects.map((a) => hashRevalidationKey(`object:${a.id}`)),
            ...locations.map((a) => hashRevalidationKey(`location:${a.id}`)),
            ...users.map((a) => hashRevalidationKey(`user:${a.id}`)),
            ...roles.map((a) => hashRevalidationKey(`role:${a.id}`)),
            ...userRolePairings.map((a) =>
              hashRevalidationKey(`userRolePairing:${a.id}`)
            ),
          ];

          const newRevalidationKeys = [
            ...new Set([...get().revalidationKeys, ...revalidationKeys]),
          ].filter((key) => !loadedKeys.includes(key));

          const newData: Partial<GlobalState> = {
            _hasHydrated: true,
            lastRevalidatedAt: new Date().toISOString(),
            revalidationKeys: newRevalidationKeys,
          };

          if (objects.length) {
            newData.objects = [
              ...get().objects.filter(
                (a) => !objects.find((b) => b.id === a.id)
              ),
              ...objects,
            ];
          }

          if (locations.length) {
            newData.locations = [
              ...get().locations.filter(
                (a) => !locations.find((b) => b.id === a.id)
              ),
              ...locations,
            ];
          }

          if (users.length) {
            newData.users = [
              ...get().users.filter((a) => !users.find((b) => b.id === a.id)),
              ...users,
            ];
          }

          if (userRolePairings.length) {
            newData.userRolePairings = [
              ...get().userRolePairings.filter(
                (a) => !userRolePairings.find((b) => b.id === a.id)
              ),
              ...userRolePairings,
            ];
          }

          if (roles.length) {
            newData.roles = [
              ...get().roles.filter((a) => !roles.find((b) => b.id === a.id)),
              ...roles,
            ];
          }

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
              // await state.fetchMany({
              //   tables: ["object", "location", "user"],
              // });
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
