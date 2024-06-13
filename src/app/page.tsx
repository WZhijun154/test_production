'use client';
import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import {
  type Container,
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { Button } from '@nextui-org/react';
import { semanticColors } from '@nextui-org/react';

const Introduction = () => {
  return (
    <div className='w-full relative flex flex-col items-center justify-center dark:bg-opacity-0 text-foreground bg-background'>
      <div className='z-10 relative flex flex-col items-start mt-[128px] mb-[96px] w-[768px]'>
        <p className='text-72px relative'>Enhance images</p>
        <p className='text-72px relative leading-[72px]'>with AI</p>
        <p className='text-24px relative leading-[36px] py-4'>
          AI tools to upscale images, remove backgrounds, detect entities, and
          restore old pictures.
        </p>
      </div>
    </div>
  );
};

const Body = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <div className='w-full h-[384px] relative flex flex-col items-center justify-center light:bg-opacity-0 light text-foreground backdrop-invert backdrop-blur-sm'>
        <div className='w-[768px] relative flex flex-col items-start'>
          <p className='text-60px'>Image Upscaler</p>
          <p className='text-24px mb-[24px]'>
            Enhance low-resolution images with AI upscaling technology.
          </p>
          <Button
            className='rounded-full'
            size='lg'
            color='default'
            variant='bordered'
          >
            Try for free!
          </Button>
        </div>
      </div>
      <div className='w-full h-[384px] relative flex flex-col items-center justify-center dark:bg-opacity-0 text-foregroung backdrop-blur-sm'>
        <div className='w-[768px] relative flex flex-col items-start'>
          <p className='text-60px'>Background Remover</p>
          <p className='text-24px mb-[24px]'>
            Remove the background from images with a single click.
          </p>
          <Button
            className='rounded-full'
            size='lg'
            color='default'
            variant='bordered'
          >
            Try for free!
          </Button>
        </div>
      </div>
      <div className='w-full h-[384px] relative flex flex-col items-center justify-center light:bg-opacity-0 light text-foreground backdrop-invert backdrop-blur-sm'>
        <div className='w-[768px] relative flex flex-col items-start'>
          <p className='text-60px'>Photo Enhancer</p>
          <p className='text-24px mb-[24px]'>
            Enhance your photos with AI-powered tools.
          </p>
          <Button
            className='rounded-full'
            size='lg'
            color='default'
            variant='bordered'
          >
            Try for free!
          </Button>
        </div>
      </div>
      <div className='w-full h-[384px] relative flex flex-col items-center justify-center dark:bg-opacity-0 text-foreground bg-background backdrop-blur-sm'>
        <div className='w-[768px] relative flex flex-col items-start text-default-900'>
          <p className='text-60px'>Photo Restorer</p>
          <p className='text-24px mb-[24px]'>
            Restore old photos with AI-powered tools.
          </p>
          <Button
            className='rounded-full'
            size='lg'
            color='default'
            variant='bordered'
          >
            Try for free!
          </Button>
        </div>
      </div>
      <div className='w-full h-[384px] relative flex flex-col items-center justify-center light:bg-opacity-0 light text-foreground backdrop-invert backdrop-blur-sm'>
        <div className='w-[768px] relative flex flex-col items-start'>
          <p className='text-60px'>Mono Photo Colorizer</p>
          <p className='text-24px mb-[24px]'>
            Colorize black and white photos with AI.
          </p>
          <Button
            className='rounded-full'
            size='lg'
            color='default'
            variant='bordered'
          >
            Try for free!
          </Button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
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

    const lightBackgroundColor =
      (semanticColors.light.background as Partial<{ DEFAULT: string }>)
        .DEFAULT || (semanticColors.light.background as string);

    const lightForegroundColor =
      (semanticColors.light.foreground as Partial<{ DEFAULT: string }>)
        .DEFAULT || (semanticColors.light.foreground as string);

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
          value: darkForegroundColor,
        },
        links: {
          color: darkForegroundColor,
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
          value: 80,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 10 },
        },
      },
      detectRetina: true,
    };
  }, []);

  if (init) {
    return (
      <div className='relative flex flex-col items-center'>
        <Particles
          id='tsparticles'
          particlesLoaded={particlesLoaded}
          options={options}
          className='absolute top-0 left-0 w-full h-full z-0'
        />
        <Introduction />
        <Body />
      </div>
    );
  }

  return <></>;
};

export default App;
