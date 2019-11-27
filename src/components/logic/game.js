import * as util from './util.js';

export function checkDeployement(gameEnded, allUnits, setAllUnits, unitsToDeploy, isDeployement, setIsDeployement, round, setRound) {
  if(gameEnded === true) {
    console.log("game ended");
  }
  let avelibleUnits = allUnits.filter(unit =>
    unit.status === "ready"
  )
  if(avelibleUnits.length === 0) {
    endRound(allUnits, setAllUnits, round, setRound);
  }
  let aiUnits = allUnits.filter(unit => {
    let unitResult;
    if(unit.control === "AI") {
      unitResult = unit;
    }
    return unitResult;
  })
  let aiUnitsToDeploy = aiUnits.filter(unit => {
    let unitResult;
    if(unit.deployed === false) {
      unitResult = unit;
    }
    return unitResult;
  })
  if(aiUnitsToDeploy.length === 0 && unitsToDeploy.length === 0) {
    if(isDeployement === false) {
      return;
    } else {
      setIsDeployement(false);
      return false;
    }
  } else {
    console.log("deploy phase");
    return true;
  }
}

//See if no units in center tiles

export function checkCenter(tiles, setGameEnded, gameEnded) {
  let aiCenterTiles = tiles.filter(tile => {
    var res;
    if(tile.position === "center" && tile.control === "AI" && tile.isOccupied === false) {
      res = tile;
    }
    return res;
  })
  let playerCenterTiles = tiles.filter(tile => {
    var res;
    if(tile.position === "center" && tile.control === "Player" && tile.isOccupied === false) {
      res = tile;
    }
    return res;
  })
  console.log("AI center empty tiles: " + aiCenterTiles.length);
  if(aiCenterTiles.length === 3 && gameEnded === false) {
    console.log("AI center collapsed");
    setGameEnded(true);
    return;
  }
  console.log("Player center empty tiles: " + playerCenterTiles.length);
  if(playerCenterTiles.length === 3 && gameEnded === false) {
    console.log("Player center collapsed");
    setGameEnded(true);
    return;
  }
  return;
}

export function endTurn(turnOrder, setTurnOrder) {
  if(turnOrder === "Player") {
    console.log("turn ends");
    setTurnOrder("AI");
  } else if(turnOrder === "AI") {
    console.log("turn ends");
    setTurnOrder("Player");
  }
}

function endRound(allUnits, setAllUnits, round, setRound) {
  let changes = allUnits.map(unit => {
    unit.ap = unit.baseAp;
    if(unit.status === "exausted") {
      unit.status = "ready";
    }
    unit.effects = unit.effects.filter(effect => effect.expires === false);
    return unit;
  })
  setAllUnits(changes);
  console.log("units after round ends, hope for no effecs");
  console.log(changes);
  console.log("Round ends");
  let newRound = round + 1;
  setRound(newRound);
}

export function deploy(unitID, tileID, turnOrder, unitsToDeploy, setUnitsToDeploy, tiles, setTiles, allUnits, setAllUnits) {
  let remainingUnits;
  let position;
  if(turnOrder === "Player") {
    remainingUnits = util.remove(unitsToDeploy, unitID);
    setUnitsToDeploy(remainingUnits);
  }
  tiles.map(tile => {
    if(tile.id === tileID) {
      tile.isOccupied = true;
      tile.unitOnTile = unitID;
      position = tile.position;
    }
    return tile;
  }
)
  setTiles(tiles);
  allUnits.map(unit => {
    if(unit.id === unitID) {
      unit.deployed = true;
      unit.position = position;
    }
    return unit;
  })
  setAllUnits(allUnits);
  console.log("deployed unit " + unitID + " on tile " + tileID);
}
