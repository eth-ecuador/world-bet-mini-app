import { auth } from "@/auth";
import { Pay } from "@/components/Pay";
import { Transaction } from "@/components/Transaction";
import { UserInfo } from "@/components/UserInfo";
import { Verify } from "@/components/Verify";
import { ViewPermissions } from "@/components/ViewPermissions";
import { Marble, TopBar } from "@worldcoin/mini-apps-ui-kit-react";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <TopBar
        title="Home"
        endAdornment={
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold capitalize">
              {session?.user.username}
            </p>
            <Marble src={session?.user.profilePictureUrl} className="w-12" />
          </div>
        }
      />

      <UserInfo />
      <Verify />
      <Pay />
      <Transaction />
      <ViewPermissions />
    </>
  );
}
