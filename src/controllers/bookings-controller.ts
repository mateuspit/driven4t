import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/bookings-service';
import { InputTicketBody } from '@/protocols';

export async function viewBookingController(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    try {
        const existBooking = await bookingService.viewBookingService(userId)
        //const ticketTypes = await ticketService.getTicketType();
        //return res.status(httpStatus.OK).send(ticketTypes);
        return res.status(httpStatus.OK).send(existBooking);
    } catch (e) {
        if (e.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
    }
}

export async function makeBookingController(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body;
    try {
        //const ticket = await ticketService.getTicketByUserId(userId);
        const bookingId = await bookingService.makeBookingService(userId, roomId);
        return res.status(httpStatus.OK).send(bookingId);
    } catch (e) {
        if (e.message === 'FORBIDDEND') {
            return res.sendStatus(httpStatus.FORBIDDEN);
        }
    }
}

export async function changeBookingController(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body;
    //  if (!ticketTypeId) {
    //    return res.sendStatus(httpStatus.BAD_REQUEST);
    //  }
    try {
        const bookingId = await bookingService.changeBookingService(userId, roomId);
        //const ticket = await ticketService.createTicket(userId, ticketTypeId);
        return res.status(httpStatus.CREATED).send(bookingId);
    } catch (e) {
        if (e.message === 'FORBIDDEND') {
            return res.sendStatus(httpStatus.FORBIDDEN);
        }
    }
}
