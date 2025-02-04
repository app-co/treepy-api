-- CreateTable
CREATE TABLE "cardToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "creditCardNumber" TEXT NOT NULL,
    "creditCardBrand" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cardToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cardToken" ADD CONSTRAINT "cardToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
