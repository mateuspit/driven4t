import { Router } from 'express';
import { authenticateToken, validateRoom } from '@/middlewares';
import { viewBookingController, makeBookingController, changeBookingController } from '@/controllers';
import { roomSchema } from '@/schemas/bookings-schemas';

const bookingsRouter = Router();

bookingsRouter
    .all('/*', authenticateToken)
    .get('/', viewBookingController)
    .post('/', validateRoom(roomSchema), makeBookingController)
    .put('/:bookingId', validateRoom(roomSchema), changeBookingController);

export { bookingsRouter };
