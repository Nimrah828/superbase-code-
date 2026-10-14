console.log("JS FILE CHAL RAHI HAI");

const { createClient } = supabase;

const supabaseURL = "https://lgxyikorvoindblopdmx.supabase.co";
const supabaseKey = "sb_publishable_5zqqrl1Psgq6LUgKn8bsCw_YWAFWtkH";

const supabaseclient = createClient(supabaseURL, supabaseKey);

// Todo data
let todos = [];
let currentUser = null;

// HTML elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");

// =========================
// CHECK LOGIN
// =========================

async function checkLogin() {
    const { data: { user }, error } =
        await supabaseclient.auth.getUser();

    if (error || !user) {
        window.location.href = "auth.html";
        return false;
    }

    currentUser = user;
    console.log("Current user ID:", currentUser.id);

    return true;
}

// =========================
// FETCH TODOS
// =========================

async function getTodos() {
    const loggedIn = await checkLogin();

    if (!loggedIn) return;

    const { data, error } = await supabaseclient
        .from("todo")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("id", { ascending: false });

    // if (error) {
        // console.error("Fetch error:", error);
        // return;
    // }

    todos = data || [];
    renderTodos();
}

// =========================
// ADD TODO
// =========================

addBtn.addEventListener("click", async function () {
    const task = taskInput.value.trim();

    if (task === "") {
        alert("Please enter a task");
        return;
    }

    const loggedIn = await checkLogin();

    if (!loggedIn) return;

    const newTodo = {
        task: task,
        iscompleted: false,
        user_id: currentUser.id
    };

    const { data, error } = await supabaseclient
        .from("todo")
        .insert([newTodo])
        .select();

    // if (error) {
    //     console.error("Insert error:", error);
    //     alert("Task add nahi hua. Console check karo.");
    //     return;
    // }

    console.log("Task add ho gaya:", data);

    taskInput.value = "";

    await getTodos();
});

// Enter key se task add karna
taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addBtn.click();
    }
});

// =========================
// SHOW TODOS
// =========================

function renderTodos() {
    todoList.innerHTML = "";

    todos.forEach(function (item) {
        const todoDiv = document.createElement("div");
        todoDiv.className = "todo";

        const taskText = document.createElement("div");
        taskText.className = "todo-text";

        if (item.iscompleted) {
            taskText.classList.add("completed");
        }

        // Safe text display
        taskText.textContent = item.task || "";

        const actions = document.createElement("div");
        actions.className = "actions";

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", function () {
            editTodo(item.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function () {
            deleteTodo(item.id);
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        todoDiv.appendChild(taskText);
        todoDiv.appendChild(actions);

        todoList.appendChild(todoDiv);
    });
}

// =========================
// DELETE TODO
// =========================

async function deleteTodo(id) {
    const loggedIn = await checkLogin();

    if (!loggedIn) return;

    const { error } = await supabaseclient
        .from("todo")
        .delete()
        .eq("id", id)
        .eq("user_id", currentUser.id);

    if (error) {
        console.error("Delete error:", error);
        alert("Task delete nahi hua.");
        return;
    }

    todos = todos.filter(function (item) {
        return item.id !== id;
    });

    renderTodos();
}

// =========================
// EDIT TODO
// =========================

async function editTodo(id) {
    const item = todos.find(function (todoItem) {
        return todoItem.id === id;
    });

    if (!item) {
        console.error("Todo nahi mila:", id);
        return;
    }

    const newTask = prompt("Edit your task:", item.task);

    if (newTask === null || newTask.trim() === "") {
        return;
    }

    const loggedIn = await checkLogin();

    if (!loggedIn) return;

    const { error } = await supabaseclient
        .from("todo")
        .update({
            task: newTask.trim()
        })
        .eq("id", id)
        .eq("user_id", currentUser.id);

    if (error) {
        console.error("Update error:", error);
        alert("Task update nahi hua.");
        return;
    }

    item.task = newTask.trim();

    renderTodos();

    console.log("Task successfully update ho gaya");
}

// =========================
// START APP
// =========================

getTodos();
