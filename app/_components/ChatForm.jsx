import { Send } from "lucide-react";
import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!inputRef?.current) {
      console.error("Input element not found! Current ref:", inputRef);
      return;
    }

    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;

    // Update chat history
    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);

    // Thinking... animation for bot's response
    setTimeout(() => {
      let dots = 0;
      const maxDots = 3;
      const thinkingMsgId = Date.now(); // إنشاء ID فريد للرسالة

      const thinkingInterval = setInterval(() => {
        dots = (dots + 1) % (maxDots + 1);
        const thinkingText = "Thinking" + ".".repeat(dots);

        setChatHistory((history) => {
          // إزالة أي رسالة "Thinking" سابقة وإضافة الجديدة
          const newHistory = history.filter(
            (msg) => !msg.id || msg.id !== thinkingMsgId
          );
          return [
            ...newHistory,
            { role: "model", text: thinkingText, id: thinkingMsgId },
          ];
        });
      }, 300);

      // استدعاء الرد الحقيقي للبوت
      generateBotResponse([...chatHistory, { role: "user", text: userMessage }])
        .then(() => {
          // إزالة رسالة "Thinking..." عند وصول الرد
          setChatHistory((history) =>
            history.filter((msg) => !msg.id || msg.id !== thinkingMsgId)
          );
          clearInterval(thinkingInterval);
        })
        .catch((error) => {
          console.error("Error generating bot response:", error);
          clearInterval(thinkingInterval);
        });

      inputRef.current.value = "";
    }, 600);
  };

  return (
    <form onSubmit={handleFormSubmit} className="chat-form">
      <input
        ref={inputRef}
        type="text"
        placeholder="Write you message here..."
        className="message-input"
        required
        aria-label="حقل إدخال الرسالة"
      />
      <button
        type="submit"
        className="material-symbols-rounded flex text-center justify-center"
        aria-label="إرسال الرسالة"
      >
        <Send fill="#ffffff" size={20} className=" items-center" />
      </button>
    </form>
  );
};

export default ChatForm;
