const Product = require("../models/product");
const { formidable } = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { sortBy } = require("lodash");
const product = require("../models/product");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err) {
      res.status(400).json({
        err: "Product not found",
      });
    }
    req.product = product;
    next();
  });
};


// Create controller
exports.createProduct = (req, res) => {
  //
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        msg: "Some error in Image.",
      });
    }

    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    // TODO: restriction on fields.
    let product = new Product(fields);

    //handle file here.

    if (file.photo) {
      if (file.photo.size > 100000) {
        return res.status(400).json({
          msg: "Image size is too big.",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // Save to database
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          msg: "Cannot save in Database.",
        });
      }

      res.json(product);
    });
  });
};


// Read controllers
exports.getProduct = (req, res) => {

  req.product.photo = undefined;
  return res.json(req.product);
};

// Read middleware
exports.photo = (req, res, next) => {

  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
};

// update
exports.updateProduct = (req, res) => {
  //
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        msg: "Some error in Image.",
      });
    }

    // updation
    let product = req.product;
    product = _.extend(product, fields);

    //handle file here.
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          msg: "Image size is too big.",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // Save to database
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          msg: "Updation failed.",
        });
      }

      res.json(product);
    });
  });
};

// Delete Controller
exports.deleteProduct = (req, res) => {
  let product = req.product;

  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Unable to delete product in database.",
      });
    }
    res.json({
      msg: "Product deleted",
      deletedProduct,
    });
  });
};

// listing
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({ error: "No product found" });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "No category found.",
      });
    }
    res.json(categories);
  });
};

// middlewares for Inventory or Stock
exports.updateStock = (req, res, next) => {
  let myOperation = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperation, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk Operation Failed.",
      });
    }
    next();
  });
};
