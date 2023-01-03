CREATE TABLE device (
    id int PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    "type" varchar(8) NOT NULL,
    "version" int NOT NULL,
    "description" varchar(110) NOT NULL,
    CHECK(LENGTH("type") > 0 AND LENGTH("description") > 0)
);
