export default {
  async fetch(request, env) {

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "*"
        }
      });
    }

    try {

      const body = await request.json();

      const {
        keyword,
        country,
        language,
        minimumScore
      } = body;

      const prompt = `
You are an elite YouTube Hidden Gems researcher.

Return ONLY valid JSON.

Schema:

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

Find YouTube channels matching:

Keyword: ${keyword}

Country: ${country}

Language: ${language}

Minimum Opportunity Score:
${minimumScore}

Requirements:

- AI friendly
- Hidden channels
- High growth
- No music
- No gaming
- No celebrities
- No politics
- No religion

Return only JSON.
`;

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + env.GEMINI_API_KEY,
        {
          method: "POST",
          headers: {
            "Content-Type":"application/json"
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
              topP: 0.95,
              maxOutputTokens: 8192,
              responseMimeType: "application/json"
            }
          })
        }
      );

      const raw = await response.text();

      if (!response.ok) {
        return new Response(
          JSON.stringify({
            success: false,
            status: response.status,
            error: "Gemini Error",
            details: raw
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }

      const gemini = JSON.parse(raw);

      let text =
        gemini?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const data = JSON.parse(text);

      return new Response(
        JSON.stringify({
          success: true,
          results: data.results || []
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    } catch (error) {

      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
          stack: error.stack
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );

    }

  }
};