document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        try {
            const response = await axios.post("http://localhost:3000/signup", {
                username,
                email,
                password
            });
            alert(response.data.message);
            form.reset();
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("something went wrong");
            }
        }
    });
});