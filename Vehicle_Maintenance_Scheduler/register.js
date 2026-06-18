const axios = require("axios");

axios.post(
  "http://4.224.186.213/evaluation-service/register",
  {
    email: "akshayajillela@gmail.com",
    name: "Jillela Akshaya",
    mobileNo: "9989074039",
    githubUsername: "Akshayajillela",
    rollNo: "2303A51629",
    accessCode: "bDreAq"
  }
)
.then(res => {
    console.log(res.data);
})
.catch(err => {
    console.log(err.response?.data || err.message);
});