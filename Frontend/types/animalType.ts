export interface Animal {
    id: number;
    name: string | null;
    breed: string | null;
    weight: number | null;
    height: number | null;
    intakeDate: string | null;
    status: string
    animalPhoto: string | null; //base64-encoded
  }

  //creates a new animal typeobject without the id property
export type CreateAnimalDto = Omit<Animal, 'id'>;