const express = require("express");
const app = express();
const User = require("./models/user");
app.use(express.json());

//sign-Up API
app.post("/signUp", async (req, res) => {
  try {
    const { firstName, lastName, email, gender, password, skills, age } =
      req.body;
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      gender: gender,
      skills: "",
      age: "",
    });

    await user.save();
    res.send("User created");
  } catch (error) {
    console.log(error);
    res.status(500).send("there is some essu" + error.message);
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

app.patch("/user/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const validDataToUpdate = ["skills", "profileImg", "bio"];
    const isValid = Object.keys(data).every((k) =>
      validDataToUpdate.includes(k)
    );
    if (!isValid) {
      throw new Error(" this field are not allow to update");
    }
    if (data.skills.length > 10) {
      throw new Error(" skills must be less than 10");
    }
    await User.findByIdAndUpdate(id, data);
    res.send("user Updated");
  } catch (error) {
    res.status(404).send("there is some essue" + error.message);
  }
});

module.exports = app;
