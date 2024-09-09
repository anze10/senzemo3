"use client"
import { Button } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { JSX, SVGProps } from "react";
import Link from "next/link";


export default function SignIn() {
    const router = useRouter();

    const handleSignIn = async () => {
        const result = await signIn("google", { callbackUrl: "/parametrs" });
        if (result?.url) {
            router.push(result.url);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center">
            <div className="mx-auto max-w-md rounded-lg bg-background p-6 shadow-xl">
                <div className="space-y-4 text-center">
                    <h1 className="text-3xl font-bold">Prijava v Senzemo</h1>
                    <p className="text-muted-foreground">Prijavite se z vašim Google računom in začnite uporabljati Senzemo.</p>
                </div>
                <div className="mt-6">
                    <Button
                        className="flex w-full items-center justify-center gap-2 rounded-md border-muted-foreground bg-background px-4 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-muted-foreground-2"
                        onClick={handleSignIn}
                    >
                        <ChromeIcon className="h-5 w-5" />
                        Prijava z Google
                    </Button>
                </div>
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    S prijavo se strinjate z našimi{" "}
                    <Link href="#" className="underline hover:text-primary" prefetch={false}>
                        pogoji
                    </Link>
                    in{" "}
                    <Link href="#" className="underline hover:text-primary" prefetch={false}>
                        politiko zasebnosti
                    </Link>
                    .
                </div>
            </div>
        </div>
    );
}

function ChromeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="21.17" x2="12" y1="8" y2="8" />
            <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
            <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
        </svg>
    );
}
