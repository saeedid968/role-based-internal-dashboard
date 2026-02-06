import Breadcrumbs from "../common/Breadcrumbs";

const Topbar = () => {
  return (
    <header className="h-14 shrink-0 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">

        {/* Left */}
        <div className="flex flex-col">
          <Breadcrumbs />
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Future: search */}
          {/* Future: notifications */}
          <div className="h-8 w-8 rounded-full bg-slate-300" />
        </div>

      </div>
    </header>
  );
};

export default Topbar;
