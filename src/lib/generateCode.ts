import { customAlphabet } from "nanoid";

export async function generateCode() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789"; // ohne 0 und O
  let length = 5;
  // let codeExists = true;
  let code = "";

  // while (codeExists) {
  const nanoid = customAlphabet(characters, length);
  code = nanoid();
  // code = `VO+${code}`;
  // codeExists = await prisma.object.findUnique({ where: { code } });
  // if (codeExists) {
  //   length += 1;
  // } else {
  //   codeExists = false;
  // }
  // }

  return code;
}
