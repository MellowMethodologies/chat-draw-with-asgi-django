import React from 'react'
import style from './textField.module.scss'

function textField() {
  return (
    <div className={style.textDiv}>
        <div className={style.textField}>
          <input className={style.textSearch} placeholder="Message.." label="send" type='text'/>
        </div>
    </div>
  )
}

export default textField
