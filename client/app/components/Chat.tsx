import { Message } from "../app/page";

const Chat = ({ data }: { data: Array<Message> }) => {
  return (
    <div className="flex flex-col gap-2 p-4">
      {data.map((message: Message, index: number) => (
        <div
          key={index}
          className={`flex ${
            message.type === "sent" ? "justify-end" : "justify-start"
          }`}
        >
          <div className="max-w-[75%]">
            <div
              className={`text-xs font-medium ${
                message.type === "sent"
                  ? "text-right text-blue-600"
                  : "text-left text-gray-600"
              }`}
            >
              {message.username}
            </div>
            <div
              className={`rounded-lg px-4 py-2 mt-1 text-sm shadow-md ${
                message.type === "sent"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chat;
