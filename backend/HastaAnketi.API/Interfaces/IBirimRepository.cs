using HastaAnketi.API.Models;

namespace HastaAnketi.API.Interfaces;

public interface IBirimRepository
{
    List<Birim> GetAll();

    Birim? GetById(int id);

    Birim Create(Birim birim);

    void Update(Birim birim);

    void Delete(Birim birim);

    bool ExistsByCode(string birimKodu, int? excludedId = null);
}
