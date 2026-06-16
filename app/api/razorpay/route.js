import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/models/Payment";
import Razorpay from "razorpay";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export const POST = async (req) => {
    await connectDb()
    let body = await req.formData()
    body = Object.fromEntries(body)

    // Check if razorpayOrderId is present on the server
    let p = await Payment.findOne({oid: body.razorpay_order_id})
    if(!p){
        return NextResponse.json({success: false, message:"Order Id not found"})
    }

    // fetch the secret of the user who is getting the payment 
    // Ensure p.to_user exists and the user record is present
    if (!p.to_user) {
        return NextResponse.json({ success: false, message: 'Payment record has no recipient' }, { status: 400 })
    }
    let user = await User.findOne({ username: p.to_user })
    if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }
    // Fall back to platform secret if creator hasn't set their own
    const secret = user.razorpaysecret || process.env.KEY_SECRET

    // Verify the payment
    let xx = validatePaymentVerification({"order_id": body.razorpay_order_id, "payment_id": body.razorpay_payment_id}, body.razorpay_signature, secret)

    if(xx){
        // Update the payment status (boolean true)
        const updatedPayment = await Payment.findOneAndUpdate(
          { oid: body.razorpay_order_id },
          { $set: { done: true } },
          { new: true }
        )
        if (updatedPayment) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${updatedPayment.to_user}?paymentdone=true`, { status: 302 })
        }
        return NextResponse.json({ success: false, message: 'Payment verified but record not found' })
    }

    else{
        return NextResponse.json({success: false, message:"Payment Verification Failed"})
    }

}

// Handle browser GETs to the callback URL (some flows redirect the user with GET)
export const GET = async (req) => {
    try {
        await connectDb()
        const url = new URL(req.url)
        const orderId = url.searchParams.get('razorpay_order_id') || url.searchParams.get('order_id')
        if (orderId) {
            const p = await Payment.findOne({ oid: orderId })
            if (p) {
                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${p.to_user}?paymentdone=true`)
            }
        }
        // Fallback: redirect to home
        return NextResponse.redirect(process.env.NEXT_PUBLIC_URL || '/')
    } catch (err) {
        return NextResponse.redirect(process.env.NEXT_PUBLIC_URL || '/')
    }
}