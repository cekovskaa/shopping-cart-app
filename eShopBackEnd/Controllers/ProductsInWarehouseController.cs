﻿using DominionWarehouseAPI.Database;
using DominionWarehouseAPI.Models;
using DominionWarehouseAPI.Models.Data_Transfer_Objects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace DominionWarehouseAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsInWarehouseController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly IConfiguration _configuration;

        public ProductsInWarehouseController(AppDbContext context, IConfiguration configuration)
        {
            this.dbContext = context;
            _configuration = configuration;
        }

        [HttpGet("FilterProductsFromWarehouseByCategory")]
        public async Task<IActionResult> FilterProductsByIncomingCategory(int? id)
        {

            if(id.Equals(null))
            {
                return BadRequest(new { Success = false, Message = "Please select a category." });
            }

            var category = await dbContext.Categories.FirstOrDefaultAsync(p => p.Id == id);

            if (category.Equals(null))
            {
                return BadRequest(new { Success = false, Message = "Category cannot be found." });
            }

            var query = dbContext.ProductsInWarehouses
                .Include(wp => wp.Product)
                .Where(wp => wp.Product.Category.Id == id)
                .Select(wp => new
                {
                    Id = wp.ProductId,
                    ProductName = wp.Product.ProductName,
                    ProductDescription = wp.Product.ProductDescription,
                    ProductPrice = wp.Product.ProductPriceForSelling,
                    ProductImageUrl = wp.Product.ProductImageURL,
                    ProductQuantity = wp.Quantity,
                    ReceivedBy = wp.Received
                });

            var products = await query.ToListAsync();

            return Ok(products);
        }

        [HttpGet("FilterProductsFromWarehouseByString")]
        public async Task<IActionResult> FilterProductsByIncomingString(string? q)
        {
            if (string.IsNullOrEmpty(q)) //modify this check so that it will accept nulls/empty/invalid strings and treat it as true
            {
                var nonfiltered = dbContext.ProductsInWarehouses
                .Include(wp => wp.Product)
                .Select(wp => new
                {
                    Id = wp.ProductId,
                    ProductName = wp.Product.ProductName,
                    ProductDescription = wp.Product.ProductDescription,
                    ProductPrice = wp.Product.ProductPriceForSelling,
                    ProductImageUrl = wp.Product.ProductImageURL,
                    ProductQuantity = wp.Quantity,
                    ReceivedBy = wp.Received
                });

                var nonfilteredProds = await nonfiltered.ToListAsync();
                return Ok(nonfilteredProds);
            }

            var query = dbContext.ProductsInWarehouses
                .Include(wp => wp.Product)
                .Where(wp => wp.Product.ProductName.Contains(q) ||
                             wp.Product.ProductDescription.Contains(q))
                .Select(wp => new
                {
                    Id = wp.ProductId,
                    ProductName = wp.Product.ProductName,
                    ProductDescription = wp.Product.ProductDescription,
                    ProductPrice = wp.Product.ProductPriceForSelling,
                    ProductImageUrl = wp.Product.ProductImageURL,
                });

            var products = await query.ToListAsync();

            return Ok(products);
        }

        [HttpGet("GetProductsFromWarehouse")]
        public async Task<IActionResult> GetAllProductsFromWarehouse()
        {

            var wh = await dbContext.Warehouse.FirstOrDefaultAsync();

            if(wh == null)
            {
                return BadRequest(new { Success = false, Message = "No warehouse found in the database." });
            }

            var prodsinwh = await dbContext.ProductsInWarehouses.
                Where(piw => piw.WarehouseId == wh.Id && piw.Quantity > 0).
                Include(piw => piw.Product).
                Select(p => new
                {
                    Id = p.ProductId,
                    ProductName = p.Product.ProductName,
                    ProductDescription = p.Product.ProductDescription,
                    ProductPrice = p.Product.ProductPriceForSelling,
                    ProductImageUrl = p.Product.ProductImageURL,
                    ProductQuantity = p.Quantity,
                    ReceivedBy = p.Received
                }).ToListAsync();

            if(!prodsinwh.Any())
            {
                return BadRequest(new { Success = false, Message = "There are no products in the warehouse at the moment" });
            }

            return Ok(prodsinwh);
        }

        [HttpPost("AddProductToWareHouse")]
        [Authorize(Roles = "ADMIN,OWNER,EMPLOYEE")]
        public async Task<IActionResult> AddProductToWareHouse(ProductWareHouseDTO request)
        {

            if ((request.Quantity.Equals(null) || request.Quantity <= 0) && request.WarehouseId.Equals(null))
            {
                return BadRequest(new { Success = false, Message = "Both fields are required" });
            }

            if (request.Quantity.Equals(null) || request.Quantity <= 0)
            {
                return BadRequest(new { Success = false, Message = "Invalid quantity" });
            }

            if (request.WarehouseId.Equals(null))
            {
                return BadRequest(new { Success = false, Message = "Warehouse must be selected" });
            }

            string username = User.FindFirstValue(ClaimTypes.Name);

            var user = await dbContext.Users.FirstOrDefaultAsync(user => user.Username == username);

            var prodToBeAdded = await dbContext.ProductsInWarehouses.FirstOrDefaultAsync(p => p.ProductId == request.ProductId);

            if (prodToBeAdded == null)
            {
                var prodInWarehouse = new ProductsInWarehouse
                {
                    WarehouseId = (int)request.WarehouseId,
                    ProductId = (int)request.ProductId,
                    Quantity = (int)request.Quantity,
                    Received = username,
                };
                dbContext.ProductsInWarehouses.Add(prodInWarehouse);
                var recordOfReceivedGoods = new ReceivedGoodsBy
                {
                    UserId = user.Id,
                    ProductId = (int)request.ProductId,
                    ProductQuantity = (int)request.Quantity,
                    AcceptanceDate = DateTime.UtcNow,
                };
                dbContext.ReceivedGoodsBy.Add(recordOfReceivedGoods);
                await dbContext.SaveChangesAsync(CancellationToken.None);
            }
            else
            {
                prodToBeAdded.Quantity += (int)request.Quantity;
                prodToBeAdded.Received = username;
                var recordOfReceivedGoods = new ReceivedGoodsBy
                {
                    UserId = user.Id,
                    ProductId = (int)request.ProductId,
                    ProductQuantity = (int)request.Quantity,
                    AcceptanceDate = DateTime.UtcNow,
                };
                dbContext.ReceivedGoodsBy.Add(recordOfReceivedGoods);
                await dbContext.SaveChangesAsync(CancellationToken.None);
            }

            return Ok(new {Success =  true, Message = "The product has been successfully added to the warehouse."});
        }

        [HttpDelete("DeleteProductFromWarehouse/{productId}")]
        [Authorize(Roles = "ADMIN,OWNER,EMPLOYEE")]
        public async Task<IActionResult> RemoveProductFromWarehouse(int productId)
        {
            var productToBeDeleted = await dbContext.ProductsInWarehouses.FirstOrDefaultAsync(p => p.ProductId.Equals(productId));

            if (productToBeDeleted.Equals(null))
            {
                BadRequest(new { Success = false, Message = "Product not found" });
            }

            dbContext.Remove(productToBeDeleted); 
            await dbContext.SaveChangesAsync(CancellationToken.None);

            return Ok(new { Success = true, Message = "The product has been successfully removed from the warehouse." });
        }

    }
}
