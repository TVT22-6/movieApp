const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "upload/" });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  addReview,
  getReview,
  getAll,
  getAllByMovie,
} = require("../postgre/Review");
const { addUser, getUsers, checkUser } = require("../postgre/user");

/**
 * User root get mapping
 */
router.get("/", async (req, res) => {
  try {
    res.json(await getUsers());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//User root post mapping. Supports urlencoded and multer
router.post("/register", upload.none(), async (req, res) => {
  const uname = req.body.uname;
  let pw = req.body.pw;

  pw = await bcrypt.hash(pw, 10);

  try {
    await addUser(uname, pw);
    res.end();
  } catch (error) {
    console.log(error);
    res.json({ error: error.message }).status(500);
  }
});

router.post("/login", upload.none(), async (req, res) => {
  const uname = req.body.uname;
  let pw = req.body.pw;

  const pwHash = await checkUser(uname);

  if (pwHash) {
    const isCorrect = await bcrypt.compare(pw, pwHash);
    if (isCorrect) {
      const token = jwt.sign({ username: uname }, process.env.JWT_SECRET_KEY);
      res.status(200).json({ jwtToken: token });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  } else {
    res.status(401).json({ error: "Customer not found" });
  }
});

router.post("/addReview", upload.none(), async (req, res) => {
  try {
    const userVS = req.body.userVS;
    const mname = req.body.mname;
    const date = req.body.date;
    const content = req.body.content;
    const genre = req.body.genre;

    if (!mname) {
      return res.status(400).json({ error: "Movie name (mname) is required." });
    }

    // Save the review to the database
    await addReview(mname, genre, date, content, userVS);

    // Respond with a success message
    res
      .status(201)
      .json({ message: "Review successfully posted to the database" });
  } catch (error) {
    // Handle errors
    console.error("Error posting review to the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getReview", async (req, res) => {
  try {
    // Assuming YourDatabaseModel.find() returns all reviews
    const reviews = await getReview();

    // Respond with the retrieved reviews
    res.status(200).json({ reviews });
  } catch (error) {
    // Handle errors
    console.error("Error fetching reviews from the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getAllByMovie", async (req, res) => {
  try {
    const moviename = req.query.moviename;

    console.log("Received request with query parameters:", req.query); // Log all query parameters
    console.log("Extracted moviename:", moviename); // Log the extracted moviename

    if (!moviename) {
      return res
        .status(400)
        .json({ error: "Movie name (moviename) is required." });
    }

    const reviewsByMovie = await getAllByMovie(moviename);

    // Respond with the retrieved reviews
    res.status(200).json({ reviewsByMovie });
  } catch (error) {
    // Handle errors
    console.error("Error fetching reviews from the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    // Assuming YourDatabaseModel.find() returns all reviews
    const reviewsAll = await getAll();

    res.status(200).json({ reviewsAll });
  } catch (error) {
    // Handle errors
    console.error("Error fetching reviews from the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/private", async (req, res) => {
  //Authorization: Bearer token
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const username = jwt.verify(token, process.env.JWT_SECRET_KEY).username;
    res.status(200).json({ private: "This is private for " + username });
  } catch (error) {
    res.status(403).json({ error: "Access forbidden" });
  }
});

module.exports = router;
