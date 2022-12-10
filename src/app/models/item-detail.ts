export interface ItemDetail {
  objectId: string;
  name: string;
  description: string;
  rarityColor: string;
  conditionsWhenEquipped?: string[];
  conditionsWhenEaten?: string[];
  damage?: { range: [number, number]; isRange: boolean };
}
