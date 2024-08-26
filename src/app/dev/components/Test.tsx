import { auth } from "src/server/auth";
import
Reader from "./Reader";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const session = await auth();

  if (!session?.user) redirect("/");

  return (
    <div className="m-4 flex flex-col items-center">

      <Reader></Reader>
    </div>
  );
};

export default HomePage;
