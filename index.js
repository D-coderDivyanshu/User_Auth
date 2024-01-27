const express = require("express");
const app = express();

// 'bcrypt' is a module use for encryption and authentication of passwords 
// It hashes passwords with hashed value and salts
// Salts is used to make hashed password more unique so that same passwords have different hashed passwords
const bcrypt = require("bcrypt");
app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
    res.json(users);
});

app.post("/users", async (req, res) => {
    try {
        const hashedpassword = await bcrypt.hash(req.body.password, 10);
        const user = { name: req.body.name, password: hashedpassword };
        users.push(user);
        console.log(hashedpassword);
        // 201 is used to state 'created'
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/users/login", async (req, res) => {
    const user = users.find((user) => user.name === req.body.name);
    if (user == null) {
        return res.status(400).send("User not found");
    }
    try {

        // comparing the hashed password's equivalent string password to the password coming from user's request 
        if (await bcrypt.compare(req.body.password, user.password)) {
            return res.status(200).send("Successful login");
        } else {
            return res.status(401).send("Username and Password combination is wrong!");
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

console.log("Server is listening on 5000 .....");
app.listen(5000);
