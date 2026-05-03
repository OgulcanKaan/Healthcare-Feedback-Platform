using HastaAnketi.API.Common.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HastaAnketi.API.Extensions;

public static class ControllerResultExtensions
{
    public static IActionResult ToActionResult(this ControllerBase controller, ServiceResult result)
    {
        if (result.IsSuccess)
        {
            return result.StatusCode == StatusCodes.Status204NoContent
                ? controller.NoContent()
                : controller.StatusCode(result.StatusCode);
        }

        return controller.StatusCode(result.StatusCode, result.ErrorMessage);
    }

    public static IActionResult ToActionResult<T>(this ControllerBase controller, ServiceResult<T> result)
    {
        if (result.IsSuccess)
        {
            return result.StatusCode == StatusCodes.Status204NoContent
                ? controller.NoContent()
                : controller.StatusCode(result.StatusCode, result.Data);
        }

        return controller.StatusCode(result.StatusCode, result.ErrorMessage);
    }
}
