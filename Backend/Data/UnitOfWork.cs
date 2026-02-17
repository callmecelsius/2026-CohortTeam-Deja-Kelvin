using Backend.Data.Models;

namespace Backend.Data
{
    public class UnitOfWork : IDisposable, IUnitOfWork
    {       
        private AppDbContext _context;
        private Repository<Animal> animalRepository;
        private Repository<AnimalCondition> animalConditionRepository;

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

        public Repository<AnimalCondition> CourseRepository
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
