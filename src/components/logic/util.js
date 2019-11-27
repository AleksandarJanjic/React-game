export function getEffect(effect, effects) {
  let effectToReturn = effects.find(effectToFetch => {
    if(effect === effectToFetch.name) {
      return effectToFetch;
    }
    return effectToFetch;
  })
  return effectToReturn;
}

export function remove(array, id) {
  return array.filter(i => i.id !== id);
}
