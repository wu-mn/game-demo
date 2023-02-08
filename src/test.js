export const tiles = [];

const swap = (i, j) => {
  let tmp = tiles[i].value;
  tiles[i].textContent = tiles[j].textContent;
  tiles[i].value = tiles[j].value;
  tiles[j].textContent = tmp;
  tiles[j].value = tmp;
};

export const cardClick = (e) => {
  let i = e.target.index;
  if (i - 4 >= 0 && tiles[i - 4].value === 0) {
    swap(i, i - 4);
  } else if (i + 4 < 16 && tiles[i + 4].value === 0) {
    swap(i, i + 4);
  } else if (i % 4 !== 0 && tiles[i - 1].value === 0) {
    swap(i, i - 1);
  } else if (i % 4 !== 3 && tiles[i + 1].value === 0) {
    swap(i, i + 1);
  }
};
