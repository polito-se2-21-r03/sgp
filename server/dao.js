'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('se2.db', (err) => {
    if (err) throw err;
});

exports.getServices = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM service_type";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const res = rows.map((e) => ({ serviceTypeId: e.serviceTypeId, serviceName: e.serviceName }));
            resolve(res);
        });
    });
}

exports.getFirstTicketFromQueue = (serviceTypeId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT MIN(ticketId) as ticketId FROM service_type_ticket WHERE serviceTypeId=? AND status = 'CREATED'";
        db.get(sql, [serviceTypeId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row.ticketId);
        });
    });
};

exports.getNumTicketsQueuedByServiceType = (serviceTypeId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) as num FROM service_type_ticket WHERE serviceTypeId=?';
        db.get(sql, [serviceTypeId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row.num);
        });
    });
};

exports.getCountersByServiceTypeId = (serviceTypeId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT counterId FROM counter_service_type WHERE serviceTypeId=?';
        db.all(sql, [serviceTypeId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const counters = rows.map((e) => ({ counterId: e.counterId }));
            resolve(counters);
        });
    });
};

exports.getNumberOfServedServices = (counterId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) as num_services FROM counter_service_type WHERE counterId=?';
        db.get(sql, [counterId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row.num_services);
        });
    });
};

exports.getLongestQueueToServe = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT MAX(myCount), serviceTypeId
                     FROM (SELECT COUNT(*) as myCount, serviceTypeId
                           FROM service_type_ticket
                           WHERE serviceTypeId IN (
                               SELECT serviceTypeId
                               FROM counter_service_type
                               WHERE counterId = ?)
                           GROUP BY serviceTypeId
                          )`;
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows.length === 0) {
                resolve(null)
            } else if (rows.length > 1) {
                // caso di 2 code della stessa lunghezza
                const list = rows
                    .map(r => ({ serviceTypeId: id, serviceTime: this.getServiceTimeByServiceTypeId(r.serviceTypeId) }))
                    .sort((a, b) => a.serviceTime - b.serviceTime);
                resolve(list[0]);
            } else {
                resolve(rows[0])
            }
        });
    });
};

exports.getServiceTimeByServiceTypeId = (serviceTypeId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT serviceExecutionTime FROM service_type WHERE serviceTypeId=?';
        db.get(sql, [serviceTypeId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row.serviceExecutionTime);
        });
    });
};

exports.createTicket = (ticket) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO ticket (counterId, position, serviceTypeId, ticketNumber, creationDate, estimatedWaitingTime, officeId) VALUES(?, ?, ?, ?, ?, ?, ?)';
        db.run(sql, [null, null, ticket.serviceTypeId, null, Date.now(), ticket.ewt, ticket.officeId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    })
};

exports.getOrders = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM orders";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

exports.getProducts = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM product";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

exports.createOrder = (order) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO orders (clientId, employeeId, status, creationDate) VALUES(?, ?, ?, ?)';
        db.run(sql, [order.clientId, order.employeeId, order.status, order.creationDate], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    })
};

exports.insertOrderProduct = (orderId, productId, amount) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO order_product (orderId, productId, amount) VALUES(?, ?, ?)';
        db.run(sql, [orderId, productId, amount], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    })
};

exports.getClientById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM client WHERE clientId=?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
};

exports.getEmployeeById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM employee WHERE employeeId=?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
};

exports.getProductById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM product WHERE productId=?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
};

exports.checkProductAvailability = (id, amount) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) as available FROM product WHERE productId=? AND quantity > ?';
        db.get(sql, [id, amount], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if(row.available > 0){
                resolve(true);
            }
        });
    });
};

exports.insertSelectTypeTicket = (serviceTypeId, ticketId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO service_type_ticket (serviceTypeId, ticketId, status) VALUES(?, ?, ?)';
        db.run(sql, [serviceTypeId, ticketId, 'CREATED'], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    })
};

exports.handleTicket = (counterId, ticketId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE ticket SET counterId=? WHERE ticketId=?';
        db.run(sql, [counterId, ticketId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    })
}

exports.updateTicketStatus = (status, serviceTypeId, ticketId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE service_type_ticket SET status=? WHERE serviceTypeId = ? AND ticketId=?';
        db.run(sql, [status, serviceTypeId, ticketId], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    })
}