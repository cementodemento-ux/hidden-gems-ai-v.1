document.getElementById("app").innerHTML = `
<div class="container">

<h1>Hidden Gems AI</h1>

<p class="subtitle">
Discover high-potential YouTube channels using AI.
</p>

<div class="card">

<div class="form-group">
<label>Keyword / Niche</label>
<input
id="keyword"
type="text"
placeholder="Example: AI Tools">
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
<input
id="score"
type="number"
value="80"
min="1"
max="100">
</div>

<button id="searchButton">
Search Hidden Gems
</button>

</div>

<div id="loading">
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

    if (keyword === "") {
        alert("Keyword wajib diisi");
        return;
    }

    loading.style.display = "block";
    results.style.display = "none";
    results.innerHTML = "";

    try {

        await new Promise(resolve => setTimeout(resolve, 1500));

        const demoData = [
            {
                channel: "AI Growth Lab",
                score: 92,
                subscribers: "18K",
                views: "45K",
                frequency: "3 videos/week",
                reason: "Fast subscriber growth with low competition.",
                url: "https://youtube.com"
            },
            {
                channel: "Future Tech Daily",
                score: 88,
                subscribers: "31K",
                views: "61K",
                frequency: "4 videos/week",
                reason: "Consistent uploads and strong engagement.",
                url: "https://youtube.com"
            }
        ];

        loading.style.display = "none";
        results.style.display = "block";

        let html = "";

        demoData.forEach(item => {

            html += `
            <div class="result-card">

                <h2>${item.channel}</h2>

                <div class="score">
                    Opportunity Score ${item.score}
                </div>

                <p><strong>Subscribers:</strong> ${item.subscribers}</p>

                <p><strong>Average Views:</strong> ${item.views}</p>

                <p><strong>Upload Frequency:</strong> ${item.frequency}</p>

                <p>${item.reason}</p>

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