let eliminatedTeams =
JSON.parse(
localStorage.getItem("eliminatedTeams")
) || [];

const allTeams = [
...new Set(
participantsData.flatMap(p => p.teams)
)
];

const select =
document.getElementById(
"championSelect"
);

allTeams.sort().forEach(team => {

const option =
document.createElement("option");

option.value = team;
option.textContent = team;

select.appendChild(option);

});

function save(){

localStorage.setItem(
"eliminatedTeams",
JSON.stringify(eliminatedTeams)
);

}

function toggleTeam(team){

if(eliminatedTeams.includes(team))
{
eliminatedTeams =
eliminatedTeams.filter(
t => t !== team
);
}
else
{
eliminatedTeams.push(team);
}

save();
render();

}

function render(){

const container =
document.getElementById(
"participantsContainer"
);

container.innerHTML = "";

let alive = 0;
let dead = 0;

participantsData.forEach(player => {

const active =
player.teams.filter(
t =>
!eliminatedTeams.includes(t)
);

const isAlive =
active.length > 0;

if(isAlive)
alive++;
else
dead++;

const div =
document.createElement("div");

div.className =
"participant";

div.innerHTML =
`<h3>${player.name}</h3>`;

player.teams.forEach(team=>{

const span =
document.createElement("span");

span.className =
"team";

if(
eliminatedTeams.includes(team)
)
span.classList.add(
"eliminated"
);

span.textContent =
team;

span.onclick =
()=>toggleTeam(team);

div.appendChild(span);

});

container.appendChild(div);

});

document.getElementById(
"aliveCount"
).textContent = alive;

document.getElementById(
"deadCount"
).textContent = dead;

updateWinner();
updateChart();

}

function updateWinner(){

const champion =
select.value;

let winner = "-";

participantsData.forEach(p=>{

if(
p.teams.includes(champion)
)
winner = p.name;

});

document.getElementById(
"winner"
).textContent = winner;

}

select.addEventListener(
"change",
updateWinner
);

document.getElementById(
"resetBtn"
).onclick = () => {

localStorage.clear();

location.reload();

};

let chart;

function updateChart(){

const labels =
participantsData.map(
p => p.name
);

const values =
participantsData.map(p=>{

const active =
p.teams.filter(
t =>
!eliminatedTeams.includes(t)
);

return active.length;

});

if(chart)
chart.destroy();

chart =
new Chart(
document.getElementById(
"probabilityChart"
),
{
type:"bar",
data:{
labels,
datasets:[{
label:
"Equipos vivos",
data:values
}]
}
}
);
function updateTeamLists(){

    const aliveDiv =
    document.getElementById("aliveTeams");

    const eliminatedDiv =
    document.getElementById("eliminatedList");

    aliveDiv.innerHTML="";
    eliminatedDiv.innerHTML="";

    allTeams.forEach(team=>{

        const span =
        document.createElement("span");

        span.className="team";

        span.textContent=team;

        if(eliminatedTeams.includes(team))
        {
            span.classList.add(
                "eliminated"
            );

            eliminatedDiv.appendChild(span);
        }
        else
        {
            aliveDiv.appendChild(span);
        }

    });

}
}
function updateRanking(){

    const rankingDiv =
    document.getElementById("ranking");

    rankingDiv.innerHTML="";

    const ranking =
    participantsData.map(player=>{

        const active =
        player.teams.filter(
            t =>
            !eliminatedTeams.includes(t)
        );

        return {
            name:player.name,
            alive:active.length
        };

    });

    ranking.sort(
        (a,b)=>b.alive-a.alive
    );

    ranking.forEach(player=>{

        const div =
        document.createElement("div");

        div.innerHTML=
        `${player.name} - ${player.alive} equipos`;

        rankingDiv.appendChild(div);

    });

}

render();
