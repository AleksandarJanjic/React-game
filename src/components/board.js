import React from 'react';
import Tile from './tile.js';
import './css/board.css';

const Board = (props) => {

  let tileClick = props.tileClick;
  let tiles = props.tiles;
  let allUnits = props.allUnits;
  let unitClick = props.unitClick;

  let friendlyTiles = tiles.map((tile) => {
    var res;
    if(tile.control === "Player") {
      return (
        res = <Tile key={tile.id} id={tile.id} unit={tile.unitOnTile} allUnits={allUnits} isOccupied={tile.isOccupied} clickHandler={tileClick} unitClick={unitClick} position={tile.position} control={tile.control} terrain={tile.terrain}/>
      )
    }
    return res;
  })

  let enemyTiles = tiles.map((tile) => {
    var res;
    if(tile.control === "AI") {
      return (
        res = <Tile key={tile.id} id={tile.id} unit={tile.unitOnTile} allUnits={allUnits} isOccupied={tile.isOccupied} clickHandler={tileClick} unitClick={unitClick} position={tile.position} control={tile.control} terrain={tile.terrain}/>
      )
    }
    return res;
  })

  return (
         <div className="board">
           <div className="enemy-tiles">
             {enemyTiles}
           </div>
           <div className="friendly-tiles">
             {friendlyTiles}
           </div>
         </div>
       );
}

export default Board;
