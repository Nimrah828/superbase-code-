const { createClient } = supabase;

const supabaseURL='https://lgxyikorvoindblopdmx.supabase.co';
const supabaseKey='sb_publishable_5zqqrl1Psgq6LUgKn8bsCw_YWAFWtkH';

const supabaseclient = createClient(
    supabaseURL,
    supabaseKey
);

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        message.textContent = "Please enter email and password.";
        message.style.color = "red";
        return;
    }

    try {
        const { data, error } =
            await supabaseclient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) {
            console.error("Login error:", error.message);

            message.textContent = error.message;
            message.style.color = "red";
            return;
        }

        console.log("Logged-in user ID:", data.user.id);

        message.textContent = "Login successful!";
        message.style.color = "green";

        window.location.href = "index.html";

    } catch (err) {
        console.error("Unexpected error:", err);
        message.textContent = "Something went wrong. Try again.";
        message.style.color = "red";
    }
});
