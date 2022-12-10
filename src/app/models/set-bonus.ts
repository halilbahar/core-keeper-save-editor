export interface SetBonus {
  id: number;
  rarity: number;
  data: SetBonusData[];
  pieces: number[];
}

export interface SetBonusData {
  conditionData: ConditionData;
  requiredPieces: number;
}

export interface ConditionData {
  conditionID: number;
  value: number;
  valueMultiplier: number;
}
