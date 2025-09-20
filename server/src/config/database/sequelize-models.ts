import { Sequelize } from "sequelize-typescript";
import { User, Project, Task, Comment, Activity } from "../../models";

/**
 * Sequelize Models Component
 * Manages all Sequelize model registrations
 */

/**
 * Get all Sequelize models
 */
export const getSequelizeModels = () => [
  User,
  Project,
  Task,
  Comment,
  Activity,
];

/**
 * Add all models to Sequelize instance
 */
export const addModelsToSequelize = (sequelize: Sequelize): void => {
  const models = getSequelizeModels();
  sequelize.addModels(models);
  console.log(`✅ Added ${models.length} models to Sequelize`);
};

/**
 * Get models by category
 */
export const getModelsByCategory = () => ({
  core: [User, Project, Task],
  related: [Comment, Activity],
  all: [User, Project, Task, Comment, Activity],
});

/**
 * Validate models before adding to Sequelize
 */
export const validateModels = (): boolean => {
  const models = getSequelizeModels();

  for (const model of models) {
    if (!model || typeof model !== "function") {
      console.error(`❌ Invalid model: ${model}`);
      return false;
    }
  }

  console.log("✅ All models validated successfully");
  return true;
};
