import { Outlet } from 'react-router';
import { SwitcherNavigateBtn } from 'shared/buttons/ui/SwitcherNavigateBtn';
import Footer from 'widgets/Footer';
import Header from 'widgets/Header';

export default function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <div className="fixed right-1/3 bottom-10 left-1/3 z-50 flex justify-center">
        <SwitcherNavigateBtn />
      </div>
      <Footer />
    </>
  );
}
