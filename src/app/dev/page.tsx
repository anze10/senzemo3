import Image from "next/image";
import Reader from "./components/Reader";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";


export default async function  Home() {
  const session =  await auth();
  if (!session){
    redirect("/")
  }
  return (
    <div>  
      <Reader session = {session} >
       
        
      </Reader>
    </div>
  );
}
