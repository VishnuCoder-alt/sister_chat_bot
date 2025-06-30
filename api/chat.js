// File: api/chat.js

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// This is the default export for Vercel's API routes
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { history } = req.body; // We only need the history now

    if (!history) {
      return res.status(400).json({ error: 'Chat history is required.' });
    }

    // Initialize the model without a system instruction
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    // Use the simpler generateContent which is great for stateless API calls
    const result = await model.generateContent({
      contents: history,
    });

    const response = result.response;
    const text = response.text();

    res.status(200).json({ text });

  } catch (error) {
    // This will now log more specific errors from the Gemini API if they happen
    console.error('Error inside API function:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
}