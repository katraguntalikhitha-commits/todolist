const Todo = require("../models/Todo");

const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch todos",
            error: error.message
        });
    }
};

const getTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch todo",
            error: error.message
        });
    }
};

const createTodo = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || title.trim() === "") {
            return res.status(400).json({
                message: "Todo title is required"
            });
        }

        const todo = await Todo.create({
            title: title.trim()
        });

        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create todo",
            error: error.message
        });
    }
};

const updateTodo = async (req, res) => {
    try {
        const { title, completed } = req.body;

        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            {
                title,
                completed
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update todo",
            error: error.message
        });
    }
};

const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete todo",
            error: error.message
        });
    }
};

module.exports = {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
};