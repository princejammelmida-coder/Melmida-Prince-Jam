document.getElementById("teamForm").addEventListener("submit", async function(e){

e.preventDefault();

const team_name = document.getElementById("team_name").value;
const captain_name = document.getElementById("captain_name").value;
const email = document.getElementById("email").value;
const game = document.getElementById("game").value;

const response = await fetch("http://localhost:5000/register", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
team_name,
captain_name,
email,
game
})

});

const data = await response.text();

alert(data);

});