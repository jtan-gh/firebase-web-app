const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { admin, signin } = require("../firebase/firebase");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  
}))

const authenticate = async (req, res, next) => {
  console.log("req.cookies", req.cookies);
  const idToken = req.cookies.session;

  if (!idToken) {
    return res.status(403).send("Unauthorized");
  }

  try {
    console.log("idToken", idToken);
    const decodedSessionInfo = await admin.auth().verifyIdToken(idToken);
    console.log("decodedSessionInfo", decodedSessionInfo);
    req.user = decodedSessionInfo;
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("Error verifying ID token:", error);
    res.status(403).send("Unauthorized");
  }
};

app.get("/protected", authenticate, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../html/signout.html"));
});

//routes
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../html/signup.html"));
});

app.get("/signin", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../html/signin.html"));
});

app.get("/signout", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../html/signout.html"));
});

app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().createUser({ email, password });
    res
      .status(201)
      .json({ message: "User created successfully", uid: userRecord.uid });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate with Firebase using the client SDK
    const user = await signin(email, password);
    const idToken = user.idToken;

    res.cookie("session", idToken, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'None' // This might be necessary if you are running on different domains
    });
    res.status(200).send({ message: "User signed in and session created." });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(401).send({ error: "Unauthorized" });
  }
});

app.post("/api/signout", (req, res) => {
  res.clearCookie("session");
  res.status(200).json({ message: "Logout successful!" });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
