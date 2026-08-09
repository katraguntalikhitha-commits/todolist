// ==========================================
// API URL
// ==========================================

const API_URL = "https://todolist-backend-la5i.onrender.com/api/todos";


// ==========================================
// Get HTML Elements
// ==========================================

const todoInput = document.getElementById("todoInput");
const addTodoBtn = document.getElementById("addTodoBtn");
const todoList = document.getElementById("todoList");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");


// ==========================================
// Load Todos When Page Opens
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    loadTodos();
});


// ==========================================
// Add Todo Button
// ==========================================

addTodoBtn.addEventListener("click", addTodo);


// ==========================================
// Press Enter to Add Todo
// ==========================================

todoInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        addTodo();
    }

});


// ==========================================
// GET ALL TODOS
// ==========================================

async function loadTodos() {

    try {

        loading.style.display = "block";
        errorMessage.textContent = "";

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load todos");
        }

        const todos = await response.json();

        todoList.innerHTML = "";

        loading.style.display = "none";


        // If there are no todos

        if (todos.length === 0) {

            todoList.innerHTML = `
                <li class="empty">
                    No todos yet. Add your first todo! 🎯
                </li>
            `;

            return;
        }


        // Display todos

        todos.forEach(todo => {
            displayTodo(todo);
        });

    }

    catch (error) {

        loading.style.display = "none";

        errorMessage.textContent =
            "Unable to connect to the server.";

        console.error("Error loading todos:", error);
    }

}


// ==========================================
// CREATE TODO
// ==========================================

async function addTodo() {

    const title = todoInput.value.trim();


    // Check empty input

    if (title === "") {

        alert("Please enter a todo!");

        todoInput.focus();

        return;
    }


    try {

        // Disable button while saving

        addTodoBtn.disabled = true;

        addTodoBtn.textContent = "Adding...";


        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: title
            })

        });


        if (!response.ok) {

            throw new Error("Failed to create todo");

        }


        const todo = await response.json();


        // Clear input

        todoInput.value = "";


        // Reload todos

        await loadTodos();


        console.log("Todo created:", todo);

    }

    catch (error) {

        console.error("Error adding todo:", error);

        errorMessage.textContent =
            "Unable to add todo. Make sure the backend is running.";

    }

    finally {

        addTodoBtn.disabled = false;

        addTodoBtn.textContent = "Add Todo";

        todoInput.focus();

    }

}


// ==========================================
// DISPLAY TODO
// ==========================================

function displayTodo(todo) {

    const li = document.createElement("li");

    li.className = "todo-item";


    // Todo text

    const span = document.createElement("span");

    span.textContent = todo.title;

    span.className = todo.completed
        ? "completed"
        : "";


    // Complete button

    const completeButton = document.createElement("button");

    completeButton.textContent = todo.completed
        ? "Undo"
        : "Complete";

    completeButton.className = "complete-btn";


    completeButton.addEventListener("click", () => {

        toggleTodo(todo._id, todo.completed);

    });


    // Delete button

    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.className = "delete-btn";


    deleteButton.addEventListener("click", () => {

        deleteTodo(todo._id);

    });


    // Add elements

    li.appendChild(span);

    li.appendChild(completeButton);

    li.appendChild(deleteButton);


    todoList.appendChild(li);

}


// ==========================================
// UPDATE TODO
// ==========================================

async function toggleTodo(id, completed) {

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                completed: !completed

            })

        });


        if (!response.ok) {

            throw new Error("Failed to update todo");

        }


        // Reload todos

        await loadTodos();

    }

    catch (error) {

        console.error("Error updating todo:", error);

        errorMessage.textContent =
            "Unable to update todo.";

    }

}


// ==========================================
// DELETE TODO
// ==========================================

async function deleteTodo(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this todo?"
    );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "DELETE"

        });


        if (!response.ok) {

            throw new Error("Failed to delete todo");

        }


        // Reload todos

        await loadTodos();

    }

    catch (error) {

        console.error("Error deleting todo:", error);

        errorMessage.textContent =
            "Unable to delete todo.";

    }

}