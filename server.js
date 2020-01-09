const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

//Allow CORS via middleware
app.use(function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get("/dist/bundle.js", (req, res) => {
	res.sendFile(path.join(__dirname, "dist", "bundle.js"));
});

app.get("/bundle.js", (req, res) => {
	res.sendFile(path.join(__dirname, "dist", "bundle.js"));
});

app.get("/translations/:name", (req, res) => {
	res.sendFile(__dirname + "/dist/translations/" + req.params.name);
});

app.get("/img/:name", (req, res) => {
  res.sendFile(__dirname + "/dist/img/" + req.params.name);
});

app.get("/", function(req, res) {
	res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("*", function(req, res) { //redirects to root page on all other requests
	res.redirect("/");
});

app.listen(port, () => {
	console.log(`Running app on Port ${port}`)
});
