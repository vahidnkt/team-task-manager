import jwt from "jsonwebtoken";
import config from "./environment";
import { JWTPayload } from "../types/auth.types";

class JWTService {
  private readonly secret: string;
  private readonly expiresIn: string;
  private readonly algorithm: string;

  constructor() {
    this.secret = config.jwt.secret;
    this.expiresIn = config.jwt.expiresIn;
    this.algorithm = config.jwt.algorithm;
  }

  /**
   * Generate JWT token
   */
  public generateToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
    try {
      return jwt.sign(payload, this.secret, {
        expiresIn: this.expiresIn,
        algorithm: this.algorithm as jwt.Algorithm,
      } as jwt.SignOptions);
    } catch (error) {
      console.error("Token generation error:", error);
      throw new Error("Failed to generate token");
    }
  }

  /**
   * Verify JWT token
   */
  public verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.secret, {
        algorithms: [this.algorithm as jwt.Algorithm],
      });

      // Ensure we have a valid object with our required properties
      if (
        typeof decoded === "object" &&
        decoded !== null &&
        "userId" in decoded
      ) {
        return decoded as JWTPayload;
      }

      throw new Error("Invalid token payload");
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token has expired");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid token");
      } else {
        throw new Error("Token verification failed");
      }
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  public decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch (error) {
      console.error("Token decode error:", error);
      return null;
    }
  }

  /**
   * Get token expiration time
   */
  public getTokenExpiration(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      if (decoded && decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch (error) {
      console.error("Token expiration check error:", error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  public isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      if (decoded && decoded.exp) {
        return Date.now() >= decoded.exp * 1000;
      }
      return true;
    } catch (error) {
      console.error("Token expiration check error:", error);
      return true;
    }
  }

  /**
   * Refresh token (generate new token with same payload)
   */
  public refreshToken(token: string): string {
    try {
      const decoded = this.verifyToken(token);
      // Remove iat and exp from payload for new token
      const { iat, exp, ...payload } = decoded;
      return this.generateToken(payload);
    } catch (error) {
      throw new Error("Cannot refresh expired or invalid token");
    }
  }
}

export default new JWTService();
