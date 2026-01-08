import React, {
  useRef,
  useEffect,
  useContext,
  useState
} from "react";

// 🔹 images, icons wagairah
import assets from "../assets/assets";

// 🔹 message ka time format karne ke liye
import { formatMessageTime } from "../lib/utils";

// 🔹 Chat related data aur functions
import { ChatContext } from "../context/ChatContext";

// 🔹 Login user aur online users ka data
import { AuthContext } from "../context/AuthContext";

// 🔹 popup message ke liye
import { toast } from "react-hot-toast";

const ChatContainer = () => {

  // 🔹 ChatContext se values le rahe hain
  const {
    messages,          // sab messages
    selectedUser,      // jis user se chat chal rahi hai
    setSelectedUser,   // selected user change karne ke liye
    sendMessage,       // message bhejne ka function
    getMessages        // messages fetch karne ka function
  } = useContext(ChatContext);

  // 🔹 AuthContext se login user aur online users
  const { authUser, onlineUsers } = useContext(AuthContext);

  // 🔹 auto scroll ke liye reference
  const scrollEnd = useRef(null);

  // 🔹 input box ka state
  const [input, setInput] = useState("");

  // ================= SEND TEXT MESSAGE =================
  const handleSendMessage = async (e) => {
    e.preventDefault();

    // agar input empty hai to message mat bhejo
    if (input.trim() === "") return;

    // message send karo
    await sendMessage({ text: input.trim() });

    // input clear kar do
    setInput("");
  };

  // ================= SEND IMAGE MESSAGE =================
  const handleSendImage = async (e) => {
    const file = e.target.files[0];

    // agar image nahi hai to error dikhao
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }

    // image ko base64 me convert kar rahe hain
    const reader = new FileReader();

    reader.onloadend = async () => {
      // image ko message ke form me send karo
      await sendMessage({ image: reader.result });

      // input reset
      e.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  // ================= MESSAGES FETCH KARNA =================
  useEffect(() => {
    // jab bhi selectedUser change ho
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    // jab naya message aaye to last tak scroll
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ================= UI RENDER =================
  return selectedUser ? (
    <div className="h-full overflow-hidden relative backdrop-blur-lg">

      {/* ========== HEADER ========== */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">

        {/* user profile image */}
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />

        {/* user name + online status */}
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>

        {/* back arrow (mobile ke liye) */}
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 cursor-pointer"
        />

        {/* help icon (desktop) */}
        <img
          src={assets.help_icon}
          alt=""
          className="max-md:hidden max-w-5"
        />
      </div>

      {/* ========== CHAT AREA ========== */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${
              msg.senderId !== authUser._id ? "flex-row-reverse" : ""
            }`}
          >
            {/* agar message image hai */}
            {msg.image ? (
              <img
                src={msg.image}
                alt=""
                className="max-w-[230px] border border-gray-700 rounded-lg mb-8"
              />
            ) : (
              // text message
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                  msg.senderId === authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}

            {/* sender image + time */}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser?.profilePic || assets.avatar_icon
                    : selectedUser?.profilePic || assets.avatar_icon
                }
                alt=""
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}

       
        <div ref={scrollEnd}></div>
      </div>

      {/* ========== INPUT AREA ========== */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">

          {/* message input */}
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) =>
              e.key === "Enter" ? handleSendMessage(e) : null
            }
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent"
          />

          {/* image input */}
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />

          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>

        {/* send button */}
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt=""
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    // jab koi user select nahi ho
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} className="max-w-16" alt="" />
      <p className="text-lg font-medium text-white">
        Chat anytime, anywhere
      </p>
    </div>
  );
};

export default ChatContainer;
