const express = require('express');
const Validator = require('jsonschema').Validator;
const OrderRequestSchema = require("./schemas/order-request");
const dao = require("./dao");
const PORT = 3001;

app = new express();
app.use(express.json());

// const computeEstimatedWaitingTime = async (serviceTypeId) => {
//     try {
//         const tr = await dao.getServiceTimeByServiceTypeId(serviceTypeId);
//         const nr = await dao.getNumTicketsQueuedByServiceType(serviceTypeId);
//         const counters = await dao.getCountersByServiceTypeId(serviceTypeId);
//         let sum = 0, k = 0;
//         for (const counter of counters) {
//             k = await dao.getNumberOfServedServices(counter.counterId);
//             if (k > 0) sum += 1 / k;
//         }
//         if (!tr || !nr || sum <= 0) {
//             return -1;
//         }
//         return tr * (nr / sum + 1 / 2);
//     } catch (e) {
//         throw new Error("Cannot compute estimated waiting time");
//     }
// }
//
// const computeNextClient = async (counterId) => {
//     try {
//         const selectedQueue = await dao.getLongestQueueToServe(counterId);
//         return await dao.getFirstTicketFromQueue(selectedQueue.serviceTypeId)
//             .then(async ticketId => {
//                 if (ticketId
//                     && await dao.handleTicket(counterId, ticketId)
//                     && await dao.updateTicketStatus("SERVED", selectedQueue.serviceTypeId, ticketId)) {
//                     return ticketId;
//                 }
//             })
//             .catch(() => -1);
//     } catch (err) {
//         throw new Error("Cannot compute next ticket");
//     }
// }
//
// /**
//  * Get all services
//  */
// app.get('/api/services', async (req, res) => {
//     try {
//         return await dao.getServices()
//             .then(data => res.json(data))
//             .catch(() => res.status(500).json("Cannot get services"));
//     } catch (e) {
//         res.status(500).json(e.message);
//     }
// });
//
// app.get('/api/tickets/next/:counterId', async function (req, res) {
//     try {
//         await computeNextClient(req.params.counterId)
//             // .then(ticketId => res.json("Next Ticket ID: " + ticketId))
//             .then(ticketId => res.json({ ticketId: ticketId }))
//             .catch(() => res.status(500).json("Cannot process the ticket"));
//     } catch (e) {
//         res.status(500).json(e.message);
//     }
// });
//
// app.post('/api/tickets', [
//     check('officeId').isInt(),
//     check('serviceTypeId').isInt(),
// ], async (req, res) => {
//     try {
//         const ticket = {
//             officeId: req.body.officeId,
//             serviceTypeId: req.body.serviceTypeId,
//             ewt: await computeEstimatedWaitingTime(req.body.serviceTypeId)
//         };
//         const newTicket = await dao.createTicket(ticket);
//         await dao.insertSelectTypeTicket(ticket.serviceTypeId, newTicket)
//             .then(() => res.json({ ticketId: newTicket, ewt: ticket.ewt }))
//             .catch(() => res.status(503).json({ error: `Database error during the creation of ticket.` }))
//     } catch (err) {
//         res.status(503).json({ error: `Database error during the creation of ticket.` });
//     }
//
// });

app.post('/api/order', async (req, res) => {
    const v = new Validator();
    const body = v.validate(req.body, OrderRequestSchema.orderRequestSchema);
    if (!body.valid) {
        return res.status(422).json({ errors: body.errors })
    }
    try {
        const { employeeId, clientId, products } = req.body
        const order = {
            clientId: clientId,
            employeeId: employeeId,
            status: "CREATED",
            creationDate: Date.now()
        };
        if (!await dao.getClientById(clientId) || !await dao.getEmployeeById(employeeId)) {
            res.status(503).json({ error: `Client or Employee not found` })
        }
        await dao.createOrder(order)
            .then(async orderId => {
                if (orderId) {
                    await Promise.all(products.map(async product => {
                        if (!await dao.checkProductAvailability(product.productId, product.amount)) {
                            res.status(503).json({ error: `Product ${product.productId} not found or not available` })
                        }
                        await dao.insertOrderProduct(orderId, product.productId, product.amount)
                    }))
                        .then(() => res.status(200).json({ orderId: orderId }))
                        .catch(err => res.status(503).json({ error: err.message }))
                }
            })
            .catch(err => res.status(503).json({ error: err.message }))
    } catch (err) {
        res.status(503).json({ error: err.message });
    }

});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

module.exports = app;