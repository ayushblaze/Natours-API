const app = require("./app");

// START THE SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`Server is up on port ${port}📡`);
});