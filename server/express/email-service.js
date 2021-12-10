exports.config = {
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
        user: 'team.r03.se2@gmail.com',
        pass: 'Teamr03se2@',
    },
    secure: true,
}

exports.pendingCancellation = (user) => ({
    from: 'team.r03.se2@gmail.com',
    to: user.email,
    subject: 'PENDING CANCELLATION',
    html: '<h1>Hi ' + user.firstname + ' ' + user.lastname + '!</h1> <br>We inform you that your order has been confirmed but is in <b>PENDING CANCELLATION</b> status due to the fact that you do not have enough credit to complete the order<br/>',
})

exports.confirmed = (user) => ({
    from: 'team.r03.se2@gmail.com',
    to: user.email,
    subject: 'ORDER CONFIRMED',
    html: '<h1>Hi ' + user.firstname + ' ' + user.lastname + '!</h1> <br>We want to inform you that your order has been correctly paid and confirmed by the Farmer. As soon as it is shipped you will receive a notification. Thank you<br/>',
})