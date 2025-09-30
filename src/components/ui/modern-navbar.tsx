"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, Info, User, Github, DollarSign } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  isExternal?: boolean;
}

interface NavItemComponentProps extends NavItem {
  isMobileMenu?: boolean;
}

interface ModernNavbarProps {
  className?: string;
  items?: NavItem[];
}

const ModernNavbar: React.FC<ModernNavbarProps> = ({ className, items = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const defaultNavItems: NavItem[] = [
    {
      label: "Descargo de Responsabilidad",
      icon: <Info className="w-4 h-4" />,
      onClick: () => {},
    },
    {
      label: "Autor",
      icon: <User className="w-4 h-4" />,
      onClick: () => {},
    },
    {
      label: "GitHub",
      icon: <Github className="w-4 h-4" />,
      href: "https://github.com/dollar-gt",
      isExternal: true,
    },
  ];

  const navItems = [...defaultNavItems, ...items];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const NavItemComponent: React.FC<NavItemComponentProps> = ({
    label,
    icon,
    onClick,
    href,
    isExternal,
    isMobileMenu = false,
  }) => {
    const content = (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
          "text-muted-foreground hover:text-foreground hover:bg-accent/50"
        )}
        onClick={onClick}
      >
        {icon}
        <span className={cn(
          "text-sm font-medium",
          !isMobileMenu && "hidden sm:inline"
        )}>{label}</span>
      </motion.button>
    );

    if (href) {
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {content}
        </a>
      );
    }

    return content;
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b",
        "bg-background/80 dark:bg-background/90",
        "border-border/20 dark:border-border/10",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 sm:gap-2"
          >
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="text-sm sm:text-base lg:text-lg font-semibold tracking-tight">
              Dólar GT
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.label === "Descargo de Responsabilidad" ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <NavItemComponent {...item} isMobileMenu={false} />
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Info className="w-5 h-5" />
                          Descargo de Responsabilidad
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 text-sm text-muted-foreground">
                        <p>
                          Esta aplicación proporciona información sobre el historial del tipo de cambio del dólar estadounidense en Guatemala durante los últimos 30 días. Los datos son proporcionados por el Banco de Guatemala.
                        </p>
                        <p>
                          Si bien nos esforzamos por proporcionar información precisa y actualizada, no garantizamos la exactitud, integridad o puntualidad de la información presentada. Los tipos de cambio pueden variar y dependen de múltiples factores.
                        </p>
                        <p>
                          Esta aplicación no debe considerarse como asesoramiento financiero. Recomendamos consultar con un profesional antes de tomar decisiones financieras basadas en la información presentada aquí.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : item.label === "Autor" ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <NavItemComponent {...item} isMobileMenu={false} />
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Información del Autor
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Creado por</p>
                          <p className="font-medium">Luis Locon</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Contacto</p>
                          <a
                            href="https://x.com/loconluis"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            @LoconLuis
                          </a>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Código Fuente</p>
                          <a
                            href="https://github.com/dollar-gt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            github.com/dollar-gt
                          </a>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <NavItemComponent {...item} isMobileMenu={false} />
                )}
              </motion.div>
            ))}

            {/* Theme Toggle */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navItems.length * 0.1 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-9 w-9 p-0"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:hidden"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-9 w-9 p-0"
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/20"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.label === "Descargo de Responsabilidad" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <NavItemComponent {...item} isMobileMenu={true} />
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Info className="w-5 h-5" />
                              Descargo de Responsabilidad
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 text-sm text-muted-foreground">
                            <p>
                              Esta aplicación proporciona información sobre el historial del tipo de cambio del dólar estadounidense en Guatemala durante los últimos 30 días. Los datos son proporcionados por el Banco de Guatemala.
                            </p>
                            <p>
                              Si bien nos esforzamos por proporcionar información precisa y actualizada, no garantizamos la exactitud, integridad o puntualidad de la información presentada. Los tipos de cambio pueden variar y dependen de múltiples factores.
                            </p>
                            <p>
                              Esta aplicación no debe considerarse como asesoramiento financiero. Recomendamos consultar con un profesional antes de tomar decisiones financieras basadas en la información presentada aquí.
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : item.label === "Autor" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <NavItemComponent {...item} isMobileMenu={true} />
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <User className="w-5 h-5" />
                              Información del Autor
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Creado por</p>
                              <p className="font-medium">Luis Locon</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Contacto</p>
                              <a
                                href="https://x.com/loconluis"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                @LoconLuis
                              </a>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Código Fuente</p>
                              <a
                                href="https://github.com/dollar-gt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                github.com/dollar-gt
                              </a>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <NavItemComponent {...item} isMobileMenu={true} />
                    )}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="w-full justify-start h-9 px-3"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        Dark Mode
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default ModernNavbar;