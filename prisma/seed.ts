import prisma from "@/lib/prisma";

const beneFiciaryDataForAshish = [
    {
        benefeciaryId: "user_2c6BIseJtmZ3hiLxoCHIjLLpkSB",
        name: "Ashish",
        email: "random@email.com",
        userId: "user_2c6BIseJtmZ3hiLxoCHIjLLpkSB",
    }
];

const load = async () => {
    try {
        for (let i = 0; i < beneFiciaryDataForAshish.length; i++) {
            await prisma.beneficiary.create({
            data: {
                beneficiaryId: beneFiciaryDataForAshish[i].benefeciaryId,
                email: beneFiciaryDataForAshish[i].email,
                userId: beneFiciaryDataForAshish[i].userId,
                name: beneFiciaryDataForAshish[i].name,
            },
            })
        }
    } catch (e) {
      console.error(e)
      process.exit(1)
    } finally {
      await prisma.$disconnect()
    }
  }

  load()