import React, { useState, useEffect, useMemo, useRef } from 'react';
import { dashboardData } from '../../services/MockData';
import Footer from '../../components/common/footer';

const AdminDashboard = () => {

  const [events, setEvents] = useState(dashboardData.systemEvents || []);
  const [servers, setServers] = useState(dashboardData.servers || []);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [comparisonPoints, setComparisonPoints] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [isChartRefreshing, setIsChartRefreshing] = useState(false);
  const [maxValue, setMaxValue] = useState(0);
  const chartRef = useRef(null);
  const [chartRange, setChartRange] = useState('7d');
  const [chartPoints, setChartPoints] = useState([]);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);

  const [chartData, setChartData] = useState({
    traffic: [],
    errorRate: [],
    responseTime: [],
    successRate: [],
    comparison: []
  });

  const [metricStats, setMetricStats] = useState({
    total: { value: 0, change: 0, trend: [] },
    peak: { value: 0, change: 0, trend: [] },
    average: { value: 0, change: 0, trend: [] },
    growth: { value: 0, change: 0, trend: [] }
  });

  const [detailedMetrics, setDetailedMetrics] = useState({
    cpu: 45,
    memory: 62,
    networkIn: 120,
    networkOut: 85,
    disk: 30
  });

  const [metrics, setMetrics] = useState({
    health: 98.2,
    sessions: 1482,
    pending: 24,
    alerts: 3
  });
  // Multi-metric state
  const [activeMetrics, setActiveMetrics] = useState({
    traffic: true,
    errorRate: true,
    responseTime: true,
    successRate: true
  });

  // Metric configurations
  const metricConfigs = {
    traffic: {
      label: 'Traffic',
      color: '#3b82f6',
      unit: 'requests',
      yAxis: 'left'
    },
    errorRate: {
      label: 'Error Rate',
      color: '#ef4444',
      unit: '%',
      yAxis: 'right'
    },
    responseTime: {
      label: 'Response Time',
      color: '#8b5cf6',
      unit: 'ms',
      yAxis: 'right'
    },
    successRate: {
      label: 'Success Rate',
      color: '#10b981',
      unit: '%',
      yAxis: 'right'
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);



  const generateRealisticData = (period) => {
    const now = new Date();
    let traffic = [];
    let errorRate = [];
    let responseTime = [];
    let successRate = [];
    let comparison = [];

    const getDataPoints = () => {
      switch (period) {
        case '7d': return 7;
        case '30d': return 30;
        case '90d': return 90;
        case '1y': return 12;
        default: return 7;
      }
    };

    const points = getDataPoints();

    for (let i = points - 1; i >= 0; i--) {
      const date = new Date(now);

      if (period === '7d') {
        date.setDate(date.getDate() - i);
        const day = date.getDay();
        let base = 400;
        if (day === 0 || day === 6) base = 300;
        if (day === 2 || day === 3) base = 500;

        const trafficValue = base + Math.random() * 200;
        traffic.push(Math.round(trafficValue));
        errorRate.push(Number((0.5 + Math.random() * 2).toFixed(2)));
        responseTime.push(Math.round(50 + Math.random() * 100));
        successRate.push(Number((96 + Math.random() * 3).toFixed(2)));
        comparison.push(Math.round(trafficValue * (0.8 + Math.random() * 0.3)));
      } else if (period === '30d') {
        const weekCycle = Math.sin(i / 7 * Math.PI) * 0.3;
        const trend = 1 + (i / 100);
        const trafficValue = (300 + Math.random() * 200) * trend * (1 + weekCycle);

        traffic.push(Math.round(trafficValue));
        errorRate.push(Number((0.8 + Math.random() * 1.5).toFixed(2)));
        responseTime.push(Math.round(60 + Math.random() * 80));
        successRate.push(Number((95 + Math.random() * 4).toFixed(2)));
        comparison.push(Math.round(trafficValue * (0.85 + Math.random() * 0.2)));
      } else if (period === '90d') {
        const weekly = Math.sin(i / 7 * Math.PI) * 0.25;
        const monthly = Math.sin(i / 30 * Math.PI) * 0.15;
        const trend = 1 + (i / 300);
        const trafficValue = (350 + Math.random() * 250) * trend * (1 + weekly + monthly);

        traffic.push(Math.round(trafficValue));
        errorRate.push(Number((0.6 + Math.random() * 1.8).toFixed(2)));
        responseTime.push(Math.round(55 + Math.random() * 90));
        successRate.push(Number((96.5 + Math.random() * 2.5).toFixed(2)));
        comparison.push(Math.round(trafficValue * (0.9 + Math.random() * 0.15)));
      } else {
        const seasonal = Math.sin(i / 12 * Math.PI * 2) * 0.4;
        const trend = 1 + (i / 24);
        const trafficValue = (500 + Math.random() * 300) * trend * (1 + seasonal);

        traffic.push(Math.round(trafficValue));
        errorRate.push(Number((0.7 + Math.random() * 1.6).toFixed(2)));
        responseTime.push(Math.round(65 + Math.random() * 85));
        successRate.push(Number((97 + Math.random() * 2).toFixed(2)));
        comparison.push(Math.round(trafficValue * (0.88 + Math.random() * 0.18)));
      }
    }

    return { traffic, errorRate, responseTime, successRate, comparison };
  };



  useEffect(() => {
    setChartLoading(true);

    const timer = setTimeout(() => {
      const data = generateRealisticData(chartRange);
      setChartData(data);

      // Calculate metric stats
      const total = data.traffic.reduce((a, b) => a + b, 0);
      const prevTotal = data.comparison.reduce((a, b) => a + b, 0);
      const peak = Math.max(...data.traffic);
      const average = Math.round(total / data.traffic.length);
      const growth = ((total - prevTotal) / prevTotal * 100);

      setMetricStats({
        total: {
          value: total,
          change: growth,
          trend: data.traffic.slice(-7)
        },
        peak: {
          value: peak,
          change: ((peak - Math.max(...data.comparison)) / Math.max(...data.comparison) * 100),
          trend: data.traffic.map((v, i) => v === peak ? v : data.traffic[Math.max(0, i - 1)])
        },
        average: {
          value: average,
          change: ((average - Math.round(prevTotal / data.comparison.length)) / Math.round(prevTotal / data.comparison.length) * 100),
          trend: data.traffic.map((_, i, arr) => {
            const start = Math.max(0, i - 2);
            const slice = arr.slice(start, i + 1);
            return Math.round(slice.reduce((a, b) => a + b, 0) / slice.length);
          })
        },
        growth: {
          value: growth,
          change: 0,
          trend: data.traffic.map((v, i) => ((v - (data.comparison[i] || 0)) / (data.comparison[i] || 1) * 100))
        }
      });

      setChartLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [chartRange]);


  const getMaxValue = (metricKey) => {
    const values = chartData[metricKey] || [];
    return Math.max(...values, 1) * 1.15;
  };

  const getLeftAxisMax = () => {
    const activeLeft = Object.keys(activeMetrics).filter(
      key => activeMetrics[key] && metricConfigs[key].yAxis === 'left'
    );
    return Math.max(...activeLeft.map(key => getMaxValue(key)), 100);
  };

  const getRightAxisMax = () => {
    const activeRight = Object.keys(activeMetrics).filter(
      key => activeMetrics[key] && metricConfigs[key].yAxis === 'right'
    );
    if (activeRight.length === 0) return 100;
    return Math.max(...activeRight.map(key => getMaxValue(key)), 100);
  };

  const getSvgPath = (points, width, height, maxVal) => {
    if (!points || points.length === 0) return "";

    const stepX = width / (points.length - 1);
    const scale = height / maxVal;

    let path = `M0,${height - (points[0] * scale)}`;

    points.forEach((p, i) => {
      if (i === 0) return;
      const x = i * stepX;
      const y = height - (p * scale);
      const prevX = (i - 1) * stepX;
      const prevY = height - (points[i - 1] * scale);
      const cp1x = prevX + (x - prevX) / 2;
      const cp1y = prevY;
      const cp2x = prevX + (x - prevX) / 2;
      const cp2y = y;
      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
    });

    return path;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatYAxisLabel = (value) => {
    return formatNumber(Math.round(value));
  };

  const getTooltipLabel = (index) => {
    const now = new Date();
    switch (chartRange) {
      case '7d':
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const date = new Date(now);
        date.setDate(date.getDate() - (chartData.traffic.length - 1 - index));
        return `${days[date.getDay()]}, ${date.getDate()}`;
      case '30d':
        return `Day ${index + 1}`;
      case '90d':
        return `Week ${Math.floor(index / 7) + 1}`;
      case '1y':
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[11 - index];
      default:
        return '';
    }
  };

  const getXAxisLabels = () => {
    switch (chartRange) {
      case '7d':
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date().getDay();
        return days.slice(today + 1).concat(days.slice(0, today + 1));
      case '30d':
        return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      case '90d':
        return ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'];
      case '1y':
        return ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'];
      default:
        return [];
    }
  };

  const handleChartRefresh = () => {
    setIsChartRefreshing(true);
    setTimeout(() => {
      const data = generateRealisticData(chartRange);
      setChartData(data);
      setActiveMetrics({
        traffic: true,
        errorRate: true,
        responseTime: true,
        successRate: true
      });
      setIsChartRefreshing(false);
    }, 800);
  };

  const toggleMetric = (metricKey) => {
    setActiveMetrics(prev => ({
      ...prev,
      [metricKey]: !prev[metricKey]
    }));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      try {
        setMetrics({
          health: (97 + Math.random() * 2).toFixed(1),
          sessions: Math.floor(1400 + Math.random() * 200),
          pending: Math.floor(20 + Math.random() * 10),
          alerts: Math.floor(Math.random() * 5)
        });

        const { traffic, comparison } = generateRealisticData(chartRange);
        setChartPoints(traffic);
        setComparisonPoints(comparison);
        setMaxValue(Math.max(...traffic, ...comparison) * 1.1);

        setActiveMetrics({
          traffic: true,
          errorRate: true,
          responseTime: true,
          successRate: true
        });
      } finally {
        setIsRefreshing(false);
      }
    }, 800);
  };

  useEffect(() => {
    let interval;

    if (isMetricsModalOpen) {
      interval = setInterval(() => {
        setDetailedMetrics(prev => ({
          ...prev, // keep everything safe
          cpu: Math.min(
            100,
            Math.max(0, prev.cpu + (Math.random() * 10 - 5))
          ),
          memory: Math.min(
            100,
            Math.max(0, prev.memory + (Math.random() * 6 - 3))
          ),
          networkIn: Math.floor(
            Math.max(0, prev.networkIn + (Math.random() * 50 - 25))
          ),
          networkOut: Math.floor(
            Math.max(0, prev.networkOut + (Math.random() * 40 - 20))
          )
        }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isMetricsModalOpen]);

  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="relative flex items-center justify-center">
          {/* Outer Ring */}
          <div className="h-20 w-20 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
          {/* Spinning Progress */}
          <div className="absolute h-20 w-20 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          {/* Center Icon */}
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">System Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Monitor your infrastructure health and system activities in real-time.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className={`inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 transition-all ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className={`material-symbols-outlined mr-2 text-[20px] ${isRefreshing ? 'animate-spin' : ''}`}>refresh</span>
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>

          <button
            onClick={() => setIsMetricsModalOpen(true)}
            className="inline-flex items-center cursor-pointer justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-all">
            <span className="material-symbols-outlined mr-2 text-[20px]">monitoring</span>
            View Metrics
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 cursor-default">
        <StatCard
          title="System Health"
          value={`${metrics.health}%`}
          status="Optimal"
          icon="check_circle"
          color="green"
        />
        <StatCard
          title="Active Sessions"
          value={metrics.sessions.toLocaleString()}
          status="+12%"
          icon="group"
          color="blue"
          trendIcon="trending_up"
        />
        <StatCard
          title="Pending Tasks"
          value={metrics.pending}
          status="Action Required"
          icon="assignment_late"
          color="amber"
        />
        <StatCard
          title="Security Alerts"
          value={metrics.alerts}
          status={metrics.alerts > 3 ? "Critical" : "Moderate"}
          icon="gpp_maybe"
          color="red"
        />
      </div>

      {/* 2. Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Multi-Metric Analysis</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Compare multiple performance indicators</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={chartRange}
                  onChange={(e) => setChartRange(e.target.value)}
                  className="text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-2 px-4 text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="1y">Yearly</option>
                </select>
                <button
                  onClick={handleChartRefresh}
                  className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <svg className={`w-4 h-4 ${isChartRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Metric Toggle Legend */}
            <div className="flex flex-wrap gap-3 mt-4">
              {Object.entries(metricConfigs).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => toggleMetric(key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeMetrics[key]
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    : 'bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500'
                    }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full transition-all ${activeMetrics[key] ? 'opacity-100' : 'opacity-30'
                      }`}
                    style={{ backgroundColor: config.color }}
                  />
                  {config.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
              Right-axis metrics auto-scale individually for visibility.
            </p>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-end relative min-h-[400px]">
            {chartLoading && (
              <div className="absolute inset-0 flex flex-col justify-end z-20">
                <div className="animate-pulse space-y-4">
                  <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                </div>
              </div>
            )}

            {/* Dual Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-14 w-12 flex flex-col justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="text-right pr-2">{formatYAxisLabel(getLeftAxisMax())}</span>
              <span className="text-right pr-2">{formatYAxisLabel(getLeftAxisMax() * 0.75)}</span>
              <span className="text-right pr-2">{formatYAxisLabel(getLeftAxisMax() * 0.5)}</span>
              <span className="text-right pr-2">{formatYAxisLabel(getLeftAxisMax() * 0.25)}</span>
              <span className="text-right pr-2">0</span>
            </div>

            <div className="absolute right-0 top-0 bottom-14 w-12 flex flex-col justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="text-left pl-2">{formatYAxisLabel(getRightAxisMax())}</span>
              <span className="text-left pl-2">{formatYAxisLabel(getRightAxisMax() * 0.75)}</span>
              <span className="text-left pl-2">{formatYAxisLabel(getRightAxisMax() * 0.5)}</span>
              <span className="text-left pl-2">{formatYAxisLabel(getRightAxisMax() * 0.25)}</span>
              <span className="text-left pl-2">0</span>
            </div>

            {/* Chart SVG Container */}
            <div className="mx-12 relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border-b border-slate-100 dark:border-slate-800"></div>
                ))}
              </div>

              <svg
                className="w-full h-64 transition-all duration-700"
                viewBox="0 0 650 200"
                ref={chartRef}
              >
                <defs>
                  {Object.entries(metricConfigs).map(([key, config]) => (
                    <linearGradient key={key} id={`gradient-${key}`} x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor={config.color} stopOpacity="0.2"></stop>
                      <stop offset="100%" stopColor={config.color} stopOpacity="0"></stop>
                    </linearGradient>
                  ))}
                </defs>

                {Object.entries(activeMetrics).map(([key, isActive]) => {
                  if (!isActive || !chartData[key]) return null;
                  const config = metricConfigs[key];
                  const maxVal = config.yAxis === 'left' ? getLeftAxisMax() : getMaxValue(key);
                  const path = getSvgPath(chartData[key], 650, 200, maxVal);
                  return (
                    <g key={key}>
                      <path d={`${path} V200 H0 Z`} fill={`url(#gradient-${key})`} className="transition-all duration-500" />
                      <path d={path} fill="none" stroke={config.color} strokeWidth="2.5" className="transition-all duration-500" />
                    </g>
                  );
                })}

                {/* Interaction Layer */}
                {activeMetrics.traffic && chartData.traffic.map((val, i) => {
                  const stepX = 650 / (chartData.traffic.length - 1);
                  const x = i * stepX;
                  const maxVal = getLeftAxisMax();
                  const y = 200 - (val / maxVal * 200);
                  return (
                    <g key={i}>
                      <rect x={x - 20} y={0} width={40} height={200} fill="transparent"
                        onMouseEnter={() => setHoveredPoint(i)}
                        onMouseLeave={() => setHoveredPoint(null)} className="cursor-pointer" />
                      <circle cx={x} cy={y} r={hoveredPoint === i ? "5" : "3"}
                        fill={hoveredPoint === i ? "#1d4ed8" : "#3b82f6"} stroke="white" strokeWidth="1.5" />
                    </g>
                  );
                })}
              </svg>

              {/* Enhanced Tooltip */}
              {hoveredPoint !== null && (
                <div className="absolute bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 min-w-[220px] transform -translate-x-1/2 -translate-y-full z-50 "
                  style={{ left: `${(hoveredPoint / (chartData.traffic.length - 1)) * 100}%`, top: '-10px' }}>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">{getTooltipLabel(hoveredPoint)}</div>
                  {Object.entries(activeMetrics).map(([key, isActive]) => {
                    if (!isActive) return null;
                    const config = metricConfigs[key];
                    const value = chartData[key][hoveredPoint];
                    return (
                      <div key={key} className="flex items-center justify-between mb-2 last:mb-0">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                          <span className="text-sm text-slate-600 dark:text-slate-400">{config.label}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {value?.toFixed(key === 'traffic' ? 0 : 2)} {config.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* X-Axis */}
            <div className="mx-12 flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              {getXAxisLabels().map((label, i) => (
                <span key={i} className="text-center flex-1">{label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Events</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">System activity log</p>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[500px]">
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {events.map((event) => (
                <li key={event.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="flex gap-3">
                    <div className={`h-8 w-8 rounded-full bg-${event.color}-100 dark:bg-${event.color}-900/30 flex items-center justify-center flex-shrink-0`}>
                      <span className={`material-symbols-outlined text-[18px] text-${event.color}-600 dark:text-${event.color}-400`}>
                        {event.type}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{event.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{event.desc}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{event.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 border-t border-slate-100 dark:border-slate-700 text-center">
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              View All Events →
            </button>
          </div>
        </div>
      </div>
      {/* Server Fleet Status */}
      <div className="bg-white cursor-default dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col mt-2">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Server Fleet Status</h2>
          <button className="text-xs cursor-pointer font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 flex items-center gap-1">
            Manage Servers <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Node ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">CPU Load</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Uptime</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Region</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {servers.map((server) => (
                <tr key={server.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{server.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${server.status === 'Healthy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${server.status === 'Healthy' ? 'bg-green-600' : 'bg-amber-600'}`}></span>
                      {server.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 max-w-[100px]">
                        <div className={`h-1.5 rounded-full ${server.cpu > 80 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${server.cpu}%` }}></div>
                      </div>
                      <span className="text-[10px] text-slate-400">{server.cpu}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{server.uptime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{server.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- LIVE METRICS MODAL --- */}
      {isMetricsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a202c] w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  Live Metrics
                </h3>
                <p className="text-sm text-slate-500">Real-time infrastructure telemetry</p>
              </div>
              <button
                onClick={() => setIsMetricsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* CPU Meter */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Total CPU Load</span>
                  <span className="font-mono font-medium">
                    {detailedMetrics.cpu.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-linear"
                    style={{ width: `${detailedMetrics.cpu}%` }}
                  ></div>
                </div>
              </div>

              {/* Memory Meter */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Memory Usage</span>
                  <span className="font-mono font-medium">
                    {detailedMetrics.memory.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-linear"
                    style={{ width: `${detailedMetrics.memory}%` }}
                  ></div>
                </div>
              </div>

              {/* Network Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Network In</p>
                  <p className="text-xl font-mono text-slate-900 dark:text-white mt-1">
                    {detailedMetrics.networkIn} <span className="text-xs text-slate-400">MB/s</span>
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Network Out</p>
                  <p className="text-xl font-mono text-slate-900 dark:text-white mt-1">
                    {detailedMetrics.networkOut} <span className="text-xs text-slate-400">MB/s</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setIsMetricsModalOpen(false)}
                className="px-4 py-2 cursor-pointer bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Close Monitor
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

// Helper component for Stat Cards
const StatCard = ({ title, value, status, icon, color, trendIcon }) => {
  // Mapping logic to ensure Tailwind picks up classes and allows for brand-specific colors
  const colorMap = {
    green: {
      border: "hover:border-emerald-500/50",
      shadow: "hover:shadow-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    },
    blue: {
      border: "hover:border-blue-500/50",
      shadow: "hover:shadow-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      pill: "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    },
    amber: {
      border: "hover:border-amber-500/50",
      shadow: "hover:shadow-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      pill: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    },
    red: {
      border: "hover:border-rose-500/50",
      shadow: "hover:shadow-rose-500/10",
      text: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      pill: "bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    },
  };

  const style = colorMap[color] || colorMap.blue;

  return (
    <div className={`
      group relative bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 
      shadow-sm flex flex-col justify-between transition-all duration-300 ease-out
      hover:-translate-y-1 hover:shadow-lg ${style.shadow} ${style.border}
    `}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${style.bg} ${style.text}`}>
          <span className="material-symbols-outlined !text-2xl">{icon}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${style.pill}`}>
          {trendIcon && <span className="material-symbols-outlined !text-sm">{trendIcon}</span>}
          {status}
        </span>
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">
          Updated now
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
