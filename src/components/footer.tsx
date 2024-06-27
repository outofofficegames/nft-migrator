'use client'
import Link from 'next/link'
import Modal from './themed/modal'
import { useState } from 'react'
import HowItWorks from './howItWorks'

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <footer className="flex text-white justify-center flex-col items-center py-4 gap-4 z-10">
      <nav className="flex gap-4 md:flex-row flex-col items-center md:items-start">
        <span className=" cursor-pointer" onClick={() => setIsModalOpen(true)}>
          How does it work?
        </span>
        <span className="hidden md:inline">|</span>
        <Link target="_blank" href="https://tripleogames.com/terms-of-service/">
          Terms and Conditions
        </Link>
        <span className="hidden md:inline">|</span>
        <Link target="_blank" href="mailto:support@tripleogames.com">
          Support
        </Link>
      </nav>
      <div className="flex gap-1">
        <span>Battle Derby ©</span>
        <Link target="_blank" href="https://tripleogames.com/">
          Triple O Games
        </Link>
      </div>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <HowItWorks />
      </Modal>
    </footer>
  )
}
