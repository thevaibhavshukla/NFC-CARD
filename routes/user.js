const { Router } = require("express");
const User = require("../models/user");
const { createTokenForUser } = require("../services/authentication");
const multer = require("multer");
const path = require("path");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/login", (req, res) => {
  return res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    // const user = await User.findOne(email);

    // console.log(token)
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("login", {
      error: "Incorrect Email or Password",
    });
  }
});





router.get("/register", (req, res) => {
  return res.render("register");
});

router.post("/register", upload.single("profileImage"), async (req, res) => {
  // console.log("control reached here")
  const { fullName, email, password } = req.body;
  // console.log(req.file.filename)
  const user = await User.create({
    fullName,
    email,
    password,
    profileImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/user/${user._id}`);
});

// router.post("/", upload.single("coverImage"), async (req, res) => {
//   const { title, body } = req.body;
//   const blog = await Blog.create({
//     body,
//     title,
//     createdBy: req.user._id,
//     coverImageURL: `/uploads/${req.file.filename}`,
//   });
//   return res.redirect(`/blog/${blog._id}`);
// });







router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});






router.get("/:id", async (req, res) => {
  // const blog = await Blog.findById(req.params.id).populate("createdBy");
  // const comments = await Comment.find({ blogId: req.params.id }).populate(
  //   "createdBy"
  // );

  const user = await User.findById(req.params.id);
  // console.log(user)

  try {
    const token = createTokenForUser(user);

    // console.log(token)
    return res.cookie("token", token).render("profile",{user : user});
  } catch (error) {
    return res.render("login", {
      error: "Incorrect Email or Password",
    });
  }

  // return res.render("profile", {
  //   user: req.user,
  //   // blog,
  //   // comments,
  // });
});






module.exports = router;
