const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJha3NoYXlhamlsbGVsYUBnbWFpbC5jb20iLCJleHAiOjE3ODE3NjUyOTAsImlhdCI6MTc4MTc2NDM5MCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjRjNmNjNmYzLTZkMjMtNDg1MS1hY2RlLTI3ZmI0MmU4MjIxOCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImppbGxlbGEgYWtzaGF5YSIsInN1YiI6IjYwMDMzYzZmLTMzMTMtNDUxYy1hOThjLTY1NThhY2I0YTI5ZSJ9LCJlbWFpbCI6ImFrc2hheWFqaWxsZWxhQGdtYWlsLmNvbSIsIm5hbWUiOiJqaWxsZWxhIGFrc2hheWEiLCJyb2xsTm8iOiIyMzAzYTUxNjI5IiwiYWNjZXNzQ29kZSI6ImJEcmVBcSIsImNsaWVudElEIjoiNjAwMzNjNmYtMzMxMy00NTFjLWE5OGMtNjU1OGFjYjRhMjllIiwiY2xpZW50U2VjcmV0Ijoia0NUQVplUnpLcFBncllEQSJ9.64vmCG8vsPBjXcRtyw5Du11KDrkd1HvrAhTm4r_xA1Q";

axios.get(
  "http://4.224.186.213/evaluation-service/depots",
  {
    headers: {
      Authorization: `Bearer ${TOKEN}`
    }
  }
)
.then(res => console.log(res.data))
.catch(err => console.log(err.response?.data));