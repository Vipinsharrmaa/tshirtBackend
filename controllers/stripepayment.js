const stripe = require('stripe')('sk_test_51Ms0NzSImqnPZiuZUFXuHgeLZDhmjeXICyxoEN2v6rlHPzTteJNcAVtvqQLi9ZlnIgZFYyYVEZH9a04wHqI15OKu00gxNs7Syx');
const { v4: uuidv4 } = require('uuid'); 

exports.makePayment = (req, res) => {
  const { products, token } = req.body;

  console.log("products", products);

  let amount = 0;
  products.map((p) => {
    amount += p.price;
  });
console.log(amount); 
  const idempotencyKey = uuidv4();
  

  return stripe.customers.create({
    email: token.email,
    source: token.id
  }).then(customer => {
    stripe.charges.create({
      amount: amount,
      customer: customer.id,
      receipt_email: token.email,
      currency: 'usd',
      description: "A test account",
      shipping: {
        name: token.card.name,
        address: {
          line1: token.card.address_line1,
          line2: token.card.address_line2,
          city: token.card.address_city,
          country: token.card.address_country,
          postal_code: token.card.address_zip
        }
      }

    }, { idempotencyKey })
      .then(result => res.status(200).json(result))
      .catch(err => console.log(err));
  })
}

