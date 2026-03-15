using ChefSupply.API.DTOs;
using ChefSupply.API.Models;

namespace ChefSupply.API.Services.Interfaces;

public interface IWalletService
{
    Task<decimal> AddMoney(AddMoneyDto dto);

    Task<decimal> GetBalance(Guid businessId);

    Task<List<WalletTransaction>> GetTransactions(Guid businessId);

    Task<decimal> DeductMoney(Guid businessId, decimal amount);
}