import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, Image, Package, LogOut, Calendar, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      toast.error('Erro ao sair.');
    }
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
    }`;

  const SidebarContent = () => (
    <>
      <div className="text-2xl font-bold font-display tracking-wider mb-8 p-4">
        <span className="text-brand">La</span> hermandad
      </div>
      <nav className="flex-grow space-y-2">
        <NavLink to="/admin/dashboard" end className={navLinkClasses} onClick={() => setIsSidebarOpen(false)}>
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </NavLink>
        <NavLink to="/admin/appointments" className={navLinkClasses} onClick={() => setIsSidebarOpen(false)}>
          <Calendar className="mr-3 h-5 w-5" />
          Agendamentos
        </NavLink>
        <NavLink to="/admin/products" className={navLinkClasses} onClick={() => setIsSidebarOpen(false)}>
          <Package className="mr-3 h-5 w-5" />
          Produtos
        </NavLink>
        <NavLink to="/admin/banners" className={navLinkClasses} onClick={() => setIsSidebarOpen(false)}>
          <Image className="mr-3 h-5 w-5" />
          Banners
        </NavLink>
        <NavLink to="/admin/settings" className={navLinkClasses} onClick={() => setIsSidebarOpen(false)}>
          <Settings className="mr-3 h-5 w-5" />
          Configurações
        </NavLink>
      </nav>
      <div>
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={handleLogout}>
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100/50">
      {/* Static sidebar for desktop */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground p-4 flex-col flex-shrink-0 hidden md:flex md:fixed md:inset-y-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-30 transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <aside className="w-64 bg-sidebar text-sidebar-foreground p-4 flex flex-col h-full">
          <SidebarContent />
        </aside>
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      <div className="flex flex-col md:ml-64">
        {/* Top bar for mobile */}
        <header className="sticky top-0 z-10 flex items-center bg-background p-4 border-b md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex-1 text-center text-lg font-bold font-display">
            <span className="text-brand">La</span> hermandad
          </div>
        </header>
        
        <main className="flex-1 p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;