"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Moon,
  Sun,
  Menu,
  X,
  Info,
  User,
  Github,
  DollarSign,
} from "lucide-react";
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

const REPO_URL = "https://github.com/loconluis/dollar-gt";
const REPO_LABEL = "github.com/loconluis/dollar-gt";

/* Legal copy: preserved verbatim. */
const DisclaimerDialogBody = (
  <div className="space-y-4 text-sm text-muted-foreground">
    <p>
      Esta aplicación proporciona información sobre el historial del tipo de
      cambio del dólar estadounidense en Guatemala durante los últimos 30 días.
      Los datos son proporcionados por el Banco de Guatemala.
    </p>
    <p>
      Si bien nos esforzamos por proporcionar información precisa y actualizada,
      no garantizamos la exactitud, integridad o puntualidad de la información
      presentada. Los tipos de cambio pueden variar y dependen de múltiples
      factores.
    </p>
    <p>
      Esta aplicación no debe considerarse como asesoramiento financiero.
      Recomendamos consultar con un profesional antes de tomar decisiones
      financieras basadas en la información presentada aquí.
    </p>
  </div>
);

const AuthorDialogBody = (
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
        className="text-primary hover:underline underline-offset-2"
      >
        @LoconLuis
      </a>
    </div>
    <div>
      <p className="text-sm text-muted-foreground">Código Fuente</p>
      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline underline-offset-2"
      >
        {REPO_LABEL}
      </a>
    </div>
  </div>
);

const ModernNavbar: React.FC<ModernNavbarProps> = ({
  className,
  items = [],
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  // Mount detection without setState-in-effect: false on the server
  // render, true once hydrated, so theme-dependent UI never mismatches.
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const { theme, setTheme } = useTheme();

  if (!mounted) return null;

  const defaultNavItems: NavItem[] = [
    {
      label: "Descargo de Responsabilidad",
      icon: <Info className="h-4 w-4" />,
      onClick: () => {},
    },
    {
      label: "Autor",
      icon: <User className="h-4 w-4" />,
      onClick: () => {},
    },
    {
      label: "GitHub",
      icon: <Github className="h-4 w-4" />,
      href: REPO_URL,
      isExternal: true,
    },
  ];

  const navItems = [...defaultNavItems, ...items];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const NavItemComponent = React.forwardRef<
    HTMLElement,
    NavItemComponentProps & React.HTMLAttributes<HTMLElement>
  >(({ label, icon, onClick, href, isExternal, isMobileMenu = false, ...rest }, ref) => {
    const baseClasses = cn(
      "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors cursor-pointer",
      "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    );

    const labelEl = (
      <span
        className={cn(
          "text-sm font-medium",
          !isMobileMenu && "hidden lg:inline",
        )}
      >
        {label}
      </span>
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className={baseClasses}
          {...rest}
        >
          {icon}
          {labelEl}
        </a>
      );
    }

    return (
      <span
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        }}
        className={baseClasses}
        {...rest}
      >
        {icon}
        {labelEl}
      </span>
    );
  });
  NavItemComponent.displayName = "NavItemComponent";

  const renderNavItem = (item: NavItem, isMobileMenu: boolean) => {
    if (item.label === "Descargo de Responsabilidad") {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <NavItemComponent {...item} isMobileMenu={isMobileMenu} />
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Descargo de Responsabilidad
              </DialogTitle>
            </DialogHeader>
            {DisclaimerDialogBody}
          </DialogContent>
        </Dialog>
      );
    }
    if (item.label === "Autor") {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <NavItemComponent {...item} isMobileMenu={isMobileMenu} />
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Información del Autor
              </DialogTitle>
            </DialogHeader>
            {AuthorDialogBody}
          </DialogContent>
        </Dialog>
      );
    }
    return <NavItemComponent {...item} isMobileMenu={isMobileMenu} />;
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b",
        "bg-background/85 backdrop-blur-md",
        "border-border/70",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a
            href="#top"
            className="flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Dólar GT, inicio"
          >
            <DollarSign
              className="h-5 w-5 text-primary sm:h-6 sm:w-6"
              aria-hidden="true"
            />
            <span className="text-sm sm:text-base lg:text-lg font-semibold tracking-tight">
              Dólar GT
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <React.Fragment key={item.label}>
                {renderNavItem(item, false)}
              </React.Fragment>
            ))}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="relative h-9 w-9 p-0"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Abrir menú"
              className="h-9 w-9 p-0"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border/70"
            >
              <div className="space-y-1 py-4">
                {navItems.map((item) => (
                  <React.Fragment key={item.label}>
                    {renderNavItem(item, true)}
                  </React.Fragment>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="h-9 w-full justify-start px-3"
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default ModernNavbar;
