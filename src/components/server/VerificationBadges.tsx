import { Icon } from "@/components/Icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { loadTranslations } from "@/lib/server/fluent-server";
import { cn } from "@/lib/utils";
import { Locale } from "@@/i18n-config";
import { Translate } from "../client/Translation";

function SmallAlert({
  children,
  icon,
  title,
  description,
  actions,
}: {
  children: React.ReactNode;
  icon?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex gap-2 items-center">
            {icon ? <Icon name={icon} /> : null}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col space-y-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>{actions}</AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function VerificationBadges({
  locale,
  isTrusted,
  isVerified,
  email,
  className,
}: {
  locale: Locale;
  isTrusted: boolean;
  isVerified: boolean;
  email: string;
  className?: string;
}) {
  isTrusted = false;
  const t = loadTranslations(locale);
  return (
    <div className={cn("flex gap-2 py-1 flex-wrap items-center", className)}>
      {isTrusted && isVerified ? (
        <SmallAlert
          icon="done_all"
          title={t("verify-badges-all-done-title")}
          description={t("verify-badges-all-done-description")}
          actions={<AlertDialogAction>{t("okay-great")}</AlertDialogAction>}
        >
          <Badge
            className="shrink-0 bg-green-500 text-white cursor-pointer"
            variant="secondary"
          >
            <Icon name="done_all" size="sm" />
          </Badge>
        </SmallAlert>
      ) : null}

      {isTrusted ? (
        <SmallAlert
          icon="check"
          title={t("verify-badges-trusted-title")}
          description={
            <Translate
              id="verify-badges-trusted-description"
              elems={{
                strong: <strong />,
                span: <span />,
                email: <strong className="font-mono" />,
              }}
              vars={{ email }}
            />
          }
          actions={<AlertDialogAction>{t("okay")}</AlertDialogAction>}
        >
          <Badge className="shrink-0 gap-1 cursor-pointer" variant="secondary">
            <Icon name="check" size="sm" />
            {t("verify-badges-trusted-badge")}
          </Badge>
        </SmallAlert>
      ) : (
        <SmallAlert
          icon="shield_question"
          title={t("verify-badges-not-trusted-title")}
          description={
            <Translate
              id="verify-badges-not-trusted-description"
              elems={{
                strong: <strong />,
                span: <span />,
                email: <strong className="font-mono" />,
              }}
              vars={{ email }}
            />
          }
          actions={
            <>
              <AlertDialogCancel>
                <Icon name="close" />
                {t("trust-person-cancel-button")}
              </AlertDialogCancel>
              <AlertDialogAction>
                <Icon name="check" />
                {t("trust-person-submit-button")}
              </AlertDialogAction>
            </>
          }
        >
          <Badge
            className="shrink-0 cursor-pointer gap-1"
            variant="destructive"
          >
            {t("verify-badges-not-trusted-badge")}
          </Badge>
        </SmallAlert>
      )}

      {isVerified ? (
        <SmallAlert
          icon="check"
          title={t("email-verified-title")}
          description={
            <Translate
              id="email-verified-description"
              elems={{
                span: <span />,
                email: <strong className="font-mono" />,
              }}
              vars={{ email }}
            />
          }
          actions={<AlertDialogAction>{t("okay")}</AlertDialogAction>}
        >
          <Badge className="shrink-0 gap-1 cursor-pointer" variant="secondary">
            <Icon name="check" size="sm" />
            {t("email-verified-badge")}
          </Badge>
        </SmallAlert>
      ) : (
        <SmallAlert
          icon="privacy_tip"
          title={t("email-not-verified-title")}
          description={
            <Translate
              id="email-not-verified-description"
              elems={{
                span: <span />,
                email: <strong className="font-mono" />,
              }}
              vars={{ email }}
            />
          }
          actions={<AlertDialogAction>{t("okay")}</AlertDialogAction>}
        >
          <Badge
            className="shrink-0 cursor-pointer gap-1"
            variant="destructive"
          >
            {t("email-not-verified-badge")}
          </Badge>
        </SmallAlert>
      )}
    </div>
  );
}
