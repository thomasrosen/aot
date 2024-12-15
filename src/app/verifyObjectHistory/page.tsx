import { verifyObjectHistory } from "@/actions/verifyObjectHistory";
import { SubHeader } from "@/components/SubHeader";
import { P } from "@/components/Typography";

export default async function VerifyObjectHistoryPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const { id } = await searchParams;

  try {
    const verifySuccessfull = await verifyObjectHistory({ id });
    if (verifySuccessfull) {
      return (
        <div>
          <SubHeader title="Verify Object History" />
          <P>You successfully verified your submission.</P>
        </div>
      );
    }
  } catch (error) {
    const error_message =
      error instanceof Error ? error.message : String(error);
    return (
      <div>
        <SubHeader title="Verify Object History" />
        <P>The verification of your submission failed.</P>
        <P>Error: {error_message}</P>
      </div>
    );
  }
}
