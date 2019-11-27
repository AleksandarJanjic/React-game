import React from 'react';
import Ability from './ability.js';
import './css/abilitiesTab.css';

const AbilitiesTab = (props) => {

  let unitId = props.unitId;
  let abilities = props.abilities;
  let useAbility = props.abilityClick;
  let selectedAbility = props.selectedAbility;

  console.log("Display Id of selected unit");
  console.log(unitId);

  let abilitiesToRender;

  if(unitId === null) {
    abilitiesToRender = <div><p> No unit selected </p></div>
  } else if (unitId !== null) {
    abilitiesToRender = abilities.map((ability) => {
        let res = <Ability name={ability.name} key={ability.id} id={ability.id} icon={ability.icon} unitId={unitId} abilityClick={useAbility}/>
        return res;
     })
   }

  let ability;
  if(unitId !== null) {
    ability = abilities.find(abilityToFetch => {
      return abilityToFetch.id === selectedAbility;
    })
  }

  let abilityDesc;
  if(selectedAbility === null) {
    abilityDesc = <div><p> No ability selected </p></div>
  } else {
    abilityDesc =
      <div>
        <p> {ability.name} </p>
      </div>
  }

  return (
      <div className='abilitiesMain'>
        <div className='abilitiesIcons'>
          {abilitiesToRender}
        </div>
        <div className='abilitiesDesc'>
          {abilityDesc}
        </div>
      </div>
    );
  }


export default AbilitiesTab;
