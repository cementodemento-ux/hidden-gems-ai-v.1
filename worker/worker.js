export default {
  async fetch(request) {

    return new Response(
      JSON.stringify({
        success: true,
        message: "Worker Connected Successfully"
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
        }
      }
    );

  }
}