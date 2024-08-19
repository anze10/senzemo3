import { auth } from "src/server/auth";
import Reader, { NewSensorSetter } from "./Reader";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const session = await auth();

  if (!session?.user) redirect("/");

  return (
    <div className="m-4 flex flex-col items-center">
      <NewSensorSetter />
      <Reader></Reader>
    </div>
  );
};

export default HomePage;
