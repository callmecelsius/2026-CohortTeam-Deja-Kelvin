export interface FosterHome {
  id: number;
  homeName: string;
  Address: string;
  Capacity: number;
  currentAnimalCount?: number;
  fosterParents?: string;
}

export interface FosterHomeDto {
  homeName: string;
  Address: string;
  Capacity: number;
}
