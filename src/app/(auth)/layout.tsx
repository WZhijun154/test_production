export default function AuthenticationLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav></nav>
      <div className='flex h-screen w-screen items-center justify-center overflow-hidden rounded-none bg-content1 p-2 sm:p-4 lg:p-8 bg-tree bg-center bg-cover'>
        {/* Brand Logo */}
        <div className='absolute left-10 top-10'>
          <div className='flex items-center'></div>
        </div>
        {/* Testimonial */}
        <div className='absolute bottom-10 left-10 hidden md:block'>
          <p className='max-w-xl text-white/60'>
            <span className='font-medium'>“</span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget
            augue nec massa volutpat aliquet.
            <span className='font-medium'>”</span>
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}
