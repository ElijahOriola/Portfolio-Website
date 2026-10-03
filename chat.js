document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('screenTransitionOverlay');
  const mainWebsite = document.getElementById('mainWebsiteWrapper');
  const resumeWorkspace = document.getElementById('resumeWorkspace');
  const chatWorkspace = document.getElementById('chatWorkspace');
  
  const resumeLinks = document.querySelectorAll('a[href="#resume"]');
  const chatLinks = document.querySelectorAll('a[href="#chatspace"]');
  const workspaceNavLinks = document.querySelectorAll('.workspace-nav-link');
  const cvBtn = document.getElementById('cvBtn');          
  const aboutCvBtn = document.getElementById('aboutCvBtn'); 

  // Create Master Widget Wrapper to lock button and mini chat together
  const widgetWrapper = document.createElement('div');
  widgetWrapper.className = 'chat-widget-wrapper';
  widgetWrapper.id = 'chatWidgetWrapper';

  // Create chat toggle button
  const chatToggleBtn = document.createElement('button');
  chatToggleBtn.className = 'chat-toggle-btn';
  chatToggleBtn.id = 'chatToggleBtn';
  chatToggleBtn.setAttribute('aria-label', 'Open Chat');
  chatToggleBtn.innerHTML = '<i class="fas fa-comment-dots"></i><span class="online-indicator"></span>';
  
  // Create mini chatbox container
  const chatboxContainer = document.createElement('div');
  chatboxContainer.className = 'chatbox-container';
  chatboxContainer.id = 'chatboxContainer';
  chatboxContainer.innerHTML = `
    <div class="chatbox-header" id="chatboxHeader">
      <div class="chatbox-profile-info">
        <div class="chatbox-avatar-wrapper">
          <div class="chatbox-avatar"></div>
          <span class="online-badge"></span>
        </div>
        <div class="chatbox-user-details">
          <h4>Oriola Chatbox</h4>
          <span>Active Now</span>
        </div>
      </div>
      <button class="chatbox-close-btn" id="chatCloseBtn">&times;</button>
    </div>
    <div class="chatbox-messages" id="chatboxMessages">
      <div class="chat-message ai">Hi there! I'm Oriola's AI assistant. Ask me anything about his IT background, education at PCU, or tech projects!</div>
    </div>
    <form class="chatbox-input-form" id="chatForm">
      <input type="text" class="chatbox-input" id="chatInput" placeholder="Type a message..." autocomplete="off">
      <button type="submit" class="chatbox-send-btn"><i class="fas fa-paper-plane"></i></button>
    </form>
  `;

  widgetWrapper.appendChild(chatboxContainer);
  widgetWrapper.appendChild(chatToggleBtn);
  document.body.appendChild(widgetWrapper);

  const chatHeader = document.getElementById('chatboxHeader');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatMessages = document.getElementById('chatboxMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');

  const fullscreenChatMessages = document.getElementById('fullscreenChatMessages');
  const fullscreenChatForm = document.getElementById('fullscreenChatForm');
  const fullscreenChatInput = document.getElementById('fullscreenChatInput');

  // --- Universal Drag Handler for Both Elements ---
  let hasMoved = false;

  function makeDraggable(handleElement) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    handleElement.addEventListener('mousedown', (e) => {
      if (e.target.closest('#chatCloseBtn')) return;
      
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;

      const rect = widgetWrapper.getBoundingClientRect();
      widgetWrapper.style.right = 'auto';
      widgetWrapper.style.bottom = 'auto';
      widgetWrapper.style.left = `${rect.left}px`;
      widgetWrapper.style.top = `${rect.top}px`;

      initialLeft = rect.left;
      initialTop = rect.top;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMoved = true;
      }

      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;

      const maxLeft = window.innerWidth - widgetWrapper.offsetWidth;
      const maxTop = window.innerHeight - widgetWrapper.offsetHeight;

      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      newTop = Math.max(0, Math.min(newTop, maxTop));

      widgetWrapper.style.left = `${newLeft}px`;
      widgetWrapper.style.top = `${newTop}px`;
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  }

  makeDraggable(chatToggleBtn);
  makeDraggable(chatHeader);

  chatToggleBtn.addEventListener('click', () => {
    if (hasMoved) return;
    chatboxContainer.classList.toggle('active');
    if (chatboxContainer.classList.contains('active')) {
      chatInput.focus();
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });

  if (chatCloseBtn) {
    chatCloseBtn.addEventListener('click', () => {
      chatboxContainer.classList.remove('active');
    });
  }

  function updateMiniChatVisibility() {
    const isChatActive = chatWorkspace && chatWorkspace.classList.contains('active');
    if (isChatActive) {
      widgetWrapper.style.display = 'none';
      chatboxContainer.classList.remove('active');
    } else {
      widgetWrapper.style.display = 'flex';
    }
  }

  function openResumeWorkspace(e) {
    e.preventDefault();
    resumeLinks.forEach(item => item.classList.add('active'));
    chatLinks.forEach(item => item.classList.remove('active'));

    if (overlay && mainWebsite && resumeWorkspace && chatWorkspace) {
      overlay.classList.add('active');
      setTimeout(() => {
        mainWebsite.classList.add('hidden');
        chatWorkspace.classList.remove('active');
        resumeWorkspace.classList.add('active');
        window.scrollTo(0, 0);
        updateMiniChatVisibility();
        setTimeout(() => overlay.classList.remove('active'), 150);
      }, 350);
    }
  }

  resumeLinks.forEach(link => link.addEventListener('click', openResumeWorkspace));
  if (cvBtn) cvBtn.addEventListener('click', openResumeWorkspace);
  if (aboutCvBtn) aboutCvBtn.addEventListener('click', openResumeWorkspace);

  chatLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      chatboxContainer.classList.remove('active');
      resumeLinks.forEach(item => item.classList.remove('active'));
      chatLinks.forEach(item => item.classList.add('active'));

      if (overlay && mainWebsite && resumeWorkspace && chatWorkspace) {
        overlay.classList.add('active');
        setTimeout(() => {
          mainWebsite.classList.add('hidden');
          resumeWorkspace.classList.remove('active');
          chatWorkspace.classList.add('active');
          window.scrollTo(0, 0);
          updateMiniChatVisibility();
          setTimeout(() => overlay.classList.remove('active'), 150);
        }, 350);
      }
    });
  });

  workspaceNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      resumeLinks.forEach(item => item.classList.remove('active'));
      chatLinks.forEach(item => item.classList.remove('active'));

      if (overlay && mainWebsite && resumeWorkspace && chatWorkspace) {
        overlay.classList.add('active');
        setTimeout(() => {
          chatWorkspace.classList.remove('active');
          resumeWorkspace.classList.remove('active');
          mainWebsite.classList.remove('hidden');

          if (targetId === 'resume') {
            mainWebsite.classList.add('hidden');
            resumeWorkspace.classList.add('active');
            resumeLinks.forEach(item => item.classList.add('active'));
          } else if (targetId === 'chatspace') {
            mainWebsite.classList.add('hidden');
            chatWorkspace.classList.add('active');
            chatLinks.forEach(item => item.classList.add('active'));
          } else {
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
              targetSection.scrollIntoView({ behavior: 'auto' });
            } else {
              window.scrollTo(0, 0);
            }
          }

          updateMiniChatVisibility();
          setTimeout(() => overlay.classList.remove('active'), 150);
        }, 350);
      }
    });
  });

  window.addEventListener('scroll', updateMiniChatVisibility);
  updateMiniChatVisibility();

  // Knowledge Base and Conversational Handlers
  const greetings = ['hello', 'hi', 'hey', 'greetings', 'sup', 'good morning', 'good afternoon', 'good evening'];
  
  const greetingReplies = [
    "Hey there! How's your day going? Feel free to ask me anything about Oriola's projects or tech background!",
    "Hello! Great to chat with you. What can I help you find out about Oriola today?",
    "Hi! How are you doing? Let me know if you want to explore Oriola's portfolio or IT background.",
    "Hey! Good to see you here. How can I help you out?"
  ];

  const knowledgeBase = [
    {
      keywords: ['project', 'projects', 'built', 'portfolio', 'doing', 'app', 'website'],
      phrases: ["Oriola has built over 15+ practical projects spanning full-stack web applications, responsive user interfaces, and mobile design concepts."]
    },
    {
      keywords: ['education', 'school', 'university', 'pcu', 'student', 'degree', 'coursework'],
      phrases: ["Oriola is currently a dedicated 4th-year Bachelor of Science in Information Technology (BSIT) student at Philippine Christian University (PCU)."]
    },
    {
      keywords: ['experience', 'work', 'job', 'capstone', 'intern', 'freelance'],
      phrases: ["Professionally, he has served as an IT project lead, infrastructure support assistant, and freelance web developer delivering custom solutions."]
    },
    {
      keywords: ['skills', 'stack', 'languages', 'code', 'technologies', 'figma', 'design'],
      phrases: ["His core technical stack spans full-stack web engineering, database management, network administration, and UI/UX prototyping using Figma, Adobe XD, and Photoshop."]
    },
    {
      keywords: ['contact', 'email', 'phone', 'hire', 'reach', 'connect'],
      phrases: ["You can easily connect with him via phone at 0916 466 6167 or drop an email directly to olaoluwa.oriola@pcu.edu.ph."]
    }
  ];

  const defaultFallbacks = [
    "That's a fascinating question! Oriola focuses heavily on building robust full-stack applications and maintaining reliable digital solutions."
  ];

  function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateHumanizedResponse(userText) {
    const textLower = userText.toLowerCase().trim();

    // Check if the input is a simple greeting
    if (greetings.some(greet => textLower === greet || textLower.startsWith(greet + ' '))) {
      return getRandomItem(greetingReplies);
    }

    // Otherwise check knowledge base
    for (const group of knowledgeBase) {
      if (group.keywords.some(keyword => textLower.includes(keyword))) {
        return getRandomItem(group.phrases);
      }
    }
    
    return getRandomItem(defaultFallbacks);
  }

  function showTypingIndicator(container) {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
  }

  function removeTypingIndicator() {
    const typingDiv = document.getElementById('typingIndicator');
    if (typingDiv) {
      typingDiv.remove();
    }
  }

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const messageText = chatInput.value.trim();
      if (!messageText) return;
      appendMessage(chatMessages, messageText, 'user');
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      showTypingIndicator(chatMessages);

      setTimeout(() => {
        removeTypingIndicator();
        const aiReply = generateHumanizedResponse(messageText);
        appendMessage(chatMessages, aiReply, 'ai');
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1000);
    });
  }

  if (fullscreenChatForm) {
    fullscreenChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const messageText = fullscreenChatInput.value.trim();
      if (!messageText) return;
      appendMessage(fullscreenChatMessages, messageText, 'user');
      fullscreenChatInput.value = '';
      fullscreenChatMessages.scrollTop = fullscreenChatMessages.scrollHeight;

      showTypingIndicator(fullscreenChatMessages);

      setTimeout(() => {
        removeTypingIndicator();
        const aiReply = generateHumanizedResponse(messageText);
        appendMessage(fullscreenChatMessages, aiReply, 'ai');
        fullscreenChatMessages.scrollTop = fullscreenChatMessages.scrollHeight;
      }, 1000);
    });
  }

  function appendMessage(container, text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    msgDiv.textContent = text;
    container.appendChild(msgDiv);
  }
});