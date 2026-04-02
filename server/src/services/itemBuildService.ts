import Anthropic from "@anthropic-ai/sdk";
import { ItemBuildRequest, ItemSuggestion } from "../models/types.js";
import { config } from "../config/env.js";

const client = new Anthropic({ apiKey: config.anthropicApiKey });

export const suggestItemBuild = async (req: ItemBuildRequest): Promise<ItemSuggestion[]> => {
  const prompt = `You are a Dota 2 expert. Suggest a situational item build for ${req.heroName} playing as ${req.role}.

Draft context:
- User's team: ${req.userTeam}
- Allied picks: ${req.alliedPicks.join(", ") || "none"}
- Enemy picks: ${req.enemyPicks.join(", ") || "none"}
- Banned heroes: ${req.bans.join(", ") || "none"}

Popular items for this hero (from match statistics):
- Starting items: ${req.popularItems.start_game_items.join(", ") || "none"}
- Early game: ${req.popularItems.early_game_items.join(", ") || "none"}
- Mid game: ${req.popularItems.mid_game_items.join(", ") || "none"}
- Late game: ${req.popularItems.late_game_items.join(", ") || "none"}

Consider the popular items as a baseline, but adjust based on the enemy lineup. For example, if enemies have heavy magic damage, prioritize BKB or Pipe. If enemies have evasion, suggest MKB.

Respond ONLY with valid JSON array (no markdown, no explanation). Each entry should have a phase, list of 2-4 item names, and brief reasoning:
[
  {
    "phase": "starting",
    "items": ["Tango", "Iron Branch", "Quelling Blade"],
    "reasoning": "Standard lane sustain"
  },
  {
    "phase": "early",
    "items": ["Boots of Speed", "Magic Wand"],
    "reasoning": "Explanation"
  },
  {
    "phase": "core",
    "items": ["Item1", "Item2"],
    "reasoning": "Explanation considering enemy lineup"
  },
  {
    "phase": "luxury",
    "items": ["Item1", "Item2"],
    "reasoning": "Explanation"
  }
]

Use official Dota 2 item names.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 16000,
    thinking: {
      type: "enabled",
      budget_tokens: 8000,
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

  return JSON.parse(jsonText);
};
