import prisma from '@/app/lib/db';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { revalidatePath, unstable_noStore } from 'next/cache';
import { SubmitButton } from '@/app/components/SubmitButtons';

async function getData(userId: string) {
  unstable_noStore();
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      colorScheme: true,
    },
  });

  return data;
}

async function SettingsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  async function postData(formData: FormData) {
    'use server';
    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        name: (formData.get('name') as string) ?? undefined,
        colorScheme: (formData.get('color') as string) ?? undefined,
      },
    });

    revalidatePath('/', 'layout');
  }

  const data = await getData(user?.id as string);
  return (
    <div className='grid items-start gap-8'>
      <div className='flex items-center justify-between px-2'>
        <div className='grid gap-1'>
          <h1 className='text-3xl md:text-4xl'>Settings</h1>
          <p className='text-lg text-muted-foreground'>Your profile settings</p>
        </div>
      </div>

      <Card>
        <form action={postData}>
          <CardHeader>
            <CardTitle>General data</CardTitle>
            <CardDescription>
              Please provider general information about yourself. Please dont
              forget to save
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='space-y-1'>
                <Label>Your name</Label>
                <Input
                  name='name'
                  placeholder='Your name'
                  type='text'
                  id='name'
                  defaultValue={data?.name ?? ''}
                />
              </div>
              <div className='space-y-1'>
                <Label>Your email</Label>
                <Input
                  name='email'
                  placeholder='Your email'
                  type='email'
                  id='email'
                  disabled
                  defaultValue={data?.email ?? ''}
                />
              </div>
              <div className='space-y-1'>
                <Label>Color Scheme</Label>
                <Select name='color' defaultValue={data?.colorScheme ?? ''}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a color' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Color</SelectLabel>
                      <SelectItem value='theme-green'>Green</SelectItem>
                      <SelectItem value='theme-blue'>Blue</SelectItem>
                      <SelectItem value='theme-violet'>Violet</SelectItem>
                      <SelectItem value='theme-orange'>Orange</SelectItem>
                      <SelectItem value='theme-red'>Red</SelectItem>
                      <SelectItem value='theme-rose'>Rose</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default SettingsPage;
