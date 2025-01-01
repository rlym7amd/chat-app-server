import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validateRequest =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: err.errors.map(({ path, message }) => ({ path, message })), // Send validation errors
        });
      } else {
        next(err);
      }
    }
  };
