export interface BehaviorLogGetDto {
    Id?: number;
    AnimalId: number;
    ReportedByUserId: number;
    ReportedByName: string;
    BehaviorType: string;
    Notes: string;
    DateReported: Date;
    Resolved: boolean;
}

export interface BehaviorLogDto {
    Id?: number;
    AnimalId: number;
    ReportedByUserId: number;
    BehaviorType: string;
    Notes: string;
    DateReported: Date;
    Resolved: boolean;
}