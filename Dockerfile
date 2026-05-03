FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copy sln and csproj
COPY backend/HastaAnketi.API.sln ./
COPY backend/HastaAnketi.API/HastaAnketi.API.csproj ./HastaAnketi.API/

# Restore dependencies
RUN dotnet restore ./HastaAnketi.API/HastaAnketi.API.csproj

# Copy the rest of the code
COPY backend/ ./

# Build and publish
WORKDIR /app/HastaAnketi.API
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/HastaAnketi.API/out .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "HastaAnketi.API.dll"]
