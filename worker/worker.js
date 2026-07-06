export default {

  async fetch(request, env) {

    if (request.method === "OPTIONS") {

      return new Response(null,{
        headers:{
          "Access-Control-Allow-Origin":"*",
          "Access-Control-Allow-Headers":"*",
          "Access-Control-Allow-Methods":"GET,POST,OPTIONS"
        }
      });

    }

    const url = new URL(request.url);

    if(url.pathname!=="/search"){

      return new Response(
        JSON.stringify({
          success:true,
          message:"Hidden Gems AI Worker Online"
        }),
        {
          headers:{
            "content-type":"application/json",
            "Access-Control-Allow-Origin":"*"
          }
        }
      );

    }

    const keyword=url.searchParams.get("keyword")||"";

    const country=url.searchParams.get("country")||"global";

    const language=url.searchParams.get("language")||"english";

    const score=Number(
      url.searchParams.get("score")||80
    );

    if(keyword===""){

      return new Response(
        JSON.stringify({
          success:false,
          error:"Keyword is required."
        }),
        {
          status:400,
          headers:{
            "content-type":"application/json",
            "Access-Control-Allow-Origin":"*"
          }
        }
      );

    }

    const prompt=`

You are an elite YouTube Growth Analyst.

Find 10 hidden YouTube channels.

Keyword:
${keyword}

Country:
${country}

Language:
${language}

Minimum Opportunity Score:
${score}

Return ONLY JSON.

Format:

{
"results":[
{
"channel":"",
"subscribers":"",
"views":"",
"uploads":"",
"opportunity":95,
"description":"",
"url":""
}
]
}

`;

    try{

      const geminiResponse=await fetch(

        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="+env.GEMINI_API_KEY,

        {

          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify({

            generationConfig:{
              responseMimeType:"application/json",
              temperature:0.4
            },

            contents:[
              {
                parts:[
                  {
                    text:prompt
                  }
                ]
              }
            ]

          })

        }

      );
      if (!geminiResponse.ok) {

  const errorText = await geminiResponse.text();

  return new Response(
    JSON.stringify({
      success: false,
      status: geminiResponse.status,
      error: "Gemini API request failed.",
      details: errorText
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

      const gemini=await geminiResponse.json();

      const rawText=

        gemini?.candidates?.[0]?.content?.parts?.[0]?.text ||

        "";

      if(rawText===""){

        return new Response(
          JSON.stringify({
            success:false,
            error:"Gemini returned empty response."
          }),
          {
            status:500,
            headers:{
              "content-type":"application/json",
              "Access-Control-Allow-Origin":"*"
            }
          }
        );

      }

      let cleanText=rawText
      .replace(/```json/gi,"")
      .replace(/```/g,"")
      .trim();

      let parsed;

      try{

        parsed=JSON.parse(cleanText);

      }

      catch(error){

        return new Response(
          JSON.stringify({
            success:false,
            error:"Gemini returned invalid JSON.",
            raw:cleanText
          }),
          {
            status:500,
            headers:{
              "content-type":"application/json",
              "Access-Control-Allow-Origin":"*"
            }
          }
        );

      }

      if(!parsed.results){

        parsed.results=[];

      }

      if(!Array.isArray(parsed.results)){

        parsed.results=[];

      }

      parsed.results=parsed.results.map(item=>({

        channel:item.channel||"Unknown",

        subscribers:item.subscribers||"Unknown",

        views:item.views||"Unknown",

        uploads:item.uploads||"Unknown",

        opportunity:Number(item.opportunity||0),

        description:item.description||"",

        url:item.url||"https://youtube.com"

      }));

      return new Response(

        JSON.stringify({

          success:true,

          total:parsed.results.length,

          keyword,

          results:parsed.results

        }),

        {

          headers:{

            "content-type":"application/json",

            "Access-Control-Allow-Origin":"*"

          }

        }

      );

    }
    catch(error){

      return new Response(

        JSON.stringify({

          success:false,

          error:error.message || "Unknown server error"

        }),

        {

          status:500,

          headers:{

            "content-type":"application/json",

            "Access-Control-Allow-Origin":"*"

          }

        }

      );

    }

  }

};