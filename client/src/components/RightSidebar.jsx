import React, { useState, useContext, useEffect } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'

const RightSidebar = () => {

  // selected user aur messages chat context se
  const { selectedUser, messages } = useContext(ChatContext)

  // logout function aur online users
  const { logout, onlineUsers } = useContext(AuthContext)

  // chat images store karne ke liye
  const [msgImages, setMsgImages] = useState([])

  // sirf image wale messages filter karke store kar rahe hain
  useEffect(() => {
    setMsgImages(
      messages.filter((msg) => msg.image).map((msg) => msg.image)
    )
  }, [messages])

  return selectedUser && (
    <div
      className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${
        selectedUser ? 'max-md:hidden' : ''
      }`}
    >
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">

        {/* user profile image */}
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt=""
          className="w-20 aspect-[1/1] rounded-full"
        />

        {/* user name + online indicator */}
        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          {onlineUsers.includes(selectedUser._id) && (
            <p className="w-2 h-2 rounded-full bg-green-500"></p>
          )}
          {selectedUser.fullName}
        </h1>

        {/* user bio */}
        <p className="px-10 mx-auto">{selectedUser.bio}</p>
      </div>

      <hr className="border-[#ffffff50] my-4" />

      {/* shared media section */}
      <div className="px-5 text-xs">
        <p>Media</p>

        <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
          {msgImages.map((url, index) => (
            <div
              key={index}
              onClick={() => window.open(url)}
              className="cursor-pointer rounded"
            >
              <img
                src={url}
                alt=""
                className="h-full rounded-md"
              />
            </div>
          ))}
        </div>
      </div>

      {/* logout button */}
      <button
        onClick={() => logout()}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer"
      >
        Logout
      </button>

    </div>
  )
}

export default RightSidebar
