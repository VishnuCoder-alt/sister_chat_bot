// File: api/chat.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

// IMPORTANT: This is how we get the secret API key from Vercel's environment variables.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { history, systemInstruction } = req.body;

    if (!history) {
      return res.status(400).json({ error: 'Chat history is required.' });
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
        systemInstruction: systemInstruction,
    });
    
    // Vercel's free plan has a 10-second timeout. For chat, we don't need history,
    // we just need the last user message to generate a response.
    // The front-end will manage the full history.
    const lastUserMessage = history.pop(); // Get the latest message

    const chat = model.startChat({
        history: history, // Start with the previous context
    });
    
    const result = await chat.sendMessage(lastUserMessage.parts[0].text);
    const response = result.response;
    const text = response.text();

    res.status(200).json({ text });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
}   