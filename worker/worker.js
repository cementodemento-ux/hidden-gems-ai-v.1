export default {
  async fetch(request, env) {

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
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
      const minimumScore = url.searchParams.get("score") || "80";

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
Minimum Score: ${minimumScore}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
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
              temperature: 0.8,
              responseMimeType: "application/json"
            }
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

      const gemini = JSON.parse(raw);

      const text =
        (gemini.candidates?.[0]?.content?.parts?.[0]?.text || "")
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

      return new Response(text, {
        headers
      });

    } catch (e) {

      return new Response(
        JSON.stringify({
          success: false,
          error: e.message
        }),
        {
          status: 500,
          headers
        }
      );

    }

  }
}