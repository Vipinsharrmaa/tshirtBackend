const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          err: "No user found",
        });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        err: "Unable to save order.",
      });
    }
    res.json(order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "name _id")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          err: "No Order Found in DB.",
        });
      }
      res.json(order);
    });
};

exports.getOrderStatus = (req, res) => {
  return res.json(Order.schema.path("status").enumValues);
};
exports.updateStatus = () => {
  
  Order.findOneAndUpdate(
    { _id: req.body.OrderId },
    { $set: { status: req.body.status } },
    (err, updatedOrderStatus) => {
      if (err) {
        return res.json({
          error: "cannot update order status",
        });
      }
      res.json(updatedOrderStatus);
    }
  );
};
