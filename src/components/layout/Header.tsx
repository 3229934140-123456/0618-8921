import { Bell, Search, Settings, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-20">
      <div>
        <h1 className="text-xl font-semibold text-text font-display">{title}</h1>
        {subtitle && <p className="text-sm text-text-light mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
          <input
            type="text"
            placeholder="搜索礼品、计划、客户..."
            className="w-64 h-9 pl-9 pr-4 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
          />
        </div>

        <button className="relative p-2 rounded-lg text-text-light hover:text-text hover:bg-bg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
        </button>

        <button className="p-2 rounded-lg text-text-light hover:text-text hover:bg-bg transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 pl-4 border-l border-border cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-sm font-medium">
            管
          </div>
          <div className="text-sm">
            <p className="font-medium text-text">管理员</p>
          </div>
          <ChevronDown className="w-4 h-4 text-text-light" />
        </div>
      </div>
    </header>
  );
}
