const express = require("express");
const authenticate = require("../middleware/middleware");
const { createGroup, getMyGroups, deleteGroup } = require("../controllers/groupController");

const groupRouter = express.Router();

groupRouter.post("/create", authenticate, createGroup);
groupRouter.get("/my-groups", authenticate, getMyGroups);
groupRouter.delete("/:id", authenticate, deleteGroup);

module.exports = groupRouter;
