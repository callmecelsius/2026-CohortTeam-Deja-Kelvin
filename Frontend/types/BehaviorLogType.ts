export interface BehaviorLogDto { 
    //Id:number;  
    AnimalId: number;
    ReportedByUserId: number;
    BehaviorType: string;
    Notes: string;
    DateReported: Date;
    Resolved: boolean;
}