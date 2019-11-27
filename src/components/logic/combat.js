import * as dice from './dice.js';
import * as util from './util.js';

export function applyEffects(unit, defender, ability, defenderTile) {
  let res = {
    attacker: {
      diceToRoll: unit.hp,
      toHit: ability.toHit,
      rerolls: false,
      toReroll: 0
    },
    defender: {
      diceToRoll: defender.armor.strength,
      toHit: defender.armor.toHit,
      rerolls: false,
      toReroll: 0
    }
  };
  console.log("Dice before effects");
  console.log(res);
  if((unit.position === "leftFlank" || unit.position === "rightFlank") && defender.position === "center") {
    res.attacker.diceToRoll += 2;
  }
  unit.effects.forEach(function(effect){
    if(effect.target === "self" && effect.role === "attacker") {
      if(effect.attribute === "diceToRoll") {
        res.attacker.diceToRoll += effect.value;
      } if (effect.attribute === "toHit") {
        res.attacker.toHit += effect.value;
      } if(effect.attribute === "rerolls") {
        res.attacker.rerolls = true;
        res.attacker.toReroll = effect.value;
      }
    } else if(effect.target === "opponent" && effect.role ==="attacker") {
      if(effect.attribute === "diceToRoll") {
        res.defender.diceToRoll += effect.value;
      } if (effect.attribute === "toHit") {
        res.defender.toHit += effect.value;
      }
    }
  })
  defender.effects.forEach(function(effect) {
    if(effect.target === "self" && effect.role === "defender") {
      if(effect.attribute === "diceToRoll") {
        res.defender.diceToRoll += effect.value;
      } if (effect.attribute === "toHit") {
        res.defender.toHit += effect.value;
      } if (effect.attribute === "rerolls") {
        res.defender.rerolls = true;
        res.defender.toReroll = effect.value;
      }
    } else if(effect.target === "opponent" && effect.role ==="defender") {
      if(effect.attribute === "diceToRoll") {
        res.attacker.diceToRoll += effect.value;
      } if(effect.attribute === "toHit") {
        res.attacker.toHit += effect.value;
      }
    }
  })
  console.log("Dice after effects");
  console.log(res);
  if(res.attacker.diceToRoll <= 1) {
    res.attacker.diceToRoll = 1;
  }
  if(res.defender.diceToRoll <= 1) {
    res.defender.diceToRoll = 1;
  }
  return res;
}






export function activateAbility(originUnit, targetUnit, ability, allUnits, tiles, setTiles, setAllUnits, effects, defenderTile) {
  console.log(effects);
  let changes;
  if(ability.type === "attack") {
    let diceToRoll = applyEffects(originUnit, targetUnit, ability, defenderTile);
    let hits = dice.rollDice(diceToRoll);
    changes = allUnits.map(unit => {
      if(unit.id === targetUnit.id) {
        unit.hp = unit.hp - hits;
        if(unit.hp <= 0) {
          unit.status = "dead";
          var changes = tiles.map(tile => {
            if(unit.id === tile.unitOnTile) {
              tile.isOccupied = false;
            }
            return tile;
          })
          setTiles(changes);
        } else if(hits > 0) {
          let moraleHits = dice.rollMorale(unit, hits);
          if(moraleHits.passed === true) {
            console.log("morale test passed");
          } else if(moraleHits.passed === false) {
            console.log("morale hits: " + moraleHits.hits);
            unit.hp = unit.hp - moraleHits.hits;
            if(unit.hp <= 0) {
              unit.status = "dead";
              var tileChanges = tiles.map(tile => {
                if(unit.id === tile.unitOnTile) {
                  tile.isOccupied = false;
                }
                return tile;
              })
              setTiles(tileChanges);
            }
          }
        }
        console.log(effects);
        let effect = util.getEffect("Already attacked", effects);
        unit.effects.push(effect);
      } if (unit.id === originUnit.id) {
        console.log("unit " + unit.id + " paying ability cost of: " + ability.apCost);
        unit.ap = unit.ap - ability.apCost;
        if(unit.ap === 0) {
          unit.status = "exausted";
        }
      }
      return unit;
    })
  }
  setAllUnits(changes);
  return "Combat Done";
}
