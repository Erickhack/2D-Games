import { Outlet } from 'react-router';
import { Bear } from 'widgets/Bear/ui';
import Footer from 'widgets/Footer';
import Header from 'widgets/Header';

export default function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <Bear />
    </>
  );
}
