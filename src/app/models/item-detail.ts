import { ItemRarity } from '~enums';

export interface ItemDetail {
  objectId: number;
  paddedObjectId: string;
  name: string;
  description: string;
  rarity: ItemRarity;
  rarityColor: string;
  conditionsWhenEquipped?: string[];
  conditionsWhenEaten?: string[];
  damage?: { range: [number, number]; isRange: boolean };
  setBonus?: { conditions: string[]; pieces: string[] };
}
