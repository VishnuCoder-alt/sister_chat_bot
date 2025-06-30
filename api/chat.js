// File: api/chat.js

// --- CORRECTED: Use 'import' instead of 'require' ---
import { GoogleGenerativeAI } from "@google/generative-ai";

// This is how we get the secret API key from Vercel's environment variables.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// This is the default export for Vercel's API routes
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
    
    // We send the previous history to the model for context
    const chat = model.startChat({
        history: history.slice(0, -1), // Send all but the last user message
    });
    
    // And we send the newest user message to get the next response
    const lastUserMessage = history[history.length - 1];
    
    const result = await chat.sendMessage(lastUserMessage.parts[0].text);
    const response = result.response;
    const text = response.text();

    res.status(200).json({ text });

  } catch (error) {
    // This will now log more specific errors from the Gemini API if they happen
    console.error('Error inside API function:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
}