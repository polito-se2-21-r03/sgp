# SPG - TEAM R03

## Project architecture
The project is divided into two independent containers (services). The first, called server listening on port 3001, is dedicated solely to the backend stuff or to everything related to the business logic exposed through api.
The second one, called frontend or client, is the interface exposed to the user and accessible to the localhost:3000 page that communicates with the backend.

## Order status meaning
- Created: it has been created
- Pending: the order has been accepted
- Issued
- Delivered
- Completed
- Pending cancelation: the client has insufficient balance
## Tech

The application is built using the following technologies:

- [Express] - Fast, unopinionated, minimalist web framework for Node.js
- [Sqlite3] - SQLite is a C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.
- [Sequelize] - Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server. 
- [Polaris] - Our design system helps us work together to build a great experience for all of Shopify’s merchants.
- [Jest] - Jest is a delightful JavaScript Testing Framework with a focus on simplicity.
- [NodeJs] - As an asynchronous event-driven JavaScript runtime, Node.js is designed to build scalable network applications.

## Installation

> The following release tags has the final number variable which varies based on the release number.
It can be for example release1 for the first release or release2 for the second one

Pull the 2 images (backend and frontend).

```sh
docker pull francescomedina/se2-r03-spg-client:release1
docker pull francescomedina/se2-r03-spg-server:release1
```

Run the two containers:

```sh
docker run -d --network="host" --name backend  francescomedina/se2-r03-spg-server:release1
docker run -d --network="host" --name frontend  francescomedina/se2-r03-spg-client:release1
```

Now you can open the project web site at this url:

```sh
http://localhost:3000/
```

## Credentials

The table below shows the access credentials according to the roles

| Role | Email | Password |
| ------ | ------ |------|
| CLIENT | mark@email.com | pass
| EMPLOYEE | robert@email.com | pass
| FARMER | nicole@email.com | pass

## Team

- [Francesco Medina]
- [Antonio Centola]
- [Simone Alberto]
- [Alessandro Loconsolo]
- [Fabio Grillo]

## License

MIT


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [Express]: <https://expressjs.com/>
   [Sequelize]: <https://sequelize.org/>
   [Polaris]: <https://polaris.shopify.com/>
   [Jest]: <https://jestjs.io/>
   [NodeJs]: <https://nodejs.org/en/>
   [Sqlite3]: <https://www.sqlite.org/index.html>

   [Francesco Medina]: <https://github.com/francescomedina>
   [Antonio Centola]: <https://github.com/CentolaAntonio>
   [Simone Alberto]: <https://github.com/simonealberto>
   [Alessandro Loconsolo]: <https://github.com/aleloco09>
   [Fabio Grillo]: <https://github.com/fabiogrillo>
