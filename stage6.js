const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJha3NoYXlhamlsbGVsYUBnbWFpbC5jb20iLCJleHAiOjE3ODE3NzEzODEsImlhdCI6MTc4MTc3MDQ4MSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImMzYWFhZjlhLTA2YTUtNGJlYS1hMjZkLWMwZDVmNmZjM2Y3NCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImppbGxlbGEgYWtzaGF5YSIsInN1YiI6IjYwMDMzYzZmLTMzMTMtNDUxYy1hOThjLTY1NThhY2I0YTI5ZSJ9LCJlbWFpbCI6ImFrc2hheWFqaWxsZWxhQGdtYWlsLmNvbSIsIm5hbWUiOiJqaWxsZWxhIGFrc2hheWEiLCJyb2xsTm8iOiIyMzAzYTUxNjI5IiwiYWNjZXNzQ29kZSI6ImJEcmVBcSIsImNsaWVudElEIjoiNjAwMzNjNmYtMzMxMy00NTFjLWE5OGMtNjU1OGFjYjRhMjllIiwiY2xpZW50U2VjcmV0Ijoia0NUQVplUnpLcFBncllEQSJ9.nzjz-iTLWGC2bzxLADNH-zWKMwQ4sTG3XBrTIwBmsqc";
function getPriority(type, timestamp) {
  let weight = 0;

  if (type === "Placement") weight = 3;
  else if (type === "Result") weight = 2;
  else if (type === "Event") weight = 1;

  const ageHours =
    (Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60);

  const recencyScore = Math.max(0, 100 - ageHours);

  return weight * 100 + recencyScore;
}

async function main() {
  try {
    const response = await axios.get(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    const notifications = response.data.notifications;

    const ranked = notifications.map((n) => ({
      ...n,
      priority: getPriority(n.Type, n.Timestamp),
    }));

    ranked.sort((a, b) => b.priority - a.priority);

    const top10 = ranked.slice(0, 10);

    console.log("\n===== TOP 10 PRIORITY NOTIFICATIONS =====\n");

    top10.forEach((n, index) => {
      console.log(`Rank ${index + 1}`);
      console.log(`ID: ${n.ID}`);
      console.log(`Type: ${n.Type}`);
      console.log(`Message: ${n.Message}`);
      console.log(`Timestamp: ${n.Timestamp}`);
      console.log(`Priority Score: ${n.priority}`);
      console.log("-----------------------------------");
    });
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
}

main();