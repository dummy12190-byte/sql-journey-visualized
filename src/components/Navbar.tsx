import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, Settings } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/admin", label: "Admin", icon: Settings },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-12">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-lg">🧠</span>
          <span className="font-display text-foreground text-base tracking-tight">
            Skill<span className="text-primary">Stack</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
