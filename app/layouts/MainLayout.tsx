import { Outlet } from 'react-router';
import { Bear } from 'widgets/Bear/ui';
import Footer from 'widgets/Footer';
import Header from 'widgets/Header';

export default function MainLayout() {
  return (
    <>
      {/* <div className="sm-main-layout-div-1 absolute top-1.5 -right-16 -left-16">
        <img src="/banner-bg.png" className="h-full w-full" />
      </div> */}

      <Header />
      <Outlet />
      <Footer />
      <Bear />
    </>
  );
}
