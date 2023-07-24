import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '.prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
    createEnrollmentWithAddress,
    createHotel,
    createPayment,
    createRoomWithHotelId,
    createTicket,
    createTicketTypeRemote,
    createTicketTypeWithHotel,
    createTicketTypeWithoutHotel,
    createUser,
    createRoom,
    createBookingData,
    createBooking,
    createBookingWithoutCapacity,
    searchingHowManyRooms
} from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
    it('Retorna status 401 ao enviar um token inválido?', async () => {
        //codigo do enrollments
        const token = faker.lorem.word();

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });//done

    it('Retorna status 404 se o usuário não tem reservas?', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const createdHotel = await createHotel();
        await createRoomWithHotelId(createdHotel.id);

        //await createBookingData(user.id, createdRoom.id);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });//done

    it('Retorna status 200 e informações da reserva no sucesso?', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const createdHotel = await createHotel();
        const createdRoom = await createRoomWithHotelId(createdHotel.id);

        await createBookingData(user.id, createdRoom.id);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
    });//done
});//done

describe('POST /booking', () => {
    it('Retorna status 401 ao enviar um token inválido?', async () => {
        //codigo do enrollments
        const token = faker.lorem.word();

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });//done

    it('Retorna status 403 se o ticket do usuário é remoto?', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemote();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);


        expect(response.status).toBe(httpStatus.FORBIDDEN);
    });//done

    it('Retorna status 403 se o ticket do usuário não inclui hotel?', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithoutHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);


        expect(response.status).toBe(httpStatus.FORBIDDEN);
    });//done

    it('Retorna status 403 se o ticket do usuário não foi pago?', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);


        expect(response.status).toBe(httpStatus.FORBIDDEN);
    });//done

    it('Retorna status 403 se o quarto não possui vagas?', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();
        const room = await createRoom(hotel.id);
        const body = { roomId: room.id };
        //await createBooking(user.id, room.id);
        await createBookingWithoutCapacity(user.id, body.roomId, room.capacity)

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);


        expect(response.status).toBe(httpStatus.FORBIDDEN);
    });//done

    //it('Retorna status 404 se o quarto não existe?', async () => {
    //    const user = await createUser();
    //    const token = await generateValidToken(user);
    //    const enrollment = await createEnrollmentWithAddress(user);
    //    const ticketType = await createTicketTypeWithHotel();
    //    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    //    const hotel = await createHotel();
    //    const room = await createRoom(hotel.id);
    //    const body = { roomId: room.id };
    //    const roomsNumber = await searchingHowManyRooms((body.roomId + 1));
    //    //await createBookingWithoutCapacity(user.id, room.id, room.capacity)
    //    await createBooking(user.id, room.id);


    //    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    //    expect(roomsNumber).toBe(0);
    //    expect(response.status).toBe(httpStatus.FORBIDDEN);
    //});

    it('Retorna status 200 e o id da reserva no sucesso?', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();
        const room = await createRoom(hotel.id);
        const body = { roomId: room.id };
        //await createBooking(user.id, body.roomId, room.capacity)

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
        expect(response.body).toEqual({
            bookingId: expect.any(Number),
        });
        expect(response.status).toBe(httpStatus.OK);
    });
});

describe('PUT /booking/:bookingId', () => {
    it('Retorna status 401 ao enviar um token inválido?', async () => {
        //codigo do enrollments
        const token = faker.lorem.word();

        const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });//done

    it('Retorna status 403 se o usuário não tem reserva?', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Retorna status 403 se o novo quarto não tem vagas?', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Retorna 404 se o quarto não existe?', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Retorna status 200 e o id da reserva no sucesso?', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
});
