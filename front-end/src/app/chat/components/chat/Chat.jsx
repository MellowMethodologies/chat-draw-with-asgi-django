import React from 'react'
import style from './Chat.module.scss'
import UserInfo from './UserInfo/UserInfo'
import IMessage from "./IMessage/IMessage"
import TextField from "./textField/TextField"


const Chat = () => {
  return (
    <div className={style.chat}>
      <UserInfo name={"receiver"} pic={"/avatars/2.jpeg"}/>
      <IMessage />
      <TextField />
    </div>
  )
}

export default Chat
