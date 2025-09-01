import Image from 'next/image'
import Link from "next/link"

export const Navbar = () => {
  return (
    <header className="flex items-center justify-between p-6 bg-black text-white">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center">
          <Image src="/beaverhacks_logo.jpg" width={64} height={64} alt="BeaverHacks Logo" />
        </div>
        <div>
          <div className="text-lg font-bold">BEAVERHACKS</div>
          <div className="text-lg font-bold">CAREER</div>
        </div>
      </Link>

      <nav className="flex items-center gap-8">
        <Link href="/user-dashboard" className="text-lg hover:text-gray-300 transition-colors">
          Discover
        </Link>
        <Link href="/profile" className="text-lg hover:text-gray-300 transition-colors">
          Profile
        </Link>
      </nav>
    </header>
  )
}