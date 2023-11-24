const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "upload/" });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { addPersonalLink, getPersonalLinksByUser } = require("../postgre/personalPage");
const {
  addReview,
  getReview,
  getAllByMovie,
  getAll,
} = require("../postgre/Review");
const { addUser, getUsers, checkUser, delUser, updateUserPassword } = require("../postgre/user");


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

//
//Userin liittyvää koodia alapuolella
//
//

//User root post mapping. Supports urlencoded and multer
router.post("/register", upload.none(), async (req, res) => {
  const uname = req.body.uname;
  const pw = req.body.pw;

  try {
    // Check if the username already exists
    const userExists = await checkUser(uname);
    if (userExists) {
      // If the username is taken, send a 409 Conflict response
      return res.status(409).json({ error: "Username already exists" });
    }

    // If the username is not taken, hash the password
    const hashedPw = await bcrypt.hash(pw, 10);

    // Add the new user to the database
    await addUser(uname, hashedPw);
    // Send a 201 Created response
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Log the error and send a 500 Internal Server Error response
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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


//Middlewaree, joka tarkistaa tokenin oikeellisuuden. Käytetään esim. delete ja change-password metodissa
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
      return res.status(401).send("Access denied. No token provided.");
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded; // Add the decoded user to the request
      next(); // Proceed to the next middleware or route handler
  } catch (error) {
      res.status(403).send("Invalid token.");
  }
}

router.put("/change-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const uname = req.user.username; 

  //console.log("Request Body:", req.body);
  //console.log("Current Password:", currentPassword); // Log current password
  //  console.log("Username from token:", uname); // Log username extracted from token

  try {
      const pwHash = await checkUser(uname);
     // console.log("Current Password:", currentPassword);  // Log current password
    //  console.log("Password Hash from DB:", pwHash);      // Log password hash from DB

      if (pwHash && await bcrypt.compare(currentPassword, pwHash)) {
          const newPwHash = await bcrypt.hash(newPassword, 10);
          await updateUserPassword(uname, newPwHash);
          res.json({ message: "Password changed successfully" });
      } else {
          res.status(401).json({ error: "Invalid current password" });
      }
  } catch (error) {
      console.error('Error in changing password:', error);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

//Delete muokkaukset myös user.js kansiossa
router.delete("/delete", authenticateToken, async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
 // console.log("Received token in backend:", token);

  if (!token) {
    return res.status(401).send("Access denied on backend. No token provided.");
}

  try {
      // Verify the token and extract the username
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const uname = decoded.username; // Assuming the username is part of the token payload

      await delUser(uname);
      res.send("User deleted successfully");
  } catch (error) {
      console.log(error);
      res.status(500).json({error: error.message});
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


//Remember to check this
const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const response = await fetch("http://localhost:3001/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        uname: username,
        pw: pw,
      }),
    });

    const data = await response.json();
    console.log(data);
    // Handle response here
  } catch (error) {
    console.error("Error:", error);
    // Handle error here
  }
};

//
//personal page liittyvää koodia alapuolella
//

// Route to add a personal link
router.post("/addLink", authenticateToken, async (req, res) => {
  console.log("addLink route hit"); // Check if this logs when you make the request
  const { linkName, personalLink, shareable } = req.body;
  console.log("Received data:", req.body); // Log to check the received data

  const username = req.user.username; // Use authenticated user's username from the token

  try {
    const newLink = await addPersonalLink(username, linkName, personalLink, shareable === 'true');
    res.status(201).json(newLink);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Route to get all personal links for the authenticated user
router.get("/getLinks", authenticateToken, async (req, res) => {
  const userid = req.user.id; // Use authenticated user's id from the token

  try {
    const links = await getPersonalLinksByUser(userid);
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});


//
//Review pageen liittyvät metodit alapuolella
//
//
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



module.exports = router;
