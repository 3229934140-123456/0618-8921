import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface PageContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function PageContainer({ title, subtitle, children }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <div className="ml-60 min-h-screen">
        <Header title={title} subtitle={subtitle} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
