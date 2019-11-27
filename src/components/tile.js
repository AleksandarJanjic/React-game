import React from 'react';
import './css/tile.css';
import Unit from './unit.js';

const Tile = (props) => {
  let id = props.id;
  let handleClick = props.clickHandler;
  let unit = props.unit;
  let allUnits = props.allUnits;
  let isOccupied = props.isOccupied;
  let unitClick = props.unitClick;
  let position = props.position;
  let control = props.control;
  let terrain = props.terrain;
  let tile;

  let displayUnit = allUnits.find(unitToRender => {
    return unitToRender.id === unit;
  })

  if(isOccupied === false) {
    tile =
    <div className={"tile " + position + " " + control} onClick={() => handleClick(id)}>
      <div className="unitBase" >
      </div>
      <div className="terrainBox">
        {terrain}
      </div>
    </div>
  } else if (displayUnit.status === "dead") {
    tile = <div className={"tile " + position + " " + control}>
      <p> Dead
        <img key={displayUnit.image} src={displayUnit.image} alt=""/>
      </p>
    </div>
  } else {
    tile =
    <div className={"tile " + position + " " + control} onClick={() => handleClick(id)}>
      <div className="unitBase">
        <Unit key={displayUnit.id} id={displayUnit.id} clickHandle={unitClick} img={displayUnit.image} hp={displayUnit.hp} ap={displayUnit.ap} />
      </div>
      <div className="terrainBox">
        {terrain}
      </div>
    </div>
  }

  return (
        <div>
        {tile}
        </div>
      );
}

export default Tile;
