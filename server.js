const express = require("express");
const connectDB = require("./config/db");
const app = express();

//connect mongo database
connectDB();

//Init Middleware

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));

//Define Route

app.use("/api/users", require("./routes/api/user_route"));
app.use("/api/auth", require("./routes/api/auth_route"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/post"));

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
