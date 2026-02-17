using Backend.Data.Models;

namespace Backend.Data
{
    public interface IUnitOfWork
    {
        public void Save();
        public void Dispose();
        Repository<Animal> AnimalRepository { get; }
        Repository<AnimalCondition> CourseRepository { get; }  
    }
}
