// Load matches and teams on page load
document.addEventListener("DOMContentLoaded", async () => {
    await loadMatches();
});

async function loadMatches() {
    try {
        const res = await fetch("http://localhost:5000/api/matches");
        const matches = await res.json();

        const matchSelect = document.getElementById("match_id");
        matchSelect.innerHTML = '<option value="">Select a match</option>';

        matches.forEach(match => {
            const option = document.createElement("option");
            option.value = match.match_id;
            option.textContent = `${match.match_name} - ${match.game} (${new Date(match.match_date).toLocaleDateString()})`;
            matchSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading matches:", error);
    }
}

async function loadTeams() {
    try {
        const res = await fetch("http://localhost:5000/api/teams");
        const teams = await res.json();

        const teamSelect = document.getElementById("team_id");
        teamSelect.innerHTML = '<option value="">Select a team</option>';

        teams.forEach(team => {
            const option = document.createElement("option");
            option.value = team.team_id;
            option.textContent = team.team_name;
            teamSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading teams:", error);
    }
}

async function loadPlayers(teamId) {
    try {
        const res = await fetch(`http://localhost:5000/api/players/team/${teamId}`);
        const players = await res.json();

        const playerSelect = document.getElementById("player_id");
        playerSelect.innerHTML = '<option value="">Select a player</option>';

        players.forEach(player => {
            const option = document.createElement("option");
            option.value = player.player_id;
            option.textContent = `${player.player_name} (${player.game_username}) - ${player.role}`;
            playerSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading players:", error);
    }
}

async function loadLineup(matchId) {
    try {
        const res = await fetch(`http://localhost:5000/api/lineups/match/${matchId}`);
        const lineup = await res.json();

        const lineupPreview = document.getElementById("lineupPreview");
        const lineupList = document.getElementById("lineupList");

        if (lineup.length > 0) {
            lineupPreview.style.display = "block";
            lineupList.innerHTML = "";

            lineup.forEach(item => {
                const lineupItem = document.createElement("div");
                lineupItem.className = "lineup-item";
                lineupItem.innerHTML = `
                    <div>
                        <strong>${item.player_name}</strong> (${item.game_username})
                        <br>
                        <small>${item.team_name} - ${item.position || "No position"}</small>
                        ${item.is_substitute ? '<span class="badge badge-pending">Substitute</span>' : ''}
                    </div>
                `;
                lineupList.appendChild(lineupItem);
            });
        } else {
            lineupPreview.style.display = "none";
        }
    } catch (error) {
        console.error("Error loading lineup:", error);
    }
}

// Event listeners
document.getElementById("match_id").addEventListener("change", async (e) => {
    const matchId = e.target.value;
    if (matchId) {
        await loadTeams();
        await loadLineup(matchId);
    }
});

document.getElementById("team_id").addEventListener("change", async (e) => {
    const teamId = e.target.value;
    if (teamId) {
        await loadPlayers(teamId);
    }
});

document.getElementById("lineupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const match_id = document.getElementById("match_id").value;
    const team_id = document.getElementById("team_id").value;
    const player_id = document.getElementById("player_id").value;
    const position = document.getElementById("position").value;
    const is_substitute = document.getElementById("is_substitute").checked;

    const messageDiv = document.getElementById("message");

    try {
        const res = await fetch("http://localhost:5000/api/lineups/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                match_id,
                team_id,
                player_id,
                position,
                is_substitute
            })
        });

        const data = await res.json();

        if (res.ok) {
            messageDiv.className = "message success";
            messageDiv.textContent = data.message || "Player added to lineup successfully!";
            
            // Reset only player selection fields
            document.getElementById("player_id").value = "";
            document.getElementById("position").value = "";
            document.getElementById("is_substitute").checked = false;
            
            // Reload lineup
            await loadLineup(match_id);
        } else {
            messageDiv.className = "message error";
            messageDiv.textContent = data.error || "Failed to add player to lineup";
        }
    } catch (error) {
        messageDiv.className = "message error";
        messageDiv.textContent = "Error: " + error.message;
    }
});
