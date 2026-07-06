export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/search") {
      return new Response("Hidden Gems AI Worker OK", {
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
You are a YouTube Growth Analyst.

Find hidden YouTube channels.

Keyword: ${keyword}
Country: ${country}
Language: ${language}
Minimum Opportunity Score: ${score}

Return ONLY valid JSON.

Format:

{
  "results":[
    {
      "channel":"...",
      "subscribers":"...",
      "views":"...",
      "uploads":"...",
      "opportunity":90,
      "description":"...",
      "url":"https://youtube.com/..."
    }
  ]
}
`;

    try {

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
          env.GEMINI_API_KEY,
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
            ]
          })
        }
      );

      const data = await response.json();

      const text =
        data.candidates[0].content.parts[0].text
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

      return new Response(text, {
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (e) {

      return new Response(
        JSON.stringify({
          success: false,
          error: e.message
        }),
        {
          status: 500,
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );

    }

  }
};