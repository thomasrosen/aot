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
import { cn } from "@/lib/utils";

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
  isTrusted,
  isVerified,
  email,
  className,
}: {
  isTrusted: boolean;
  isVerified: boolean;
  email: string;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-2 py-1 flex-wrap items-center", className)}>
      {isTrusted && isVerified ? (
        <SmallAlert
          icon="done_all"
          title="All checks passed!"
          description="This submission can be trusted."
          actions={<AlertDialogAction>Okay, Great :)</AlertDialogAction>}
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
          title="Trusted Person"
          description={
            <>
              <strong>
                This submission is from someone marked as trusted.
              </strong>
              <span>If needed, an admin can mark a person as not trusted.</span>
              <span>
                The location submission is signed with this email address:{" "}
                <strong className="font-mono">{email}</strong>
              </span>
            </>
          }
          actions={<AlertDialogAction>Okay</AlertDialogAction>}
        >
          <Badge className="shrink-0 gap-1 cursor-pointer" variant="secondary">
            <Icon name="check" size="sm" /> From a Trusted Person
          </Badge>
        </SmallAlert>
      ) : (
        <SmallAlert
          icon="shield_question"
          title="Trust this Person?"
          description={
            <>
              <strong>
                This submission is from someone not yet marked as trusted.
              </strong>
              <span>
                If you recognize this person by their email address, you can
                mark them as trusted. This decision will ensure their future
                entries are automatically verified. If needed, an admin can undo
                this action.
              </span>
              <span>
                The location submission is signed with this email address:{" "}
                <strong className="font-mono">{email}</strong>
              </span>
            </>
          }
          actions={
            <>
              <AlertDialogCancel>
                <Icon name="close" />
                No, Cancel
              </AlertDialogCancel>
              <AlertDialogAction>
                <Icon name="check" />
                Yes, I Trust this Person
              </AlertDialogAction>
            </>
          }
        >
          <Badge
            className="shrink-0 cursor-pointer gap-1"
            variant="destructive"
          >
            Not from a Trusted Person
          </Badge>
        </SmallAlert>
      )}

      {isVerified ? (
        <SmallAlert
          icon="check"
          title="Email Verified"
          description={
            <>
              <span>
                The email address <strong className="font-mono">{email}</strong>{" "}
                has been verified and confirmed for this location submission.
              </span>
              <span>
                Verification was completed by either: Clicking a link in a
                confirmation email or being signed in with their account.
              </span>
            </>
          }
          actions={<AlertDialogAction>Okay</AlertDialogAction>}
        >
          <Badge className="shrink-0 gap-1 cursor-pointer" variant="secondary">
            <Icon name="check" size="sm" /> Email Verified
          </Badge>
        </SmallAlert>
      ) : (
        <SmallAlert
          icon="privacy_tip"
          title="Email Not Verified"
          description={
            <>
              <span>
                The email address <strong className="font-mono">{email}</strong>{" "}
                has <strong>not</strong> been verified.
              </span>
              <span>
                This means the person has not confirmed their submission by:
                Clicking the verification link sent to their email, or signing
                in with their account.
                <br />
              </span>
              <span>
                Without verification, this submission cannot be fully trusted.
              </span>
            </>
          }
          actions={<AlertDialogAction>Okay</AlertDialogAction>}
        >
          <Badge
            className="shrink-0 cursor-pointer gap-1"
            variant="destructive"
          >
            Email Not Verified
          </Badge>
        </SmallAlert>
      )}
    </div>
  );
}
