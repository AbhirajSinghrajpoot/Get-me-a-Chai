"use client"
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import PaymentPage from '@/components/PaymentPage'

const Username = () => {
  const { status } = useSession()
  const router = useRouter()
  const params = useParams()
  const username = params?.username

  useEffect(() => {
    if (status === 'unauthenticated' && username) {
      router.push(`/login?callbackUrl=/${username}`)
    }
  }, [status, router, username])

  return <PaymentPage username={username} />
}

export default Username
