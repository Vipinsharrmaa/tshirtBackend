const category = require("../models/category");
const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err) {
      res.status(400).json({
        err: "Category not found in DB",
      });
    }
    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);

  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        err: "Category did not saved in DB.",
      });
    }
    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        err: "No category found in DB",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  
  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        err: "Category updation failed. ",
      });
    }
    res.json(updatedCategory); // TODO: May be it will come as an object.
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
console.log(category); 
  category.deleteOne((err, removedCategory) => {
    if (err) {
      return res.status(400).json({
        err: "Failed to remove this category",
      });
    }
    res.json({
      message: `succesfully deleted ${removedCategory}. `,
    });
  });
};
