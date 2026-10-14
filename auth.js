const { createClient } = supabase;

const supabaseURL = 'https://lgxyikorvoindblopdmx.supabase.co';
const supabaseKey = 'sb_publishable_5zqqrl1Psgq6LUgKn8bsCw_YWAFWtkH';

const supabaseclient = createClient(supabaseURL, supabaseKey);

const signupForm = document.getElementById("signupForm");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const message = document.getElementById("message");

signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = password.value;
    const confirmPass = confirmPassword.value;

    // Step 1: Validate name
    if (name.length < 2) {
        showMessage("Please enter your full name.", "red");
        return;
    }

    // Step 2: Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage("Please enter a valid email address.", "red");
        return;
    }

    // Step 3: Validate password
    if (pass.length < 8) {
        showMessage("Password must be at least 8 characters.", "red");
        return;
    }

    // Step 4: Confirm password
    if (pass !== confirmPass) {
        showMessage("Passwords do not match!", "red");
        return;
    }

    // Step 5: Sign up with Supabase
    showMessage("Creating your account...", "black");

    try {
        const { data, error } = await supabaseclient.auth.signUp({
            email: email,
            password: pass,
            options: {
                data: {
                    first_name: name
                },
                emailRedirectTo: window.location.origin + "/login.html"
                
            }
        });

        // Step 6: Handle signup error
        if (error) {
            console.error("Signup error:", error.message);
            console.error("Error code:", error.code);
            console.error("Error status:", error.status);

            showMessage(error.message, "red");
            return;
        }

        // Step 7: Check user data
        console.log("Signup data:", data);
        console.log("User ID:", data?.user?.id);
        console.log("Metadata:", data?.user?.user_metadata);

        if (data?.user?.id) {
            showMessage(
                "Account created! Please check your email if confirmation is required.",
                "green"
            );
        } else {
            showMessage(
                "Signup response received, but no user was returned.",
                "red"
            );
        }

    } catch (err) {
        console.error("Unexpected error:", err);
        showMessage("Something went wrong. Please try again.", "red");
    }
});

// Step 8: Display message
function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}
