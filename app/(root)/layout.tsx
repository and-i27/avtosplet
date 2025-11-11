import Navbar from "@/app/components/navbar";

export default function Layout({ children }: Readonly<{ childer: React.ReactNode }>)
{
    return(
        <main className="font-work-sans">
            <Navbar />


            {children}
        </main>
    )
}