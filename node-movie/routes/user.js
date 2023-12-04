const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "upload/" });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  addPersonalLink,
  getPersonalLinksByUser,
  deletePersonalLink,
  getUserLinks,
} = require("../postgre/personalPage");
const {
  addReview,
  getReview,
  getAllByMovie,
  getAll,
  getUserReview,
} = require("../postgre/Review");

const {
  addUser,
  getUsers,
  checkUser,
  delUser,
  updateUserPassword,
  getSpecificUsers,
  getUser,
} = require("../postgre/user");
const {
  addGroup,
  deleteGroup,
  getAllGroups,
  joinGroup,
  getGroup,
  getCreatedGroup,
  getDeletedGroup,
} = require("../postgre/group");
const { response } = require("express");

const { addActorReview } = require("../postgre/actorReview");

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

//Get user
router.get("/getUser/:username", async (req, res) => {
  console.log("getUser route hit"); // Check if this logs when you make the request
  const username = req.params.username;
  console.log("username:", username);

  try {
    const user = await getUser(username); // Updated this line
    if (user) {
      console.log("user:", user);

      res.status(200).json({ user }); // Updated this line
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user from the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Specific Users

router.get("/getSpecificUsers/:username", async (req, res) => {
  console.log("getSpecificUsers route hit"); // Check if this logs when you make the request
  const username = req.params.username;
  console.log("username:", username);

  try {
    const users = await getSpecificUsers(username); // Updated this line
    console.log("users:", users);

    res.status(200).json({ users }); // Updated this line
  } catch (error) {
    console.error("Error fetching users from the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/register", upload.none(), async (req, res) => {
  const uname = req.body.uname;
  const pw = req.body.pw;

  try {
    // Check for empty username or password
    if (!uname || !pw) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Basic password strength validation
    if (pw.length < 3) { // Example condition: password length at least 6 characters
      return res.status(422).json({ error: "Password is too weak" });
    }

    // Check if the username already exists
    const userExists = await checkUser(uname);
    if (userExists) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPw = await bcrypt.hash(pw, 10);
    await addUser(uname, hashedPw);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
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
  //console.log("Request Headers:", req.headers);
  //console.log("Middleware token:", token);
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  // console.log("Middleware token ennen decodea:", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Add the decoded user to the request
    // console.log("Middleware onko decoded:", decoded);
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(403).send("Invalid token.");
    //console.log("Middleware end onko token täällä:", token);
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

    if (pwHash && (await bcrypt.compare(currentPassword, pwHash))) {
      const newPwHash = await bcrypt.hash(newPassword, 10);
      await updateUserPassword(uname, newPwHash);
      res.json({ message: "Password changed successfully" });
    } else {
      res.status(401).json({ error: "Invalid current password" });
    }
  } catch (error) {
    console.error("Error in changing password:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
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
    res.status(500).json({ error: error.message });
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

//Get user links
router.get("/getUserLinks/:username", async (req, res) => {
  console.log("getUserLinks route hit"); // Check if this logs when you make the request
  const username = req.params.username;
  console.log("username:", username);

  try {
    const userLinks = await getUserLinks(username); // Updated this line
    console.log("userLinks:", userLinks);

    res.status(200).json({ userLinks }); // Updated this line
  } catch (error) {
    console.error("Error fetching user links from the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to add a personal link
router.post("/addLink", authenticateToken, async (req, res) => {
  console.log("addLink route hit"); // Check if this logs when you make the request
  const { linkName, personalLink } = req.body;
  console.log("Received data:", req.body); // Log to check the received data

  const username = req.user.username; // Use authenticated user's username from the token

  try {
    const newLink = await addPersonalLink(username, linkName, personalLink);
    res.status(201).json(newLink);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Route to get all personal links for the authenticated user
router.get("/getLinks", authenticateToken, async (req, res) => {
  const username = req.user.username; // Use authenticated user's username from the token

  try {
    const links = await getPersonalLinksByUser(username);
    console.log(links); // Log to check the retrieved links
    res.status(200).json(links);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

router.delete(
  "/deleteLink/:personalpageid",
  authenticateToken,
  async (req, res) => {
    console.log("Delete route hit. Params:", req.params); // Log to check the parameters
    const { personalpageid } = req.params;
    const username = req.user.username; // Extracted from the JWT token

    try {
      await deletePersonalLink(username, personalpageid);
      res.status(200).json({ message: "Link deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  }
);

//
//Review pageen liittyvät metodit alapuolella
//
//

router.post(
  "/addReview",
  authenticateToken,
  upload.none(),
  async (req, res) => {
    try {
      console.log("req.body", req.body);

      const userVS = req.body.userVS;
      const mname = req.body.mname;
      const date = req.body.date;
      const content = req.body.content;
      const genre = req.body.genre;
      const username = req.user.username;

      console.log(username + "add review backendissä");

      if (!mname) {
        return res
          .status(400)
          .json({ error: "Movie name (mname) is required." });
      }

      // Save the review to the database
      await addReview(mname, genre, date, content, userVS, username);

      // Respond with a success message
      res.status(201).json({
        message: "Review successfully posted to the database in user routes",
      });
    } catch (error) {
      // Handle errors
      console.error("Error posting review to the database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

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

router.get("/getUserReview/:username", async (req, res) => {
  console.log("getUserReview route hit"); // Check if this logs when you make the request
  const username = req.params.username;
  console.log("username reviewissä:", username);
  try {
    const userReviews = await getUserReview(username);
    res.status(200).json({ userReviews });
    console.log("userReviews:", userReviews);
  } catch (error) {
    console.error("Error fetching reviews from the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//
//
//Group pageen liittyvät metodit alapuolella
//
//

// Create Group //user.js
router.post("/postGroup", authenticateToken, async (req, res) => {
  const gname = req.body.gname;

  try {
    const username = req.user.username;

    // Updated the function call to pass both gname and username
    await addGroup(gname, username);

    console.log("Group added:", gname, username);

    res.status(201).json({ message: "Group successfully created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/getDeletedGroup/:groupid", async (req, res) => {
  const groupid = req.params.groupid;

  try {
    await getDeletedGroup(groupid);

    res.status(200).json({ message: "Group successfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/deleteGroup/:groupid", authenticateToken, async (req, res) => {
  const groupid = req.params.groupid;
  const username = req.user.username;

  try {
    // Assuming you have a function to delete a group in your database
    await deleteGroup(groupid, username);
    res.status(200).json({ message: "Group successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/groups", async (req, res) => {
  try {
    const groups = await getAllGroups();
    res.status(200).json({ data: groups });
  } catch (error) {
    console.error("Error fetching groups from the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Group Details
router.get("/group/:groupid", async (req, res) => {
  const groupid = req.params.groupid;

  try {
    // Fetch group details from the database, including group members
    const groupDetails = await getGroupDetails(groupid);

    res.status(200).json({ groupDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Actorpost metodi

router.post(
  "/addActorReview",
  authenticateToken,
  upload.none(),
  async (req, res) => {
    try {
      console.log("req.body", req.body);

      const date = req.body.date;
      const actorname = req.body.actorname;
      const movie = req.body.movie;
      const content = req.body.content;
      const votescore = req.body.votescore;
      const username = req.user.username;

      if (!actorname) {
        return res
          .status(400)
          .json({ error: "actor name (actorname) is required." });
      }

      // Save the review to the database
      await addActorReview(
        date,
        actorname,
        movie,
        content,
        votescore,
        username
      );

      // Respond with a success message
      res.status(201).json({
        message: "Review successfully posted to the database in user routes",
      });
    } catch (error) {
      // Handle errors
      console.error("Error posting review to the database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Join Group
router.post("/joinGroup/:groupid", authenticateToken, async (req, res) => {
  const groupid = req.params.groupid;

  try {
    const username = req.user.username;
    await joinGroup(username, groupid);
    res.status(200).json({ message: "Successfully joined the group" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Specific Group Data
router.get("/getGroup/:groupid", async (req, res) => {
  const groupid = req.params.groupid;

  try {
    // Fetch group details from the database, including group members
    const groupDetails = await getGroup(groupid);

    res.status(200).json({ groupDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getCreatedGroup/:gname", async (req, res) => {
  const gname = req.params.gname;

  try {
    // Fetch group details from the database, including group members
    const groupDetails = await getCreatedGroup(gname);

    console.log("Group details fetched successfully:", groupDetails);

    res.status(200).json(groupDetails);
  } catch (error) {
    console.error("Error fetching group details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router;

module.exports = router;
