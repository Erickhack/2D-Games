import React from 'react';
import { Outlet } from 'react-router';
import { SwitcherNavigateBtn } from 'shared/buttons/ui/SwitcherNavigateBtn';
import Footer from 'widgets/Footer';
import Header from 'widgets/Header';

export default function DashboardLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
