export function findUnit(isReady, aiUnits, isDeployement) {
  let res;
  if(isDeployement) {
    let aiUnitsToDeploy = aiUnits.filter(unit => {
      let unitResult;
      if(unit.deployed === false) {
        unitResult = unit;
      }
      return unitResult;
    })
    res = aiUnitsToDeploy.find(unit => {
      var res;
      if(unit.deployed === false) {
        res = unit;
      }
      return res;
    })
  } else {
    if(isReady === true) {
      res = aiUnits.find(unit => {
        var res;
        if(unit.status !== "exausted" && unit.status !== "dead") {
          res = unit;
        }
        return res;
      })
    }
  }
  return res;
}

export function findTile(isDeployement, tiles) {
  if(isDeployement) {
    let tile = tiles.find(tile => {
      var res;
      if(tile.isOccupied === false && tile.control === "AI" && tile.position === "center") {
        res = tile;
      }
      return res;
    })
    return tile;
  } else {
    console.log("not dep any more");
  }
}

export function findTarget(attackingUnit, allUnits) {
  let unit;
  let enemyUnits = allUnits.filter(unit => {
    var res;
    if(unit.control === "Player" && unit.status !== "dead") {
      res = unit;
    }
    return res;
  })
  console.log("All non-dead enemy units");
  console.log(enemyUnits);
  let eligableTargets = enemyUnits.filter(target => {
    var res;
    if(attackingUnit.position === "rightFlank" && target.position === "leftFlank") {
      res = target;
    } else if (attackingUnit.position === "center" && target.position === "center") {
      res = target;
    } else if (attackingUnit.position === "leftFlank" && target.position === "rightFlank" ) {
      res = target;
    }
    return res;
  })
  if(eligableTargets === undefined || eligableTargets.length === 0) {
    //flank colapsed?
    eligableTargets = enemyUnits.filter(target => {
      var res;
      if((attackingUnit.position === "rightFlank" || attackingUnit.position === "leftFlank") && target.position === "center") {
        res = target;
      } else if (attackingUnit.position === "center") {
        console.log("Enemy center colapsed?");
        res = target;
      }
      return res;
    })
  }
  console.log("second target selection: ");
  console.log(eligableTargets);
  unit = eligableTargets.find(target => {
    return target;
  })
  console.log("target is " + unit.id );
  return unit;
}


export function findAbility(unit) {
  console.log("all abilities");
  console.log(unit.abilities);
  let abilityToReturn = unit.abilities.find(ability => {
    if((ability.apCost <= unit.ap) && ability.type === "attack") {
      return ability;
    }
    return ability;
  })
  console.log(abilityToReturn);
  return abilityToReturn;
}
