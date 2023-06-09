import PasswordPromptModal from "@/components/PasswordPromptModal";
import Navbar from "../components/NavBar";
import E2EETEST from "@/components/e2eeTest";
import PasswordTable from "@/components/PasswordTable";
import { useUser } from "@auth0/nextjs-auth0/client";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import crypto from "crypto";

export default function Home() {
  const { user, error, isLoading } = useUser();
  const [userHasSetMasterPassword, setUserHasSetMasterPassword] =
    useState(false);

  useEffect(() => {
    let fetchMasterPasswordBoolean = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        setUserHasSetMasterPassword(data.hasSetMasterPassword);
      } catch (error) {
        console.log(error);
      }
    };
    console.log(crypto.randomBytes(16).toString("hex"));
    fetchMasterPasswordBoolean();
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  return (
    <UserProvider>
      <main className="" style={{ height: "100%", width: "100%" }}>
        <Navbar />
        {!userHasSetMasterPassword && (
          <div style={{ height: "100%", width: "100%" }}>
            <PasswordPromptModal />
          </div>
        )}
        {user && userHasSetMasterPassword && (
          <div style={{ height: "100%", width: "100%" }}>
            <E2EETEST />

            <PasswordTable />
          </div>
        )}
      </main>
    </UserProvider>
  );
}
