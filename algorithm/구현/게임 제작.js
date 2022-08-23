const initialPosition = [1, 1, 0];

// 안 가본 칸: true
// 바다: null
// 가본 칸: false

const result = [[initialPosition[0], initialPosition[1]]];
const map = [
  [1, 1, 1, 1],
  [1, 0, 0, 1],
  [1, 1, 0, 1],
  [1, 1, 1, 1],
].map((x) => x.map((y) => (y ? null : true)));

function changDirection(character) {
  character.direction !== 0 ? character.direction-- : (character.direction = 3);
}

function isSeaOrOutOfTheMap(position) {
  return map[position[0]][position[1]] === false;
}

function moveBackward(character) {
  if (character.direction === 0) {
    const backPoisiton = [character.position[0] + 1, character.position[1]];
    if (isSeaOrOutOfTheMap(backPoisiton)) {
      return result.push(backPoisiton), (character.position = backPoisiton);
    }
    return false;
  } else if (character.direction === 1) {
    const backPoisiton = [character.position[0], character.position[1] - 1];
    if (isSeaOrOutOfTheMap(backPoisiton)) {
      return result.push(backPoisiton), (character.position = backPoisiton);
    }
    return false;
  } else if (character.direction === 2) {
    const backPoisiton = [character.position[0] - 1, character.position[1]];
    if (isSeaOrOutOfTheMap(backPoisiton)) {
      return result.push(backPoisiton), (character.position = backPoisiton);
    }
    return false;
  } else if (character.direction === 3) {
    const backPoisiton = [character.position[0], character.position[1] + 1];
    if (isSeaOrOutOfTheMap(backPoisiton)) {
      return result.push(backPoisiton), (character.position = backPoisiton);
    }
    return false;
  }
}

function move(character, checked = []) {
  if (checked.length === 4) {
    const result = moveBackward(character);
    return result;
  }

  if (character.direction === 0) {
    const nextPosition = [character.position[0] - 1, character.position[1]];

    if (map[nextPosition[0]][nextPosition[1]]) {
      result.push(nextPosition);
      map[nextPosition[0]][nextPosition[1]] = false;
      character.position = nextPosition;
      checked = [];
    } else {
      changDirection(character);
      checked.push(character.direction);
      return move(character, checked);
    }
  } else if (character.direction === 1) {
    const nextPosition = [character.position[0], character.position[1] + 1];

    if (map[nextPosition[0]][nextPosition[1]]) {
      result.push(nextPosition);
      map[nextPosition[0]][nextPosition[1]] = false;
      character.position = nextPosition;
      checked = [];
    } else {
      changDirection(character);
      checked.push(character.direction);
      return move(character, checked);
    }
  } else if (character.direction === 2) {
    const nextPosition = [character.position[0] + 1, character.position[1]];

    if (map[nextPosition[0]][nextPosition[1]]) {
      result.push(nextPosition);
      map[nextPosition[0]][nextPosition[1]] = false;
      character.position = nextPosition;
      checked = [];
    } else {
      changDirection(character);
      checked.push(character.direction);
      return move(character, checked);
    }
  } else if (character.direction === 3) {
    const nextPosition = [character.position[0], character.position[1] - 1];

    if (map[nextPosition[0]][nextPosition[1]]) {
      result.push(nextPosition);
      map[nextPosition[0]][nextPosition[1]] = false;
      character.position = nextPosition;
      checked = [];
    } else {
      changDirection(character);
      checked.push(character.direction);
      return move(character, checked);
    }
  }
}

const character = {
  position: [initialPosition[0], initialPosition[1]],
  direction: initialPosition[2],
};

while (1) {
  if (move(character) === false) break;
}

console.log(new Set(result.map((x) => JSON.stringify(x))).size);
