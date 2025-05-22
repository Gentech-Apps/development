using Going.Plaid;
using MassTransit;
using Microsoft.OpenApi.Models;
using System.Reflection;
using UserManagement.CQRS.Repositories.Implementation;
using UserManagement.DwollaOperations.Model.Plaid;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddSingleton<JwtTokenHandler>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Configuration.AddYamlFile("secrets.yaml", optional: true);

builder.Services.AddMediatR(Assembly.GetExecutingAssembly());
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IOTPRepository, OTPRepository>();
builder.Services.AddScoped<IUserInfoRepository, UserInfoRepository>();
builder.Services.AddScoped<IBusinessRepository, BusinessRepository>();
builder.Services.AddScoped<IOwnerAndControllerRepository, OwnerAndControllerRepository>();
builder.Services.AddScoped<IFundingSourceRepository, FundingSourceRepository>(); 
builder.Services.AddScoped<IDwollaDocumentRepository, DwollaDocumentRepository>();

builder.Services.Configure<PlaidCredentials>(builder.Configuration.GetSection(PlaidOptions.SectionKey));
builder.Services.Configure<PlaidOptions>(builder.Configuration.GetSection(PlaidOptions.SectionKey));
builder.Services.AddSingleton<PlaidClient>();

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
app.UseSession();
app.MapControllers();
app.Run();
