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
      label: "Disclaimer",
      icon: <Info className="w-4 h-4" />,
      onClick: () => {},
    },
    {
      label: "Author",
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

  const NavItemComponent: React.FC<NavItem> = ({
    label,
    icon,
    onClick,
    href,
    isExternal,
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
        <span className="text-sm font-medium hidden sm:inline">{label}</span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <DollarSign className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold tracking-tight">
              Dólar en Guatemala
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
                {item.label === "Disclaimer" ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <NavItemComponent {...item} />
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Info className="w-5 h-5" />
                          Disclaimer
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 text-sm text-muted-foreground">
                        <p>
                          This application provides information about the exchange rate history of the US dollar in Guatemala over the last 30 days. Data is provided by the Bank of Guatemala.
                        </p>
                        <p>
                          While we strive to provide accurate and up-to-date information, we do not guarantee the accuracy, completeness, or timeliness of the information presented. Exchange rates may vary and depend on multiple factors.
                        </p>
                        <p>
                          This application should not be considered as financial advice. We recommend consulting with a professional before making financial decisions based on the information presented here.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : item.label === "Author" ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <NavItemComponent {...item} />
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Author Information
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Created by</p>
                          <p className="font-medium">Luis Locon</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Contact</p>
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
                          <p className="text-sm text-muted-foreground">Source Code</p>
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
                  <NavItemComponent {...item} />
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
                    <NavItemComponent {...item} />
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