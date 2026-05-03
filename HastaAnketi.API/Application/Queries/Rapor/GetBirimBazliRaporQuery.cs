using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.DTOs;

namespace HastaAnketi.API.Application.Queries.Rapor;

public record GetBirimBazliRaporQuery(DateTime? BaslangicTarihi, DateTime? BitisTarihi) : IQuery<IReadOnlyList<BirimMemnuniyetDto>>;
