const express = require("express");
const Jimp = require("jimp");
const qrCodeReader = require("qrcode-reader");
const app = express();
app.use(express.json());


app.post("/decodeQR", async (req, res) => {
  try {
    if (!req.body.image) {
      return res.status(400).json({ error: "No image uploaded" });
    }
    const image = await Jimp.read(req.body.image);
    const qrCodeInstance = new qrCodeReader();
    qrCodeInstance.callback = function (err, value) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error decoding QR code" });
      }
      res.json({ decodedValue: value.result });
    };
    qrCodeInstance.decode(image.bitmap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
