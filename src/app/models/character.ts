import { CharacterCostomization } from './character-customization';
import { Condition } from './condition';
import { InventorySlot } from './inventory-slot';
import { Server } from './server';
import { Skill } from './skill';

export interface Character {
  version: number;
  characterGuid: string;
  characterCustomization: CharacterCostomization;
  discoveredObjects: [];
  servers: Server[];
  skills: Skill[];
  activatedCrystals: [];
  inventory: InventorySlot[];
  conditionsList: Condition[];
  hasUnlockedSouls: boolean;
  coinAmount: number;
  collectedSouls: [];
  maxHealth: number;
  serverConnectCount: number;
  skillTalentTreeDatas: [];
  characterType: number;
  discoveredBiomes: [];
  discoveredObjects2: InventorySlot[];
  disabledSoulPowers: [];
}
