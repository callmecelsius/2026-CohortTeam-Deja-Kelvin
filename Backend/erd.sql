// ERD updated 2/22/2026

// *****************
// User System
// *****************
Table User {
  Id integer [primary key]  
  FirstName text
  LastName text
  EmployeeId integer [null] 
  PhoneNumber text  
  Email text
  Address text
  City text
  State text
  Zip integer   
  CreatedOn timestamp
  UpdatedOn timestamp 
}

// *****************
// Animal System
// *****************
Table Animal {
  Id integer [primary key]
  Name text
  Type text 
  Breed text
  Weight numeric
  Height numeric
  IntakeDate timestamp 
  Status text  
  AnimalPhoto bytea 
   
}

Table AnimalCondition {
  Id integer [primary key]
  AnimalId integer
  ConditionType text
  Description text
  Severity text
  StartDate timestamp
  EndDate timestamp
  VetSeen bool
}
Ref: AnimalCondition.AnimalId > Animal.Id

Table BehaviorLog {
  Id integer [primary key]
  AnimalId integer
  ReportedByUserId integer
  BehaviorType text
  Notes text
  DateReported timestamp
  Resolved bool
}
Ref: BehaviorLog.AnimalId > Animal.Id
Ref: BehaviorLog.ReportedByUserId > User.Id


// *****************
// Foster Structure System
// *****************
Table FosterHome {
  Id integer [primary key]
  HomeName text
  Address text
  Capacity integer 
}

Table FosterParent {
  Id integer [primary key]
  UserId integer
  FosterHomeId integer
  ApprovedDate timestamp
  Status text
}
Ref: FosterParent.UserId > User.Id
Ref: FosterParent.FosterHomeId > FosterHome.Id

Table FosterAssignment {
  Id integer [primary key]
  AnimalId integer
  FosterHomeId integer
  StartDate timestamp
  EndDate timestamp 
}
Ref: FosterAssignment.AnimalId > Animal.Id
Ref: FosterAssignment.FosterHomeId > FosterHome.Id

Table FosterParentNote {
  Id integer [primary key]
  FosterParentId integer  
  Notes text
  DateCreated timestamp
}
Ref: FosterParentNote.FosterParentId > FosterParent.Id


// *****************
//   Product System
// *****************
Table ProductCategory {
  Id integer [primary key]
  Name text
}

Table Product {
  Id integer [primary key]
  CategoryId integer
  Description text
  UnitPrice numeric
}
Ref: Product.CategoryId > ProductCategory.Id

Table Inventory {
  Id integer [primary key]
  ProductId integer
  QuantityOnHand integer
  ReorderLevel integer
  LastUpdated timestamp
}
Ref: Inventory.ProductId > Product.Id


// *****************
//   Ordering System
// *****************
Table Order {
  Id integer [primary key]
  UserId integer
  OrderComplete bool
  DateOrdered timestamp
}
Ref: Order.UserId > User.Id

Table OrderItem {
  Id integer [primary key]
  OrderId integer
  ProductId integer
  Quantity integer
}
Ref: OrderItem.OrderId > Order.Id
Ref: OrderItem.ProductId > Product.Id



