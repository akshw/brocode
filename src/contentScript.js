function extractProblemInfo() {
  let problemTitleElement = document.querySelector(
    "h1, h2, h3, p[class*='font-semibold'], div[class*='text-xl']"
  );
  let problemTitle = problemTitleElement
    ? problemTitleElement.innerText.trim()
    : "Not found";

  let problemStatementElement = document.querySelector(
    "div[class*='px-[22px]'] > p, div[class*='text-lg']"
  );
  let problemStatement = problemStatementElement
    ? problemStatementElement.innerText.trim()
    : "Not found";

  let fullProblemStatement = problemTitle + "\n\n" + problemStatement;

  let sampleOutputElement = document.querySelector(
    "pre[class*='bg-slate-100'][class*='rounded-md'][class*='p-'][class*='text-black']"
  );
  let sampleOutput = sampleOutputElement
    ? sampleOutputElement.innerText.trim()
    : "Not found";

  let explanationElement = document.querySelector("ul, ol");
  let explanation = explanationElement
    ? explanationElement.innerText.trim()
    : "Not found";

  return {
    problemStatement: fullProblemStatement,
    explanation,
    sampleOutput,
  };
}

function extractUserCode() {
  let editor = document.querySelector(".monaco-editor");
  if (editor) {
    let code = editor.querySelector("textarea")?.value || "";
    return code;
  }
  return "Monaco editor not found";
}

function injectButton() {
  if (document.getElementById("ask-brocode-btn")) {
    return;
  }

  // Create the button
  const button = document.createElement("button");
  button.id = "ask-brocode-btn";
  button.textContent = "Ask Brocode";
  button.style.position = "fixed";
  button.style.right = "50px";
  button.style.top = "110px";
  button.style.zIndex = "9999";
  button.style.padding = "10px 15px";
  button.style.backgroundColor = "#FFD700"; // Gold/Yellow
  button.style.color = "#2D3648"; // Dark blue-gray text
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
  button.style.fontWeight = "bold";

  // Add hover effect
  button.addEventListener("mouseover", () => {
    button.style.backgroundColor = "#FFBF00"; // Darker gold
  });
  button.addEventListener("mouseout", () => {
    button.style.backgroundColor = "#FFD700"; // Gold/Yellow
  });

  // Add click event
  button.addEventListener("click", async () => {
    const problemInfo = extractProblemInfo();
    const userCode = extractUserCode();

    // Create modal for user to ask question
    createModal(problemInfo, userCode);
  });

  // Add button to the page
  document.body.appendChild(button);
}

// Function to create a modal for user interaction
function createModal(problemInfo, userCode) {
  // Remove existing modal if any
  let existingModal = document.getElementById("brocode-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // Define color palette
  const colors = {
    primary: "#FFD700", // Gold/Yellow
    primaryDark: "#FFBF00", // Darker gold for hover
    primaryLight: "#FFFACD", // Lemon chiffon (light yellow)
    secondary: "#FFFFFF", // White background
    border: "#FFE45C", // Light gold border
    text: "#2D3648", // Dark blue-gray text
    textLight: "#555555", // Light text
  };

  // Create modal container
  const modal = document.createElement("div");
  modal.id = "brocode-modal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.right = "0";
  modal.style.bottom = "0";
  modal.style.zIndex = "10000";
  modal.style.backgroundColor = colors.secondary;
  modal.style.padding = "0";
  modal.style.boxShadow = "-4px 0 8px rgba(0, 0, 0, 0.2)";
  modal.style.width = "400px";
  modal.style.border = "none";
  modal.style.borderLeft = `2px solid ${colors.border}`;
  modal.style.transition = "transform 0.3s ease-in-out";
  modal.style.transform = "translateX(0)";
  modal.style.display = "flex";
  modal.style.flexDirection = "column";

  // Create header
  const header = document.createElement("div");
  header.style.padding = "15px 20px";
  header.style.borderBottom = `1px solid ${colors.border}`;
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.backgroundColor = colors.primary;
  header.style.color = colors.text;

  const headerTitle = document.createElement("h2");
  headerTitle.textContent = "Ask Brocode";
  headerTitle.style.margin = "0";
  headerTitle.style.color = colors.text;
  headerTitle.style.fontSize = "18px";
  headerTitle.style.fontWeight = "bold";

  // Create close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.style.backgroundColor = "transparent";
  closeButton.style.border = "none";
  closeButton.style.fontSize = "24px";
  closeButton.style.cursor = "pointer";
  closeButton.style.color = colors.text;
  closeButton.style.padding = "0";
  closeButton.style.lineHeight = "1";
  closeButton.addEventListener("click", () => {
    modal.style.transform = "translateX(100%)";
    setTimeout(() => {
      modal.remove();
    }, 300);
  });

  header.appendChild(headerTitle);
  header.appendChild(closeButton);

  // Create chat history container
  const chatHistory = document.createElement("div");
  chatHistory.id = "brocode-chat-history";
  chatHistory.style.flex = "1";
  chatHistory.style.overflowY = "auto";
  chatHistory.style.padding = "15px";
  chatHistory.style.display = "flex";
  chatHistory.style.flexDirection = "column";
  chatHistory.style.gap = "15px";
  chatHistory.style.backgroundColor = colors.secondary;

  // Create input area at the bottom
  const inputArea = document.createElement("div");
  inputArea.style.padding = "15px";
  inputArea.style.borderTop = `1px solid ${colors.border}`;
  inputArea.style.backgroundColor = colors.primary;
  inputArea.style.display = "flex";
  inputArea.style.flexDirection = "column";
  inputArea.style.gap = "10px";

  const textarea = document.createElement("textarea");
  textarea.placeholder = "Ask for a hint or help with your code...";
  textarea.style.width = "100%";
  textarea.style.height = "80px";
  textarea.style.padding = "10px";
  textarea.style.borderRadius = "5px";
  textarea.style.border = `1px solid ${colors.border}`;
  textarea.style.resize = "none";
  textarea.style.boxSizing = "border-box";
  textarea.style.fontFamily = "inherit";
  textarea.style.backgroundColor = colors.secondary;

  const button = document.createElement("button");
  button.textContent = "Get Help";
  button.style.padding = "10px 15px";
  button.style.backgroundColor = colors.primary;
  button.style.color = colors.text;
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  button.style.fontWeight = "bold";
  button.style.width = "100%";
  button.style.boxSizing = "border-box";
  button.style.transition = "background-color 0.2s";

  // Add hover effect for button
  button.addEventListener("mouseover", () => {
    button.style.backgroundColor = colors.primaryDark;
  });
  button.addEventListener("mouseout", () => {
    button.style.backgroundColor = colors.primary;
  });

  inputArea.appendChild(textarea);
  inputArea.appendChild(button);

  // Function to add a message to the chat history
  function addMessageToChat(content, isUser = false) {
    const messageContainer = document.createElement("div");
    messageContainer.style.display = "flex";
    messageContainer.style.flexDirection = "column";
    messageContainer.style.maxWidth = "90%";
    messageContainer.style.alignSelf = isUser ? "flex-end" : "flex-start";

    const messageBubble = document.createElement("div");
    messageBubble.style.padding = "12px";
    messageBubble.style.borderRadius = "12px";
    messageBubble.style.backgroundColor = isUser ? colors.primary : "#F8F8F8";
    messageBubble.style.color = colors.text;
    messageBubble.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";
    messageBubble.style.border = isUser ? "none" : `1px solid #E0E0E0`;

    if (isUser) {
      messageBubble.textContent = content;
    } else {
      messageBubble.innerHTML = formatResponse(content);
      messageBubble.style.whiteSpace = "pre-wrap";
    }

    messageContainer.appendChild(messageBubble);
    chatHistory.appendChild(messageContainer);

    // Scroll to the bottom of the chat history
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  // Add event listener to the button
  button.addEventListener("click", async () => {
    const userQuestion = textarea.value.trim();
    if (!userQuestion) return;

    // Add user message to chat
    addMessageToChat(userQuestion, true);

    // Clear the textarea
    textarea.value = "";

    // Add loading message
    const loadingMessage = document.createElement("div");
    loadingMessage.style.display = "flex";
    loadingMessage.style.alignItems = "center";
    loadingMessage.style.gap = "8px";
    loadingMessage.style.padding = "12px";
    loadingMessage.style.borderRadius = "12px";
    loadingMessage.style.backgroundColor = "#F8F8F8";
    loadingMessage.style.border = `1px solid #E0E0E0`;
    loadingMessage.style.alignSelf = "flex-start";
    loadingMessage.style.maxWidth = "90%";
    loadingMessage.style.color = colors.text;

    // Add loading animation
    const loadingDots = document.createElement("div");
    loadingDots.textContent = "Thinking";
    loadingDots.style.position = "relative";

    // Create the dot animation
    const animateDots = () => {
      let dots = 0;
      return setInterval(() => {
        dots = (dots + 1) % 4;
        loadingDots.textContent = "Thinking" + ".".repeat(dots);
      }, 300);
    };

    const dotsInterval = animateDots();
    loadingMessage.appendChild(loadingDots);

    chatHistory.appendChild(loadingMessage);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // Disable button while loading
    button.disabled = true;

    try {
      // Send message to background script
      chrome.runtime.sendMessage(
        {
          action: "getHelp",
          data: {
            userQuestion: userQuestion,
            problemInfo: problemInfo,
            userCode: userCode,
          },
        },
        (response) => {
          // Clear interval
          clearInterval(dotsInterval);

          // Remove loading message
          chatHistory.removeChild(loadingMessage);

          // Display the response
          if (response && response.answer) {
            addMessageToChat(response.answer);
          } else {
            addMessageToChat("Sorry, there was an error getting a response.");
          }

          // Re-enable button
          button.disabled = false;
        }
      );
    } catch (error) {
      // Clear interval
      clearInterval(dotsInterval);

      // Remove loading message
      chatHistory.removeChild(loadingMessage);

      // Display error
      addMessageToChat("Error: " + error.message);

      // Re-enable button
      button.disabled = false;
    }
  });

  // Add event listener for Enter key (with Shift+Enter for new line)
  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      button.click();
    }
  });

  // Append elements to modal
  modal.appendChild(header);
  modal.appendChild(chatHistory);
  modal.appendChild(inputArea);

  // Add to page
  document.body.appendChild(modal);

  // Trigger animation to slide in from right
  setTimeout(() => {
    modal.style.transform = "translateX(0)";
  }, 10);

  // Focus the textarea
  textarea.focus();
}

// Helper function to format AI response with Markdown-like syntax
function formatResponse(text) {
  // Convert markdown code blocks to HTML
  let formatted = text.replace(
    /```([a-z]*)\n([\s\S]*?)\n```/g,
    "<pre><code>$2</code></pre>"
  );

  // Convert line breaks to <br>
  formatted = formatted.replace(/\n/g, "<br>");

  // Bold text
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italic text
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");

  return formatted;
}

// Run the injection when the page is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", injectButton);
} else {
  injectButton();
}

// Re-inject the button when the page changes (for single-page applications)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(injectButton, 1000); // Wait a second for the page to load
  }
}).observe(document, { subtree: true, childList: true });
