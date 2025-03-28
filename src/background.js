import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "paste gemini api key here";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getHelp") {
    getAIResponse(message.data)
      .then((response) => {
        sendResponse({ answer: response });
      })
      .catch((error) => {
        console.error("Error getting AI response:", error);
        sendResponse({ error: error.message });
      });

    return true;
  }
});

// Function to get AI response
async function getAIResponse(data) {
  try {
    const { userQuestion, problemInfo, userCode } = data;

    // Construct the prompt
    let prompt = `You are BroCode, an AI assistant helping a coding student solve a programming problem on the Kodnest App.

Problem Statement:
${problemInfo.problemStatement}

Sample Output:
${problemInfo.sampleOutput}

Additional Explanation:
${problemInfo.explanation}

The student's current code:
\`\`\`
${userCode}
\`\`\`

The student asks:
${userQuestion}

Please provide a helpful response that guides the student without directly solving the entire problem for them. 
If their code has issues, point them out and suggest improvements. Use code examples where appropriate. Be concise but thorough. 
Give the student the hint to solve the problem. Give the code if the student asks for it explicitly.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return response;
  } catch (error) {
    console.error("Error in getAIResponse:", error);
    throw new Error("Failed to get response from AI: " + error.message);
  }
}
