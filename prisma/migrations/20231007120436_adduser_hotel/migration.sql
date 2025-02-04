-- CreateTable
CREATE TABLE "userHotel" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone_area" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,

    CONSTRAINT "userHotel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userHotel_cpf_key" ON "userHotel"("cpf");
