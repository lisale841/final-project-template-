set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."users" (
	"userId" serial NOT NULL,
	"username" TEXT NOT NULL UNIQUE,
	"hashedPassword" TEXT NOT NULL,
	"createdAt" timestamptz NOT NULL DEFAULT NOW(),
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."moodBoard" (
	"moodBoardId" serial NOT NULL,
	"userId" integer NOT NULL,
	"createdAt" timestamptz NOT NULL DEFAULT NOW(),
	CONSTRAINT "moodBoard_pk" PRIMARY KEY ("moodBoardId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."moodObject" (
  "moodObjectId" serial NOT NULL,
	"yCoordinates" float8 NOT NULL,
	"xCoordinates" float8 NOT NULL,
	"moodBoardId" integer NOT NULL,
	"type" TEXT NOT NULL,
	"scale" float8 NOT NULL,
	"data" TEXT NOT NULL,
  CONSTRAINT "moodObject_pk" PRIMARY KEY ("moodObjectId")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "moodBoard" ADD CONSTRAINT "moodBoard_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "moodObject" ADD CONSTRAINT "moodObject_fk0" FOREIGN KEY ("moodBoardId") REFERENCES "moodBoard"("moodBoardId");
