import React from 'react'
import style from './UserInfo.module.scss'
import Image from 'next/image'


export default function UserInfo({ name, pic }) {
  return (
    <div className={style.userInfo}>
      <Image priority src={pic} alt={name} width={80} height={80} />
      <h2>{name}</h2>
    </div>
  )
}