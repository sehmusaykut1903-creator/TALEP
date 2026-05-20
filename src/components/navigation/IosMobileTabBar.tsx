import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, FlaskConical, Settings, Bot } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function IosMobileTabBar() {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { t } = useSettings();

  useEffect(() => {
    setMounted(true);
    document.body.classList.add("ios-tabbar-active");
    return () => {
      document.body.classList.remove("ios-tabbar-active");
    };
  }, []);

  if (!mounted) return null;

  const items = [
    { id: "dashboard", label: t('dashboard'), icon: Home, to: "/" },
    { id: "assessment", label: t('assessment'), icon: PlusCircle, to: "/assessment" },
    { id: "talep-ai", label: t('talep_ai'), icon: Bot, to: "/ai" },
    { id: "library", label: t('library'), icon: FlaskConical, to: "/chemicals" },
    { id: "settings", label: t('settings'), icon: Settings, to: "/settings" },
  ];

  return createPortal(
    <div className="ios-tabbar-viewport-layer">
      <nav className="ios-tabbar" aria-label="Mobil alt menü">
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.id}
              to={item.to}
              className={`ios-tabbar-item ${isActive ? "active" : ""}`}
            >
              <span className="ios-tabbar-icon">
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </span>
              <span className="ios-tabbar-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>,
    document.body
  );
}
