'use client';

import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Avatar,
  Input,
  Badge,
} from '@nextui-org/react';
import { Icon } from '@iconify/react';

export default function LandingLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='w-full'>
      <Navbar
        classNames={{
          base: 'bg-gray-500 dark:bg-primary-600',
          wrapper: 'px-4 sm:px-6',
          item: 'data-[active=true]:text-primary',
        }}
        height='64px'
      >
        <NavbarBrand>
          <NavbarMenuToggle className='h-6 sm:hidden' />
          <p className='font-bold text-inherit'>IMAGIO</p>
        </NavbarBrand>
        <NavbarContent
          className='hidden h-12 w-full max-w-fit gap-4 rounded-full px-4 sm:flex'
          justify='start'
        >
          <NavbarItem>
            <Link className='flex gap-2 text-inherit' href='#'>
              Dashboard
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link
              aria-current='page'
              className='flex gap-2 text-inherit'
              href='#'
            >
              Deployments
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className='flex gap-2 text-inherit' href='#'>
              Analytics
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className='flex gap-2 text-inherit' href='#'>
              Team
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className='flex gap-2 text-inherit' href='#'>
              Settings
            </Link>
          </NavbarItem>
        </NavbarContent>
        {/* Right Menu */}
        <NavbarContent
          className='ml-auto h-12 max-w-fit items-center gap-0'
          justify='end'
        >
          {/* Search */}
          <NavbarItem className='mr-2 hidden lg:flex'>
            <Input
              aria-label='Search'
              classNames={{
                base: 'px-1',
                inputWrapper:
                  'bg-gray-400 dark:bg-gray-300 data-[hover=true]:bg-gray-300/80 group-data-[focus=true]:bg-gray-300 w-48',
                input:
                  'font-light placeholder:text-primary-foreground/80 group-data-[has-value=true]:text-primary-foreground',
              }}
              labelPlacement='outside'
              placeholder='Search...'
              radius='full'
              startContent={
                <Icon
                  className='text-primary-foreground/60 [&>g]:stroke-[2px]'
                  icon='solar:magnifer-linear'
                  width={20}
                />
              }
            />
          </NavbarItem>
          {/* Mobile search */}
          <NavbarItem className='lg:hidden'>
            <Button isIconOnly radius='full' variant='light'>
              <Icon
                className='text-primary-foreground/60'
                icon='solar:magnifer-linear'
                width={20}
              />
            </Button>
          </NavbarItem>
          {/* Theme change */}
          <NavbarItem className='hidden lg:flex'>
            <Button isIconOnly radius='full' variant='light'>
              <Icon
                className='text-primary-foreground/60'
                icon='solar:sun-linear'
                width={24}
              />
            </Button>
          </NavbarItem>
          {/* Settings */}
          <NavbarItem className='hidden lg:flex'>
            <Button isIconOnly radius='full' variant='light'>
              <Icon
                className='text-primary-foreground/60'
                icon='solar:settings-linear'
                width={24}
              />
            </Button>
          </NavbarItem>
          {/* Notifications */}
          <NavbarItem className='flex'>
            <Popover offset={12} placement='bottom-end'>
              <PopoverTrigger>
                <Button
                  disableRipple
                  isIconOnly
                  className='overflow-visible'
                  radius='full'
                  variant='light'
                >
                  <Badge
                    color='danger'
                    content='5'
                    showOutline={false}
                    size='md'
                  >
                    <Icon
                      className='text-primary-foreground/60'
                      icon='solar:bell-linear'
                      width={22}
                    />
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className='max-w-[90vw] p-0 sm:max-w-[380px]'>
                {/* <NotificationsCard className='w-full shadow-none' /> */}
              </PopoverContent>
            </Popover>
          </NavbarItem>
          {/* User Menu */}
          <NavbarItem className='px-2'>
            <Dropdown placement='bottom-end'>
              <DropdownTrigger>
                <button className='mt-1 h-8 w-8 transition-transform'>
                  <Badge
                    classNames={{
                      badge: 'border-primary',
                    }}
                    color='success'
                    content=''
                    placement='bottom-right'
                    shape='circle'
                  >
                    <Avatar
                      size='sm'
                      src='https://i.pravatar.cc/150?u=a04258114e29526708c'
                    />
                  </Badge>
                </button>
              </DropdownTrigger>
              <DropdownMenu aria-label='Profile Actions' variant='flat'>
                <DropdownItem key='profile' className='h-14 gap-2'>
                  <p className='font-semibold'>Signed in as</p>
                  <p className='font-semibold'>johndoe@example.com</p>
                </DropdownItem>
                <DropdownItem key='settings'>My Settings</DropdownItem>
                <DropdownItem key='team_settings'>Team Settings</DropdownItem>
                <DropdownItem key='analytics'>Analytics</DropdownItem>
                <DropdownItem key='system'>System</DropdownItem>
                <DropdownItem key='configurations'>Configurations</DropdownItem>
                <DropdownItem key='help_and_feedback'>
                  Help & Feedback
                </DropdownItem>
                <DropdownItem key='logout' color='danger'>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Menu */}
        <NavbarMenu>
          <NavbarMenuItem>
            <Link className='w-full' color='foreground' href='#'>
              Dashboard
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem isActive>
            <Link
              aria-current='page'
              className='w-full'
              color='primary'
              href='#'
            >
              Deployments
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link className='w-full' color='foreground' href='#'>
              Analytics
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link className='w-full' color='foreground' href='#'>
              Team
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link className='w-full' color='foreground' href='#'>
              Settings
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
      {children}
    </div>
  );
}
