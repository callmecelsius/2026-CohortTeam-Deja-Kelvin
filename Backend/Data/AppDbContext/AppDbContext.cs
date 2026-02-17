using System;
using System.Collections.Generic;
using Backend.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data.AppDbContext;

public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Animal> Animals { get; set; }

    public virtual DbSet<AnimalCondition> AnimalConditions { get; set; }

    public virtual DbSet<BehaviorLog> BehaviorLogs { get; set; }

    public virtual DbSet<FosterAssignment> FosterAssignments { get; set; }

    public virtual DbSet<FosterHome> FosterHomes { get; set; }

    public virtual DbSet<FosterParent> FosterParents { get; set; }

    public virtual DbSet<FosterParentNote> FosterParentNotes { get; set; }

    public virtual DbSet<Inventory> Inventories { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductCategory> ProductCategories { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasPostgresEnum("auth", "aal_level", new[] { "aal1", "aal2", "aal3" })
            .HasPostgresEnum("auth", "code_challenge_method", new[] { "s256", "plain" })
            .HasPostgresEnum("auth", "factor_status", new[] { "unverified", "verified" })
            .HasPostgresEnum("auth", "factor_type", new[] { "totp", "webauthn", "phone" })
            .HasPostgresEnum("auth", "oauth_authorization_status", new[] { "pending", "approved", "denied", "expired" })
            .HasPostgresEnum("auth", "oauth_client_type", new[] { "public", "confidential" })
            .HasPostgresEnum("auth", "oauth_registration_type", new[] { "dynamic", "manual" })
            .HasPostgresEnum("auth", "oauth_response_type", new[] { "code" })
            .HasPostgresEnum("auth", "one_time_token_type", new[] { "confirmation_token", "reauthentication_token", "recovery_token", "email_change_token_new", "email_change_token_current", "phone_change_token" })
            .HasPostgresEnum("realtime", "action", new[] { "INSERT", "UPDATE", "DELETE", "TRUNCATE", "ERROR" })
            .HasPostgresEnum("realtime", "equality_op", new[] { "eq", "neq", "lt", "lte", "gt", "gte", "in" })
            .HasPostgresEnum("storage", "buckettype", new[] { "STANDARD", "ANALYTICS", "VECTOR" })
            .HasPostgresExtension("extensions", "pg_stat_statements")
            .HasPostgresExtension("extensions", "pgcrypto")
            .HasPostgresExtension("extensions", "uuid-ossp")
            .HasPostgresExtension("graphql", "pg_graphql")
            .HasPostgresExtension("vault", "supabase_vault");

        modelBuilder.Entity<Animal>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Animal_pkey");

            entity.ToTable("Animal");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.IntakeDate).HasColumnType("timestamp without time zone");
        });

        modelBuilder.Entity<AnimalCondition>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("AnimalCondition_pkey");

            entity.ToTable("AnimalCondition");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.EndDate).HasColumnType("timestamp without time zone");
            entity.Property(e => e.StartDate).HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.Animal).WithMany(p => p.AnimalConditions)
                .HasForeignKey(d => d.AnimalId)
                .HasConstraintName("AnimalCondition_AnimalId_fkey");
        });

        modelBuilder.Entity<BehaviorLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("BehaviorLog_pkey");

            entity.ToTable("BehaviorLog");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.DateReported).HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.Animal).WithMany(p => p.BehaviorLogs)
                .HasForeignKey(d => d.AnimalId)
                .HasConstraintName("BehaviorLog_AnimalId_fkey");

            entity.HasOne(d => d.ReportedByUser).WithMany(p => p.BehaviorLogs)
                .HasForeignKey(d => d.ReportedByUserId)
                .HasConstraintName("BehaviorLog_ReportedByUserId_fkey");
        });

        modelBuilder.Entity<FosterAssignment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("FosterAssignment_pkey");

            entity.ToTable("FosterAssignment");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.EndDate).HasColumnType("timestamp without time zone");
            entity.Property(e => e.StartDate).HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.Animal).WithMany(p => p.FosterAssignments)
                .HasForeignKey(d => d.AnimalId)
                .HasConstraintName("FosterAssignment_AnimalId_fkey");

            entity.HasOne(d => d.FosterHome).WithMany(p => p.FosterAssignments)
                .HasForeignKey(d => d.FosterHomeId)
                .HasConstraintName("FosterAssignment_FosterHomeId_fkey");
        });

        modelBuilder.Entity<FosterHome>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("FosterHome_pkey");

            entity.ToTable("FosterHome");

            entity.Property(e => e.Id).ValueGeneratedNever();
        });

        modelBuilder.Entity<FosterParent>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("FosterParent_pkey");

            entity.ToTable("FosterParent");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.ApprovedDate).HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.FosterHome).WithMany(p => p.FosterParents)
                .HasForeignKey(d => d.FosterHomeId)
                .HasConstraintName("FosterParent_FosterHomeId_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.FosterParents)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FosterParent_UserId_fkey");
        });

        modelBuilder.Entity<FosterParentNote>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("FosterParentNote_pkey");

            entity.ToTable("FosterParentNote");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.DateCreated).HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.FosterParent).WithMany(p => p.FosterParentNotes)
                .HasForeignKey(d => d.FosterParentId)
                .HasConstraintName("FosterParentNote_FosterParentId_fkey");
        });

        modelBuilder.Entity<Inventory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Inventory_pkey");

            entity.ToTable("Inventory");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.LastUpdated).HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.Product).WithMany(p => p.Inventories)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("Inventory_ProductId_fkey");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Order_pkey");

            entity.ToTable("Order");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.DateOrdered).HasColumnType("timestamp without time zone");

            entity.HasOne(d => d.User).WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("Order_UserId_fkey");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("OrderItem_pkey");

            entity.ToTable("OrderItem");

            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("OrderItem_OrderId_fkey");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("OrderItem_ProductId_fkey");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Product_pkey");

            entity.ToTable("Product");

            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.HasOne(d => d.Category).WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("Product_CategoryId_fkey");
        });

        modelBuilder.Entity<ProductCategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("ProductCategory_pkey");

            entity.ToTable("ProductCategory");

            entity.Property(e => e.Id).ValueGeneratedNever();
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("User_pkey");

            entity.ToTable("User");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.CreatedOn).HasColumnType("timestamp without time zone");
            entity.Property(e => e.Lastname).HasColumnType("character varying");
            entity.Property(e => e.UpdatedOn).HasColumnType("timestamp without time zone");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
