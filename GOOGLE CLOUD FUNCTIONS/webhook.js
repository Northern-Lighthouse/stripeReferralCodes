const functions = require('@google-cloud/functions-framework');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const stripe = require('stripe')('sk_test_REPLACEME');

var serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount)
});

functions.http('stripeWeb', async (req, res) => {

  const db = getFirestore();
  const endpointSecret = "whsec_REPLACEME";
  const sig = req.headers['stripe-signature'];
  const payLoad = req.rawBody

  let event;

  try {
    event = stripe.webhooks.constructEvent(payLoad, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'checkout.session.completed':
        const eventData = event.data.object
        const sessionId = eventData.id
        const paymentStatus = eventData.payment_status
        const uid = eventData.client_reference_id

        // referral code logic here
        const fullSession = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['total_details.breakdown'],
        });
        const discounts = fullSession.total_details.breakdown.discounts

        if(paymentStatus === 'paid') {
            //referral code logic here
            if(discounts.length > 0) {
                const metadata = discounts[0].discount.coupon.metadata
                if(metadata != null && metadata.uid != uid) {
                    const userUid = metadata.uid; // Assuming the UID is stored in the
                    const amountChange = Number(metadata.amountChange);
                    // Update referred user
                    db.collection("users").doc(userUid).update({
                        money: FieldValue.increment(amountChange),
                    }).then(() => {
                        console.log(`Updated user with UID: ${userUid}`);
                        // send user an email
                    }).catch((error) => {
                        console.error(`Error updating user with UID: ${userUid}`, error);
                    });
                }
            }


            stripe.checkout.sessions.listLineItems(sessionId, async function(err, lineItems) {
                if (err) {
                  console.error('Error retrieving line items:', err);
                  return;
                } 
                const lineItem = lineItems.data[0]
                const productId = lineItem.price.product
                let amountIncrease = 0
                switch(productId) {
                    case 'prod_REPLACEME':
                        amountIncrease += 50
                        break;
                    case 'prod_REPLACEME':
                        amountIncrease += 1000
                        break;
                    case 'prod_REPLACEME':
                        amountIncrease += 20000 //20,000
                        break;
                    case 'prod_REPLACEME':
                        amountIncrease += 500000 //500,000
                        break;
                    default:
                        console.log(`Unhandled product ID ${productId}`);
                }
                db.collection("users").doc(uid).update({
                    money: FieldValue.increment(amountIncrease),
                }).then(() => {
                    console.log("Document successfully updated!");
                }).catch((error) => {
                // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
                
            })
        }
        break;
    default:
        console.log(`Unhandled event type ${event.type}`);

  }
  
});
