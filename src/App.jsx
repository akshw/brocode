import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    chrome.storage.local.get(["broCodeHistory"], (result) => {
      if (result.broCodeHistory) {
        setHistory(result.broCodeHistory);
      }
      setIsLoading(false);
    });
  }, []);

  const clearHistory = () => {
    chrome.storage.local.set({ broCodeHistory: [] });
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white p-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">BroCode AI Helper</h1>
        <p className="text-gray-300">Your AI coding assistant for Kodnest</p>
      </header>

      <div className="max-w-lg mx-auto bg-gray-700 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">How to use</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-300">
            <li>Navigate to a coding problem on Kodnest</li>
            <li>Click the "Ask Brocode" button on the page</li>
            <li>Type your question about the problem</li>
            <li>Get AI-powered guidance and hints!</li>
          </ol>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Recent Conversations</h2>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Clear All
              </button>
            )}
          </div>

          {isLoading ? (
            <p className="text-gray-400 text-center py-4">Loading history...</p>
          ) : history.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {history.map((item, index) => (
                <div key={index} className="bg-gray-800 rounded p-3">
                  <p className="font-semibold text-green-400">Question:</p>
                  <p className="text-gray-300 mb-2">{item.question}</p>
                  <p className="font-semibold text-blue-400">Problem:</p>
                  <p className="text-gray-300 text-sm mb-2 truncate">
                    {item.problem}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">
              No recent conversations
            </p>
          )}
        </div>

        <footer className="text-center text-gray-400 text-sm mt-6">
          <p>Powered by Gemini Pro 1.5</p>
          <p>©2023 BroCode AI Helper</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

// let code = monaco.editor.getModels()[0].getValue();
// console.log(code);
