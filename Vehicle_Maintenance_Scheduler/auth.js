const axios = require("axios");

axios.post(
  "http://4.224.186.213/evaluation-service/auth",
  {
    email: "akshayajillela@gmail.com",
    name: "jillela akshaya",
    rollNo: "2303a51629",
    accessCode: "bDreAq",
    clientID: "60033c6f-3313-451c-a98c-6558acb4a29e",
    clientSecret: "kCTAZeRzKpPgrYDA"
  }
)
.then((res) => {
    console.log(res.data);
})
.catch((err) => {
    console.log(err.response?.data || err.message);
});