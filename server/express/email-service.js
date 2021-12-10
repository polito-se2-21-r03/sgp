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
    subject: 'SPG - PENDING CANCELLATION',
    html: '<h2>Hi ' + user.firstname + ' ' + user.lastname + '!</h2> <br>We inform you that your order has been confirmed but is in <b>PENDING CANCELLATION</b> status due to the fact that you do not have enough credit to complete the order<br/>',
})

exports.confirmed = (user) => ({
    from: 'team.r03.se2@gmail.com',
    to: user.email,
    subject: 'SPG - ORDER CONFIRMED',
    html: '<h2>Hi ' + user.firstname + ' ' + user.lastname + '!</h2> <br>We want to inform you that your order has been correctly paid and confirmed by the Farmer. As soon as it is shipped you will receive a notification. Thank you<br/>',
})

exports.customEmail = (user,body) => ({
    from: 'team.r03.se2@gmail.com',
    to: user.email,
    subject: 'SPG',
    html: '<h2>Hi ' + user.firstname + ' ' + user.lastname + '!</h2> <br>'+ body +'<br/>',
})