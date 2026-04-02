import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import draftRoutes from "./routes/draftRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", draftRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
