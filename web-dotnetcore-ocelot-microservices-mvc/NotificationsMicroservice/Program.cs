using JwtAuthanticationManager;
using MassTransit;
using Microsoft.OpenApi.Models;
using NotificationsMicroservice.Consumers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddSingleton<JwtTokenHandler>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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
    x.AddConsumer<SendSMSConsumer>();
    x.AddBus(provider => Bus.Factory.CreateUsingRabbitMq(cfg =>
    {
        //cfg.UseHealthCheck(provider);
        cfg.Host(new Uri("rabbitmq://rabbitmq"), h =>
        {
            h.Username("SRE");
            h.Password("P^k@w54x3yUd");
        });
        cfg.ReceiveEndpoint("NotificationQueue", ep =>
        {
            ep.PrefetchCount = 16;
            ep.UseMessageRetry(r => r.Interval(2, 100));
            ep.ConfigureConsumer<SendSMSConsumer>(provider);
        });
    }));
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
