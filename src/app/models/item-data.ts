export interface ItemData {
  objectID: number;
  name: string;
  description: string;
  objectType: number;
  initialAmount: number;
  rarity: number;
  isStackable: number;
  iconIndex: number;
  damage?: ItemDamage;
  cooldown?: number;
  whenEquipped?: ConditionWhenEquipped[];
  setBonusId?: number;
}

export interface ItemDamage {
  range: [number, number];
  isRange: boolean;
  reinforcementBonus?: number;
}

export interface ConditionWhenEquipped {
  id: number;
  value: number;
}
