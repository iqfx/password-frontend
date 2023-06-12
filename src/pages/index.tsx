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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  return (
    <UserProvider>
      <main className="" style={{ height: "100%", width: "100%" }}>
        <Navbar />
        {user && (
          <div style={{ height: "100%", width: "100%" }}>
            <E2EETEST />
            <PasswordTable />
          </div>
        )}
      </main>
    </UserProvider>
  );
}
