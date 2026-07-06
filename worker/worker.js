export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    if (url.pathname !== "/search") {
      return new Response("Hidden Gems AI Worker OK", {
        status: 200,
        headers: {
          "content-type": "text/plain",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    const keyword = url.searchParams.get("keyword") || "";
    const country = url.searchParams.get("country") || "global";
    const language = url.searchParams.get("language") || "english";
    const score = Number(url.searchParams.get("score") || 80);

    const prompt = `
You are an expert YouTube growth analyst.

Find 10 hidden YouTube channels.

Keyword: ${keyword}
Country: ${country}
Language: ${language}
Minimum Opportunity Score: ${score}

Return ONLY valid JSON.

Example:

{
"results":[
{
"channel":"Channel Name",
"subscribers":"12K",
"views":"45K",
"uploads":"4 videos/week",
"opportunity":91,
"description":"Reason why this channel is promising.",
"url":"https://youtube.com/@channel"
}
]
}
`;

    try {

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
            ]
          })
        }
      );

      const gemini = await response.json();

      let text =
        gemini?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let parsed;

      try {
        parsed = JSON.parse(text);
      } catch {

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

      if (!parsed.results) {
        parsed.results = [];
      }

      return new Response(
        JSON.stringify({
          success: true,
          results: parsed.results
        }),
        {
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );

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