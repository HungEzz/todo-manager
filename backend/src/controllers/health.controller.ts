import { Request, Response } from "express";

/**
 * Controller to handle health check requests.
 */
export const getHealth = (req: Request, res: Response): void => {
  res.status(200).json({ status: "ok" });
};
