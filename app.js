document.getElementById("app").innerHTML = `
<div class="container">

<h1>Hidden Gems AI</h1>

<p class="subtitle">
Discover high-potential YouTube channels using AI.
</p>

<div class="card">

<div class="form-group">
<label>Keyword</label>
<input id="keyword" placeholder="AI Tools">
</div>

<div class="form-group">
<label>Country</label>
<select id="country">
<option value="global">Global</option>
<option value="id">Indonesia</option>
<option value="us">United States</option>
<option value="in">India</option>
</select>
</div>

<div class="form-group">
<label>Language</label>
<select id="language">
<option value="english">English</option>
<option value="indonesia">Indonesia</option>
</select>
</div>

<div class="form-group">
<label>Minimum Opportunity Score</label>
<input id="score" type="number" value="80">
</div>

<button id="searchButton">
Search Hidden Gems
</button>

</div>

<div id="loading">
Searching...
</div>

<div id="results">
</div>

</div>
`;

const searchButton=document.getElementById("searchButton");

searchButton.onclick=async()=>{

const keyword=document.getElementById("keyword").value.trim();

if(keyword===""){
alert("Keyword wajib diisi");
return;
}

document.getElementById("loading").style.display="block";

document.getElementById("results").style.display="none";

setTimeout(()=>{

document.getElementById("loading").style.display="none";

const results=document.getElementById("results");

results.style.display="block";

results.innerHTML=`

<div class="result-card">

<h2>Demo Hidden Gem</h2>

<div class="score">
Opportunity Score 92
</div>

<p><b>Subscribers:</b> 18K</p>

<p><b>Average Views:</b> 45K</p>

<p><b>Upload Frequency:</b> 3 videos/week</p>

<p>
Strong growth with low competition.
</p>

<a href="#">
Open Channel
</a>

</div>

`;

},1500);

}