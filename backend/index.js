const express  = require("express");
const cors = require("cors");
const app = express();
const contentRoutes = require("./routes/content.Routes");

app.use(cors());
app.use(express.json());

app.use("/content", contentRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the CMS API");
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
