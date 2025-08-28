import Link from "next/link";
import Image from "next/image";

export default function Navbar () {
  return (
  
      <header className="flex items-center justify-between p-4 bg-black">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/beaverhacks_logo.jpg" width={48} height={48} alt="BeaverHacks Logo" />
        <div>
          <span className="font-bold uppercase block text-white text-xl">BEAVERHACKS</span>
          <span className="font-bold uppercase block text-white text-xl">CAREER</span>
        </div>
      </Link>
      <nav className="flex items-center gap-8">
        <Link href="/user-dashboard" className="text-white">Discover</Link>
        <Link href="/dashboard" className="text-white">Profile</Link>
        <Link href="/signup" className="text-white">SignUp/SignIn</Link>
      </nav>
    </header>
  );
}