using MassTransit;
using Microsoft.OpenApi.Models;
using PropertiesManagement.CQRS.Repositories.Implementation;
using PropertiesManagement.CQRS.Repositories.Interfaces;
using PropertiesManagement.Database;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddSingleton<JwtTokenHandler>();
builder.Services.AddScoped<IPropertiesRepository, PropertiesRepository>();
builder.Services.AddScoped<ITenantPropAssocRepository, TenantPropAssocRepository>();
builder.Services.AddScoped<ILeaseRepository, LeasesRepository>();
builder.Services.AddScoped<IRentStatusRepository, RentStatusRepository>();
builder.Services.AddMediatR(Assembly.GetExecutingAssembly());
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
    Options =>
    {
        Options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
        {
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 1safsfsdfdfd\"",
        });
        Options.AddSecurityRequirement(new OpenApiSecurityRequirement
         {
             {
                 new OpenApiSecurityScheme {
                     Reference= new OpenApiReference
                     {
                          Type =ReferenceType.SecurityScheme,
                          Id = "Bearer"
                     }
                  },
                  new string[] { }
              }
         });
    });
builder.Services.AddMassTransit(x =>
{
    x.AddBus(provider => Bus.Factory.CreateUsingRabbitMq(config =>
    {
        //config.UseHealthCheck(provider);
        config.Host(new Uri("rabbitmq://rabbitmq"), h =>
        {
            h.Username("SRE");
            h.Password("P^k@w54x3yUd");
        });
        //config.Host(new Uri("rabbitmq://localhost"), h =>
        //{
        //    h.Username("guest");
        //    h.Password("guest");
        //});
    }));
});
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<DatabaseContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromSeconds(10);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
