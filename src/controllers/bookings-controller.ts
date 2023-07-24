import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/bookings-service';

export async function viewBookingController(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    try {
        const existBooking = await bookingService.viewBookingService(userId)
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
        const bookingId = await bookingService.makeBookingService(userId, roomId);
        return res.status(httpStatus.OK).send({ bookingId: bookingId.id });
    } catch (e) {
        if (e.message === 'FORBIDDEN') {
            return res.sendStatus(httpStatus.FORBIDDEN);
        }
        if (e.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
    }
}

export async function changeBookingController(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body;
    try {
        console.log("changeBookingController");
        const bookingId = await bookingService.changeBookingService(userId, roomId);
        return res.status(httpStatus.OK).send({ bookingId: bookingId.id });
    } catch (e) {
        if (e.message === 'FORBIDDEN') {
            //console.log("FORBIDDEN");
            return res.sendStatus(httpStatus.FORBIDDEN);
        }
    }
}
