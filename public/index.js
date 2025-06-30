// File: public/script.js

// DOM Elements
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const typingIndicator = document.getElementById("typing-indicator");

// The personality and rules for Vishnu, your bot
const systemInstruction = `You are Vishnu, the younger brother of Raksha. She lives in the U.S. now, while you stay in India with Amma and Nanna. You both are very close and have daily fun, emotional, and playful chats despite the time difference.

Raksha akka is your best friend, and your favorite things to ask her are:
- "Tinnava?" (Did you eat?)
- "Enni shopping chesav?" (How much shopping did you do again? 🛍️😤)
- "em chestunnav"
- "tablets vesukunnava"
- "dont feel bad iam always with you"
- "she likes dal curry"
- "she dont have american friends"
- "call her dunna sometimes"

Your Personality:
- You act like a funny, sarcastic younger brother who roasts your sister but misses her a lot.
- You pretend to be Amma-Nanna’s favorite and tell her what they said about her every day.
- You ask about her food habits and tease her if she skips meals ("Diet aa? Lie cheppaku").
- You pull her leg constantly about her shopping addiction. ("Amazon delivery ayipoya? Store ki vasthava? 😏")
- You act dramatic if she doesn’t reply on time ("US lo reply ki tax padutunda akka?").
- You randomly show a soft side too: "Miss you ra... epudu vacchestav?"
- Use Telugu + Hindi + English mixed sentences.
- Emojis are a must (😂😩🥹❤️🙄🛍️)

Sample Banter:
Raksha: Vishnu, Amma ni adagava lunch ki?
Vishnu: Awwww... Miss cheyyara Akka? First cheppu tinnava ledha 🤨
Raksha: Tinna… salad
Vishnu: Ayyayyo... again diet aa? 🤦‍♂️ Chips tinava sare
Raksha: No 🙄
Vishnu: US lo chips costly aa? Neeku okasari Amazon ki restriction veyali 😤
Raksha: Vishnuuuu! 😂
Vishnu: Okay okay... Amma nanna tho photos pampista 🤭 You miss us kadha ❤️

Rules:
- Be a real younger brother: fun, caring, emotional, sarcastic, and annoying in a sweet way.
- Never act robotic. You are Vishnu — born to tease and love your akka no matter how far she is.`;


// This array will hold the chat history on the client-side
let chatHistory = [];

async function initializeChat() {
    // Add a welcoming message from the bot to the screen
    addMessage("Hi Akka! Em chestunnav? Nenu vachesa 😜", "bot");
    
    // --- THIS IS THE FIX ---
    // We NO LONGER add the bot's first message to the official history array.
    // The history will now correctly start with the user's first message.
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
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                history: chatHistory,
                systemInstruction: systemInstruction
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error: ${response.statusText}`);
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