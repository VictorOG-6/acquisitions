import { db } from "#config/database.js"
import logger from "#config/logger.js"
import { users } from "#models/user.model.js"
import { eq } from "drizzle-orm"

export const getAllUsers = async () => {
    try {
        return await db.select({
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
            created_at: users.created_at,
            updated_at: users.updated_at
        }).from(users)
    } catch (error) {
        logger.error('Error getting users', error)
        throw error
    }
}

export const getUserById = async (id) => {
    try {

        const [user] = await db.select({
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
            created_at: users.created_at,
            updated_at: users.updated_at
        }).from(users).where(eq(users.id, id)).limit(1);

        if (!user) {
            throw new Error('User not found')
        }

        return user
    } catch (error) {
        logger.error('Error getting user', error)
        throw error
    }
}

export const updateUser = async (id, updates) => {
    try {
        // Check if user exists
        const existingUser = await getUserById(id);

        // Check if email is being updated and already exists
        if (updates.email && updates.email !== existingUser.email) {
            const [emailExists] = await db
                .select({ id: users.id })
                .from(users)
                .where(eq(users.email, updates.email))
                .limit(1);

            if (emailExists) {
                throw new Error('Email already exists');
            }
        }

        const [updatedUser] = await db
            .update(users)
            .set({
                ...updates,
                updated_at: new Date()
            })
            .where(eq(users.id, id))
            .returning({
                id: users.id,
                email: users.email,
                name: users.name,
                role: users.role,
                created_at: users.created_at,
                updated_at: users.updated_at
            });

        return updatedUser;
    } catch (error) {
        logger.error('Error updating user', error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        // Check if user exists
        await getUserById(id);

        const [deletedUser] = await db
            .delete(users)
            .where(eq(users.id, id))
            .returning({
                id: users.id,
                email: users.email,
                name: users.name,
                role: users.role
            });

        return deletedUser;
    } catch (error) {
        logger.error('Error deleting user', error);
        throw error;
    }
};