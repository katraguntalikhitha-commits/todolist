const express = require("express");

const {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
} = require("../controllers/todoController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getTodos);

router.get("/:id", protect, getTodo);

router.post("/", protect, createTodo);

router.put("/:id", protect, updateTodo);

router.delete("/:id", protect, deleteTodo);

module.exports = router;