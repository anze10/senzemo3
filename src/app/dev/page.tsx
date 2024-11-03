
import Reader from "./components/Reader";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import Navbar from "./components/Navbar";


export default async function Home() {
  const Session = await auth();
  if (!Session) {
    redirect("/")
  }
  return (
    <div>
      <Navbar session={Session} ></Navbar>
      <Reader  >

      </Reader>
    </div>
  );
}
