import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function viewBookingService(userId: number) {
    const existBooking = await bookingRepository.viewBookingRepository(userId);
    if (existBooking === null) {
        throw notFoundError();
    }
    return existBooking;
}

async function makeBookingService(userId: number, roomId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (ticket.status !== 'PAID' ||
        ticket.TicketType.isRemote ||
        !ticket.TicketType.includesHotel) {
        throw Error("FORBIDDEN");
    }

    const roomExists = await roomExistsFunc(roomId);
    if (!roomExists || roomExists.id === null) {
        throw notFoundError();
    }


    const capacityExists = await capacityExistsFunc(roomId);
    if (!capacityExists) {
        throw Error("FORBIDDEN");
    }

    const bookingId = await bookingRepository.makeBookingRepository(roomId, userId);

    return bookingId;
}

async function changeBookingService(userId: number, roomId: number) {
    //const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    //const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    const existBooking = await bookingRepository.viewBookingRepository(userId);
    if (existBooking === null) {
        throw Error("FORBIDDEN");
    }

    const capacityExists = await capacityExistsFunc(roomId);
    if (!capacityExists) {
        throw Error("FORBIDDEN");
    }

    const roomExists = await roomExistsFunc(roomId);
    if (!roomExists || roomExists.id === null) {
        throw notFoundError();
    }

    const bookingId = await bookingRepository.changeBookingRepository(roomId, userId);//duvida

    return bookingId;
}

export default {
    viewBookingService,
    makeBookingService,
    changeBookingService
};

async function roomExistsFunc(roomId: number) {
    return await bookingRepository.roomExistsRepository(roomId);
}

async function capacityExistsFunc(roomId: number) {
    const { capacity } = await roomExistsFunc(roomId);

    const currentRents = await bookingRepository.currentRentsRepository(roomId);

    return (capacity <= currentRents);
}
