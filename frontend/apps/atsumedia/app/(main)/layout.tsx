import MainFooter from './_components/MainFooter';
import MainHeader from './_components/MainHeader';
import React from 'react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={'md:min-w-[1024px] md:overflow-auto'}>
      <MainHeader />
      {children}
      <MainFooter />
    </main>
  );
}
