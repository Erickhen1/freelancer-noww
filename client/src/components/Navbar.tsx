import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { 
  Search, 
  PlusCircle, 
  UserCircle, 
  Star, 
  Menu, 
  X, 
  MessageSquare,
  LogOut,
  Info
} from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const [location] = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    window.location.href = "/";
  };

  const navItems = [
    { name: "Buscar Vagas", path: "/buscar-vagas", icon: <Search className="mr-2 h-5 w-5" /> },
    { name: "Publicar Vaga", path: "/publicar-vaga", icon: <PlusCircle className="mr-2 h-5 w-5" /> },
    { name: "Meu Perfil", path: "/perfil", icon: <UserCircle className="mr-2 h-5 w-5" /> },
    { name: "Avaliações", path: "/avaliacoes", icon: <Star className="mr-2 h-5 w-5" /> },
    { name: "Mensagens", path: "/mensagens", icon: <MessageSquare className="mr-2 h-5 w-5" /> },
    { name: "Sobre Nós", path: "/sobre", icon: <Info className="mr-2 h-5 w-5" /> },
  ];

  return (
    <nav className="bg-gradient-to-r from-primary via-blue-600 to-blue-700 px-4 py-3 shadow-xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl md:text-2xl font-bold text-white flex items-center cursor-pointer hover:opacity-90 transition-opacity">
          <img
            src={APP_LOGO}
            alt={`${APP_TITLE} Logo`}
            className="h-10 w-10 object-contain hover:scale-105 transition-transform"
            style={{marginRight: '19px', borderRadius: '16px'}}
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/40x40/0ea5e9/ffffff?text=FN";
            }}
          />
          <span className="hidden sm:inline">{APP_TITLE}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-1 items-center">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={`text-white hover:bg-blue-600 hover:text-white px-3 py-2 text-sm ${
                location === item.path ? "bg-blue-600" : ""
              }`}
              asChild
            >
              <Link href={item.path}>
                {item.icon}
                {item.name}
              </Link>
            </Button>
          ))}

          {!isAuthenticated ? (
            <Button
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 text-sm ml-2"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Entrar
            </Button>
          ) : (
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white hover:bg-red-600 px-3 py-2 text-sm ml-2"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sair
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            onClick={toggleMobileMenu} 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-blue-600"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 bg-blue-600 rounded-md shadow-xl overflow-hidden">
          <ul className="flex flex-col space-y-1 p-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-white hover:bg-blue-500 hover:text-white text-base py-3 ${
                    location === item.path ? "bg-blue-500" : ""
                  }`}
                  asChild
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href={item.path}>
                    {item.icon}
                    {item.name}
                  </Link>
                </Button>
              </li>
            ))}

            {!isAuthenticated ? (
              <li>
                <Button
                  className="w-full justify-start bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base py-3"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.location.href = getLoginUrl();
                  }}
                >
                  Entrar
                </Button>
              </li>
            ) : (
              <li>
                <Button
                  onClick={handleLogout}
                  className="w-full justify-start bg-red-500 hover:bg-red-600 text-white text-base py-3"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sair
                </Button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

