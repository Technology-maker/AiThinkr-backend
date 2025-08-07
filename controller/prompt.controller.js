import OpenAI from "openai";
import dotenv from "dotenv";
import { Prompt } from "../model/prompt.model.js";
dotenv.config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY || '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'
});

export const sendPrompt = async (req, res) => {
  const { content } = req.body;
  const userId = req.userId;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    // Save user prompt to DB
    const userPrompt = await Prompt.create({
      userId,
      role: "user",
      content,
    });

    // Call DeepSeek via OpenRouter
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [{ role: "user", content }],
    });

    const aiContent = completion.choices[0].message.content;

    if (!aiContent) {
      throw new Error("AI response is empty or invalid");
    }

    // Save AI response to DB
    const aiMessage = await Prompt.create({
      userId,
      role: "assistant",
      content: aiContent,
    });

    return res.status(200).json({ reply: aiContent });

  } catch (error) {
    console.error("Error in sendPrompt:", error);
    return res.status(500).json({
      error: error?.response?.data || error.message || "Unknown error occurred",
    });
  }
};
