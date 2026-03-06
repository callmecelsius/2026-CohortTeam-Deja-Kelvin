export interface FosterHome {
  id: number;
  homeName: string;
  Address: string;
  Capacity: number;
  fosterParents?: string;
}

export interface FosterHomeDto {
  homeName: string;
  Address: string;
  Capacity: number;
}
