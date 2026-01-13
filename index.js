const dotenv = require('dotenv');

dotenv.config();
const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contact');

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
