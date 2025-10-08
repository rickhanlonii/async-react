import express from "express";
const app = express();
const port = 8080;

import * as fakeData from "@/data/fake-data.js";

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.get("/lessons", async (req, res) => {
  const tab = req.query.tab;
  const search = req.query.q;
  await fakeData
    .getLessons(tab, search, req.query.delay || 0)
    .then((lessons) => {
      res.send(JSON.stringify(lessons));
    });
});

app.post("/lesson/:id/toggle", async (req, res) => {
  await fakeData
    .postLessonToggle(req.params.id, req.query.delay || 0)
    .then(() => {
      res.send(JSON.stringify({ status: "ok" }));
    });
});

app.post("/login", async (req, res) => {
  await fakeData.postLogin(req.query.delay || 0).then(() => {
    res.send(JSON.stringify({ status: "ok" }));
  });
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
