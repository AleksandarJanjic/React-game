import React, { useState } from 'react';
import Board from './board.js';
import UnitPool from './unitPool.js';
import AbilitiesTab from './abilitiesTab.js';
import UnitBox from './unitBox.js';
import CombatLog from './combatLog.js';
import './css/combatScreen.css';
import * as enemy from './logic/enemy.js';
import * as combat from './logic/combat.js';
import * as game from './logic/game.js';

function CombatScreen() {

  //Arrays with data, will be from backend

  let effects = [{id:1, name:"Already attacked", type: "base effect", expires: true, icon: "Already attacked", target:"opponent", role:"defender", attribute:"diceToRoll", value:-2, icon:"/images/pic1.png"},
                    {id:2, name:"Reroll test", type: "base effect", expires: false, icon:"Reroll test", target:"self", role:"attacker", attribute:"rerolls", value:1, icon:"/images/pic1.png"}]

  let tilesFromDb = [{id:1, terrain:"Plains", isOccupied:false, unitOnTile:null, control:"Player", position:"leftFlank"},
                    {id:2, terrain:"Plains", isOccupied:false, unitOnTile:null, control:"Player", position:"leftFlank"},
                    {id:3, terrain:"Hill", isOccupied:false, unitOnTile:null, control:"Player", position:"center"},
                    {id:4, terrain:"Plains", isOccupied:false, unitOnTile:null, control:"Player", position:"center"},
                    {id:5, terrain:"Plains", isOccupied:false, unitOnTile:null, control:"Player", position:"center"},
                    {id:6, terrain:"Plains", isOccupied:false, unitOnTile:null, control:"Player", position:"rightFlank"},
                    {id:7, terrain:"Plains", isOccupied:false, unitOnTile:null, control:"Player", position:"rightFlank"},
                    {id:8, terrain:"Plains", isOccupied:false, unitOnTile:null, control:"AI", position:"rightFlank"},
                    {id:9, terrain:"Plains", isOccupied:false, unitOnTile:null, control:"AI", position:"rightFlank"},
                    {id:10, terrain:"Plains", isOccupied:false, unitOnTile:null, control:"AI", position:"center"},
                    {id:11, terrain:"Plains", isOccupied:false, unitOnTile:null, control:"AI", position:"center"},
                    {id:12, terrain:"Plains", isOccupied:false, unitOnTile:null, control:"AI", position:"center"},
                    {id:13, terrain:"Plains", isOccupied:false, unitOnTile:null, control:"AI", position:"leftFlank"},
                    {id:14, terrain:"Plains", isOccupied:false, unitOnTile:null, control:"AI", position:"leftFlank"}]

  let unitsFromDb = [{id:1, unitType:"infantry", image:"/images/pic1.png", deployed:false, abilities:[
                      {id:1, name:"Slow Attack", apCost:1, icon:"/images/pic1.png", type: "attack", toHit:5}],
                       control: "Player", ap:1, baseAp:1, status: "ready", hp:5, position: null, effects:[
                         {id:2, name:"Reroll test", type: "base effect", expires: false, icon:"Reroll test", target:"self", role:"attacker", attribute:"rerolls", value:1}],
                     armor:{strength: 3, toHit:5}, morale:4},
                     {id:2, unitType:"cavalry", image:"/images/pic2.png", deployed:false, abilities:[
                       {id:1, name:"Slow Attack", apCost:1, icon:"/images/pic1.png", type: "attack", toHit:4},
                       {id:2, name:"Fast Attack", apCost:2, icon:"/images/pic2.png", type: "attack", toHit:4}],
                        control: "Player", ap:2, baseAp:2, status: "ready", hp:7, position: null, effects:[],
                      armor:{strength:4, toHit:4}, morale:3}]

  let aiUnitsFromDb = [{id:3, unitType: "infantry", image:"/images/pic1.png", deployed: false, abilities:[
                        {id:1, name:"Slow Attack", apCost:1, type: "attack", toHit:5}],
                         control: "AI", ap:1, baseAp:1, status: "ready", hp:5, position: null, effects:[],
                       armor:{strength:3, toHit:5}, morale:4},
                       {id:4, unitType: "cavalry", image:"/images/pic2.png", deployed:false, abilities:[
                        {id:2, name:"Fast Attack", apCost:2, icon:"/images/pic2.png", type: "attack", toHit:4}],
                         control: "AI", ap:2, baseAp:2, status: "ready", hp:7, position: null, effects:[],
                       armor:{strength:4, toHit:4}, morale:3}]


  //Combat Screen global vars
  let allUnitsFromDb = unitsFromDb.concat(aiUnitsFromDb);

  let [unitsToDeploy, setUnitsToDeploy] = useState(unitsFromDb);
  let [allUnits, setAllUnits] = useState(allUnitsFromDb);
  let [tiles, setTiles] = useState(tilesFromDb);
  let [selectedUnit, setSelectedUnit] = useState(null);
  let [clickedTile, setClickedTile] = useState(null);
  let [abilities, setAbilities] = useState(null);
  let [selectedAbility, setSelectedAbility] = useState(null);
  let [isDeployement, setIsDeployement] = useState(true);
  let [turnOrder, setTurnOrder] = useState("Player");
  let [aiUnits, setAiUnits] = useState(aiUnitsFromDb);
  let [gameEnded, setGameEnded] = useState(false);
  let [round, setRound] = useState(1);
  let [message, setMessage] = useState("Click on a unit and then on a tile to deploy it");
  let [clickedUnit, setClickedUnit] = useState(null);

  //checking board state and phase of the game
  game.checkDeployement(gameEnded, allUnits, setAllUnits, unitsToDeploy, isDeployement, setIsDeployement, round, setRound);

  //"AI" tree
  if(turnOrder === "AI") {
    if(isDeployement === false) {
      game.checkCenter(tiles, setGameEnded, gameEnded);
    }
    if(isDeployement === true) {
      let aiUnitsToDeploy = aiUnits.filter(unit => {
        let unitResult;
        if(unit.deployed === false) {
          unitResult = unit;
        }
        return unitResult;
      })
      if(aiUnitsToDeploy.length > 0) {
        let unit = enemy.findUnit(false, aiUnitsToDeploy, aiUnits, isDeployement);
        if(unit === undefined) {
          return game.endTurn(turnOrder, setTurnOrder);
        }
        setSelectedUnit(unit.id);
        let tile = enemy.findTile(isDeployement, tiles);
        setClickedTile(tile.id);
        game.deploy(unit.id, tile.id, turnOrder, unitsToDeploy, setUnitsToDeploy, tiles, setTiles, allUnits, setAllUnits);
        setSelectedUnit(null);
        game.endTurn(turnOrder, setTurnOrder);
      } else if (aiUnitsToDeploy.length === 0) {
        console.log("ai has nothing to deploy");
        game.endTurn(turnOrder, setTurnOrder);
      }
    } else if (isDeployement === false) {
      console.log("AI combat phase");
      let unit = enemy.findUnit(true, aiUnits, isDeployement);
      if(unit === undefined) {
        console.log("No eligable unit?");
        game.endTurn(turnOrder, setTurnOrder);
        return;
      }
      let target = enemy.findTarget(unit, allUnits);
      let defenderTile = tiles.find(tile => {
        return tile.unitOnTile === target.id;
      })
      let ability = enemy.findAbility(unit);
      let message = combat.activateAbility(unit, target, ability, allUnits, tiles, setTiles, setAllUnits, effects, defenderTile);
      console.log("Enemy unit: " + unit.id + " took its turn");
      game.endTurn(turnOrder, setTurnOrder);
    }
  } else if (turnOrder === "Player") {
    if(isDeployement === false) {
      game.checkCenter(tiles, setGameEnded, gameEnded);
    }
    let unitsToActivate = allUnits.filter(unit => {
      let res;
      if(unit.control === "Player" && unit.ap > 0) {
        res = unit;
      }
      return res;
    })
    if(unitsToActivate.length === 0) {
      game.endTurn(turnOrder, setTurnOrder);
    }
    console.log("your turn");
  }
  //Tile clicking, select and deselect, attacking enemies etc

  function tileClick(id) {
    let unit = allUnits.find(unit => {
      return unit.id === selectedUnit;
    })
    let tile = tiles.find(tile => {
      return tile.id === id;
    })
    if(isDeployement === true && selectedUnit !== null && unit.deployed === false && tile.isOccupied === false) {
      game.deploy(selectedUnit, id, turnOrder, unitsToDeploy, setUnitsToDeploy, tiles, setTiles, allUnits, setAllUnits);
      setSelectedUnit(null);
      return game.endTurn(turnOrder, setTurnOrder);
    } else if (isDeployement === false && selectedUnit !== null && selectedAbility !== null) {
      let unitOnTile = allUnits.find(unit => {
        return unit.id === tile.unitOnTile;
      })
      if (unitOnTile === undefined) {
        console.log("No eligable target");
        return;
      }
      if(unitOnTile.control === "AI") {
        if((unitOnTile.position === "leftFlank" && unit.position === "rightFlank") ||
           (unitOnTile.position === "center" && unit.position === "center") ||
           (unitOnTile.position === "rightFlank" && unit.position === "leftFlank")) {
          let ability = unit.abilities.find(ability => {
            return ability.id === selectedAbility;
          })
          if(ability === undefined) {
            console.log("no ability selected?");
            return;
          }
          if(unit.ap >= ability.apCost) {
            combat.activateAbility(unit, unitOnTile, ability, allUnits, tiles, setTiles, setAllUnits, effects, tile);
            game.endTurn(turnOrder, setTurnOrder);
          }
        } else {
          console.log("Gotta attack on the same flank or in center");
          return;
        }
      } else if(unitOnTile.control === "Player") {
        console.log("friendly unit");
      }
    }
    if(clickedTile === id) {
      setClickedTile(null);
    } else {
      setClickedTile(id);
    }
  }

  //Unit clicking, select and deselect

  function unitClick(id) {
    let unit = allUnits.find(unit => {
      return unit.id === id;
    })
    if(selectedUnit === null || selectedUnit !== unit.id) {
      if(unit.control === "Player") {
        setSelectedUnit(id);
        setClickedUnit(id);
        setAbilities(unit.abilities);
        setSelectedAbility(null);
      } else {
        setClickedUnit(id);
        setSelectedUnit(null);
        setAbilities(null);
        setSelectedAbility(null);
      }
    } else if (selectedUnit === id) {
      setSelectedUnit(null);
      setClickedUnit(null);
      setAbilities(null);
    }
  }

  //Ability selection

  function selectAbility(abilityId) {
    setSelectedAbility(abilityId);
  }

  let center;
  if(gameEnded === false) {
    center = <Board tileClick={tileClick} tiles={tiles} allUnits={allUnits} unitClick={unitClick}/>;
  } else if (gameEnded === true) {
    center = <p> Game Ended </p>
  }

  let hud;
  if(isDeployement === true) {
    hud = <UnitPool unitClick={unitClick} units={unitsToDeploy}/>;
  } else if(isDeployement === false && gameEnded === false && turnOrder === "Player") {
    hud = <AbilitiesTab unitId={selectedUnit} allUnits={allUnits} abilities={abilities} abilityClick={selectAbility} selectedAbility={selectedAbility}/>;
  } else if(gameEnded === true) {
    hud = <p> Game Ended </p>
  }

  return (
    <div className="main">
      <div className="infoDiv">
        <div className="navBar"></div>
        <div className="message">{message}</div>
      </div>
      <div className="board">
        {center}
      </div>
      <div className="hud">
        <div className="bottomLeft">
          <UnitBox unitID={clickedUnit} allUnits={allUnits}/>
        </div>
        <div className="bottomCenter">
          {hud}
        </div>
        <div className="bottomRight">
          <CombatLog/>
        </div>
      </div>
      <div className="infoBox">
      </div>
    </div>
  );
}

export default CombatScreen;
