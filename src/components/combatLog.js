import React from 'react';

const CombatLog = (props) => {

  let messages = ["game starts", "first turn"];

  let toPrint = messages.map((msg) => {
    return <p key={msg}>{msg}</p>
  })

  return (
    <div className="log">
      {toPrint}
    </div>
  )
}

export default CombatLog;
