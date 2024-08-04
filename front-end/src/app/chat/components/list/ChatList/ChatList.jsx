import React from 'react'
import style from './ChatList.module.scss'
import { FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { IoReturnUpBack } from 'react-icons/io5';
import Image from 'next/image';

function User({ id, name, pic, rank }) {
  return (
      <div className={style.friend}>
        <div className={style.userInfo}>
          <Image height={75} width={75} src={pic} alt={name} className={style.userPic} />
          <div className={style.nameChat}>
            <span className={style.userName}>{name} {rank}</span>
            <p className={style.lastMessage}>Last message</p>
          </div>
        </div>

        <div className={style.notification}>
          <span>notif</span>
        </div>


      </div>
  )
}
function ChatList() {
  const users = [
    { id: 1, name: "John", pic: "/avatars/1.jpeg",  },
    { id: 2, name: "Doe", pic: "/avatars/1.jpeg" },
    { id: 3, name: "John Doe", pic: "/avatars/3.jpeg" },
    { id: 4, name: "Jane", pic: "/avatars/2.jpeg" },
    { id: 5, name: "Smith ", pic: "/avatars/2.jpeg" },
    { id: 6, name: "Jane Smith", pic: "/avatars/3.jpeg" },
    { id: 7, name: "Jane Smith", pic: "/avatars/3.jpeg" },
  ];
  
  
  return (
    <div>
     
     
     {/*                     search field                   */}
     <div className={style.textDiv}>

      <div className={style.textField}>
        
        < FiSearch className={style.searchIcon}/>
        
        <input className={style.textSearch} placeholder="Search By Name" label="Search" type='text'/>
      
      </div>
        
        <FaPlus className={style.add}/>
     
     </div>
      {/* ************************************************* */}


    {/*                     the friends field                    */}
    
      <div className={style.friends}>
        {users.map(user => (
          <User key={user.id} id={user.id} name={user.name} rank={"{rank}"} pic={user.pic} />
        ))}
      </div>
    
    {/*  ************************************************* */}
    </div>
  )
}

export default ChatList
