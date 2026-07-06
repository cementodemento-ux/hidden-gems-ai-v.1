export default {
  async fetch(request, env) {

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    try {

      const url = new URL(request.url);

      const keyword = url.searchParams.get("keyword") || "";
      const country = url.searchParams.get("country") || "global";
      const language = url.searchParams.get("language") || "english";
      const score = url.searchParams.get("score") || "80";

      const prompt = `
Return ONLY valid JSON.

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

Find hidden YouTube channels.

Keyword: ${keyword}
Country: ${country}
Language: ${language}
Minimum Score: ${score}
`;

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": env.GEMINI_API_KEY
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
            ]
          })
        }
      );

      const raw = await response.text();

      if (!response.ok) {
        return new Response(raw, {
          status: response.status,
          headers
        });
      }

      const data = JSON.parse(raw);

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

      return new Response(text, {
        headers
      });

    } catch (err) {

      return new Response(
        JSON.stringify({
          success: false,
          error: err.message
        }),
        {
          status: 500,
          headers
        }
      );

    }

  }
}