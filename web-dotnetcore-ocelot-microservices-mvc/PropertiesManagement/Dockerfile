#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["PropertiesManagement/PropertiesManagement.csproj", "PropertiesManagement/"]
COPY ["JwtAuthanticationManager/JwtAuthanticationManager.csproj", "JwtAuthanticationManager/"]
COPY ["Shared.Models/Shared.Models.csproj", "Shared.Models/"]
RUN dotnet restore "PropertiesManagement/PropertiesManagement.csproj"
COPY . .
WORKDIR "/src/PropertiesManagement"
RUN dotnet build "PropertiesManagement.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PropertiesManagement.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PropertiesManagement.dll"]