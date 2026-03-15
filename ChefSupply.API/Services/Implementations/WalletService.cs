using ChefSupply.API.Models;
using ChefSupply.API.DTOs;
using ChefSupply.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChefSupply.API.Services.Implementations;

public class WalletService : IWalletService
{
    private readonly ApplicationDbContext _context;

    public WalletService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<decimal> AddMoney(AddMoneyDto dto)
    {
        var wallet = await _context.Wallets
            .FirstOrDefaultAsync(w => w.BusinessId == dto.BusinessId);

        if (wallet == null)
        {
            wallet = new Wallet
            {
                WalletId = Guid.NewGuid(),
                BusinessId = dto.BusinessId,
                Balance = 0,
                CreatedAt = DateTime.UtcNow
            };

            _context.Wallets.Add(wallet);
        }

        wallet.Balance += dto.Amount;

        var transaction = new WalletTransaction
        {
            TransactionId = Guid.NewGuid(),
            WalletId = wallet.WalletId,
            Amount = dto.Amount,
            Type = "deposit",
            CreatedAt = DateTime.UtcNow
        };

        _context.WalletTransactions.Add(transaction);

        await _context.SaveChangesAsync();

        return wallet.Balance;
    }

    public async Task<decimal> GetBalance(Guid businessId)
    {
        var wallet = await _context.Wallets
            .FirstOrDefaultAsync(w => w.BusinessId == businessId);

        return wallet?.Balance ?? 0;
    }

    public async Task<List<WalletTransaction>> GetTransactions(Guid businessId)
    {
        var wallet = await _context.Wallets
            .FirstOrDefaultAsync(w => w.BusinessId == businessId);

        if (wallet == null) return new List<WalletTransaction>();

        return await _context.WalletTransactions
            .Where(t => t.WalletId == wallet.WalletId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<decimal> DeductMoney(Guid businessId, decimal amount)
    {
        var wallet = await _context.Wallets
            .FirstOrDefaultAsync(w => w.BusinessId == businessId);

        if (wallet == null || wallet.Balance < amount)
            throw new Exception("Insufficient wallet balance.");

        wallet.Balance -= amount;

        var transaction = new WalletTransaction
        {
            TransactionId = Guid.NewGuid(),
            WalletId = wallet.WalletId,
            Amount = -amount,
            Type = "payment",
            CreatedAt = DateTime.UtcNow
        };

        _context.WalletTransactions.Add(transaction);
        await _context.SaveChangesAsync();

        return wallet.Balance;
    }
}