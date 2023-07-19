import hotelRepository from '@/repositories/hotel-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { cannotListHotelsError } from '@/errors/cannot-list-hotels-error';

async function viewBookingService(userId: number) {
    const existBooking = await bookingRepository.viewBookingRepository(userId);
    if (!existBooking) {
        throw notFoundError();
    }
    return existBooking;
}

async function makeBookingService(userId: number, roomId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    //if (ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    //    throw Error("FORBIDDEN"); // LANÇA UM ERRO PARA A FUNÇÃO QUE O CHAMOU
    //}
    const bookingId = await bookingRepository.makeBookingRepository(roomId, userId);
    if (!bookingId || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
        throw Error("FORBIDDEN"); // LANÇA UM ERRO PARA A FUNÇÃO QUE O CHAMOU
    }
    return bookingId;
}

async function changeBookingService(userId: number, roomId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    const bookingId = await bookingRepository.changeBookingRepository(roomId, userId);
    if (!bookingId || ticket.status !== 'RESERVED') {
        throw Error("FORBIDDEN"); // LANÇA UM ERRO PARA A FUNÇÃO QUE O CHAMOU
    }
    return bookingId;
}

export default {
    viewBookingService,
    makeBookingService,
    changeBookingService
};
