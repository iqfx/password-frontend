import Navbar from "../components/NavBar";
import E2EETEST from "@/components/e2eeTest";
import PasswordTable from "@/components/PasswordTable";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Avatar } from "@mui/material";

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  return (
    <main className="">
      <Navbar />
      {user && (
        <div>
          <E2EETEST />
          <PasswordTable />
        </div>
      )}
    </main>
  );
}
