
const crypto = require('crypto');

exports.validateRazorpayWebhook = (req, res, next) => {
  const secret = '7290938999'; 
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).json({ message: 'Invalid webhook signature' });
  }

  req.razorpayPayload = req.body;
  next();

};
