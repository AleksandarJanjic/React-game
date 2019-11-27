import React from 'react';
import './css/unit.css';

const Unit = (props) => {
  let id = props.id;
  let clickHandle = props.clickHandle;
  let image = props.img;
  let hp = props.hp;
  let ap = props.ap;


  return (
    <div className="counter" onClick={() => clickHandle(id)}>
      <div className="hp">{hp}</div>
      <div className="ap">{ap}</div>
      <img className="icon" src={image} alt="some" />
    </div>
  )
}
export default Unit;
