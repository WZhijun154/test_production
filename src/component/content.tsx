'use client';
import React from 'react';
import { Tabs, Tab, Avatar, Button } from '@nextui-org/react';
import { useState, useRef, useEffect } from 'react';
import ScrollButton from './scrollButton';

const Content = () => {
  const tabsPostionRef = useRef<HTMLDivElement>(null);
  const [isScrolledToTabs, setIsScrolledToTabs] = useState(false);

  let coverClassName =
    'flex flex-col w-full items-center justify-center transition-bg duration-700 ease-in-out bg-gray-900';
  coverClassName += isScrolledToTabs ? ' bg-opacity-97 ' : ' bg-opacity-50 ';

  let tabListsClassName =
    'self-center w-full px-96 bg-opacity-0 rounded-none transition-bg duration-700 ease-in-out';
  tabListsClassName += isScrolledToTabs ? ' bg-opacity-20' : ' bg-opacity-0 ';

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      if (tabsPostionRef.current) {
        setIsScrolledToTabs(position >= tabsPostionRef.current.offsetTop - 1); // Change 500 to whatever pixel value you need
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='w-full bg-tree bg-cover bg-fixed bg-center'>
      <div className={coverClassName}>
        <section
          className={`relative w-full h-[100vh] flex items-center justify-center`}
        >
          <div className='flex flex-col items-center justify-center gap-y-4'>
            <Avatar
              src='https://cdn.pixabay.com/photo/2023/01/02/09/13/ai-generated-7691654_1280.jpg'
              isBordered
              className='w-32 h-32 text-large'
            />
            <div className='relative z-10 text-center text-white max-w-3xl px-4 md:px-0'>
              <h1 className='text-4xl md:text-6xl font-bold mb-4'>
                Sir, place your name here
              </h1>
              <p className='text-lg md:text-xl mb-8'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                at dolor sed felis tincidunt ultrices. Nullam nec
              </p>
            </div>
          </div>
          <ScrollButton
            className='absolute bottom-20'
            targetRef={tabsPostionRef}
          />
        </section>
        <div ref={tabsPostionRef} />
        <Tabs
          size='lg'
          className=''
          variant='solid'
          radius='full'
          fullWidth
          motionProps={{
            initial: 'hidden',
            animate: 'visible',
            variants: {
              hidden: { opacity: 1 },
              visible: { opacity: 1 },
            },
          }}
          classNames={{
            base: 'w-full sticky top-0',
            tabList: tabListsClassName,
            tab: 'h-12 text-xl bg-color-white bg-opacity-100',
            tabContent: 'z-0 text-opacity-100 text-white',
            cursor: 'opacity-100 color-white',
            panel: 'w-full flex flex-col items-center justify-center',
          }}
        >
          <Tab key='posts' title={<span>Pdf Merging</span>}>
            Hello
          </Tab>
          <Tab key='likes' title='Likes'>
            <Button>Click me</Button>
          </Tab>
          <Tab key='comments' title='Comments'>
            <Button>Click me</Button>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Content;
