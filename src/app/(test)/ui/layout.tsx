'use client';
import { useEffect, useMemo, useState } from 'react';
import React from 'react';
import {
  type Container,
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { semanticColors } from '@nextui-org/react';

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const [init, setInit] = useState(false);
  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  const options: ISourceOptions = useMemo(() => {
    const darkBackgroundColor =
      (semanticColors.dark.background as Partial<{ DEFAULT: string }>)
        .DEFAULT || (semanticColors.dark.background as string);
    const darkForegroundColor =
      (semanticColors.dark.foreground as Partial<{ DEFAULT: string }>)
        .DEFAULT || (semanticColors.dark.foreground as string);
    const primaryColor =
      (semanticColors.dark.primary as Partial<{ DEFAULT: string }>).DEFAULT ||
      (semanticColors.dark.primary as string);

    return {
      background: {
        color: {
          value: darkBackgroundColor,
        },
      },
      fpsLimit: 30,
      interactivity: {
        events: {},
        modes: {},
      },
      particles: {
        color: {
          value: primaryColor,
        },
        links: {
          color: primaryColor,
          distance: 150,
          enable: true,
          opacity: 1,
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: {
            default: OutMode.out,
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 20,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 5, max: 30 },
        },
      },
      detectRetina: true,
    };
  }, []);
  if (init) {
    return (
      <>
        {/* <Particles
          id='tsparticles'
          particlesLoaded={particlesLoaded}
          options={options}
          className='absolute inset-0 z-0'
        /> */}
        <div className='absolute inset-0 backdrop-blur-md' />
        {children}
      </>
    );
  }

  return <></>;
}
