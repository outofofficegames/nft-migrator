'use client'
import { useEffect } from 'react'
import { passport } from '@/providers/passport'

export default function LoginPage() {
  useEffect(() => {
    passport?.loginCallback()
  }, [])
  return
}
