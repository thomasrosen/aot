export const object_code_prefix = "OBJ-";

export const adminRoleName = "admin";
export const adminPermissionName = "admin";

export const trustedRoleName = "trusted";
export const trustedPermissionName = "trusted";

export const locationTypes: string[] = [
  "home",
  "office",
  "storage",
  "infobooth",
];
export const locationTypesIcons: Record<string, string> = {
  home: "location_home",
  storage: "warehouse",
  office: "work",
  infobooth: "festival",
};

export const objectTypes: string[] = [
  "pavilion",
  "counter",
  "foldingtable",
  "flag",
  "beachflag",
  "banner",
  "poster",
  "pallet",
  "chair",
  "umbrella",
];
export const objectTypesIcons: Record<string, string> = {
  pavilion: "festival",
  counter: "desk",
  foldingtable: "table_restaurant",
  flag: "flag",
  beachflag: "flag_2",
  banner: "crop_16_9",
  poster: "wall_art",
  pallet: "pallet",
  chair: "chair_alt",
  umbrella: "umbrella",
};

export const roleIcons: Record<string, string> = {
  unknown: "no_accounts",
  admin: "shield_person",
  trusted: "person",
};
