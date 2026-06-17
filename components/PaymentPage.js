"use client"
import React, { useEffect, useState, useCallback, useRef } from 'react'
import Script from 'next/script'
import { useSession } from 'next-auth/react'
import { fetchuser, fetchpayments, initiate } from '@/actions/useractions'
import { useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { useRouter } from 'next/navigation'

const PaymentPage = ({ username }) => {
    const { data: session, status } = useSession()

    const [paymentform, setPaymentform] = useState({ name: "", message: "", amount: "" })
    const [currentUser, setcurrentUser] = useState({})
    const [payments, setPayments] = useState([])
    const searchParams = useSearchParams()
    const router = useRouter()
    const toastShown = useRef(false)

    const getData = useCallback(async () => {
        let u = await fetchuser(username)
        setcurrentUser(u)
        let dbpayments = await fetchpayments(username)
        setPayments(dbpayments)
    }, [username])

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push(`/login?callbackUrl=/${username}`)
            return
        }
        if (status === 'authenticated') {
            getData()
        }
    }, [status, router, username, getData])

    useEffect(() => {
        if (searchParams.get("paymentdone") === "true" && !toastShown.current) {
            toastShown.current = true
            toast('🎉 Thanks for your donation!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            getData()
            router.replace(`/${username}`, { scroll: false })
        }
    }, [searchParams, getData, router, username])

    const handleChange = (e) => {
        setPaymentform({ ...paymentform, [e.target.name]: e.target.value })
    }

    const pay = async (amount) => {
        let a = await initiate(amount, username, paymentform, session?.user?.image || "")
        let orderId = a.id
        var options = {
            "key": currentUser.razorpayid || process.env.NEXT_PUBLIC_KEY_ID,
            "amount": amount,
            "currency": "INR",
            "name": "Get Me A Chai",
            "description": "Support with a Chai!",
            "image": currentUser.profilepic ? `${process.env.NEXT_PUBLIC_URL}${currentUser.profilepic}` : undefined,
            "order_id": orderId,
            "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
            "prefill": {
                "name": paymentform.name,
                "email": session?.user?.email || "",
                "contact": ""
            },
            "notes": { "username": username },
            "theme": { "color": "#7c3aed" }
        }
        var rzp1 = new Razorpay(options);
        rzp1.open();
    }

    const totalRaised = payments.reduce((a, b) => a + b.amount, 0)

    const rankEmoji = (i) => {
        if (i === 0) return "🥇"
        if (i === 1) return "🥈"
        if (i === 2) return "🥉"
        return `#${i + 1}`
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

            {/* Cover + Profile */}
            <div className='cover w-full relative'>
                <img
                    className='object-cover w-full h-52 md:h-[380px]'
                    src="/cover.png"
                    alt="cover"
                />
                {/* Gradient overlay bottom fade */}
                <div className='absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent' />
                {/* Profile picture with glow */}
                <div className='absolute -bottom-16 left-1/2 -translate-x-1/2'>
                    <div className='relative'>
                        <div className='absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 blur-md opacity-60 scale-110' />
                        <img
                            className='relative rounded-full object-cover size-32 border-4 border-[#0a0a1a]'
                            width={128}
                            height={128}
                            src="/profile.png"
                            alt="profile"
                        />
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="flex justify-center items-center mt-24 mb-6 flex-col gap-2">
                <h1 className='font-extrabold text-2xl bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent tracking-wide'>
                    Wizard
                </h1>
                <p className='text-slate-400 text-sm'>Lets help Wizard get a chai!</p>

                {/* Stats */}
                <div className='flex gap-4 mt-3'>
                    <div className='flex flex-col items-center bg-slate-800/60 backdrop-blur rounded-2xl px-6 py-3 border border-slate-700/40'>
                        <span className='text-white font-bold text-xl'>{payments.length}</span>
                        <span className='text-slate-400 text-xs mt-0.5'>Payments</span>
                    </div>
                    <div className='flex flex-col items-center bg-slate-800/60 backdrop-blur rounded-2xl px-6 py-3 border border-slate-700/40'>
                        <span className='text-white font-bold text-xl'>₹{totalRaised.toLocaleString()}</span>
                        <span className='text-slate-400 text-xs mt-0.5'>Raised</span>
                    </div>
                </div>
            </div>

            {/* Main Cards */}
            <div className="flex gap-5 w-[92%] max-w-5xl mx-auto my-8 flex-col md:flex-row pb-10">

                {/* Top Supporters */}
                <div className="w-full md:w-1/2 bg-slate-900/70 backdrop-blur-md border border-slate-700/40 rounded-2xl p-6 shadow-2xl">
                    <h2 className='text-lg font-bold mb-5 flex items-center gap-2 text-white'>
                        <span>🏆</span> Top 10 Supporters
                    </h2>
                    <ul className='flex flex-col gap-3'>
                        {payments.length === 0 &&
                            <li className='text-slate-500 text-sm text-center py-8'>
                                No payments yet. Be the first! ☕
                            </li>
                        }
                        {payments.map((p, i) => (
                            <li key={i} className='flex gap-3 items-center bg-slate-800/50 rounded-xl px-3 py-2.5 border border-slate-700/30 hover:border-violet-500/40 hover:bg-slate-800/80 transition-all duration-200'>
                                <span className='text-base w-7 text-center shrink-0 font-bold'>{rankEmoji(i)}</span>
                                <img
                                    width={38} height={38}
                                    src={p.from_image || `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(p.name)}`}
                                    alt="avatar"
                                    className="rounded-full object-cover shrink-0 border-2 border-slate-600"
                                    onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(p.name)}` }}
                                />
                                <div className='flex flex-col min-w-0'>
                                    <span className='text-white text-sm font-semibold truncate'>{p.name}</span>
                                    <span className='text-slate-400 text-xs truncate'>
                                        donated <span className='text-violet-400 font-bold'>₹{p.amount}</span>
                                        {p.message ? ` · "${p.message}"` : ""}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Make a Payment */}
                <div className="w-full md:w-1/2 bg-slate-900/70 backdrop-blur-md border border-slate-700/40 rounded-2xl p-6 shadow-2xl">
                    <h2 className='text-lg font-bold mb-5 flex items-center gap-2 text-white'>
                        <span>☕</span> Make a Payment
                    </h2>
                    <div className='flex gap-3 flex-col'>
                        <input
                            onChange={handleChange}
                            value={paymentform.name}
                            name='name'
                            type="text"
                            className='w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700/40 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/70 focus:bg-slate-800 transition-all text-sm'
                            placeholder='Your Name'
                        />
                        <input
                            onChange={handleChange}
                            value={paymentform.message}
                            name='message'
                            type="text"
                            className='w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700/40 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/70 focus:bg-slate-800 transition-all text-sm'
                            placeholder='Leave a message...'
                        />
                        <input
                            onChange={handleChange}
                            value={paymentform.amount}
                            name="amount"
                            type="number"
                            min="1"
                            className='w-full p-3 rounded-xl bg-slate-800/80 border border-slate-700/40 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/70 focus:bg-slate-800 transition-all text-sm'
                            placeholder='Amount (₹)'
                        />
                        <button
                            onClick={() => pay(Number.parseInt(paymentform.amount) * 100)}
                            type="button"
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-violet-900/30 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                            disabled={paymentform.name?.length < 3 || paymentform.message?.length < 4 || paymentform.amount?.length < 1}
                        >
                            Pay Now 🚀
                        </button>
                    </div>

                    {/* Quick amounts */}
                    <div className='grid grid-cols-3 gap-2 mt-4'>
                        {[100, 500, 1000].map((amt) => (
                            <button
                                key={amt}
                                onClick={() => pay(amt * 100)}
                                className='py-2.5 px-3 rounded-xl bg-slate-800/80 border border-slate-700/40 text-slate-300 text-sm font-medium hover:border-violet-500/50 hover:text-white hover:bg-slate-700/80 transition-all duration-200 active:scale-95'
                            >
                                ₹{amt}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </>
    )
}

export default PaymentPage
