import { auth } from "@/auth";

export const middleware = async (req: Request) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    if (req.url !== "/") {
      return Response.redirect("/", 302);
    }
  }

  return new Response("OK", { status: 200 });
};
