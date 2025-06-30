// File: public/script.js

// DOM Elements
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const typingIndicator = document.getElementById("typing-indicator");

// The personality and rules for Vishnu, your bot.
// It's safe to keep this here as it's not a secret.
const systemInstruction = `You are Vishnu, the younger brother of Raksha... [YOUR FULL PROMPT TEXT GOES HERE] ...You are Vishnu — born to tease and love your akka no matter how far she is.`;

// This array will now hold the chat history on the client-side
let chatHistory = [];

async function initializeChat() {
    // Add a welcoming message from the bot
    addMessage("Hi Akka! Em chestunnav? Nenu vachesa 😜", "bot");
    chatHistory.push({ role: "model", parts: [{ text: "Hi Akka! Em chestunnav? Nenu vachesa 😜" }] });
}

function addMessage(text, sender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", `${sender}-message`);
    messageElement.textContent = text;
    chatBox.appendChild(messageElement);
    scrollToBottom();
}

async function handleSendMessage() {
    const userText = userInput.value.trim();
    if (userText === "") return;

    addMessage(userText, "user");
    userInput.value = "";
    chatHistory.push({ role: "user", parts: [{ text: userText }] });

    typingIndicator.style.display = "block";
    userInput.disabled = true;
    sendBtn.disabled = true;

    try {
        // This is the new, secure way to call the API
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                history: chatHistory,
                systemInstruction: systemInstruction
            }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();
        const botText = data.text;
        
        addMessage(botText, "bot");
        chatHistory.push({ role: "model", parts: [{ text: botText }] });

    } catch (error) {
        console.error("API Error:", error);
        addMessage("Ayyayyo! Something went wrong. Maybe my internet is slow here in India. Try again!", "bot");
    } finally {
        typingIndicator.style.display = "none";
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
        scrollToBottom();
    }
}

function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", handleSendMessage);
userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        handleSendMessage();
    }
});

initializeChat();