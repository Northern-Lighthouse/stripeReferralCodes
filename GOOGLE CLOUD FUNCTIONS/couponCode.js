const functions = require('@google-cloud/functions-framework');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const stripe = require('stripe')('sk_test_REPLACEME');

var serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore()

function generateReferralCode(uid) {
    const timeStamp = Date.now().toString(36).toUpperCase() //converts timestamp to base36
    return `REFERRAL-${uid.substring(0,4).toUpperCase()}-${timeStamp}`
}

functions.http('referral', async (req, res) => {
   
    const { uid } = req.body
    const amountChange = 25

    try {

        const referralCode = generateReferralCode(uid)

        // create a coupon
        const coupon = await stripe.coupons.create({
            id: referralCode,
            percent_off: 10,
            duration: 'forever',
            metadata: { uid, amountChange }
        })

        // create promo code
        await stripe.promotionCodes.create({
            coupon: coupon.id,
            code: referralCode,
            metadata: { uid, amountChange }
        })

        await db.collection('users').doc(uid).set({
            referralCode
        }, {merge: true})

    } catch(err) {

        console.log(err)
    }

});
