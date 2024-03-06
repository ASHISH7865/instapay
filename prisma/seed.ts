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
      
    } catch (e) {
      console.error(e)
      process.exit(1)
    } finally {
      await prisma.$disconnect()
    }
  }

  load()