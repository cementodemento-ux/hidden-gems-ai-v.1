export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
        }
      });
    }

    if (url.pathname !== "/search") {
      return new Response("Hidden Gems AI Worker", {
        headers: {
          "content-type": "text/plain"
        }
      });
    }

    const keyword = url.searchParams.get("keyword") || "";
    const country = url.searchParams.get("country") || "global";
    const language = url.searchParams.get("language") || "english";
    const score = Number(url.searchParams.get("score") || 80);

    const prompt = `
You are an elite YouTube Growth Analyst.

Find 10 hidden YouTube channels about:

Keyword: ${keyword}
Country: ${country}
Language: ${language}

Rules:

- Under 100,000 subscribers
- High engagement
- Fast growth
- Output ONLY valid JSON

JSON format:

{
  "results":[
    {
      "channel":"",
      "subscribers":"",
      "views":"",
      "uploads":"",
      "opportunity":90,
      "description":"",
      "url":""
    }
  ]
}
`;

    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=" +
      env.GEMINI_API_KEY;
      const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          maxOutputTokens: 8192,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {

      const error = await response.text();

      return new Response(
        JSON.stringify({
          success: false,
          status: response.status,
          error
        }),
        {
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    const gemini = await response.json();

    const text =
      gemini.candidates?.[0]?.content?.parts?.[0]?.text || "";
      let data;

    try {
      data = JSON.parse(text);
    } catch (e) {

      return new Response(
        JSON.stringify({
          success: false,
          error: "Gemini returned invalid JSON",
          raw: text
        }),
        {
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    if (!Array.isArray(data.results)) {
      data.results = [];
    }

    data.results = data.results.filter(item =>
      Number(item.opportunity || 0) >= score
    );

    return new Response(
      JSON.stringify({
        success: true,
        keyword,
        country,
        language,
        results: data.results
      }),
      {
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }

};