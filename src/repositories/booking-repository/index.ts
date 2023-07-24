import { prisma } from '@/config';

async function viewBookingRepository(userId: number) {
    return await prisma.booking.findFirst({
        where: {
            userId,
        },
        select: {
            id: true,
            Room: true
        },
    });
}

async function makeBookingRepository(roomId: number, userId: number) {
    return await prisma.booking.create({
        data: {
            roomId,
            userId
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
            id
        },
        data: {
            roomId,
            userId
        },
        select: {
            id: true,
        },
    });
}

async function roomExistsRepository(roomId: number) {
    const id = roomId;
    //console.log("roomexistrepository,id", id);
    return await prisma.room.findFirst({
        where: {
            id
        },
        select: {
            id: true,
            capacity: true
        },
    });
}

async function currentRentsRepository(roomId: number) {
    return await prisma.booking.count({
        where: {
            roomId,
        },
    });
}

const hotelRepository = {
    viewBookingRepository,
    makeBookingRepository,
    changeBookingRepository,
    roomExistsRepository,
    currentRentsRepository
};

export default hotelRepository;
