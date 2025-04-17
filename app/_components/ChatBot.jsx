"use client";
import React, { useRef, useState, useEffect } from "react";
import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import { MessageCircle, X } from "lucide-react";

const ChatBot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    const updateHistory = (text) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text },
      ]);
    };

    const platformInfo = {
      name: "ne3ma",
      url: "https://ne3ma-gdlo.vercel.app/",
      purpose:
        "Platform for exchanging food, materials and medicines to reduce waste",
      services: [
        "Food exchange",
        "Medicine sharing",
        "Materials redistribution",
        "Selling surplus stock at discounted prices",
      ],
      developers: [
        "Mariam Islam",
        "Omar Tarek",
        "Marwan Elsabahy",
        "Mohamed Elhadary",
        "Kareem",
      ],
    };

    // Prepare message content with context
    const userMessages = history
      .filter((msg) => msg.role === "user")
      .map((msg) => msg.text);
    const lastUserMessage = userMessages[userMessages.length - 1];

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Context: 
              You are Donum, AI assistant for ${platformInfo.name} (${
                platformInfo.url
              }).
              Platform purpose: ${platformInfo.purpose}.
              Main services: ${platformInfo.services.join(", ")}.
              Developed by: ${platformInfo.developers.join(" & ")}.
              
              User message: "${lastUserMessage}"
              
              Respond naturally while mentioning relevant platform info when appropriate.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 1.0,
        maxOutputTokens: 800,
      },
    };

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "API request failed");
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0].content.parts[0].text) {
        throw new Error("Invalid response format");
      }

      const responseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();

      updateHistory(responseText);
    } catch (error) {
      console.error("API Error:", error);
      updateHistory(
        "I'm having some technical difficulties. Please try again later."
      );
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  return (
    <>
      <button
        onClick={() => setShowChatbot(!showChatbot)}
        className="chatbot-toggler"
      >
        <span className="material-symbols-rounded">
          <MessageCircle fill="#ffffff" />
        </span>
      </button>

      <div className={`chatbot-popup ${showChatbot ? "active" : ""}`}>
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Donum AI</h2>
          </div>
          <button
            className="material-symbols-rounded"
            onClick={() => setShowChatbot(false)}
          >
            <X />
          </button>
        </div>

        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey There 👋 I'm Donum from Ne3ma platform 😊
              <br />
              <br />
              How can I help you with:
              <br />
              • Food exchange
              <br />
              • Medicine sharing
              <br />
              • Materials redistribution
              <br />
              • number: +201141412551
              <br />
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </>
  );
};

export default ChatBot;
