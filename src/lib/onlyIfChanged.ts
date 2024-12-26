import { RequiredProperties } from "@/prisma_types";
import isEqual from "lodash.isequal";

export type AnyData = RequiredProperties & Record<string, any>;
export function onlyIfChanged(
  name: string,
  newData?: AnyData[],
  getOldData?: () => AnyData[]
): Record<string, AnyData[]> | undefined {
  if (!newData || !newData.length) {
    return undefined;
  }

  const oldData = getOldData ? getOldData() : undefined;
  if (!oldData || !oldData.length) {
    // if there is no old data or old data is not an array assume it has fully changed
    return {
      [name]: newData,
    };
  }

  const newDataFiltered = [
    ...oldData.filter((a) => !newData.find((b) => b.id === a.id)),
    ...newData,
  ]
    .sort((a, b) => a.id.localeCompare(b.id))
    .filter((a) => !!a);

  if (!isEqual(oldData, newDataFiltered)) {
    return {
      [name]: newDataFiltered,
    };
  }

  return undefined;
}
