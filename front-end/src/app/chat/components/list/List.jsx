import React from 'react'
import style from './List.module.scss'
import UserInfo from './UserInfo/UserInfo'
import ChatList from './ChatList/ChatList'

const List = () => {
  return (
    <div className={style.list}>
      <UserInfo name={"saad"} pic={"/avatars/1.jpeg"}/>
      <ChatList />
    </div>
  )
}

export default List
