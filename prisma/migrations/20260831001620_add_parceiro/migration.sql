-- CreateTable
CREATE TABLE "Parceiros" (
    "id" TEXT NOT NULL,
    "nomeEmpresa" TEXT NOT NULL,
    "minDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "photoUrl" TEXT,
    "treepyCashe" DOUBLE PRECISION NOT NULL,
    "florestaId" INTEGER NOT NULL,
    "siteUrl" TEXT,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parceiros_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Parceiros_userId_key" ON "Parceiros"("userId");

-- AddForeignKey
ALTER TABLE "Parceiros" ADD CONSTRAINT "Parceiros_florestaId_fkey" FOREIGN KEY ("florestaId") REFERENCES "florestas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parceiros" ADD CONSTRAINT "Parceiros_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
