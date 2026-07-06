export default {
  async fetch(request) {

    const url = new URL(request.url);

    if (url.pathname !== "/search") {
      return new Response("Hidden Gems AI Worker OK", {
        status: 200,
        headers: {
          "content-type": "text/plain"
        }
      });
    }

    const keyword = url.searchParams.get("keyword") || "";
    const country = url.searchParams.get("country") || "global";
    const language = url.searchParams.get("language") || "english";
    const score = Number(url.searchParams.get("score") || 80);

    const demo = [
      {
        channel:"AI Growth Lab",
        subscribers:"18K",
        views:"45K",
        uploads:"3 videos/week",
        opportunity:92,
        description:"Fast subscriber growth with low competition.",
        url:"https://youtube.com"
      },
      {
        channel:"Future Tech Daily",
        subscribers:"31K",
        views:"61K",
        uploads:"4 videos/week",
        opportunity:88,
        description:"Consistent uploads and strong engagement.",
        url:"https://youtube.com"
      },
      {
        channel:"AI Explained",
        subscribers:"12K",
        views:"30K",
        uploads:"5 videos/week",
        opportunity:85,
        description:"Strong evergreen content.",
        url:"https://youtube.com"
      }
    ];

    const results = demo.filter(x => x.opportunity >= score);

    return new Response(
      JSON.stringify({
        success:true,
        keyword,
        country,
        language,
        results
      }),
      {
        headers:{
          "content-type":"application/json",
          "Access-Control-Allow-Origin":"*"
        }
      }
    );

  }
}