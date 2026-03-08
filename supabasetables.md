| table_name       | column_name      | data_type                   | is_nullable |
| ---------------- | ---------------- | --------------------------- | ----------- |
| Animal           | Id               | integer                     | NO          |
| Animal           | Name             | text                        | YES         |
| Animal           | Breed            | text                        | YES         |
| Animal           | Weight           | numeric                     | YES         |
| Animal           | Height           | numeric                     | YES         |
| Animal           | IntakeDate       | timestamp without time zone | YES         |
| Animal           | Status           | text                        | YES         |
| Animal           | AnimalPhoto      | bytea                       | YES         |
| Animal           | Type             | text                        | YES         |
| AnimalCondition  | Id               | integer                     | NO          |
| AnimalCondition  | AnimalId         | integer                     | YES         |
| AnimalCondition  | ConditionType    | text                        | YES         |
| AnimalCondition  | Description      | text                        | YES         |
| AnimalCondition  | Severity         | text                        | YES         |
| AnimalCondition  | StartDate        | timestamp without time zone | YES         |
| AnimalCondition  | EndDate          | timestamp without time zone | YES         |
| AnimalCondition  | VetSeen          | boolean                     | YES         |
| BehaviorLog      | Id               | integer                     | NO          |
| BehaviorLog      | AnimalId         | integer                     | YES         |
| BehaviorLog      | ReportedByUserId | integer                     | YES         |
| BehaviorLog      | BehaviorType     | text                        | YES         |
| BehaviorLog      | Notes            | text                        | YES         |
| BehaviorLog      | DateReported     | timestamp without time zone | YES         |
| BehaviorLog      | Resolved         | boolean                     | YES         |
| FosterAssignment | Id               | integer                     | NO          |
| FosterAssignment | AnimalId         | integer                     | YES         |
| FosterAssignment | FosterHomeId     | integer                     | YES         |
| FosterAssignment | StartDate        | timestamp without time zone | YES         |
| FosterAssignment | EndDate          | timestamp without time zone | YES         |
| FosterHome       | Id               | integer                     | NO          |
| FosterHome       | HomeName         | text                        | YES         |
| FosterHome       | Address          | text                        | YES         |
| FosterHome       | Capacity         | integer                     | YES         |
| FosterParent     | Id               | integer                     | NO          |
| FosterParent     | UserId           | integer                     | YES         |
| FosterParent     | FosterHomeId     | integer                     | YES         |
| FosterParent     | ApprovedDate     | timestamp without time zone | YES         |
| FosterParent     | Status           | text                        | YES         |
| FosterParentNote | Id               | integer                     | NO          |
| FosterParentNote | FosterParentId   | integer                     | YES         |
| FosterParentNote | Notes            | text                        | YES         |
| FosterParentNote | DateCreated      | timestamp without time zone | YES         |
| Inventory        | Id               | integer                     | NO          |
| Inventory        | ProductId        | integer                     | YES         |
| Inventory        | QuantityOnHand   | integer                     | YES         |
| Inventory        | ReorderLevel     | integer                     | YES         |
| Inventory        | LastUpdated      | timestamp without time zone | YES         |
| Order            | Id               | integer                     | NO          |
| Order            | UserId           | integer                     | YES         |
| Order            | OrderComplete    | boolean                     | YES         |
| Order            | DateOrdered      | timestamp without time zone | YES         |
| OrderItem        | Id               | integer                     | NO          |
| OrderItem        | OrderId          | integer                     | YES         |
| OrderItem        | ProductId        | integer                     | YES         |
| OrderItem        | Quantity         | integer                     | YES         |
| Product          | Id               | integer                     | NO          |
| Product          | CategoryId       | integer                     | YES         |
| Product          | Description      | text                        | YES         |
| Product          | UnitPrice        | numeric                     | YES         |
| ProductCategory  | Id               | integer                     | NO          |
| ProductCategory  | Name             | text                        | YES         |
| User             | Id               | integer                     | NO          |
| User             | FirstName        | text                        | YES         |
| User             | LastName         | text                        | YES         |
| User             | EmployeeId       | integer                     | YES         |
| User             | PhoneNumber      | text                        | YES         |
| User             | Email            | text                        | YES         |
| User             | Address          | text                        | YES         |
| User             | City             | text                        | YES         |
| User             | State            | text                        | YES         |
| User             | Zip              | integer                     | YES         |
| User             | CreatedOn        | timestamp without time zone | YES         |
| User             | UpdatedOn        | timestamp without time zone | YES         |