import stripe from 'stripe'
import Booking from '../models/Booking.js'
// API to handle stripe webhooks

export const stripeWebhooks = async (req, res) => {
    // Stripe Gateway Initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
    const sig = req.headers['stripe-signature']
    let event;

    try{
        event = stripeInstance.webhooks.constructEvent(req.body,sig,process.env.STRIPE_WEBHOOK_KEY)
    }catch(error){
        res.status(400).send(`Webhook Error: ${error.message}`)
    }


    // handle the event
    if(event.type === 'payment_intent.successed'){
        const paymentIntent = event.data.object;
        const paymenIntentId = paymentIntent.id;

        // Getting session Metadata
        const session = await stripeInstance.checkout.sessions.list({
            payment_intent: paymenIntentId,
        })

        const { bookingId } = session.data[0].metadata;
        // Mark payment as true

        await Booking.findByIdAndUpdate(bookingId, {isPaid : true, paymentMethod: "Stripe"})

    }else{
        console.log("Unhandled event type : ", event.type)
    }
    res.json({received: true})
}