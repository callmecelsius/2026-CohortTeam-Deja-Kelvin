using Backend.Data.Models;

namespace Backend.Data
{
    public interface IUnitOfWork
    {
        public void Save();
        public void Dispose();
        Repository<Animal> AnimalRepository { get; }
        Repository<AnimalCondition> AnimalConditionRepository { get; }
        Repository<BehaviorLog> BehaviorLogRepository { get; }
        Repository<FosterParent> FosterParentRepository { get; }
        Repository<FosterHome> FosterHomeRepository { get; }
        Repository<Inventory> InventoryRepository { get; }
        Repository<User> UserRepository { get; }
        Repository<Product> ProductRepository { get; }
        Repository<ProductCategory> ProductCategoryRepository { get; }
        Repository<Order> OrderRepository { get; }
        Repository<OrderItem> OrderItemRepository { get; }
    }
}
