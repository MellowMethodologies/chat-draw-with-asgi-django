import React from 'react'
import style from './UserInfo.module.scss'
import Image from 'next/image'

export default function UserInfo({ name, pic, status }) {
  return (
    <div className={style.userInfo}>
      <Image priority src={pic} alt={name} width={60} height={60} />
      <div className={style.nameStatus}>
        <h2>{name}</h2>
        <span>status</span>
      </div>
    </div>
  )
}