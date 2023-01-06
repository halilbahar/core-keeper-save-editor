import { ItemRarity } from '~enums';

export interface ItemDetail {
  objectId: number;
  paddedObjectId: string;
  name: string;
  description: string;
  initialAmount: number;
  isStackable: number;
  rarity: ItemRarity;
  rarityColor: string;
  conditionsWhenEquipped?: [string, boolean, string | undefined][];
  conditionsWhenEaten?: string[];
  damage?: { range: [number, number]; isRange: boolean };
  setBonus?: { conditions: string[]; pieces: string[] };
}
