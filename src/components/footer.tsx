import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="flex justify-center items-center py-4 gap-1">
      <span>Battle Derby ©</span>
      <Link target="_blank" href="https://tripleogames.com/">
        Triple O Games
      </Link>
    </footer>
  )
}
