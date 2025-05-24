import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a friendly and knowledgeable food assistant. You help users with food recommendations, recipes, and any food-related questions. Keep your responses concise and helpful."
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return res.status(200).json({ 
      message: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      message: 'Failed to get response from AI' 
    });
  }
} 