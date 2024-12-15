import { signOut } from "@/auth";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      onClick={async () => {
        "use server";
        await signOut();
      }}
    >
      <Icon name="logout" /> Sign Out
    </Button>
  );
}
