export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  employeeId?: number | null;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: number;
  createdOn?: string;
  updatedOn?: string;
}
