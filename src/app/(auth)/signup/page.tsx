'use client';

import React from 'react';
import { Button, Input, Checkbox, Link, Divider } from '@nextui-org/react';
import { Icon } from '@iconify/react';
import { useFormStatus } from 'react-dom';
import { createClient } from '@/utils/supbase/client';
import { useRouter } from 'next/navigation';
import {
  emailPlaceHolder,
  usernamePlaceHolder,
  passwordPlaceHolder,
} from '@/utils/constStr';

export default function SignUp() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const router = useRouter();

  const { pending, action } = useFormStatus();

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) {
      // failed to sign in
      console.error(error);
    }
    // redirect to dashboard
    console.log('Sign up successful');
    router.push('/login');
  };

  return (
    <div className='animate-appearance-in flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small'>
      <p className='pb-2 text-xl font-medium'>Sign Up</p>
      <form className='flex flex-col gap-3'>
        <Input
          isRequired
          label='Username'
          name='username'
          placeholder={usernamePlaceHolder}
          type='text'
          variant='bordered'
        />
        <Input
          isRequired
          label='Email Address'
          name='email'
          placeholder={emailPlaceHolder}
          type='email'
          variant='bordered'
        />
        <Input
          isRequired
          endContent={
            <button type='button' onClick={toggleVisibility}>
              {isVisible ? (
                <Icon
                  className='pointer-events-none text-2xl text-default-400'
                  icon='solar:eye-closed-linear'
                />
              ) : (
                <Icon
                  className='pointer-events-none text-2xl text-default-400'
                  icon='solar:eye-bold'
                />
              )}
            </button>
          }
          label='Password'
          name='password'
          placeholder={passwordPlaceHolder}
          type={isVisible ? 'text' : 'password'}
          variant='bordered'
        />
        <Input
          isRequired
          endContent={
            <button type='button' onClick={toggleConfirmVisibility}>
              {isConfirmVisible ? (
                <Icon
                  className='pointer-events-none text-2xl text-default-400'
                  icon='solar:eye-closed-linear'
                />
              ) : (
                <Icon
                  className='pointer-events-none text-2xl text-default-400'
                  icon='solar:eye-bold'
                />
              )}
            </button>
          }
          label='Confirm Password'
          name='confirmPassword'
          placeholder={passwordPlaceHolder}
          type={isConfirmVisible ? 'text' : 'password'}
          variant='bordered'
        />
        <Checkbox isRequired className='py-4' size='sm'>
          I agree with the&nbsp;
          <Link href='#' size='sm'>
            Terms
          </Link>
          &nbsp; and&nbsp;
          <Link href='#' size='sm'>
            Privacy Policy
          </Link>
        </Checkbox>
        <Button
          color='primary'
          type='submit'
          isLoading={pending}
          formAction={handleSubmit}
        >
          Sign Up
        </Button>
      </form>
      <div className='flex items-center gap-4 py-2'>
        <Divider className='flex-1' />
        <p className='shrink-0 text-tiny text-default-500'>OR</p>
        <Divider className='flex-1' />
      </div>
      <div className='flex flex-col gap-2'>
        <Button
          startContent={<Icon icon='flat-color-icons:google' width={24} />}
          variant='bordered'
        >
          Sign Up with Google
        </Button>
        <Button
          startContent={
            <Icon className='text-default-500' icon='fe:github' width={24} />
          }
          variant='bordered'
        >
          Sign Up with Github
        </Button>
      </div>
      <p className='text-center text-small'>
        Already have an account?&nbsp;
        <Link href='/login' size='sm'>
          Log In
        </Link>
      </p>
    </div>
  );
}
