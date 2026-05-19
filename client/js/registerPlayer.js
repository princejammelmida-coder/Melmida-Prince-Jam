// Load teams on page load
document.addEventListener("DOMContentLoaded", async () => {
    await loadTeams();
});

async function loadTeams() {
    try {
        const res = await fetch("http://localhost:5000/api/teams");
        const teams = await res.json();

        const teamSelect = document.getElementById("team_id");
        teamSelect.innerHTML = '<option value="">Select a team</option>';

        teams.forEach(team => {
            const option = document.createElement("option");
            option.value = team.team_id;
            option.textContent = `${team.team_name} (${team.game})`;
            teamSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading teams:", error);
    }
}

document.getElementById("playerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const team_id = document.getElementById("team_id").value;
    const player_name = document.getElementById("player_name").value;
    const game_username = document.getElementById("game_username").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const role = document.getElementById("role").value;

    const messageDiv = document.getElementById("message");

    try {
        const res = await fetch("http://localhost:5000/api/players/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                team_id,
                player_name,
                game_username,
                email,
                phone,
                role
            })
        });

        const data = await res.json();

        if (res.ok) {
            messageDiv.className = "message success";
            messageDiv.textContent = data.message || "Player registered successfully!";
            document.getElementById("playerForm").reset();
            
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 2000);
        } else {
            messageDiv.className = "message error";
            messageDiv.textContent = data.error || "Failed to register player";
        }
    } catch (error) {
        messageDiv.className = "message error";
        messageDiv.textContent = "Error: " + error.message;
    }
});
