type SetRange = {
  setNumber: number;
  startRoll: number;
  endRoll: number;
};

const sets: { [branch: string]: SetRange[] } = {
  BCS: [
    { setNumber: 1, startRoll: 1, endRoll: 118 },
    { setNumber: 2, startRoll: 121, endRoll: 235 },
    { setNumber: 3, startRoll: 1, endRoll: 119 },
    { setNumber: 4, startRoll: 122, endRoll: 236 },
    { setNumber: 5, startRoll: 1, endRoll: 120 },
    { setNumber: 6, startRoll: 123, endRoll: 234 },
  ],
  BCD: [
    { setNumber: 1, startRoll: 1, endRoll: 28 },
    { setNumber: 2, startRoll: 31, endRoll: 58 },
    { setNumber: 3, startRoll: 2, endRoll: 29 },
    { setNumber: 4, startRoll: 32, endRoll: 59 },
    { setNumber: 5, startRoll: 3, endRoll: 30 },
    { setNumber: 6, startRoll: 33, endRoll: 57 },
  ],
  BCY: [
    { setNumber: 1, startRoll: 1, endRoll: 31 },
    { setNumber: 2, startRoll: 34, endRoll: 64 },
    { setNumber: 3, startRoll: 2, endRoll: 32 },
    { setNumber: 4, startRoll: 35, endRoll: 62 },
    { setNumber: 5, startRoll: 3, endRoll: 33 },
    { setNumber: 6, startRoll: 36, endRoll: 63 },
  ],
  BEC: [
    { setNumber: 1, startRoll: 1, endRoll: 28 },
    { setNumber: 2, startRoll: 31, endRoll: 55 },
    { setNumber: 3, startRoll: 2, endRoll: 29 },
    { setNumber: 4, startRoll: 32, endRoll: 56 },
    { setNumber: 5, startRoll: 3, endRoll: 30 },
    { setNumber: 6, startRoll: 33, endRoll: 57 },
  ],
};

export const getSet = (
  branch: string,
  batch: number,
  rollNumber: number
): number | null => {
  branch = branch.toUpperCase();
  const branchSets = sets[branch];
  if (!branchSets) return null;

  const batchSets = branchSets.slice((batch - 1) * 2, batch * 2);
  const matchingSet = batchSets.find(
    (set) => rollNumber >= set.startRoll && rollNumber <= set.endRoll
  );

  return matchingSet ? matchingSet.setNumber : null;
};
