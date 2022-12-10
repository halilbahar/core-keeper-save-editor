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
  whenEquipped?: ConditionWhenEquipped[];
  setBonusId?: number;
}

export interface ItemDamage {
  range: [number, number];
  isRange: boolean;
}

export interface ConditionWhenEquipped {
  id: number;
  value: number;
}
