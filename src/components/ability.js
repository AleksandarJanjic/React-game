import React from 'react';

const Ability = (props) => {

  let selectAbility = props.abilityClick;

  return (
    <div>
      <p>{props.name}</p>
      <img src={props.icon} alt='' onClick={() => selectAbility(props.id)}/>
    </div>
  );
}


export default Ability;
