import { ThemeToggle } from '@/app/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components';
import Link from 'next/link';
import React from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import UserNav from '@/app/components/UserNav';

async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  const user = await getUser();

  return (
    <nav className='border-b bg-background h-[10vh] flex items-center'>
      <div className='container flex items-center justify-between'>
        <Link href='/'>
          <h1 className='font-bold text-3xl'>
            My<span className='text-primary'>Saas</span>
          </h1>
        </Link>

        <div className='flex items-center gap-x-5'>
          <ThemeToggle />

          {(await isAuthenticated()) ? (
            <UserNav
              email={user?.email as string}
              image={user?.picture as string}
              name={user?.given_name as string}
            />
          ) : (
            <div className='flex items-center gap-x-5'>
              <LoginLink>
                <Button className=''>Sign in</Button>
              </LoginLink>
              <RegisterLink>
                <Button variant='secondary'>Sing up</Button>
              </RegisterLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
