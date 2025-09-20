import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass, ClassConstructor } from 'class-transformer';

// Generic DTO validation middleware
export const validateDto = <T extends object>(dtoClass: ClassConstructor<T>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Transform plain object to class instance
      const dto = plainToClass(dtoClass, req.body);
      
      // Validate the DTO
      const errors: ValidationError[] = await validate(dto as object);
      
      if (errors.length > 0) {
        const formattedErrors = errors.map(error => ({
          field: error.property,
          value: error.value,
          constraints: error.constraints,
          children: error.children?.map(child => ({
            field: child.property,
            value: child.value,
            constraints: child.constraints
          }))
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors
        });
        return;
      }

      // Replace req.body with validated and transformed data
      req.body = dto;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Validation error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
};

// Generic query parameter validation middleware
export const validateQueryDto = <T extends object>(dtoClass: ClassConstructor<T>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Transform query parameters to class instance
      const dto = plainToClass(dtoClass, req.query);
      
      // Validate the DTO
      const errors: ValidationError[] = await validate(dto as object);
      
      if (errors.length > 0) {
        const formattedErrors = errors.map(error => ({
          field: error.property,
          value: error.value,
          constraints: error.constraints,
          children: error.children?.map(child => ({
            field: child.property,
            value: child.value,
            constraints: child.constraints
          }))
        }));

        res.status(400).json({
          success: false,
          message: 'Query validation failed',
          errors: formattedErrors
        });
        return;
      }

      // Replace req.query with validated and transformed data
      req.query = dto as any;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Query validation error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
};

// Generic parameter validation middleware
export const validateParamDto = <T extends object>(dtoClass: ClassConstructor<T>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Transform route parameters to class instance
      const dto = plainToClass(dtoClass, req.params);
      
      // Validate the DTO
      const errors: ValidationError[] = await validate(dto as object);
      
      if (errors.length > 0) {
        const formattedErrors = errors.map(error => ({
          field: error.property,
          value: error.value,
          constraints: error.constraints,
          children: error.children?.map(child => ({
            field: child.property,
            value: child.value,
            constraints: child.constraints
          }))
        }));

        res.status(400).json({
          success: false,
          message: 'Parameter validation failed',
          errors: formattedErrors
        });
        return;
      }

      // Replace req.params with validated and transformed data
      req.params = dto as any;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Parameter validation error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
};
