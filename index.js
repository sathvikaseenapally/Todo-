const express = require("express");
const bodyParser = require("body-parser");

var app = express();
app.set("view engine","ejs")
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/todo", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

const trySchema = new mongoose.Schema({
    name: String
});
const item = mongoose.model("Task",trySchema)


app.get("/", async function(req, res) {
    try {
        const foundItems = await item.find({});
        res.render("list", { ejes: foundItems });
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

app.post("/",function(req,res){
    const itemName = req.body.ele1;
    const todo = new item({
        name: itemName
    });
    todo.save();
    res.redirect("/");
});

app.post("/delete", function(req, res) {
    console.log(req.body); // Debug
    const checked = req.body.checkbox1;
    item.findByIdAndDelete(checked)
        .then(() => {
            console.log("Deleted");
            res.redirect("/");
        })
        .catch(err => {
            console.log("Error deleting:", err);
            res.status(500).send("Delete failed");
        });
});

const port = process.env.PORT || 3500;

app.listen(port, function() {
    console.log("Server started on port " + port);
});


