import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp, Layers, CreditCard, AlertCircle,
  Search, Bell, Settings, Info,
  Download, Filter, ShieldCheck, Activity,
  Hammer
} from 'lucide-react';
import Footer from '../../components/common/footer';

// --- MOCK DATA SERVICES ---
const CHART_DATA = {
  Day: {
    points: [40, 60, 45, 80, 70, 90, 65, 85, 95, 110, 100, 120],
    labels: ['2am', '4am', '6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm', '12am']
  },
  Week: {
    points: [120, 40, 100, 20, 110, 40, 100],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  Month: {
    points: [50, 80, 60, 90, 120, 100, 140, 130, 160, 140, 180, 150],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }
};


const ACTIVITY_DATA = [
  { id: 1, user: "Sarah Chen", action: "deployed build", target: "v2.4.0-release", time: "24m ago", tag: "Project", tagColor: "blue", image: "Sarah" },
  { id: 2, user: "Finance Bot", action: "approved", target: "Q3 Auxiliary Budget", time: "2h ago", tag: "Finance", tagColor: "green", icon: "shield" },
  { id: 3, user: "Marcus Thorne", action: "initiated", target: "Onboarding Protocol", time: "5h ago", tag: "HR", tagColor: "purple", image: "Marcus" },
  { id: 4, user: "CloudWatch", action: "reported", target: "Latency Spike: APAC", time: "Yesterday", tag: "Urgent", tagColor: "red", icon: "activity" },
  { id: 5, user: "System Admin", action: "updated", target: "Firewall Rules", time: "Yesterday", tag: "Security", tagColor: "blue", icon: "shield" },
  { id: 6, user: "Jessica Wu", action: "commented", target: "PR #402", time: "2 days ago", tag: "Dev", tagColor: "purple", image: "Jessica" },
];


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Week');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredActivities, setFilteredActivities] = useState(ACTIVITY_DATA);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [chartAnimating, setChartAnimating] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // --- 1. SEARCH FUNCTIONALITY ---
  useEffect(() => {
    setSearchLoading(true);

    const timer = setTimeout(() => {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = ACTIVITY_DATA.filter(item =>
        item.user.toLowerCase().includes(lowerQuery) ||
        item.target.toLowerCase().includes(lowerQuery) ||
        item.tag.toLowerCase().includes(lowerQuery)
      );
      setFilteredActivities(filtered);
      setSearchLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setChartAnimating(true);
    const timer = setTimeout(() => {
      setChartAnimating(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // --- 2. CHART GENERATION LOGIC ---
  const currentChart = useMemo(() => CHART_DATA[activeTab], [activeTab]);

  const getSvgPath = (points) => {
    if (!points || points.length === 0) return "";
    const height = 200;
    const width = 800;
    const stepX = width / (points.length - 1);

    let path = `M0,${height - points[0]}`;
    points.forEach((p, i) => {
      if (i === 0) return;
      const x = i * stepX;
      const y = height - p;
      const prevX = (i - 1) * stepX;
      const prevY = height - points[i - 1];
      const cp1x = prevX + (x - prevX) / 2;
      const cp1y = prevY;
      const cp2x = prevX + (x - prevX) / 2;
      const cp2y = y;
      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
    });
    return path;
  };

  const chartPath = getSvgPath(currentChart.points);

  // Calculate statistics
  const stats = useMemo(() => {
    const points = currentChart.points;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const avg = points.reduce((a, b) => a + b, 0) / points.length;
    const trend = points[points.length - 1] > points[0] ? 'up' : 'down';
    const trendPercent = Math.abs(((points[points.length - 1] - points[0]) / points[0]) * 100).toFixed(1);

    return { max, min, avg: avg.toFixed(1), trend, trendPercent };
  }, [currentChart]);


  // Download handler with progress animation
  const handleDownload = () => {
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
            setDownloadProgress(0);
          }, 3000);
          return 100;
        }
        return prev + 10;
      });
    }, 50);
  };

  // Get point coordinates for interactive dots
  const getPointCoordinates = (index) => {
    const width = 800;
    const height = 200;
    const stepX = width / (currentChart.points.length - 1);
    const x = index * stepX;
    const y = height - currentChart.points[index];
    return { x, y };
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="relative flex items-center justify-center">
          <div className="h-20 w-20 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
          <div className="absolute h-20 w-20 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          <span className="material-symbols-outlined absolute text-blue-600 animate-pulse">monitoring</span>
        </div>
        <div className="mt-6 flex flex-col items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Initializing Systems</h2>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce"></span>
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-2 font-medium">Fetching Secure Data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mx-auto max-w-7xl px-4 sm:px-4 lg:px-2 flex flex-col gap-6 relative">

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Exporting Report...</span>
          </div>
        </div>
      )}

      {/* 1. GLOBAL COMMAND HEADER */}
      <div className=" max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Enterprise Operations Command
          </h1>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-primary/60 to-transparent rounded-full"></div>
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
            <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400">System Live</span>
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400">
          Real-time performance metrics and department synchronization.
        </p>
      </div>

      {/* 2. UTILITY & SEARCH BAR */}
      <header className="flex items-center justify-end h-16 max-w-7xl mx-auto w-full sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm w-72 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Search assets, projects, or staff..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

          </div>
          <div className="flex items-center gap-2 relative">

            {/* Notification Button */}
            <div className="relative" onMouseEnter={() => setHoveredIcon('bell')} onMouseLeave={() => setHoveredIcon(null)}>
              <button className="size-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500 transition-all relative shadow-sm">
                <Bell className="size-5" />
                <span className="absolute top-2 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
              {hoveredIcon === 'bell' && <Tooltip text="Notifications module under maintenance" />}
            </div>

            {/* Settings Button */}
            <div className="relative" onMouseEnter={() => setHoveredIcon('settings')} onMouseLeave={() => setHoveredIcon(null)}>
              <button className="size-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500 transition-all shadow-sm">
                <Settings className="size-5" />
              </button>
              {hoveredIcon === 'settings' && <Tooltip text="Config panel construction in progress" />}
            </div>

          </div>
        </div>
      </header>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="flex flex-col gap-8 max-w-7xl mx-auto w-full">

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 cursor-default">
          <StatCard
            title="Operational Efficiency"
            value="94.2%"
            trend="+2.4%"
            sub="Target: 90%"
            icon={<TrendingUp className="size-5" />}
            color="green"
          />
          <StatCard
            title="Active Sprints"
            value="14"
            trend="Stable"
            sub="2 Release Candidates"
            icon={<Layers className="size-5" />}
            color="primary"
          />
          <StatCard
            title="Monthly Burn"
            value="$45,200"
            trend="-5%"
            sub="Under Budget"
            icon={<CreditCard className="size-5" />}
            color="red"
          />
          <StatCard
            title="Security Alerts"
            value="3"
            trend="High Priority"
            sub="Requires Triage"
            icon={<AlertCircle className="size-5" />}
            color="amber"
            alert
          />
        </div>


        {/* ANALYTICS SECTION */}
        <div className="relative">
          {/* Toast Notification */}
          {showToast && (
            <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-[slideInRight_0.3s_ease-out]">
              <Download className="size-5 text-green-400" />
              <span className="text-sm font-medium">Report downloaded successfully!</span>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm  transition-all hover:shadow-md">
            {/* Header */}
            <div className="relative overflow-visible p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Throughput Analytics
                    </h3>
                    <div className="group relative">
                      <Info className="size-4 text-slate-400 cursor-help transition-colors hover:text-slate-600 dark:hover:text-slate-300" />

                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-2xl z-50 animate-[fadeIn_0.15s_ease-out]">
                        <div className="font-semibold mb-1">Calculation Method</div>
                        <div className="text-slate-300">
                          Based on closed Jira tickets vs. active capacity. Updated in real-time.
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                      </div>
                    </div>

                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold transition-all ${stats.trend === 'up'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                      <TrendingUp className={`size-3 transition-transform ${stats.trend === 'down' ? 'rotate-180' : ''}`} />
                      {stats.trendPercent}%
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                      Current Period
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">Avg: {stats.avg}%</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">Peak: {stats.max}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                  {/* Tab Selector */}
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
                    {['Day', 'Week', 'Month'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-300 cursor-pointer ${activeTab === tab
                          ? 'bg-white dark:bg-slate-700 shadow-md text-primary dark:text-white scale-105'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                          }`}
                      >
                        {tab}
                        {activeTab === tab && (
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    disabled={downloadProgress > 0 && downloadProgress < 100}
                    className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <Download className="size-4" />
                    {downloadProgress > 0 && downloadProgress < 100 && (
                      <div className="absolute inset-0 bg-primary/10 rounded-md overflow-hidden">
                        <div
                          className="h-full bg-primary/30 transition-all duration-300"
                          style={{ width: `${downloadProgress}%` }}
                        ></div>
                      </div>
                    )}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Download Report
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="p-6 pt-8">
              <div className="h-72 w-full relative group">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-slate-400 font-bold pb-6">
                  {[100, 75, 50, 25, 0].map((val, i) => (
                    <span key={val} className="animate-[fadeIn_0.5s_ease-out]" style={{ animationDelay: `${i * 0.1}s` }}>
                      {val}%
                    </span>
                  ))}
                </div>

                <div className="ml-8 h-full">
                  {/* Chart SVG */}
                  <svg
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                    viewBox="0 0 800 200"
                  >
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#135bec" stopOpacity="0.3" />
                        <stop offset="95%" stopColor="#135bec" stopOpacity="0" />
                      </linearGradient>

                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>

                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#135bec" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 50, 100, 150, 200].map((y, i) => (
                      <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="800"
                        y2={y}
                        stroke="currentColor"
                        className="text-slate-100 dark:text-slate-800/50 transition-opacity"
                        strokeWidth="1"
                        opacity={chartAnimating ? 0 : 1}
                        style={{ transition: 'opacity 0.3s ease-out' }}
                      />
                    ))}

                    {/* Area Fill */}
                    <path
                      d={`${chartPath} L800,200 L0,200 Z`}
                      fill="url(#areaGradient)"
                      className="transition-all duration-700 ease-in-out"
                      style={{
                        opacity: chartAnimating ? 0 : 1,
                        transform: chartAnimating ? 'scaleY(0)' : 'scaleY(1)',
                        transformOrigin: 'bottom'
                      }}
                    />

                    {/* Line Path */}
                    <path
                      d={chartPath}
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-700 ease-in-out"
                      filter="url(#glow)"
                      style={{
                        opacity: chartAnimating ? 0 : 1,
                        strokeDasharray: chartAnimating ? 1000 : 0,
                        strokeDashoffset: chartAnimating ? 1000 : 0
                      }}
                    />

                    {/* Interactive Data Points */}
                    {currentChart.points.map((point, index) => {
                      const { x, y } = getPointCoordinates(index);
                      return (
                        <g key={index}>
                          {/* Invisible larger hit area for better hover detection */}
                          <circle
                            cx={x}
                            cy={y}
                            r={16}
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredPoint(index)}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />

                          {/* Outer glow circle */}
                          <circle
                            cx={x}
                            cy={y}
                            r={hoveredPoint === index ? 12 : 0}
                            fill="#135bec"
                            opacity="0.2"
                            className="transition-all duration-200"
                            style={{ pointerEvents: 'none' }}
                          />

                          {/* Main data point */}
                          <circle
                            cx={x}
                            cy={y}
                            r={hoveredPoint === index ? 6 : 4}
                            fill="#135bec"
                            className="transition-all duration-200"
                            style={{
                              opacity: chartAnimating ? 0 : (hoveredPoint === index ? 1 : 0.7),
                              animationDelay: `${index * 0.05}s`,
                              pointerEvents: 'none'
                            }}
                          />

                          {/* Tooltip */}
                          {hoveredPoint === index && (
                            <g style={{ pointerEvents: 'none' }}>
                              <rect
                                x={x - 30}
                                y={y - 40}
                                width="60"
                                height="28"
                                rx="4"
                                fill="#1e293b"
                                className="animate-[fadeIn_0.2s_ease-out]"
                              />
                              <text
                                x={x}
                                y={y - 28}
                                textAnchor="middle"
                                fill="white"
                                fontSize="11"
                                fontWeight="bold"
                              >
                                {point}%
                              </text>
                              <text
                                x={x}
                                y={y - 17}
                                textAnchor="middle"
                                fill="#94a3b8"
                                fontSize="9"
                              >
                                {currentChart.labels[index]}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* X-axis Labels */}
                  <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-bold uppercase">
                    {currentChart.labels.map((label, i) => (
                      <span
                        key={i}
                        className="transition-all duration-300 hover:text-slate-600 dark:hover:text-slate-300 hover:scale-110 cursor-default"
                        style={{
                          opacity: chartAnimating ? 0 : 1,
                          transform: chartAnimating ? 'translateY(10px)' : 'translateY(0)',
                          transitionDelay: `${i * 0.05}s`
                        }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Insight Footer */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800/30 dark:to-blue-900/10 px-6 py-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Filter className="size-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Smart Insight
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {activeTab === 'Week'
                      ? "Throughput is peaking mid-week. Consider moving APAC deployments to the Thursday window for optimal performance."
                      : activeTab === 'Month'
                        ? "Monthly capacity is at 85%. Review hiring plan for Q4 to maintain service levels and prevent bottlenecks."
                        : "Daily trend indicates higher load during morning standups (8-10am). Consider load balancing strategies."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* RECENT ACTIVITY LOGS WITH SEARCH */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[300px]">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Audit Logs & System Activity</h3>
            <button className="text-xs font-bold text-primary hover:underline cursor-pointer">View Full Audit</button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((item) => (
                <ActivityItem
                  key={item.id}
                  user={item.user}
                  action={item.action}
                  target={item.target}
                  time={item.time}
                  tag={item.tag}
                  tagColor={item.tagColor}
                  image={item.image}
                  icon={item.icon === 'shield' ? <ShieldCheck className="size-5 text-green-500" /> : item.icon === 'activity' ? <Activity className="size-5 text-red-500" /> : null}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Search className="size-10 mb-3 opacity-20" />
                <p className="text-sm font-medium">No activity found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

// New Tooltip Component for "Under Construction"
const Tooltip = ({ text }) => (
  <div className="absolute top-full right-0 mt-2 w-48 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
    <div className="flex items-start gap-2">
      <Hammer className="size-3 mt-0.5 text-amber-400 shrink-0" />
      <span className="leading-tight">{text}</span>
    </div>
    <div className="absolute -top-1 right-4 w-2 h-2 bg-slate-800 rotate-45"></div>
  </div>
);

const StatCard = ({ title, value, trend, sub, icon, color, alert }) => {
  const colorMap = {
    green: {
      border: "hover:border-emerald-500/50",
      shadow: "hover:shadow-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      trend: "text-emerald-500",
    },
    primary: {
      border: "hover:border-primary/40",
      shadow: "hover:shadow-primary/10",
      text: "text-primary",
      bg: "bg-primary/10",
      trend: "text-primary",
    },
    red: {
      border: "hover:border-rose-500/50",
      shadow: "hover:shadow-rose-500/10",
      text: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      trend: "text-rose-500",
    },
    amber: {
      border: "hover:border-amber-500/50",
      shadow: "hover:shadow-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      trend: "text-amber-500",
    },
  };

  const style = colorMap[color] || colorMap.primary;

  return (
    <div
      className={`
        group relative bg-white dark:bg-slate-900 p-6 rounded-xl
        border border-slate-200 dark:border-slate-800
        shadow-sm transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-lg
        ${style.shadow} ${style.border}
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold tracking-widest uppercase">
          {title}
        </span>

        <span
          className={`
            size-9 rounded-lg flex items-center justify-center relative
            transition-all duration-300
            group-hover:scale-110 group-hover:rotate-3
            ${style.bg} ${style.text}
          `}
        >
          {icon}
          {alert && (
            <span className="absolute -top-1 -right-1 size-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
          )}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {value}
        </h3>
        <p className={`text-xs font-bold ${style.trend}`}>
          {trend}
        </p>
      </div>

      {/* Sub */}
      <p className="text-[11px] text-slate-400 mt-1 font-medium">
        {sub}
      </p>
    </div>
  );
};

const ActivityItem = ({ user, action, target, time, tag, tagColor, image, icon }) => {
  const tagColors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
  };

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
      {image ? (
        <div
          className="size-10 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-800 shrink-0 shadow-sm"
          style={{ backgroundImage: `url('https://api.dicebear.com/7.x/avataaars/svg?seed=${image}')` }}
        />
      ) : (
        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-900 dark:text-white font-medium truncate">
          <span className="font-bold">{user}</span> {action} <span className="font-bold text-primary">{target}</span>
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{time}</p>
      </div>
      <div className="text-right shrink-0">
        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${tagColors[tagColor]}`}>
          {tag}
        </span>
      </div>

    </div>
  );
};

export default Dashboard;