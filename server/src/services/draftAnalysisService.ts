import Anthropic from "@anthropic-ai/sdk";
import { DraftState, HeroRecommendation } from "../models/types.js";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config/env.js";

const client = new Anthropic({ apiKey: config.anthropicApiKey });

export const analyzeDraft = async (draftState: DraftState): Promise<HeroRecommendation[]> => {
  const prompt = `You are a Dota 2 expert analyst. Based on the following draft state, recommend 3-5 hero picks for the user's team.

Draft State:
- User's team: ${draftState.userTeam}
- Allied picks: ${draftState.alliedPicks.join(", ") || "none yet"}
- Enemy picks: ${draftState.enemyPicks.join(", ") || "none yet"}
- Banned heroes: ${draftState.bans.join(", ") || "none"}

Consider:
1. Counter-picks against enemy heroes
2. Synergy with allied heroes
3. Current meta viability
4. Role balance (carry, mid, offlane, support)
5. What roles are missing from the allied lineup
6. Do NOT recommend any banned heroes

Respond ONLY with valid JSON array (no markdown, no explanation):
[
  {
    "heroName": "Hero Name",
    "reasoning": "Brief explanation of why this hero is good here",
    "confidence": 85,
    "role": "carry | midlane | offlane | soft_support | hard_support"
  }
]`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 16000,
    thinking: {
      type: "enabled",
      budget_tokens: 10000,
    },
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textContent = response.content.find((block) => block.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const jsonText = textContent.text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  const parsed: Array<Omit<HeroRecommendation, "id" | "draftStateId">> = JSON.parse(jsonText);

  return parsed.map((rec) => ({
    id: uuidv4(),
    draftStateId: draftState.id,
    heroName: rec.heroName,
    reasoning: rec.reasoning,
    confidence: rec.confidence,
    role: rec.role,
  }));
};
