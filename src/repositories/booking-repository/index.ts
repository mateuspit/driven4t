import { prisma } from '@/config';

async function viewBookingRepository(userId: number) {
    return await prisma.booking.findFirst({
        where: {
            userId: userId,
        },
        select: {
            id: true,
            roomId: true,
        },
    });
}

async function makeBookingRepository(roomId: number, userId: number) {
    return await prisma.booking.create({
        data: {
            roomId: roomId,
            userId: userId
        },
        select: {
            id: true,
        },
    });;
}

async function changeBookingRepository(roomId: number, userId: number) {
    const { id } = await viewBookingRepository(userId)
    return await prisma.booking.update({
        where: {
            id: id
        },
        data: {
            roomId: roomId,
            userId: userId
        },
        select: {
            id: true,
        },
    });
}

const hotelRepository = {
    viewBookingRepository,
    makeBookingRepository,
    changeBookingRepository
};

export default hotelRepository;
