const { execPath } = require("process");
const app = require("./app");
const { server } = require("./services/socket");
require("dotenv").config();
const PORT = process.env.PORT || 3005;


server.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
