import { ItemData } from './item-data';
import { SetBonus } from './set-bonus';

export interface ExtractedData {
  items: { [key: string]: ItemData };
  setBonuses: { [key: string]: SetBonus };
  conditions: { [key: string]: { description: string; isUnique: boolean } };
}
