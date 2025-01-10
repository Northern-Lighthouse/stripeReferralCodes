const functions = require('@google-cloud/functions-framework');
const stripe = require("stripe")("sk_test_REPLACEME");
const {initializeApp, cert} = require("firebase-admin/app")
const {getFirestore, FieldValue} = require("firebase-admin/firestore")

const serviceAccount = require("./serviceAccountKey.json")

initializeApp({
  credential: cert(serviceAccount)
})

functions.http('stripeWeb', (req, res) => {

    const sig = req.headers['stripe-signature'];
    const payLoad = req.rawBody
    const endpointSecret = "whsec_REPLACEME"

    const db = getFirestore()

    let event;

    try {
        event = stripe.webhooks.constructEvent(payLoad, sig, endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

     // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        const sessionId = checkoutSessionCompleted.id;
        const paymentStatus = checkoutSessionCompleted.payment_status
        const uid = checkoutSessionCompleted.client_reference_id


        stripe.checkout.sessions.listLineItems(sessionId, async function(err, lineItems) {
            try {
                const lineItem = lineItems.data[0]
                const productId = lineItem.price.product
                var moreMoney = 0

                if(paymentStatus == "paid") {

                    const fullSession = await stripe.checkout.sessions.retrieve(sessionId, {
                        expand: ["total_details.breakdown"]
                    })

                    switch(productId) {
                        case "prod_RXrBdp28UKKLvm":
                            moreMoney += 50
                            break;
                        case "prod_RXrCKnAmsY9f0y":
                            moreMoney += 1000
                            break;
                        case "prod_RXrCEyY9Ptsvmu":
                            moreMoney += 20000 //20,000
                            break;
                        case "prod_RXrDNhDKY7M8Wh":
                            moreMoney += 500000 //500,000
                            break;
                        default:
                            moreMoney += 0
                            break;
                    }

                    if(fullSession.total_details.breakdown.discounts.length > 0) {
                        const discount = fullSession.total_details.breakdown.discounts[0]
                        const coupon = discount.discount.coupon
                        const userBuid = coupon.metadata.uid
                        
                        if(userBuid) {
                            db.collection('users').doc(userBuid).update({
                                money: FieldValue.increment(Math.floor(0.15*moreMoney))
                            }).then(() =>{
                                res.status(200).send(`User B Document Successfully Updated`);
                            }).catch((err) => {
                                res.status(400).send(`User B Document Update Error: ${err.message}`);
                            })
                        }
                        
                    }

                    // update user
                    db.collection('users').doc(uid).update({
                        money: FieldValue.increment(moreMoney)
                    }).then(() =>{
                        res.status(200).send(`Document Successfully Updated`);
                    }).catch((err) => {
                        res.status(400).send(`Document Update Error: ${err.message}`);
                    })
                }

            } catch(err) {
              res.status(400).send(`LineItem Error: ${err.message}`);
            }
        })
        // Then define and call a function to handle the event checkout.session.completed
        break;
        // ... handle other event types
        default:
        console.log(`Unhandled event type ${event.type}`);
    }

  
});
