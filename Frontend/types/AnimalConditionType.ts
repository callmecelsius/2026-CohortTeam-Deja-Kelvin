export interface AnimalConditionDto {
    Id: number;
    AnimalId: number;
    ConditionType: string;
    Description: string;
    Severity: string;
    StartDate: Date | null;
    EndDate: Date | null;
    VetSeen: boolean;

}
