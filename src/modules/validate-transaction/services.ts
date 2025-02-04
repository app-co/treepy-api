import { prisma } from "@/lib/prisma"
import { AppError } from "@/shared/app-error/AppError";
import cron from 'node-cron'

interface I {
  amount: number;
  metodo: 'BOLETO' | 'PIX' | 'CARTAO'
  orderId: string;
  userId: string;
}
export async function ValidatedTransactions({ amount = 0, metodo, orderId, userId }: I) {
  const treepycash = await prisma.precificacao.findFirst({ select: { unid_trepycash: true } })


  const qnt_treepycash = Number((amount / treepycash!.unid_trepycash).toPrecision(2))

  // await prisma.pagamentos.create({
  //   data: {
  //     metodo,
  //     status: 1,
  //     valo_compra: amount,
  //     userId,
  //     orderId
  //   }
  // })

  const floresta = await prisma.florestas.findFirst({
    where: {
      AND: [
        {
          treepycash_disponivel: { gt: 0 } // maior que ...
        }
      ]
    },
    orderBy: {
      projeto: 'asc'
    }
  })

  if (!floresta) throw new AppError('Sem florestas disponiveis')

  await prisma.florestas.update({
    where: { id: floresta.id },
    data: {
      treepycash_disponivel: floresta.treepycash_disponivel - qnt_treepycash
    }
  });

  const treepycashes = await prisma.treepycaches.create({
    data: {
      userId,
      florestaId: floresta.id,
      qnt: qnt_treepycash,
      isValid: true,
    }
  })

  const oneHourInMilliseconds = 60 * 1000;

  cron.schedule('* * * * *', async () => {

    const update = await prisma.treepycaches.updateMany({
      where: {
        AND: [
          {
            isValid: true,
          },
          {
            updated_at: { gt: new Date(new Date().getTime() - oneHourInMilliseconds) } // menos de 1h
          }
        ]
      },
      data: {
        isValid: false,
      }
    });

    console.log(`Atualizando ${update.count} treepycashes invalidos`);
  }, {
    timezone: 'America/Sao_Paulo'
  }
  );

}