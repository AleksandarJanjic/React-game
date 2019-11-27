export function rollDice(dice) {
  var i;
  var results = [];
  for(i=0; i < dice.attacker.diceToRoll; i++) {
    let roll = Math.floor(Math.random() * 6) + 1;
    results.push(roll);
  }
  if(dice.attacker.rerolls === true) {
    console.log("rerollin'");
    results = results.map(roll => {
      if(roll <= dice.attacker.toReroll) {
        return roll = Math.floor(Math.random() * 6) + 1;
      }
      return roll;
    })
  }
  let successes = 0;
  results.forEach(function(res) {
    if(res >= dice.attacker.toHit) {
      successes++;
    }
  })
  console.log("Hits before saves");
  console.log(successes);
  var armorSaves = [];
  for(i=0; i < dice.defender.diceToRoll; i++) {
    let roll = Math.floor(Math.random() * 6) + 1;
    armorSaves.push(roll);
  }
  if(dice.defender.rerolls === true) {
    armorSaves = armorSaves.map(roll => {
      if(roll <= dice.defender.toReroll) {
        return roll = Math.floor(Math.random() * 6) + 1;
      }
      return roll;
    })
  }
  let saves = 0;
  armorSaves.forEach(function(res) {
    if(res >= dice.defender.toHit) {
      saves++;
    }
  })
  console.log("Saves: " + saves);
  successes -= saves;
  if(successes < 0) {
    successes = 0;
  }
  console.log("Number of Dice:");
  console.log(dice.attacker.diceToRoll);
  console.log("Number of Hits:");
  console.log(successes);
  return successes;
}


export function rollMorale(unit, combatHits) {
  let moraleDice = 2;
  let moraleToHit = unit.morale;
  unit.effects.forEach(function(effect) {
    if(effect.attribute === "moraleDice") {
      moraleDice += effect.value;
    } else if (effect.attribute === "moraleBonus") {
      moraleToHit += effect.value;
    }
  })
  var i;
  var results = [];
  for(i=0; i < moraleDice; i++) {
    let roll = Math.floor(Math.random() * 6) + 1;
    results.push(roll);
  }
  let successes = 0;
  results.forEach(function(res) {
    if(res >= moraleToHit) {
      successes++;
    }
  })
  let res = {
    passed: false,
    hits: 0
  }
  if(successes > 0) {
    res.passed = true;
  } else if(successes === 0) {
    res.passed = false;
    res.hits = Math.floor(combatHits / 2);
  }
  return res;
}
