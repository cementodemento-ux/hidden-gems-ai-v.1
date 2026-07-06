document.getElementById(“app”).innerHTML =
<div class="container"> <h1>Hidden Gems AI</h1> <p class="subtitle">Discover high-potential YouTube channels using AI.</p> <div class="card"> <div class="form-group"> <label>Keyword</label> <input id="keyword" placeholder="AI Tools"> </div> <div class="form-group"> <label>Country</label> <select id="country"> <option value="global">Global</option> <option value="id">Indonesia</option> <option value="us">United States</option> <option value="in">India</option> </select> </div> <div class="form-group"> <label>Language</label> <select id="language"> <option value="english">English</option> <option value="indonesia">Indonesia</option> </select> </div> <div class="form-group"> <label>Minimum Opportunity Score</label> <input id="score" type="number" value="80"> </div> <button id="searchButton">Search Hidden Gems</button> </div> <div id="loading">Searching...</div> <div id="results"></div> </div>;

document.getElementById(“searchButton”).onclick = async () => { const
keyword=document.getElementById(“keyword”).value.trim(); const
country=document.getElementById(“country”).value; const
language=document.getElementById(“language”).value; const
score=document.getElementById(“score”).value;

if(!keyword){ alert(“Keyword wajib diisi”); return; }

loading.style.display=“block”; results.style.display=“none”;

try{ const response=await fetch(“YOUR_WORKER_URL”,{ method:“POST”,
headers:{“Content-Type”:“application/json”},
body:JSON.stringify({keyword,country,language,score}) });

const data=await response.json();

loading.style.display=“none”; results.style.display=“block”;

if(!data.success){ results.innerHTML=’

Tidak ada hasil

’; return; }

results.innerHTML=data.results.map(item=><div class="result-card">  <h2>${item.channel}</h2>  <div class="score">Opportunity Score ${item.score}</div>  <p><b>Subscribers:</b> ${item.subscribers}</p>  <p><b>Average Views:</b> ${item.views}</p>  <p><b>Upload Frequency:</b> ${item.frequency}</p>  <p>${item.reason}</p>  <a href="${item.url}" target="_blank">Open Channel</a>  </div>).join(““);

}catch(e){ loading.style.display=“none”; results.style.display=“block”;
results.innerHTML=<div class="result-card"><h2>Connection Error</h2><p>${e.message}</p></div>;
} };
