const express = require("express");
const app = express();
const User = require("./models/user");
app.use(express.json());

//sign-Up API
app.post("/signUp", async (req, res) => {
  try {
    const { firstName, lastName, email, gender, password } = req.body;
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      gender: gender,
    });

    await user.save();
    res.send("User created");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});

//get-User by Email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const users = await User.findOne({ email: userEmail });

    if (users === 0) {
      res.send(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.send(400).send("somthing went wrong...");
  }
});

//get-all user

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(401).send("somting went wrong...");
  }
});

//Delete User by id

app.delete("/deleteUser", async (req, res) => {
  const userId = req.body.userId;
  try {
    const users = await User.findByIdAndDelete(userId);
    res.send(users);
  } catch (error) {
    console.log(error.message);

    res.status(404).send("somthing went wrong...");
  }
});

//UpdateUser by id

app.patch("/user", async (req, res) => {
  const id = req.body.id;
  const data = req.body;
  try {
    await User.findByIdAndUpdate(id, data);
    res.send("user Updated");
  } catch (error) {
     res.status(404).send("user is not updated...");
  }
});

module.exports = app;
