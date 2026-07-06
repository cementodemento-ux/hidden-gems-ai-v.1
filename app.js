document.getElementById("app").innerHTML = `
<div class="container">

<h1>Hidden Gems AI</h1>

<p class="subtitle">
Find High Potential YouTube Hidden Gems
</p>

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
<option value="us">United States</option>
<option value="id">Indonesia</option>
<option value="in">India</option>
<option value="br">Brazil</option>
<option value="jp">Japan</option>
</select>
</div>

<div class="form-group">
<label>Language</label>
<select id="language">
<option value="english">English</option>
<option value="indonesia">Indonesia</option>
<option value="spanish">Spanish</option>
<option value="portuguese">Portuguese</option>
<option value="japanese">Japanese</option>
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
`;

const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", () => {

    const keyword = document.getElementById("keyword").value.trim();

    const country = document.getElementById("country").value;

    const language = document.getElementById("language").value;

    const score = document.getElementById("score").value;

    alert(
`Keyword : ${keyword}

Country : ${country}

Language : ${language}

Minimum Score : ${score}`
    );

});