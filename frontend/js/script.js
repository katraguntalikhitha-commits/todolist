// ==========================================
// API URL
// ==========================================

const API_URL =
    "https://todolist-backend-la5i.onrender.com/api/todos";

const AUTH_URL =
    "https://todolist-backend-la5i.onrender.com/api/auth";


// ==========================================
// Get HTML Elements
// ==========================================

const authContainer = document.getElementById("authContainer");
const todoContainer = document.getElementById("todoContainer");

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");

const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const registerBtn = document.getElementById("registerBtn");
const registerMessage = document.getElementById("registerMessage");

const showRegisterBtn =
    document.getElementById("showRegisterBtn");

const showLoginBtn =
    document.getElementById("showLoginBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const welcomeUser =
    document.getElementById("welcomeUser");

const todoInput =
    document.getElementById("todoInput");

const addTodoBtn =
    document.getElementById("addTodoBtn");

const todoList =
    document.getElementById("todoList");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");


// ==========================================
// TOKEN FUNCTIONS
// ==========================================

function getToken() {
    return localStorage.getItem("token");
}


function saveToken(token) {
    localStorage.setItem("token", token);
}


function removeToken() {
    localStorage.removeItem("token");
}


function getUser() {
    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
}


function saveUser(user) {
    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );
}


function removeUser() {
    localStorage.removeItem("user");
}


// ==========================================
// SHOW LOGIN
// ==========================================

function showLogin() {

    loginSection.style.display = "block";

    registerSection.style.display = "none";

    loginMessage.textContent = "";
    registerMessage.textContent = "";
}


// ==========================================
// SHOW REGISTER
// ==========================================

function showRegister() {

    loginSection.style.display = "none";

    registerSection.style.display = "block";

    loginMessage.textContent = "";
    registerMessage.textContent = "";
}


// ==========================================
// SHOW TODO APP
// ==========================================

function showTodoApp() {

    authContainer.style.display = "none";

    todoContainer.style.display = "block";

    const user = getUser();

    if (user) {
        welcomeUser.textContent =
            `Welcome, ${user.name}!`;
    }

    loadTodos();
}


// ==========================================
// SHOW AUTH
// ==========================================

function showAuth() {

    authContainer.style.display = "block";

    todoContainer.style.display = "none";

    showLogin();
}


// ==========================================
// REGISTER
// ==========================================

async function registerUser() {

    const name =
        registerName.value.trim();

    const email =
        registerEmail.value.trim();

    const password =
        registerPassword.value;

    if (!name || !email || !password) {

        registerMessage.textContent =
            "Please fill all fields.";

        return;
    }

    if (password.length < 6) {

        registerMessage.textContent =
            "Password must be at least 6 characters.";

        return;
    }

    try {

        registerBtn.disabled = true;

        registerBtn.textContent =
            "Registering...";

        const response = await fetch(
            `${AUTH_URL}/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Registration failed"
            );
        }

        // Save login information

        saveToken(data.token);

        saveUser(data.user);

        registerName.value = "";
        registerEmail.value = "";
        registerPassword.value = "";

        showTodoApp();

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        registerMessage.textContent =
            error.message;

    } finally {

        registerBtn.disabled = false;

        registerBtn.textContent =
            "Register";
    }
}


// ==========================================
// LOGIN
// ==========================================

async function loginUser() {

    const email =
        loginEmail.value.trim();

    const password =
        loginPassword.value;

    if (!email || !password) {

        loginMessage.textContent =
            "Please enter email and password.";

        return;
    }

    try {

        loginBtn.disabled = true;

        loginBtn.textContent =
            "Logging in...";

        const response = await fetch(
            `${AUTH_URL}/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Login failed"
            );
        }

        // Save JWT

        saveToken(data.token);

        saveUser(data.user);

        loginEmail.value = "";
        loginPassword.value = "";

        showTodoApp();

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        loginMessage.textContent =
            error.message;

    } finally {

        loginBtn.disabled = false;

        loginBtn.textContent =
            "Login";
    }
}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    removeToken();

    removeUser();

    todoList.innerHTML = "";

    showAuth();
}


// ==========================================
// AUTHENTICATED FETCH
// ==========================================

async function authenticatedFetch(
    url,
    options = {}
) {

    const token = getToken();

    if (!token) {

        throw new Error(
            "You are not logged in."
        );
    }

    const headers = {
        ...(options.headers || {}),
        "Authorization":
            `Bearer ${token}`
    };

    return fetch(url, {
        ...options,
        headers
    });
}


// ==========================================
// LOAD TODOS
// ==========================================

async function loadTodos() {

    try {

        loading.style.display = "block";

        errorMessage.textContent = "";

        const response =
            await authenticatedFetch(
                API_URL
            );

        if (response.status === 401) {

            logout();

            return;
        }

        if (!response.ok) {

            throw new Error(
                "Failed to load todos"
            );
        }

        const todos =
            await response.json();

        todoList.innerHTML = "";

        loading.style.display = "none";


        if (todos.length === 0) {

            todoList.innerHTML = `
                <li class="empty">
                    No todos yet. Add your first todo! 🎯
                </li>
            `;

            return;
        }


        todos.forEach(todo => {

            displayTodo(todo);

        });

    } catch (error) {

        loading.style.display = "none";

        errorMessage.textContent =
            "Unable to connect to the server.";

        console.error(
            "Error loading todos:",
            error
        );
    }
}


// ==========================================
// ADD TODO
// ==========================================

async function addTodo() {

    const title =
        todoInput.value.trim();

    if (title === "") {

        alert(
            "Please enter a todo!"
        );

        todoInput.focus();

        return;
    }

    try {

        addTodoBtn.disabled = true;

        addTodoBtn.textContent =
            "Adding...";

        const response =
            await authenticatedFetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        title
                    })
                }
            );

        if (response.status === 401) {

            logout();

            return;
        }

        if (!response.ok) {

            throw new Error(
                "Failed to create todo"
            );
        }

        await response.json();

        todoInput.value = "";

        await loadTodos();

    } catch (error) {

        console.error(
            "Error adding todo:",
            error
        );

        errorMessage.textContent =
            "Unable to add todo.";

    } finally {

        addTodoBtn.disabled = false;

        addTodoBtn.textContent =
            "Add Todo";

        todoInput.focus();
    }
}


// ==========================================
// DISPLAY TODO
// ==========================================

function displayTodo(todo) {

    const li =
        document.createElement("li");

    li.className =
        "todo-item";


    const span =
        document.createElement("span");

    span.textContent =
        todo.title;

    span.className =
        todo.completed
            ? "completed"
            : "";


    // Complete button

    const completeButton =
        document.createElement("button");

    completeButton.textContent =
        todo.completed
            ? "Undo"
            : "Complete";

    completeButton.className =
        "complete-btn";


    completeButton.addEventListener(
        "click",
        () => {

            toggleTodo(
                todo._id,
                todo.completed
            );

        }
    );


    // Delete button

    const deleteButton =
        document.createElement("button");

    deleteButton.textContent =
        "Delete";

    deleteButton.className =
        "delete-btn";


    deleteButton.addEventListener(
        "click",
        () => {

            deleteTodo(todo._id);

        }
    );


    li.appendChild(span);

    li.appendChild(
        completeButton
    );

    li.appendChild(
        deleteButton
    );

    todoList.appendChild(li);
}


// ==========================================
// UPDATE TODO
// ==========================================

async function toggleTodo(
    id,
    completed
) {

    try {

        const response =
            await authenticatedFetch(
                `${API_URL}/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        completed: !completed
                    })
                }
            );

        if (response.status === 401) {

            logout();

            return;
        }

        if (!response.ok) {

            throw new Error(
                "Failed to update todo"
            );
        }

        await loadTodos();

    } catch (error) {

        console.error(
            "Error updating todo:",
            error
        );

        errorMessage.textContent =
            "Unable to update todo.";
    }
}


// ==========================================
// DELETE TODO
// ==========================================

async function deleteTodo(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this todo?"
        );

    if (!confirmDelete) {
        return;
    }

    try {

        const response =
            await authenticatedFetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (response.status === 401) {

            logout();

            return;
        }

        if (!response.ok) {

            throw new Error(
                "Failed to delete todo"
            );
        }

        await loadTodos();

    } catch (error) {

        console.error(
            "Error deleting todo:",
            error
        );

        errorMessage.textContent =
            "Unable to delete todo.";
    }
}


// ==========================================
// EVENT LISTENERS
// ==========================================

loginBtn.addEventListener(
    "click",
    loginUser
);

registerBtn.addEventListener(
    "click",
    registerUser
);

logoutBtn.addEventListener(
    "click",
    logout
);

showRegisterBtn.addEventListener(
    "click",
    showRegister
);

showLoginBtn.addEventListener(
    "click",
    showLogin
);


// Press Enter in login

loginPassword.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {
            loginUser();
        }

    }
);


// Press Enter in register

registerPassword.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {
            registerUser();
        }

    }
);


// Press Enter to add Todo

todoInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {
            addTodo();
        }

    }
);


// ==========================================
// CHECK LOGIN ON PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const token = getToken();

        const user = getUser();

        if (token && user) {

            showTodoApp();

        } else {

            showAuth();

        }

    }
);