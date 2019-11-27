import React from 'react';

const UnitBox = (props) => {
    let unit = props.unitID;
    let allUnits = props.allUnits;

    let unitBox;

    if(unit !== null) {
      let selectedUnit = allUnits.find(unitToFind => {
        return unitToFind.id === unit;
      })
      let effects = selectedUnit.effects.map(effect => {
        let res = <p key={effect.id}> {effect.name} </p>;
        return res;
      })
      unitBox =
      <div>
        <p> {selectedUnit.hp} </p>
        <div> {effects} </div>
      </div>
    } else {
      unitBox = <p> No unit clicked </p>
    }

    return (
      <div>
        {unitBox}
      </div>
    );
}

export default UnitBox;
