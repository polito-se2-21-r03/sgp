# polito-se2-21-r03

## Team:
- 280620 Medina Francesco
- 287562 Alberto Simone
- 292486 Loconsolo Alessandro
- 288192 Centola Antonio
- 287873 Grillo Fabio

## DB Query - Create
- create table ticket
                (
                    ticketId             INTEGER
                        primary key autoincrement,
                    counterId            INTEGER,
                    position             INTEGER,
                    serviceTypeId        INTEGER,
                    ticketNumber         INTEGER,
                    creationDate         DATETIME,
                    estimatedWaitingTime TIME,
                    officeId             INTEGER
                )

- create table service_type_ticket
                (
                    serviceTypeId INTEGER                not null
                        references service_type,
                    ticketId      INTEGER                not null
                        references ticket,
                    status        text default "CREATED" not null
                )