import { useUI } from "../../context/UIContext";
import { useEffect, useState } from "react";

const AppToast = () => {
    const { toast } = useUI();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (toast) {
            setVisible(true);
            // Auto hide after duration
            const timer = setTimeout(() => setVisible(false), toast.duration || 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    if (!toast) return null;

    // Role-based colors (optional)
    const roleColors = {
        success: "bg-emerald-700",
        error: "bg-rose-700",
        info: "bg-slate-700",
        default: "bg-slate-800",
    };


    const bgColor = roleColors[toast.type] || roleColors.default;

    return (
        <div className="fixed top-6 right-11 z-50 flex flex-col gap-2">
            <div
                className={`
          ${bgColor} text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium 
          flex items-center gap-3 transform transition-all duration-300
          ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}
        `}
            >
                {toast.icon && (
                    <span className="material-symbols-outlined text-[18px]">
                        {toast.icon}
                    </span>
                )}
                <span className="flex-1">{toast.message}</span>

                {/* Optional action button */}
                {toast.action && (
                    <div className="relative group ml-2">
                        <button
                            onClick={toast.action.disabled ? undefined : toast.action.onClick}
                            className={`
        text-xs px-2 py-1 rounded transition
        ${toast.action.disabled
                                    ? "bg-white/5 text-white/50 cursor-not-allowed"
                                    : "bg-white/10 text-white font-bold hover:bg-white/20"}
      `}
                        >
                            {toast.action.label}
                        </button>

                        {/* Tooltip */}
                        {toast.action.tooltip && (
                            <div
                                className="
          absolute bottom-full mb-1 right-0
          whitespace-nowrap
          bg-black text-white text-[10px]
          px-2 py-1 rounded
          opacity-0 scale-95
          group-hover:opacity-100 group-hover:scale-100
          transition pointer-events-none
        "
                            >
                                {toast.action.tooltip}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default AppToast;
