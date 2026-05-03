using Microsoft.AspNetCore.Http;

namespace HastaAnketi.API.Common.Results;

public class ServiceResult
{
    protected ServiceResult(bool isSuccess, int statusCode, string? errorMessage)
    {
        IsSuccess = isSuccess;
        StatusCode = statusCode;
        ErrorMessage = errorMessage;
    }

    public bool IsSuccess { get; }

    public int StatusCode { get; }

    public string? ErrorMessage { get; }

    public static ServiceResult Success(int statusCode = StatusCodes.Status200OK) =>
        new(true, statusCode, null);

    public static ServiceResult Fail(string errorMessage, int statusCode = StatusCodes.Status400BadRequest) =>
        new(false, statusCode, errorMessage);
}

public sealed class ServiceResult<T> : ServiceResult
{
    private ServiceResult(bool isSuccess, T? data, int statusCode, string? errorMessage)
        : base(isSuccess, statusCode, errorMessage)
    {
        Data = data;
    }

    public T? Data { get; }

    public static ServiceResult<T> Success(T data, int statusCode = StatusCodes.Status200OK) =>
        new(true, data, statusCode, null);

    public static new ServiceResult<T> Fail(string errorMessage, int statusCode = StatusCodes.Status400BadRequest) =>
        new(false, default, statusCode, errorMessage);
}
