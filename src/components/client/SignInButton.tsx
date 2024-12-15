import { signIn } from "@/auth";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  return (
    <Button
      variant="outline"
      onClick={async () => {
        "use server";

        // const formdata = new FormData();
        // formdata.append("email", "thomas.rosen@me.com");
        // formdata.append("code", "123");

        const result = await signIn("object_history_verify_signin", {
          redirect: false,
          email: "thomas.rosen@me.com",
          code: "123",
        });
        console.log("result", result);
      }}
    >
      <Icon name="login" /> Sign In
    </Button>
  );
}

/*
<Link href="/api/auth/signin">
  <Button variant="outline">
    <Icon name="login" /> Sign In
  </Button>
</Link>
*/
