import { auth, signOut, signIn } from "@/auth";
import Link from "next/link";
import React from 'react';

const navbar = async () => {
const session = await auth();

  return (
    <header className='px-5 py-3 bg-white shadow-sm font-work-sans'>
        <nav className='flex justify-between items-center'>
            <Link href="/">
             <span className="text-black">Home</span>
            </Link>

            <div className="flex items-center gap-5 text-black">
                {session && session?.user ? (
                    <>
                        <Link href="/app/">
                            <span>Create</span>
                        </Link>

                        <form action={async() => {
                            "use server"

                            await signOut({redirectTo: "/"});
                            }}>
                            <button type="submit">
                                Logout
                            </button>
                        </form>

                        <Link href={`/user/${session?.id}`}>
                            <span>{session?.user?.name}</span>
                        </Link>
                    </>
                ) : (
                    <form action={async() => {
                        "use server"

                        await signIn('github')}}>
                        <button type="submit">Login</button>
                    </form>
                )}
            </div>
        </nav>
    </header>
  )
}

export default navbar