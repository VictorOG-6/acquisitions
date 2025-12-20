import jwt from "jsonwebtoken";
import logger from "#config/logger.js";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Role-based authorization middleware
 * @param {string[]} allowedRoles
 */
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            // Ensure user is authenticated
            if (!req.user) {
                logger.warn('Unauthorized access attempt (no user)');
                return res.status(401).json({
                    error: 'Authentication required',
                    message: 'User not authenticated'
                });
            }

            const { role } = req.user;

            // Ensure role exists
            if (!role) {
                logger.warn(`Access denied: user has no role`);
                return res.status(403).json({
                    error: 'Access denied'
                });
            }

            // Check role
            if (!allowedRoles.includes(role)) {
                logger.warn(
                    `Access denied for user ${req.user.id} with role ${role}`
                );
                return res.status(403).json({
                    error: 'Access Denied',
                    message: 'Insufficient permissions'
                });
            }

            next();
        } catch (error) {
            logger.error('Role verification error', error);
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Error during role verification'
            })
        }
    };
};

export const authenticateToken = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authorization header missing'
            });
        }

        const decoded = jwt.verify(token);
        req.user = decoded;

        logger.info(`User authenticated: ${decoded.email} (${decoded.role})`)
        next();
    } catch (error) {
        logger.error('Authentication error', error);
        if (e.message === 'Failed to authenticate token') {
            return res.status(401).json({

            })
        }
        next(error);
    }
};