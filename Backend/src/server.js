import dotenv from "dotenv";
import app from "./app.js";
import { server } from "./services/socket.js";

dotenv.config();

const PORT = process.env.PORT || 3005;

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
