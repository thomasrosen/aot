import { getGlobalSetting } from "@/lib/getGlobalSetting";
import { setGlobalSetting } from "@/lib/setGlobalSetting";
import { prisma } from "@/prisma";
import { customAlphabet } from "nanoid";

export async function generateCode(): Promise<string> {
  const original_lenght = (await getGlobalSetting({ key: "code_length" })) || 1;

  const characters = "346789BCDFGHJKLMNPQRTWXYZ"; // similar to the nolookalikesSafe alphabet from nanoid

  let length = 3; // original_lenght;
  let code = null;
  let codeExistsInDatabase: boolean = true;
  let tryCount = 1;
  while (codeExistsInDatabase) {
    if (tryCount > 10) {
      // if we tried 10 times, we give up
      throw new Error("ERROR_vJ28L3bk Could not generate a unique code");
    }

    const nanoid = customAlphabet(characters, length);
    code = nanoid();
    codeExistsInDatabase = Boolean(
      await prisma.object.findFirst({
        where: { code },
      })
    );
    if (!codeExistsInDatabase) {
      // early stopping if code does not exist
      break;
    }
    if (codeExistsInDatabase) {
      if (tryCount % 2) {
        // increase length every second try
        // only every second time, to be more sure that the codes in that length are used up
        length += 1;
      }
    }
    tryCount += 1;
  }

  // save new length to global setting
  if (original_lenght !== length) {
    await setGlobalSetting({ key: "code_length", value: length });
  }

  if (!code) {
    throw new Error("ERROR_kTLhEPOM Could not generate a unique code");
  }

  return code;
}
