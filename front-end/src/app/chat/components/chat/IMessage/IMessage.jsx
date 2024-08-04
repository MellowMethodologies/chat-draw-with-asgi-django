import React from "react";
import style from "./IMessage.module.scss";

function message(msg){
    return (
        <div className={style.msg}>

        </div>
    )
}

function IMessage(){
    return(
        <div className={style.Mcontainer}>
            <div className={style.mainMessageContainer}>
                <p>hello</p>
            </div>
        </div>
    )
}

export default IMessage