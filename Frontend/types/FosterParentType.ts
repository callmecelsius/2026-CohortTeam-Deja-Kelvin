export interface FosterHome {
  id: number;
  homeName: string;
  address: string;
  capacity: number;
}

export interface FosterParent {
  id: number;
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
  postalCode: string;
  phoneNumber: string;
  email: string;
  fosterParent?: FosterParent;
}
