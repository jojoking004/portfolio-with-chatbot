// ===== MOCKAPI CONFIGURATION =====
const novaConfig = {
    mockAPI: {
      url: 'https://mockapi.io/clone/680c65412ea307e081d3def2',
      enabled: true
    },
    fallbackResponses: [
      "I'm having connection issues. Try again later!",
      "My knowledge base seems unavailable at the moment.",
      "Let me try that again... seems my connection is unstable."
    ]
  };
  
  // ===== ENHANCED NOVA CHATBOT =====
  async function generateNovaResponse(input) {
    // First check for local commands
    const localResponse = handleLocalCommands(input);
    if (localResponse) return localResponse;
  
    try {
      // Try MockAPI connection
      if (novaConfig.mockAPI.enabled) {
        const apiResponse = await fetchMockAPIResponse(input);
        if (apiResponse) return apiResponse;
      }
      
      return getRandomFallback();
    } catch (error) {
      console.error("API Error:", error);
      return handleAPIError(input);
    }
  }
  
  // ===== MOCKAPI INTEGRATION =====
  async function fetchMockAPIResponse(input) {
    try {
      // First get all responses from MockAPI
      const response = await fetch(novaConfig.mockAPI.url);
      const data = await response.json();
      
      // Find the best matching response
      const lowerInput = input.toLowerCase();
      const matchedResponse = data.find(item => 
        item.triggers.some(trigger => lowerInput.includes(trigger.toLowerCase()))
      );
      
      return matchedResponse?.response || null;
    } catch (error) {
      console.error("MockAPI Error:", error);
      return null;
    }
  }
  
  // ===== MOCKAPI DATA STRUCTURE =====
  /*
  Create these endpoints in your MockAPI dashboard:
  
  Endpoint: /responses
  Sample Data:
  [
    {
      "id": "1",
      "triggers": ["project", "work", "portfolio"],
      "response": "My projects:\n1. Cosmic Explorer - 3D space journey\n2. Neon Dreams - Music visualizer\n3. Quantum Interface - Spatial UI"
    },
    {
      "id": "2",
      "triggers": ["three.js", "three js", "webgl"],
      "response": "Three.js is a powerful JavaScript library for 3D graphics:\n• Creates WebGL animations\n• Handles models/lights/cameras\n• Used in most 3D projects"
    },
    {
      "id": "3",
      "triggers": ["contact", "email", "reach"],
      "response": "Contact options:\n1. Form on Contact page\n2. Email: hello@syeddev.com\n3. LinkedIn: linkedin.com/in/syeddev"
    }
  ]
  */
  
  // ===== UPDATED INIT FUNCTION =====
  function initNovaChatbot() {
    const chatbot = document.getElementById('nova-chatbot-trigger');
    const container = document.getElementById('nova-chatbot-container');
    const closeBtn = document.getElementById('nova-chatbot-close');
    const sendBtn = document.getElementById('nova-chatbot-send');
    const input = document.getElementById('nova-chatbot-input');
    const messages = document.getElementById('nova-chatbot-messages');
    
    let isFirstInteraction = true;
  
    // Toggle chatbot
    chatbot.addEventListener('click', () => {
      container.classList.toggle('active');
      if (container.classList.contains('active')) {
        input.focus();
      }
    });
  
    // Close chatbot
    closeBtn.addEventListener('click', () => {
      container.classList.remove('active');
    });
  
    // Async send function
    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;
      
      addNovaMessage(text, 'user');
      input.value = '';
      
      showTypingIndicator();
      
      try {
        const response = await generateNovaResponse(text);
        addNovaMessage(response || "I couldn't understand that. Try asking differently.", 'bot');
        
        if (isFirstInteraction) {
          addQuickReplies();
          isFirstInteraction = false;
        }
      } catch (error) {
        console.error("Error:", error);
        addNovaMessage("Sorry, I encountered an error. Please try again.", 'bot');
      }
      
      messages.scrollTop = messages.scrollHeight;
    }
  
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
  
  // ===== INTEGRATION WITH EXISTING CODE =====
  // Replace your existing generateNovaResponse and initNovaChatbot functions
  // Keep all other functions (addNovaMessage, showTypingIndicator, etc.) the same
  
  // ===== TESTING THE IMPLEMENTATION =====
  // 1. First set up your MockAPI.io account
  // 2. Create a new project and add the /responses endpoint
  // 3. Add sample responses (see data structure above)
  // 4. Update the novaConfig.mockAPI.url with your MockAPI URL
  // 5. Test with these commands:
  async function testChatbot() {
    console.log("Testing projects query:");
    console.log(await generateNovaResponse("What projects have you done?"));
    
    console.log("Testing tech query:");
    console.log(await generateNovaResponse("Tell me about three.js"));
    
    console.log("Testing contact query:");
    console.log(await generateNovaResponse("How can I contact you?"));
  }
  
  testChatbot();