export interface FosterHome {
  id?: number;
  homeName?: string;
  address?: string;
  capacity?: number;
  currentAnimalCount?: number;
}

export interface FosterParent {
  id?: number;
  userId?: number;
  fosterHomeId?: number;
  approvedDate?: string;
  status?: string;
  fosterHome?: FosterHome;
}

export interface FosterUser {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  address: string;
  zip: number;
  phone: string;
  email: string;
  createdOn?: string;
  fosterParent: FosterParent;
}
