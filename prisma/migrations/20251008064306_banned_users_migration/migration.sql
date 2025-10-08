-- CreateTable
CREATE TABLE "banned_users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "banned_users_pkey" PRIMARY KEY ("id")
);
