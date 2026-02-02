// navbar component with authentication and navigation links

import { auth, signOut, } from "@/auth";
import Link from "next/link";

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
                            <Link href="/vehicle/create">
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

                            <Link href={`/profile`}>
                                <span>{session?.user?.name}</span>
                            </Link>
                        </>
                    ) : (
                        <Link href="/login/">
                                <span>Log In</span>
                            </Link>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default navbar