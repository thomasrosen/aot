import { SubHeader } from "@/components/SubHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      <SubHeader
        title="About"
        actions={
          <Link href={`mailto:${process.env.CONTACT_EMAIL}`}>
            <Button>Contact</Button>
          </Link>
        }
      />
      <p>This is going to be the about page.</p>
    </div>
  );
}
