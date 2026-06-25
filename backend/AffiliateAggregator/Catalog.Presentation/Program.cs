using Affiliate.SharedLibrary.DependencyInjection;
using Catalog.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSharedServices<CatalogDbContext>(builder.Configuration, "Catalog");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSharedPolicies();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
