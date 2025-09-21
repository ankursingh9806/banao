document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("forgotForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;

        try {
            const response = await axios.post("http://localhost:3000/forgot-password", { email });
            alert(response.data.message);
            form.reset();
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong");
            }
        }
    });
});