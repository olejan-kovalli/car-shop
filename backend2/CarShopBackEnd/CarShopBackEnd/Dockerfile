#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["CarShopBackEnd/CarShopBackEnd.csproj", "CarShopBackEnd/"]
RUN dotnet restore "CarShopBackEnd/CarShopBackEnd.csproj"
COPY . .
WORKDIR "/src/CarShopBackEnd"
RUN dotnet build "CarShopBackEnd.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CarShopBackEnd.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CarShopBackEnd.dll"]