const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

//Aquiring Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripepayment");

// My DB connections.
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
  console.log("DB CONNECTED");
});

// MiddleWare
app.use(express.json());
app.use(cookieParser());
app.use(cors());


// My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);

//Starting a server.
const port = process.env.PORT || 8000;
app.get("/", (req, res) => res.send("Hello World"));
app.listen(port, () => console.log(`app is running at ${port}`));
