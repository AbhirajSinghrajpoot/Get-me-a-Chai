"use server"

import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDb from "@/db/connectDb"
import User from "@/models/User"


export const initiate = async (amount, to_username, paymentform) => {
    await connectDb()
    var instance = new Razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET })
    let options = {
        amount: Number.parseInt(amount), 
        currency: "INR",
    }
    let x = await instance.orders.create(options)

    // create a payment object which shows a pending payment in the database

    await Payment.create({ oid: x.id, to_user: to_username, amount: amount, name: paymentform.name, message: paymentform.message, done: false })
    return x
}

export const fetchuser = async (username) => {
    await connectDb()
    // Support both `Username` (schema) and `username` (sessions/UI) keys
    const user = await User.findOne({ $or: [{ Username: username }, { username: username }] }).lean()
    return user || {}
}

export const fetchpayments = async (username) => {
    await connectDb()
    const payments = await Payment.find({ to_user: username, done: true }).sort({ createdAt: -1 }).limit(10).lean()
    return payments || []
}

export const updateProfile = async (formData, username) => {
    await connectDb()
    const data = Object.fromEntries(formData)
    // Normalize: store under `Username` to match schema, keep other editable fields
    const update = { ...data, Username: data.username || username, updatedAt: new Date() }
    await User.updateOne({ $or: [{ Username: username }, { username: username }] }, { $set: update }, { upsert: false })
    return { ok: true }
}