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
                theme: "light",
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
        let a = await initiate(amount, username, paymentform)
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
            "theme": { "color": "#3399cc" }
        }
        var rzp1 = new Razorpay(options);
        rzp1.open();
    }

    const totalRaised = payments.reduce((a, b) => a + b.amount, 0)

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
                theme="light"
            />
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

            <div className='cover w-full relative'>
                {currentUser.coverpic
                    ? <img className='object-cover w-full h-48 md:h-[350px]' src={currentUser.coverpic} alt="cover" />
                    : <div className='w-full h-48 md:h-[350px] bg-slate-700' />
                }
                <div className='absolute -bottom-20 right-[33%] md:right-[46%] border-white overflow-hidden border-2 rounded-full size-36'>
                    {currentUser.profilepic
                        ? <img className='rounded-full object-cover size-36' width={128} height={128} src={currentUser.profilepic} alt="profile" />
                        : <div className='rounded-full bg-slate-600 size-36' />
                    }
                </div>
            </div>

            <div className="info flex justify-center items-center my-24 mb-11 flex-col gap-2">
                <div className='font-bold text-lg'>@{username}</div>
                <div className='text-slate-400'>Lets help {username} get a chai!</div>
                <div className='text-slate-400'>
                    {payments.length} Payments · ₹{totalRaised} raised
                </div>

                <div className="payment flex gap-3 w-[80%] mt-11 flex-col md:flex-row">
                    <div className="supporters w-full md:w-1/2 bg-slate-900 rounded-lg text-white px-2 md:p-10">
                        <h2 className='text-2xl font-bold my-5'>Top 10 Supporters</h2>
                        <ul className='mx-5 text-lg'>
                            {payments.length === 0 && <li>No payments yet. Be the first!</li>}
                            {payments.map((p, i) => (
                                <li key={i} className='my-4 flex gap-2 items-center'>
                                    <img width={33} height={33} src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(p.name)}`} alt="user avatar" />
                                    <span>
                                        {p.name} donated <span className='font-bold'>₹{p.amount}</span> with a message &quot;{p.message}&quot;
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="makePayment w-full md:w-1/2 bg-slate-900 rounded-lg text-white px-2 md:p-10">
                        <h2 className='text-2xl font-bold my-5'>Make a Payment</h2>
                        <div className='flex gap-2 flex-col'>
                            <input onChange={handleChange} value={paymentform.name} name='name' type="text" className='w-full p-3 rounded-lg bg-slate-800' placeholder='Enter Name' />
                            <input onChange={handleChange} value={paymentform.message} name='message' type="text" className='w-full p-3 rounded-lg bg-slate-800' placeholder='Enter Message' />
                            <input onChange={handleChange} value={paymentform.amount} name="amount" type="number" min="1" className='w-full p-3 rounded-lg bg-slate-800' placeholder='Enter Amount (₹)' />
                            <button
                                onClick={() => pay(Number.parseInt(paymentform.amount) * 100)}
                                type="button"
                                className="text-white bg-gradient-to-br from-purple-900 to-blue-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={paymentform.name?.length < 3 || paymentform.message?.length < 4 || paymentform.amount?.length < 1}
                            >
                                Pay
                            </button>
                        </div>
                        <div className='flex flex-col md:flex-row gap-2 mt-5'>
                            <button className='bg-slate-800 p-3 rounded-lg' onClick={() => pay(100 * 100)}>Pay ₹100</button>
                            <button className='bg-slate-800 p-3 rounded-lg' onClick={() => pay(500 * 100)}>Pay ₹500</button>
                            <button className='bg-slate-800 p-3 rounded-lg' onClick={() => pay(1000 * 100)}>Pay ₹1000</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentPage
