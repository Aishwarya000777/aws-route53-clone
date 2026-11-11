
"use client";

import {
  Search,
  Bell,
  HelpCircle,
  Settings,
  ChevronDown,
  Menu
} from "lucide-react";
import { logout } from "@/lib/api";

export default function Header() {
  return (
    <header className="aws-header">
      <div className="header-left">
        <button className="header-menu">
          <Menu size={19} />
        </button>
        <span className="header-service">Route 53</span>
      </div>

      <div className="header-search">
        <Search size={17} />
        <input placeholder="Search AWS services and resources" />
        <span>⌘ K</span>
      </div>

      <div className="header-actions">
        <button title="Notifications"><Bell size={18} /></button>
        <button title="Help"><HelpCircle size={18} /></button>
        <button title="Settings"><Settings size={18} /></button>
        <button className="account-button">
          <span className="account-avatar">A</span>
          <span>admin</span>
          <ChevronDown size={14} />
        </button>
        <button className="logout-button" onClick={logout}>
          Sign out
        </button>
      </div>
    </header>
  );
}
