using HastaAnketi.API.Application.Abstractions;
using HastaAnketi.API.DTOs;

namespace HastaAnketi.API.Application.Queries.Rapor;

public record GetSikayetListQuery() : IQuery<IReadOnlyList<SikayetOzetDto>>;
