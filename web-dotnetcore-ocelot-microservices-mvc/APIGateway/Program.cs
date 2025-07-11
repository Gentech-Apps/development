using APIGateway.Models;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

var routes = "Routes";
const string CORS_POLICY_NAME = "AllowOrigins";
builder.Configuration.AddOcelotWithSwaggerSupport(options =>
{
    options.Folder = routes;
});
builder.Services.AddOcelot(builder.Configuration).AddPolly();
builder.Services.AddSwaggerForOcelot(builder.Configuration);
builder.Services.AddCustomeJwtAUthentication();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: CORS_POLICY_NAME,
    options =>
    {
            var corsOrigins = builder.Configuration.GetSection("ApiConfig").Get<ApiConfig>().AllowCorsOrigins.Split(";");
            options.WithOrigins(corsOrigins).AllowCredentials().AllowAnyHeader().AllowAnyMethod();
        });
});

var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
builder.Configuration.SetBasePath(Directory.GetCurrentDirectory())
    .AddOcelot(routes, builder.Environment)
    .AddEnvironmentVariables();


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

// Swagger for ocelot
builder.Services.AddSwaggerGen() ; 
    


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
}


//app.UseHttpsRedirection();
app.UseCors(CORS_POLICY_NAME);
app.UseAuthorization();

app.UseSwaggerForOcelotUI(options =>
{
    options.PathToSwaggerGenerator = "/swagger/docs";
    options.ReConfigureUpstreamSwaggerJson = AlterUpstream.AlterUpstreamSwaggerJson;

}).UseOcelot().Wait();

app.MapControllers();

app.Run();
