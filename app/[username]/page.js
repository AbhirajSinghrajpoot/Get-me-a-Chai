"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import PaymentPage from '@/components/PaymentPage'

const Username = () => {
  const params = useParams()
  const username = params?.username ? decodeURIComponent(params.username) : undefined

  return <PaymentPage username={username} />
}

export default Username
