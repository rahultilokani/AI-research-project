document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.getElementById("login-btn");
    const logoutButton = document.getElementById("logout-btn");

    if (loginButton) {
        loginButton.addEventListener("click", function() {
            alert("Login functionality will be added here.");
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", function() {
            alert("Logout functionality will be added here.");
        });
    }
});
