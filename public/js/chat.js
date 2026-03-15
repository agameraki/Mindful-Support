// Chat functionality for Dodo
const chatButton = document.getElementById('chat-button');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

// Toggle chat window
chatButton.addEventListener('click', () => {
    chatWindow.classList.add('active');
    chatButton.style.display = 'none';
});

chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('active');
    chatButton.style.display = 'flex';
});

// Send message
function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Get bot response
    setTimeout(() => {
        const response = getBotResponse(message);
        addMessage(response, 'bot');
    }, 500);
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;
    
    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    messageDiv.appendChild(bubble);
    messageDiv.appendChild(time);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Simple bot responses
function getBotResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    // Crisis keywords
    if (lowerMsg.includes('suicide') || lowerMsg.includes('kill myself') || lowerMsg.includes('end it')) {
        return "🫧 I'm really concerned. Please reach out: National Suicide Prevention Lifeline: 988 or Crisis Text Line: Text HOME to 741741. You matter!";
    }
    
    // Greetings
    if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey')) {
        return "🫧 Hi there! I'm Dodo, your wellness companion. How are you feeling today?";
    }
    
    // Anxiety
    if (lowerMsg.includes('anxious') || lowerMsg.includes('anxiety') || lowerMsg.includes('worried') || lowerMsg.includes('nervous')) {
        return "🫧 Anxiety can feel overwhelming. Try this: Take a deep breath - in for 4, hold for 4, out for 4. Check out our breathing exercises in Resources!";
    }
    
    // Sadness
    if (lowerMsg.includes('sad') || lowerMsg.includes('down') || lowerMsg.includes('depressed')) {
        return "🫧 I hear you. It's okay to feel sad. Your feelings are valid. Have you tried journaling? Sometimes writing helps process emotions.";
    }
    
    // Stress
    if (lowerMsg.includes('stress') || lowerMsg.includes('overwhelm')) {
        return "🫧 Stress is tough. Remember to take breaks. Try a 5-minute meditation or quick walk. You're doing better than you think!";
    }
    
    // Positive
    if (lowerMsg.includes('good') || lowerMsg.includes('great') || lowerMsg.includes('happy')) {
        return "🫧 That's wonderful! I'm so glad you're feeling good. Keep that positive energy going!";
    }
    
    // Thanks
    if (lowerMsg.includes('thank')) {
        return "🫧 You're very welcome! I'm always here to help. Take care of yourself! 💙";
    }
    
    // Help/features
    if (lowerMsg.includes('help') || lowerMsg.includes('what can you')) {
        return "🫧 I can chat about your feelings, suggest breathing exercises, or point you to resources. Just tell me what's on your mind!";
    }
    
    // Default
    const responses = [
        "🫧 I'm here to listen. Tell me more about how you're feeling.",
        "🫧 That sounds challenging. Would you like to talk about it?",
        "🫧 I understand. Remember, you're not alone in this journey.",
        "🫧 Thank you for sharing. How can I support you right now?",
        "🫧 Your feelings are valid. What would help you feel better?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Welcome message
setTimeout(() => {
    addMessage("Hi! I'm Dodo 🫧 your wellness companion. How are you feeling today?", 'bot');
}, 500);