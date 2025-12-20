import logger from "#config/logger.js"
import { deleteUser, getAllUsers, getUserById, updateUser } from "#services/users.service.js";

export const fetchAllUsers = async (req, res, next) => {
    try {
        const allUsers = await getAllUsers();

        res.json({
            message: 'Successfully retreived users',
            users: allUsers,
            count: allUsers.length,
        })
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

export const fetchUserById = async (req, res, next) => {
    try {
        logger.info(`Getting user by id: ${req.params.id}`)

        // Validate the user ID parameter
        const validationResult = userIdSchema.safeParse({ id: req.params.id });

        if (!validationResult.success) {
            return res.stats(400).json({
                error: 'Validation failed',
                details: formatValidationError(validationResult.error)
            })
        }

        const { id } = validationResult.data;
        const user = await getUserById(id)

        logger.info(`User ${user.email} retrieved successfully`);
        res.json({
            message: 'User retrieved successfully',
            user
        })

    } catch (error) {
        logger.error(`Error fetching user by id: ${error.message}`)
    }
}

export const updateUserById = async (req, res, next) => {
    try {
        logger.info(`Updating user with id: ${req.params.id}`);

        // Validate ID
        const idValidation = userIdSchema.safeParse({
            id: req.params.id
        });

        if (!idValidation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationError(idValidation.error)
            });
        }

        // Validate request body
        const bodyValidation = updateUserSchema.safeParse(req.body);

        if (!bodyValidation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationError(bodyValidation.error)
            });
        }

        const { id } = idValidation.data;
        const updates = bodyValidation.data;

        const updatedUser = await updateUser(id, updates);

        logger.info(`User ${updatedUser.email} updated successfully`);

        res.json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        logger.error(`Error updating user: ${error.message}`);
        next(error);
    }
};

export const deleteUserById = async (req, res, next) => {
    try {
        logger.info(`Deleting user with id: ${req.params.id}`);

        const validationResult = userIdSchema.safeParse({
            id: req.params.id
        });

        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationError(validationResult.error)
            });
        }

        const { id } = validationResult.data;

        const deletedUser = await deleteUser(id);

        logger.info(`User ${deletedUser.email} deleted successfully`);

        res.json({
            message: 'User deleted successfully',
            user: deletedUser
        });
    } catch (error) {
        logger.error(`Error deleting user: ${error.message}`);
        next(error);
    }
};