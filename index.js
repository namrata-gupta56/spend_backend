const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const app = express();
app.use(cors());
mongoose
  .connect(
    "mongodb+srv://ng8238:YkOaUlCo1LPAUkSo@cluster0.ofuy8a4.mongodb.net/backend",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process if the connection fails
  });

const storage = multer.memoryStorage(); // Using memory storage for simplicity
const upload = multer({ storage: storage });

const inventorySchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  quantity: Number,
  unitPrice: Number,
  manufacturer: String,
  weight: Number,
  storageLocation: String,
  room: String,
  shelf: Number,
  img: {
    data: Buffer,
    contentType: String,
  },
});

const Inventory = mongoose.model("Inventory", inventorySchema);

app.post("/api/submit", upload.single("img"), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      quantity,
      unitPrice,
      manufacturer,
      weight,
      storageLocation,
      room,
      shelf,
    } = req.body;

    const img = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    const newInventory = new Inventory({
      name,
      description,
      category,
      quantity,
      unitPrice,
      manufacturer,
      weight,
      storageLocation,
      room,
      shelf,
      img,
    });

    await newInventory.save();

    res.status(201).json({ message: "Form data submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ... (other routes)

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
