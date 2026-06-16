"use server"

import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDb from "@/db/connectDb"
import User from "@/models/User"


export const initiate = async (amount, to_username, paymentform) => {
    await connectDb()
    // Decode any URL-encoded characters (e.g. %20 → space) then normalise to lowercase
    const normalizedUsername = decodeURIComponent(to_username).toLowerCase()
    const toUser = await User.findOne({ username: normalizedUsername }).lean()
    if (!toUser) {
        throw new Error(`Creator "${to_username}" not found in database`)
    }

    // Use creator's own Razorpay keys so money goes to them; fall back to platform keys
    const keyId     = toUser.razorpayid     || process.env.KEY_ID
    const keySecret = toUser.razorpaysecret || process.env.KEY_SECRET

    var instance = new Razorpay({ key_id: keyId, key_secret: keySecret })
    let options = {
        amount: Number.parseInt(amount),
        currency: "INR",
    }
    let x = await instance.orders.create(options)

    const safeName    = paymentform && paymentform.name    ? paymentform.name    : "Anonymous"
    const safeMessage = paymentform && paymentform.message ? paymentform.message : ""

    // Normalize to_user to lowercase so queries stay consistent
    await Payment.create({
        oid:     x.id,
        to_user: normalizedUsername,
        amount:  Number.parseInt(amount),
        name:    safeName,
        message: safeMessage,
        done:    false
    })
    return x
}

export const fetchuser = async (username) => {
    await connectDb()
    if (!username) return {}
    const normalizedUsername = decodeURIComponent(username).toLowerCase()
    const user = await User.findOne({ username: normalizedUsername }).lean()
    if (!user) return {}
    const safe = { ...user }
    if (safe._id)       safe._id       = String(safe._id)
    if (safe.createdAt instanceof Date) safe.createdAt = safe.createdAt.toISOString()
    if (safe.updatedAt instanceof Date) safe.updatedAt = safe.updatedAt.toISOString()
    return safe
}

export const fetchpayments = async (username) => {
    await connectDb()
    if (!username) return []
    const normalizedUsername = decodeURIComponent(username).toLowerCase()
    const payments = await Payment.find({
        to_user: normalizedUsername,
        done:    true
    }).sort({ amount: -1 }).limit(10).lean()

    if (!payments) return []
    const safePayments = payments.map(p => {
        const s = { ...p }
        if (s._id)       s._id       = String(s._id)
        if (s.createdAt instanceof Date) s.createdAt = s.createdAt.toISOString()
        if (s.updatedAt instanceof Date) s.updatedAt = s.updatedAt.toISOString()
        return s
    })
    return safePayments
}

export const updateProfile = async (formData, username) => {
    await connectDb()
    const data = Object.fromEntries(formData)
    // Do not allow the user to change their username key here (it's the lookup key)
    const { username: _ignore, ...rest } = data
    const update = { ...rest, updatedAt: new Date() }
    await User.updateOne(
        { username: username.toLowerCase() },
        { $set: update },
        { upsert: false }
    )
    return { ok: true }
}