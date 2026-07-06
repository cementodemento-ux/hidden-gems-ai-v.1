document.body.innerHTML = `
<div class="container">

<h1>Hidden Gems AI</h1>
<p>Discover high-potential YouTube channels using AI.</p>

<div class="card">

<div class="form-group">
<label>Keyword / Niche</label>
<input id="keyword" type="text" placeholder="AI, Finance, History">
</div>

<div class="form-group">
<label>Country</label>
<select id="country">
<option value="global">Global</option>
<option value="us">United States</option>
<option value="id">Indonesia</option>
<option value="uk">United Kingdom</option>
</select>
</div>

<div class="form-group">
<label>Language</label>
<select id="language">
<option value="english">English</option>
<option value="indonesian">Indonesian</option>
</select>
</div>

<div class="form-group">
<label>Minimum Opportunity Score</label>
<input id="score" type="number" value="80" min="1" max="100">
</div>

<button id="searchButton">
Search Hidden Gems
</button>

</div>

<div id="loading" style="display:none">
<h2>Searching Hidden Gems...</h2>
<p>Please wait...</p>
</div>

<div id="results"></div>

</div>
`;

const searchButton = document.getElementById("searchButton");
const loading = document.getElementById("loading");
const results = document.getElementById("results");

searchButton.addEventListener("click", async () => {

const keyword = document.getElementById("keyword").value.trim();
const country = document.getElementById("country").value;
const language = document.getElementById("language").value;
const score = document.getElementById("score").value;

if (!keyword) {
alert("Keyword wajib diisi");
return;
}

loading.style.display = "block";
results.style.display = "none";
results.innerHTML = "";

try {

const response = await fetch(
`https://hidden-gems-ai.airdropnendra.workers.dev/search?keyword=${encodeURIComponent(keyword)}&country=${country}&language=${language}&score=${score}`
);

const data = await response.json();

loading.style.display = "none";
results.style.display = "block";

if (!data.success) {
results.innerHTML = `
<div class="result-card">
<h2>Error</h2>
<p>${data.error || "Unknown Error"}</p>
<pre style="white-space:pre-wrap;">${data.raw || ""}</pre>
</div>
`;
return;
}

if (!Array.isArray(data.results)) {
results.innerHTML = `
<div class="result-card">
<h2>Error</h2>
<p>Response tidak memiliki data results.</p>
</div>
`;
return;
}

if (data.results.length === 0) {
results.innerHTML = `
<div class="result-card">
<h2>Tidak ada hasil</h2>
<p>Coba keyword lain.</p>
</div>
`;
return;
}

let html = "";

data.results.forEach(item => {

html += `
<div class="result-card">

<h2>${item.channel}</h2>

<div class="badge">
Opportunity Score ${item.opportunity}
</div>

<p><strong>Subscribers:</strong> ${item.subscribers}</p>

<p><strong>Average Views:</strong> ${item.views}</p>

<p><strong>Upload Frequency:</strong> ${item.uploads}</p>

<p>${item.description}</p>

<p>
<a href="${item.url}" target="_blank">
Open Channel
</a>
</p>

</div>
`;

});

results.innerHTML = html;

} catch (error) {

loading.style.display = "none";
results.style.display = "block";

results.innerHTML = `
<div class="result-card">
<h2>Error</h2>
<p>${error.message}</p>
</div>
`;

}

});