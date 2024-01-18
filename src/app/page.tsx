'use client'

import { paths } from '@/routes/paths'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push(paths.epg.programacion)
  }, [router])
  
  return (
    <></>
  )
}
