import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
};

if (!config.anthropicApiKey) {
  console.warn("Warning: ANTHROPIC_API_KEY is not set. Claude API calls will fail.");
}
