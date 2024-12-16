import { SubHeader } from "@/components/SubHeader";
import { H2, P } from "@/components/Typography";
import { Translate } from "@/components/client/Translation";
import { Button } from "@/components/ui/button";
import { loadTranslations } from "@/lib/server/fluent-server";
import { PageParams } from "@/types";
import Link from "next/link";

export default async function AboutPage({ params }: { params: PageParams }) {
  const { locale } = await params;
  const t = await loadTranslations(locale);

  return (
    <div>
      <SubHeader
        title={t("about")}
        actions={
          <Link href={`mailto:${process.env.CONTACT_EMAIL}`}>
            <Button>{t("contact")}</Button>
          </Link>
        }
      />
      <Translate
        id="about-content"
        elems={{
          p: <P />,
          h2: <H2 />,
        }}
      />
    </div>
  );
}
