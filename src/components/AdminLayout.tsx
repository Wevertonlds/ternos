import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, Image, Package, LogOut } from 'lucide-react';
import { Button } from './ui/button';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Em uma aplicação real, aqui você limparia os tokens de autenticação
    navigate('/admin');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
    }`;

  return (
    <div className="flex min-h-screen bg-gray-100/50">
      <aside className="w-64 bg-sidebar text-sidebar-foreground p-4 flex flex-col flex-shrink-0">
        <div className="text-2xl font-bold font-display tracking-wider mb-8 p-4">
          <span className="text-brand">La</span> hermandad
        </div>
        <nav className="flex-grow space-y-2">
          <NavLink to="/admin/dashboard" end className={navLinkClasses}>
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/settings" className={navLinkClasses}>
            <Settings className="mr-3 h-5 w-5" />
            Configurações
          </NavLink>
          <NavLink to="/admin/banners" className={navLinkClasses}>
            <Image className="mr-3 h-5 w-5" />
            Banners
          </NavLink>
          <NavLink to="/admin/products" className={navLinkClasses}>
            <Package className="mr-3 h-5 w-5" />
            Produtos
          </NavLink>
        </nav>
        <div>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={handleLogout}>
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-6 sm:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;