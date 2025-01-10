const functions = require('@google-cloud/functions-framework');
const stripe = require("stripe")("sk_test_REPLACEME");
const {initializeApp, cert} = require("firebase-admin/app")
const {getFirestore} = require("firebase-admin/firestore")

const serviceAccount = require("./serviceAccountKey.json")

initializeApp({
  credential: cert(serviceAccount)
})

function generateReferralCouponCode(uid) {
  const timestamp = Date.now().toString(36)
  return `REFERRAL-${uid.substring(0, 4).toUpperCase()}-${timestamp}`
}

functions.http('createCoupon', async (req, res) => {
  
  const { uid } = req.body
  const db = getFirestore()

  try {
    const referralCode = generateReferralCouponCode(uid)

    const coupon = await stripe.coupons.create({
      id: referralCode,
      percent_off: 10, //10% off
      duration: "forever",
      metadata: { uid }
    });

    await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: referralCode,
      metadata: {uid}
    });

    await db.collection('users').doc(uid).set({
      referralCode
    }, {merge: true})

  }catch(err) {
    res.status(500).send({success: false, error: err.message})
  }
  
});
