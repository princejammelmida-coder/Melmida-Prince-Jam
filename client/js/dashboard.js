// Tab functionality
document.addEventListener("DOMContentLoaded", () => {
    loadTeams();
    loadPlayers();
    loadMatches();

    // Tab switching
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const tabName = btn.getAttribute("data-tab");
            
            // Remove active class from all tabs and contents
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add("active");
            document.getElementById(tabName).classList.add("active");
        });
    });
});

async function loadTeams() {
    try {
        const res = await fetch("http://localhost:5000/api/teams");
        const teams = await res.json();

        const teamsList = document.getElementById("teamsList");
        teamsList.innerHTML = "";

        if (teams.length === 0) {
            teamsList.innerHTML = "<p>No teams registered yet.</p>";
            return;
        }

        teams.forEach(team => {
            const card = document.createElement("div");
            card.className = "data-card";
            card.innerHTML = `
                <h3>${team.team_name}</h3>
                <p><strong>Captain:</strong> ${team.captain_name}</p>
                <p><strong>Email:</strong> ${team.email}</p>
                <p><strong>Game:</strong> ${team.game}</p>
                <p><strong>Registered:</strong> ${new Date(team.registration_date).toLocaleDateString()}</p>
                <span class="badge badge-${team.status}">${team.status}</span>
            `;
            teamsList.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading teams:", error);
        document.getElementById("teamsList").innerHTML = "<p>Error loading teams.</p>";
    }
}

async function loadPlayers() {
    try {
        const res = await fetch("http://localhost:5000/api/players");
        const players = await res.json();

        const playersList = document.getElementById("playersList");
        playersList.innerHTML = "";

        if (players.length === 0) {
            playersList.innerHTML = "<p>No players registered yet.</p>";
            return;
        }

        players.forEach(player => {
            const card = document.createElement("div");
            card.className = "data-card";
            card.innerHTML = `
                <h3>${player.player_name}</h3>
                <p><strong>Username:</strong> ${player.game_username}</p>
                <p><strong>Team:</strong> ${player.team_name || "No team"}</p>
                <p><strong>Role:</strong> ${player.role}</p>
                <p><strong>Email:</strong> ${player.email}</p>
                ${player.phone ? `<p><strong>Phone:</strong> ${player.phone}</p>` : ""}
            `;
            playersList.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading players:", error);
        document.getElementById("playersList").innerHTML = "<p>Error loading players.</p>";
    }
}

async function loadMatches() {
    try {
        const res = await fetch("http://localhost:5000/api/matches");
        const matches = await res.json();

        const matchesList = document.getElementById("matchesList");
        matchesList.innerHTML = "";

        if (matches.length === 0) {
            matchesList.innerHTML = "<p>No matches scheduled yet.</p>";
            return;
        }

        matches.forEach(match => {
            const card = document.createElement("div");
            card.className = "data-card";
            card.innerHTML = `
                <h3>${match.match_name}</h3>
                <p><strong>Game:</strong> ${match.game}</p>
                <p><strong>Date:</strong> ${new Date(match.match_date).toLocaleString()}</p>
                ${match.venue ? `<p><strong>Venue:</strong> ${match.venue}</p>` : ""}
                <span class="badge badge-${match.status}">${match.status}</span>
            `;
            matchesList.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading matches:", error);
        document.getElementById("matchesList").innerHTML = "<p>Error loading matches.</p>";
    }
}

function showMatchForm() {
    document.getElementById("matchForm").style.display = "block";
}

function hideMatchForm() {
    document.getElementById("matchForm").style.display = "none";
    document.getElementById("createMatchForm").reset();
}

document.getElementById("createMatchForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const match_name = document.getElementById("match_name").value;
    const game = document.getElementById("match_game").value;
    const match_date = document.getElementById("match_date").value;
    const venue = document.getElementById("venue").value;

    try {
        const res = await fetch("http://localhost:5000/api/matches/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                match_name,
                game,
                match_date,
                venue
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.message || "Match created successfully!");
            hideMatchForm();
            loadMatches();
        } else {
            alert(data.error || "Failed to create match");
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
});
