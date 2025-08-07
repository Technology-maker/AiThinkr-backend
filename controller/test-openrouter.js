import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY || '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'}`,
  },
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "deepseek/deepseek-r1:free",
    messages: [{ role: "user", content: "What is the capital of Spain?" }],
  });

  console.log(completion.choices[0].message.content);
}

main();
