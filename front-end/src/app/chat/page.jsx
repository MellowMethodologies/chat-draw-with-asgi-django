import React from 'react'
import Chat from './components/chat/Chat.jsx'
import List from './components/list/List.jsx'
import Detail from './components/detail/Detail.jsx'
import style from './style.module.css'

function Page() {
  return (
    <div className={style.body}>
      <div className={style.container}>
        <div className={style.list}>
          <List/>
        </div>
        <div className={style.chat}>
          <Chat/>
        </div>
        <div className={style.detail}>
          <Detail/>
        </div>
      </div>
    </div>
  )
}

export default Page