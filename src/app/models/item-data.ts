export interface ItemData {
  objectID: number;
  name: string;
  description: string;
  objectType: number;
  initialAmount: number;
  rarity: number;
  isStackable: number;
  iconIndex: number;
  damage?: [number, number];
  condition?: { id: number; value: number }[];
  setBonusId?: number;
}
