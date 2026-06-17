"use client"
import React, { useEffect, useState, useCallback } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { fetchuser, updateProfile } from '@/actions/useractions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';

const Dashboard = () => {
    const { data: session, update } = useSession()
    const router = useRouter()
    const [form, setform] = useState({})

    const getData = useCallback(async () => {
        const username = session?.user?.username
        if (!username) return
        let u = await fetchuser(username)
        setform(u)
    }, [session])

    useEffect(() => {
        if (!session) {
            router.push('/login')
        } else {
            getData()
        }
    }, [session, router, getData])

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const username = session?.user?.username
        if (!username) return
        const formData = new FormData(e.target)
        let a = await updateProfile(formData, username)
        toast('✅ Profile Updated!', {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
    }

    const fields = [
        { id: "name",          label: "Full Name",        type: "text",  placeholder: "Your display name",          icon: "👤" },
        { id: "email",         label: "Email",            type: "email", placeholder: "you@example.com",            icon: "✉️" },
        { id: "username",      label: "Username",         type: "text",  placeholder: "your_username",              icon: "🔖" },
        { id: "razorpayid",   label: "Razorpay ID",      type: "text",  placeholder: "rzp_live_xxxxxxxxxxxx",      icon: "💳" },
        { id: "razorpaysecret",label: "Razorpay Secret", type: "text",  placeholder: "Your Razorpay secret key",   icon: "🔑" },
    ]

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

            {/* Background blobs */}
            <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-violet-700/10 rounded-full blur-[140px] pointer-events-none -z-10" />
            <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-cyan-700/10 rounded-full blur-[140px] pointer-events-none -z-10" />

            <div className='min-h-screen text-white px-4 py-12'>
                <div className="max-w-2xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-full px-4 py-1.5 text-xs text-slate-400 mb-4">
                            <span className="w-2 h-2 rounded-full bg-violet-400" />
                            Account Settings
                        </div>
                        <h1 className='text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent'>
                            Welcome to your Dashboard
                        </h1>
                        <p className="text-slate-500 text-sm mt-2">Manage your profile and payment settings</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700/40 rounded-2xl p-6 md:p-8 shadow-2xl">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                            {/* Profile & Cover group */}
                            <div className="mb-1">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Profile Info</p>
                                <div className="flex flex-col gap-4">
                                    {fields.slice(0, 3).map(f => (
                                        <div key={f.id}>
                                            <label htmlFor={f.id} className="block mb-1.5 text-sm font-medium text-slate-300">
                                                {f.icon} {f.label}
                                            </label>
                                            <input
                                                id={f.id}
                                                name={f.id}
                                                type={f.type}
                                                value={form[f.id] || ""}
                                                onChange={handleChange}
                                                placeholder={f.placeholder}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/40 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-violet-500/60 focus:bg-slate-800 transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-slate-700/40" />

                            {/* Payment group */}
                            <div className="mb-1">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Payment Settings</p>
                                <div className="flex flex-col gap-4">
                                    {fields.slice(3).map(f => (
                                        <div key={f.id}>
                                            <label htmlFor={f.id} className="block mb-1.5 text-sm font-medium text-slate-300">
                                                {f.icon} {f.label}
                                            </label>
                                            <input
                                                id={f.id}
                                                name={f.id}
                                                type={f.type}
                                                value={form[f.id] || ""}
                                                onChange={handleChange}
                                                placeholder={f.placeholder}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/40 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-violet-500/60 focus:bg-slate-800 transition-all font-mono"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                type="submit"
                                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-violet-900/30 active:scale-[0.98]"
                            >
                                Save Changes ✓
                            </button>
                        </form>
                    </div>

                    {/* Footer hint */}
                    <p className="text-center text-slate-600 text-xs mt-6">Changes are saved instantly to your profile</p>
                </div>
            </div>
        </>
    )
}

export default Dashboard
