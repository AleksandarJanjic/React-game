import React from 'react';
import Unit from './unit.js';
import './css/unitPool.css';

const UnitPool = (props) => {
  let unitClick = props.unitClick;
  let units = props.units;

  let unitsToRender = units.map((unit) =>
    <Unit key={unit.id} id={unit.id} clickHandle={unitClick} img={unit.image} hp={unit.hp} ap={unit.ap}/>
  )

  return (
        <div className="unitPool">
         {unitsToRender}
         </div>
);}

export default UnitPool;
