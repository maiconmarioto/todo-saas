import DashboardNav from '@/app/components/DashboardNav';
import React from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/db';
import { stripe } from '@/app/lib/stripe';
import { unstable_noStore } from 'next/cache';

async function getData({
  email,
  id,
  firstName,
  lastName,
  proflieImage,
}: {
  email: string;
  id: string;
  firstName: string | undefined | null;
  lastName: string | undefined | null;
  proflieImage: string | undefined | null;
}) {
  unstable_noStore();
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    await prisma.user.create({
      data: {
        id,
        email,
        name: `${firstName} ${lastName}`,
      },
    });
  }

  if (!user?.stripeCustomerId) {
    const data = await stripe.customers.create({
      email,
      name: `${firstName} ${lastName}`,
    });

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        stripeCustomerId: data.id,
      },
    });
  }
}

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user) {
    redirect('/');
  }

  await getData({
    email: user.email as string,
    id: user.id,
    firstName: user.given_name as string,
    lastName: user.family_name as string,
    proflieImage: user.picture,
  });

  return (
    <div className='flex flex-col space-y-6 mt-10'>
      <div className='container grid flex-1 gap-12 md:grid-cols-[200px_1fr]'>
        <aside className='hidden w-[200px] flex-col md:flex'>
          <DashboardNav />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
