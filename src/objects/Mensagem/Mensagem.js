import React from "react";
import {useState, useEffect} from 'react'
import styles from './Mensagem.module.css'

function Mensagem({tipo, texto}) {

  const [visible, setVisible] = useState(false)
  
  useEffect (() => {
    if(!texto){
      setVisible(false)
      return
    }
    setVisible(true)

    const timer = setTimeout(() => {
      setVisible(false)
    }, 3000);

    return () => clearTimeout(timer)

  }, [texto])

    return(
      <>
        {visible && (
          <div className={`${styles.mensagem} ${styles[tipo]}`}>{texto}</div>
        )}
      </>
    )
}

export default Mensagem