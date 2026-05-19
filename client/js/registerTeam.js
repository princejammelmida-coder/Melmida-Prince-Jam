// Preview image when selected
document.getElementById("team_logo").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("previewImage").src = e.target.result;
            document.getElementById("logoPreview").style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("teamForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const team_name = document.getElementById("team_name").value;
    const captain_name = document.getElementById("captain_name").value;
    const email = document.getElementById("email").value;
    const game = document.getElementById("game").value;
    const logoFile = document.getElementById("team_logo").files[0];

    const messageDiv = document.getElementById("message");
    
    let team_logo = null;

    try {
        // Upload logo if file is selected
        if (logoFile) {
            const formData = new FormData();
            formData.append("logo", logoFile);

            const uploadRes = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                body: formData
            });

            if (uploadRes.ok) {
                const uploadData = await uploadRes.json();
                team_logo = uploadData.fileUrl;
            } else {
                messageDiv.className = "message error";
                messageDiv.textContent = "Failed to upload logo";
                return;
            }
        }

        // Register team
        const res = await fetch("http://localhost:5000/api/teams/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                team_name,
                captain_name,
                email,
                game,
                team_logo
            })
        });

        const data = await res.json();

        if (res.ok) {
            messageDiv.className = "message success";
            messageDiv.textContent = data.message || "Team registered successfully!";
            document.getElementById("teamForm").reset();
            document.getElementById("logoPreview").style.display = "none";
            
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 2000);
        } else {
            messageDiv.className = "message error";
            messageDiv.textContent = data.error || "Failed to register team";
        }
    } catch (error) {
        messageDiv.className = "message error";
        messageDiv.textContent = "Error: " + error.message;
    }
});