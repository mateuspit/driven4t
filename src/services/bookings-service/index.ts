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
    //console.log("makeBookingService");
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    //console.log("makeBookingService:enrollment");
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    //console.log("makeBookingService:ticket");
    //console.log("ticket", ticket);
    //console.log("TicketType", ticket.TicketType.isRemote);
    if (ticket.status !== 'PAID' ||
        ticket.TicketType.isRemote ||
        !ticket.TicketType.includesHotel) {
        //console.log("ticket.status",ticket.status!=='PAID');
        //console.log("ticket.isRemote",!!ticket.TicketType.isRemote);
        //console.log("ticket.includesHotel",!ticket.TicketType.includesHotel);
        //console.log("1ticket:", ticket);
        throw Error("FORBIDDEN");
    }

    const roomExists = await roomExistsFunc(roomId);
    //console.log("roomExists");
    if (!roomExists || roomExists.id === null) {
        //console.log("roomExists: sim");
        throw notFoundError();
    }
    //console.log("roomExists: nou");



    const capacityExists = await capacityExistsFunc(roomId);
    //console.log("capacityExists", capacityExists)
    if (!capacityExists) {
        //console.log("capacityExists:error", capacityExists)
        //console.log("2capacityExists:", capacityExists);
        throw Error("FORBIDDEN");
    }

    //console.log("bookingId:");
    const bookingId = await bookingRepository.makeBookingRepository(roomId, userId);
    //console.log("bookingId:", bookingId);

    return bookingId;
}

async function changeBookingService(userId: number, roomId: number) {
    //const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    //const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    const existBooking = await bookingRepository.viewBookingRepository(userId);
    //console.log("changeBookingService,roomId", roomId);
    if (existBooking === null) {
        //console.log("1");
        throw Error("FORBIDDEN");
    }
    //console.log("roomId", roomId);
    const roomExists = await roomExistsFunc(roomId);
    //console.log("nopetest", roomExists);
    if (!roomExists || roomExists.id === null || roomExists === null) {
        //console.log("CAIU NO ERRO", roomExists);
        throw notFoundError();
    }

    const capacityExists = await capacityExistsFunc(roomId);
    if (!capacityExists) {
        //console.log("4");
        throw Error("FORBIDDEN");
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
    //console.log("roomexistfunc,roomid", roomId);
    return await bookingRepository.roomExistsRepository(roomId);
}

async function capacityExistsFunc(roomId: number) {
    const { capacity } = await roomExistsFunc(roomId);

    const currentRents = await bookingRepository.currentRentsRepository(roomId);
    //console.log("capacity.ExistsFunc,capacity", capacity);
    //console.log("capacity.ExistsFunc,currentRents", currentRents);
    //console.log("capacity.ExistsFunc,capacity <= currentRents", capacity > currentRents);
    return (capacity > currentRents);
}
