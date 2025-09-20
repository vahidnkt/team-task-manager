# Database Configuration Documentation

## 📁 **Overview**

This folder contains the database configuration for the Team Task Manager application. It provides a **component-based architecture** for managing both raw MySQL connections and Sequelize ORM connections.

## 🏗️ **Architecture**

```
config/database/
├── README.md                 # This documentation file
├── index.ts                  # Central exports and re-exports
├── database.ts               # Raw MySQL connection (legacy)
├── sequelize.ts              # Main Sequelize database class
├── sequelize-config.ts       # Sequelize configuration component
├── sequelize-models.ts       # Sequelize models management
├── sequelize-connection.ts   # Sequelize connection lifecycle
└── sequelize-factory.ts      # Sequelize instance factory
```

## 📋 **File Descriptions**

### **1. `index.ts` - Central Exports**

**Purpose:** Central hub for all database-related exports
**Usage:** Import any database component from this single file

```typescript
// Import main database instances
import { database, sequelize } from "./config/database";

// Import specific components
import { getSequelizeConfig, SequelizeFactory } from "./config/database";
```

**Exports:**

- `database` - Raw MySQL connection
- `sequelize` - Main Sequelize instance
- Configuration functions
- Model management functions
- Connection and factory classes

---

### **2. `database.ts` - Raw MySQL Connection**

**Purpose:** Legacy MySQL connection using `mysql2` package
**Usage:** For raw SQL queries and backward compatibility

```typescript
import database from "./config/database/database";

// Connect to database
await database.connect();

// Execute raw SQL
const users = await database.query("SELECT * FROM users");
const result = await database.execute("INSERT INTO users ...");
```

**Features:**

- Connection pooling
- Transaction support
- Health checks
- Raw SQL execution

---

### **3. `sequelize.ts` - Main Sequelize Class**

**Purpose:** Main entry point for Sequelize database operations
**Usage:** Primary database interface for the application

```typescript
import sequelizeDatabase from "./config/database/sequelize";

// Connect to database
await sequelizeDatabase.connect();

// Get Sequelize instance
const sequelize = sequelizeDatabase.getSequelize();

// Use in services
const users = await User.findAll();
```

**Features:**

- Singleton pattern
- Component-based architecture
- Backward compatibility
- Health monitoring

---

### **4. `sequelize-config.ts` - Configuration Component**

**Purpose:** Centralizes all Sequelize configuration options
**Usage:** Provides flexible configuration for different environments

```typescript
import {
  getSequelizeConfig,
  getSequelizeConfigForEnv,
} from "./config/database/sequelize-config";

// Get base configuration
const config = getSequelizeConfig();

// Get environment-specific configuration
const prodConfig = getSequelizeConfigForEnv("production");
```

**Functions:**

- `getSequelizeConfig()` - Base configuration
- `getSequelizeConfigForEnv(env)` - Environment-specific config
- `getSequelizeConfigWithOptions(overrides)` - Custom configuration

---

### **5. `sequelize-models.ts` - Models Management**

**Purpose:** Manages Sequelize model registrations and validation
**Usage:** Handles model loading and validation

```typescript
import {
  getSequelizeModels,
  validateModels,
} from "./config/database/sequelize-models";

// Get all models
const models = getSequelizeModels();

// Validate models
const isValid = validateModels();

// Get models by category
const { core, related, all } = getModelsByCategory();
```

**Functions:**

- `getSequelizeModels()` - Get all models
- `addModelsToSequelize(sequelize)` - Add models to instance
- `getModelsByCategory()` - Categorize models
- `validateModels()` - Validate model integrity

---

### **6. `sequelize-connection.ts` - Connection Lifecycle**

**Purpose:** Handles Sequelize connection lifecycle and operations
**Usage:** Manages connection state and provides database operations

```typescript
import { SequelizeConnection } from "./config/database/sequelize-connection";

const connection = new SequelizeConnection();

// Connect
await connection.connect();

// Check connection status
const isConnected = connection.isConnectedToDatabase();

// Health check
const isHealthy = await connection.healthCheck();
```

**Features:**

- Connection state management
- Health monitoring
- Legacy query methods
- Error handling

---

### **7. `sequelize-factory.ts` - Instance Factory**

**Purpose:** Creates and configures Sequelize instances
**Usage:** Factory pattern for creating different types of Sequelize instances

```typescript
import { SequelizeFactory } from "./config/database/sequelize-factory";

// Create basic instance
const sequelize = SequelizeFactory.createSequelize();

// Create and connect
const connectedSequelize = await SequelizeFactory.createAndConnect();

// Create test instance
const testSequelize = SequelizeFactory.createTestSequelize();
```

**Methods:**

- `createSequelize()` - Basic instance
- `createAndConnect()` - Instance with connection
- `createTestSequelize()` - Test configuration
- `createSequelizeWithConfig(custom)` - Custom configuration

---

## 🚀 **Usage Examples**

### **Basic Usage (Recommended)**

```typescript
// In your services
import sequelizeDatabase from "./config/database/sequelize";

class UserService {
  async getAllUsers() {
    // Sequelize automatically handles the connection
    return await User.findAll();
  }
}
```

### **Advanced Usage (Component-based)**

```typescript
// Custom configuration
import { getSequelizeConfigWithOptions } from "./config/database/sequelize-config";
import { SequelizeFactory } from "./config/database/sequelize-factory";

const customConfig = getSequelizeConfigWithOptions({
  pool: { max: 20 },
  logging: false,
});

const sequelize = SequelizeFactory.createSequelizeWithConfig(customConfig);
```

### **Testing Usage**

```typescript
// In your tests
import { SequelizeFactory } from "./config/database/sequelize-factory";

beforeAll(async () => {
  const testSequelize = SequelizeFactory.createTestSequelize();
  await testSequelize.sync({ force: true });
});
```

---

## 🔧 **Configuration Options**

### **Environment Variables**

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=team_task_manager
DB_USER=root
DB_PASSWORD=your_password

# Application Environment
NODE_ENV=development
```

### **Pool Configuration**

```typescript
pool: {
  max: 5,        // Maximum connections
  min: 0,        // Minimum connections
  acquire: 50000, // Connection timeout
  idle: 10000    // Idle timeout
}
```

---

## 🎯 **Best Practices**

### **1. Use the Main Class**

```typescript
// ✅ Good - Use main class
import sequelizeDatabase from "./config/database/sequelize";

// ❌ Avoid - Direct component usage
import { SequelizeFactory } from "./config/database/sequelize-factory";
```

### **2. Environment-Specific Configuration**

```typescript
// ✅ Good - Environment-aware
const config = getSequelizeConfigForEnv(process.env.NODE_ENV);

// ❌ Avoid - Hardcoded values
const config = { host: "localhost", port: 3306 };
```

### **3. Error Handling**

```typescript
// ✅ Good - Proper error handling
try {
  await sequelizeDatabase.connect();
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Connection Failed**

   - Check database credentials
   - Verify database server is running
   - Check network connectivity

2. **Model Validation Failed**

   - Ensure all models are properly exported
   - Check model imports in `sequelize-models.ts`

3. **Pool Exhausted**
   - Increase pool size in configuration
   - Check for connection leaks

### **Debug Mode**

```typescript
// Enable debug logging
const config = getSequelizeConfigWithOptions({
  logging: console.log,
});
```

---

## 📚 **Dependencies**

- `sequelize` - ORM library
- `sequelize-typescript` - TypeScript decorators
- `mysql2` - MySQL driver
- `reflect-metadata` - Metadata reflection

---

## 🔄 **Migration Guide**

### **From Old Structure**

```typescript
// Old way
import database from "./config/database";

// New way
import sequelizeDatabase from "./config/database/sequelize";
```

### **Component Usage**

```typescript
// Old way - Direct configuration
const sequelize = new Sequelize({...});

// New way - Component-based
const sequelize = SequelizeFactory.createSequelize();
```

---

## 📝 **Notes**

- This configuration supports both **raw MySQL** and **Sequelize ORM**
- The **component-based architecture** makes it easy to test and maintain
- **Environment-specific configurations** are supported
- **Backward compatibility** is maintained for existing code
- **Health monitoring** and **error handling** are built-in

---

## 🤝 **Contributing**

When adding new database features:

1. Follow the component-based architecture
2. Add proper TypeScript types
3. Include error handling
4. Update this documentation
5. Add tests for new components

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Maintainer:** Team Task Manager Development Team
