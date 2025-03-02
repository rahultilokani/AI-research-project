async function addResearcher() {
    const email = document.getElementById("email").value;

    if (!email) {
        document.getElementById("message").innerText = "Please enter a valid email.";
        return;
    }

    const response = await fetch("https://your-api-gateway-url/add-researcher", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    });

    const data = await response.json();
    document.getElementById("message").innerText = data.message;
}

async function removeResearcher() {
    const email = document.getElementById("email").value;

    if (!email) {
        document.getElementById("message").innerText = "Please enter a valid email.";
        return;
    }

    const response = await fetch("https://your-api-gateway-url/remove-researcher", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    });

    const data = await response.json();
    document.getElementById("message").innerText = data.message;
}
