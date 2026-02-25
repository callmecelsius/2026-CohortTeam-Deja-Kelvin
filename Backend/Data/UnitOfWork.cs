using Backend.Data.Models;

namespace Backend.Data
{
    public class UnitOfWork : IDisposable, IUnitOfWork
    {       
        private AppDbContext _context;
        private Repository<Animal> animalRepository;
        private Repository<AnimalCondition> animalConditionRepository;
        private Repository<BehaviorLog> behaviorLogRepository;
        private Repository<FosterParent> fosterParentRepository;
        private Repository<Inventory> inventoryRepository;
        private Repository<User> userRepository;
        private Repository<Product> productRepository;
        private Repository<ProductCategory> productCategoryRepository;        
        private Repository<Order> orderRepository;
        private Repository<OrderItem> orderitemRepository;

        public UnitOfWork(AppDbContext context) 
        { 
            _context = context;
        }

        public Repository<Animal> AnimalRepository
        {
            get
            {
                if (this.animalRepository == null)
                {
                    this.animalRepository = new Repository<Animal>(_context);
                }
                return animalRepository;
            }
        }

        public Repository<AnimalCondition> AnimalConditionRepository
        {
            get
            {

                if (this.animalConditionRepository == null)
                {
                    this.animalConditionRepository = new Repository<AnimalCondition>(_context);
                }
                return animalConditionRepository;
            }
        }

        public Repository<BehaviorLog> BehaviorLogRepository
        {
            get
            {

                if (this.behaviorLogRepository == null)
                {
                    this.behaviorLogRepository = new Repository<BehaviorLog>(_context);
                }
                return behaviorLogRepository;
            }
        }

        public Repository<FosterParent> FosterParentRepository
        {
            get
            {

                if (this.fosterParentRepository == null)
                {
                    this.fosterParentRepository = new Repository<FosterParent>(_context);
                }
                return fosterParentRepository;
            }
        }

        //Inventory
        public Repository<Inventory> InventoryRepository
        {
            get
            {
                if (this.inventoryRepository == null)
                {
                    this.inventoryRepository = new Repository<Inventory>(_context);
                }
                return inventoryRepository;
            }
        }

        //User
        public Repository<User> UserRepository
        {
            get
            {
                if (this.userRepository == null)
                {
                    this.userRepository = new Repository<User>(_context);
                }
                return userRepository;
            }
        }

        //Product
        public Repository<Product> ProductRepository
        {
            get
            {
                if (this.productRepository == null)
                {
                    this.productRepository = new Repository<Product>(_context);
                }
                return productRepository;
            }
        }

        //Product Category
        public Repository<ProductCategory> ProductCategoryRepository
        {
            get
            {
                if (this.productCategoryRepository == null)
                {
                    this.productCategoryRepository = new Repository<ProductCategory>(_context);
                }
                return productCategoryRepository;
            }
        }

        //Order
        public Repository<Order> OrderRepository
        {
            get
            {
                if (this.orderRepository == null)
                {
                    this.orderRepository = new Repository<Order>(_context);
                }
                return orderRepository;
            }
        }

        //Order Item
        public Repository<OrderItem> OrderItemRepository
        {
            get
            {
                if (this.orderitemRepository == null)
                {
                    this.orderitemRepository = new Repository<OrderItem>(_context);
                }
                return orderitemRepository;
            }
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
