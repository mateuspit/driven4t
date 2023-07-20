import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import { prisma } from '@/config';
import { number } from 'joi';

export async function createBookingData(userId: number, roomId: number) {
    const bookingData = {
        userId,
        roomId,
        createdAt: faker.date.recent(), // Gera uma data recente falsa para createdAt
        updatedAt: new Date(), // Utiliza a data atual para updatedAt
    };

    await prisma.booking.create({
        data: bookingData,
    });
}
