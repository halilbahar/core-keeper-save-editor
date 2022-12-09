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
  condition?: { id: number; value: number }[];
  setBonusId?: number;
}

export interface ItemDamage {
  range: [number, number];
  isRange: boolean;
}
