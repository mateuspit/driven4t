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

export async function createRoom(hotelId: number) {
    const roomData = {
        name: "faker.name",
        //name: faker.name,
        capacity: faker.datatype.number({ min: 1, max: 7 }),
        hotelId,
        createdAt: faker.date.recent(),
        updatedAt: new Date(),
    };

    const createdRoom = await prisma.room.create({
        data: roomData,
    });

    return createdRoom;
}

export async function createBooking(userId: number, roomId: number) {
    const bookingData = {
        userId: userId,
        roomId: roomId,
        createdAt: faker.date.recent(),
        updatedAt: new Date(),
    };

    const createdBooking = await prisma.booking.create({
        data: bookingData,
    });

    return createdBooking;
}

export async function createBookingWithoutCapacity(userId: number, roomId: number, capacity: number) {
    for (let i = 0; i < capacity; i++) {
        const bookingData = {
            userId: userId,
            roomId: roomId,
            createdAt: faker.date.recent(),
            updatedAt: new Date(),
        };

        //const createdBooking = await prisma.booking.create({
        await prisma.booking.create({
            data: bookingData,
        });
    }
}

export async function searchingHowManyRooms(roomId: number) {
    return await prisma.booking.count({
        where: {
            roomId,
        },
    });
}
