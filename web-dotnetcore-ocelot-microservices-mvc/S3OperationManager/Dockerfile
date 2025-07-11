#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["S3OperationManager/S3OperationManager.csproj", "S3OperationManager/"]
RUN dotnet restore "S3OperationManager/S3OperationManager.csproj"
COPY . .
WORKDIR "/src/S3OperationManager"
RUN dotnet build "S3OperationManager.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "S3OperationManager.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "S3OperationManager.dll"]