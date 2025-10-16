import React, { useState } from 'react';
// Uncomment when re-implementing the pageName variable
// import { useMemo } from 'react';
import { LayoutDashboard, CalendarDays, Factory, User, Menu, X, ArrowRight, Bot, Star, ChevronLeft, ChevronRight, DollarSign, Package, MessageCircle, BarChart, Ticket } from 'lucide-react';
// Uncomment these when implementing the features
// import { Lightbulb, TrendingUp } from 'lucide-react';
import VenueManagement from './VenueManagement';
import InquiryQueue from './Inquiry';

// --- MOCK DATA ---

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, slug: 'dashboard' },
  { name: 'Venue Creation', icon: Factory, slug: 'venue' },
  // Commented out for future implementation
  // { name: 'Service Creation', icon: Lightbulb, slug: 'service' },
  { name: 'Inquiries & Bookings', icon: CalendarDays, slug: 'bookings' },
  // Commented out for future implementation
  // { name: 'Offers', icon: TrendingUp, slug: 'offers' },
];

const mockOrders = [
  { invoice: 'INV-2024-001', customer: { name: 'Olivia Martin', email: 'olivia.martin@email.com', avatar: 'https://placehold.co/40x40/F59E0B/FFFFFF?text=OM' }, eventType: 'Wedding Reception', amount: 2500.00, status: 'Completed' },
  { invoice: 'INV-2024-002', customer: { name: 'Jackson Lee', email: 'jackson.lee@email.com', avatar: 'https://placehold.co/40x40/EF4444/FFFFFF?text=JL' }, eventType: 'Corporate Gala', amount: 8500.00, status: 'Completed' },
  { invoice: 'INV-2024-003', customer: { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', avatar: 'https://placehold.co/40x40/3B82F6/FFFFFF?text=IN' }, eventType: 'Birthday Party', amount: 850.00, status: 'Pending' },
  { invoice: 'INV-2024-004', customer: { name: 'William Kim', email: 'will@email.com', avatar: 'https://placehold.co/40x40/10B981/FFFFFF?text=WK' }, eventType: 'Product Launch', amount: 4200.00, status: 'Completed' },
];

const mockAnalytics = {
  totalRevenue: '$45,231.89',
  revenueChange: '+20.1%',
  totalOrders: '12,234',
  ordersChange: '+18.1%',
  customerReviews: '573',
  reviewsChange: '+15%',
  activeCampaigns: '3',
  campaignsChange: '+2 since last month',
};

// Map metric titles to icons for the updated design
const metricIcons = {
    'Total Revenue': DollarSign,
    'Total Orders': Package,
    'Customer Reviews': MessageCircle,
    'Active Campaigns': BarChart,
};

// Custom Eventwala Logo Component (Reworked to use Ticket icon)
const EventwalaLogo = ({ isCollapsed, className = "" }) => (
    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} ${className}`}>
        {/* Adjusted size for Ticket icon */}
        <Ticket 
            className="w-7 h-7" 
            style={{ color: '#FFB347' }} // Specific orange color from the request
        />
        {!isCollapsed && (
            <span className="ml-3 font-extrabold text-xl text-white">
                 Eventwala
            </span>
        )}
    </div>
);


// --- HELPER COMPONENTS ---

const Card = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-xl ${className}`}>
    {children}
  </div>
);

const MetricCard = ({ title, value, change, icon: Icon }) => (
  <Card>
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center text-gray-500">
        <Icon className="w-5 h-5 mr-2" />
        <p className="text-sm font-medium">{title}</p>
      </div>
    </div>
    <p className="text-4xl font-bold text-gray-900">{value}</p>
    <div className="flex items-center mt-2">
        <span className={`text-xs font-semibold p-1 rounded-md ${
            change.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
        }`}>{change}</span>
        <span className="text-xs text-gray-500 ml-2">from last month</span>
    </div>
  </Card>
);

const StatusPill = ({ status }) => {
  const isCompleted = status === 'Completed';
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
      isCompleted
        ? 'bg-green-100 text-green-700'
        : 'bg-yellow-100 text-yellow-700'
    }`}>
      {status}
    </span>
  );
};

// --- MAIN COMPONENTS ---

const Header = ({ vendorName, onMenuToggle, isCollapsed, onCollapseToggle }) => (
  <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
    <div className="flex items-center">
        {/* Collapse button visible on desktop */}
        <button
            onClick={onCollapseToggle}
            className="text-gray-600 hover:text-orange-600 hidden md:block p-2 rounded-lg transition duration-200 mr-4"
            aria-label="Toggle Sidebar Collapse"
        >
            {isCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>

        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="text-gray-600 hover:text-orange-600 md:hidden p-2 rounded-lg transition duration-200"
          aria-label="Toggle Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 hidden md:block ml-2">Eventwala Dashboard</h1>
    </div>

    <div className="flex items-center space-x-3">
      <div className="text-right">
        <p className="text-sm font-medium text-gray-800">{vendorName}</p>
        <p className="text-xs text-gray-500">vendor@email.com</p>
      </div>
      <div className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
        {vendorName[0]}
      </div>
    </div>
  </header>
);

const Sidebar = ({ activePage, setActivePage, isMenuOpen, onMenuClose, isCollapsed }) => (
  <>
    {/* Overlay for mobile */}
    {isMenuOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
        onClick={onMenuClose}
      />
    )}
    <nav className={`
      // Mobile positioning: fixed and transforms
      fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out transform
      ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}

      // Desktop positioning: static/flex item with dynamic width
      md:static md:translate-x-0 md:block
      ${isCollapsed ? 'w-20' : 'w-64'} 

      bg-gray-900 text-white p-6 flex flex-col shadow-2xl md:shadow-none
    `}>
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-10 h-8`}>
        <EventwalaLogo isCollapsed={isCollapsed} />
        <button onClick={onMenuClose} className="text-gray-300 hover:text-white md:hidden p-1">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-2 flex-grow">
        {navItems.map((item) => (
          <button
            key={item.slug}
            onClick={() => {
              setActivePage(item.slug);
              if (isMenuOpen) onMenuClose(); // Close menu on mobile after selection
            }}
            className={`flex items-center w-full px-3 py-3 rounded-xl transition duration-200 text-left ${
              activePage === item.slug
                ? 'bg-orange-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-800 hover:text-orange-300'
            }`}
          >
            <item.icon className={`w-5 h-5 ${!isCollapsed ? 'mr-3' : 'mx-auto'}`} />
            <span className={`font-medium whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
            {/* Tooltip for collapsed state would go here */}
          </button>
        ))}
      </div>

      {/* Profile Settings Section */}
      <div className={`mt-8 pt-4 border-t border-gray-700 ${isCollapsed ? 'text-center' : ''}`}>
        <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-start'} items-center space-x-2 p-2 text-sm text-gray-400`}>
            <User className="w-5 h-5"/>
            {!isCollapsed && <span className="whitespace-nowrap">Profile Settings</span>}
        </div>
      </div>
    </nav>
  </>
);

const PerformanceChart = () => {
    // State to track the currently hovered data point index
    const [hoveredPoint, setHoveredPoint] = useState(null);

    // Mock data points for a smooth curve (Jan to Jul)
    const data = [
        { month: 'Jan', value: 1000 },
        { month: 'Feb', value: 2500 },
        { month: 'Mar', value: 3000 },
        { month: 'Apr', value: 1500 },
        { month: 'May', value: 800 },
        { month: 'Jun', value: 2000 },
        { month: 'Jul', value: 3500 },
    ];

    const chartWidth = 700; // Fixed width for calculation purposes, scaled by SVG viewbox
    const chartHeight = 200;
    const padding = 20;

    const xMax = data.length - 1;
    const yMax = 4000; // Based on the mock y-axis values ($0k to $4k)

    // Scaling functions
    const getX = (index) => (index / xMax) * (chartWidth - 2 * padding) + padding;
    const getY = (value) => chartHeight - padding - (value / yMax) * (chartHeight - 2 * padding);

    // Function to calculate the SVG path for the curve (using simple cubic interpolation)
    const getCurvePath = () => {
        let path = '';
        data.forEach((point, i) => {
            const x = getX(i);
            const y = getY(point.value);

            if (i === 0) {
                path += `M ${x} ${y}`;
            } else {
                // Simple quadratic Bezier curve to smooth transitions (for visualization purposes)
                const xPrev = getX(i - 1);
                const yPrev = getY(data[i - 1].value);

                // Control point x halfway between points, control point y same as previous point's y
                const c1x = (xPrev + x) / 2;
                const c1y = yPrev;

                path += ` S ${c1x},${c1y} ${x},${y}`;
            }
        });
        return path;
    };

    // Path for the shaded area (Area under the curve)
    const getAreaPath = () => {
        const curvePath = getCurvePath();
        const startX = getX(0);
        const endX = getX(data.length - 1);
        const bottomY = chartHeight - padding;
        
        return `${curvePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
    };

    return (
        <Card className="h-96">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Growth Analysis</h3>
            <p className="text-sm text-gray-500 mb-4">Your sales trends over the last 7 months.</p>
            
            <div className="h-64 flex flex-col justify-between">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full relative">
                    {/* Y-Axis Grid Lines */}
                    {[0, 1000, 2000, 3000, 4000].map(yValue => {
                        const y = getY(yValue);
                        return (
                            <g key={yValue}>
                                {/* Grid Line */}
                                <line 
                                    x1={padding} 
                                    y1={y} 
                                    x2={chartWidth - padding} 
                                    y2={y} 
                                    stroke={yValue === 0 ? "#D1D5DB" : "#F3F4F6"} 
                                    strokeDasharray={yValue === 0 ? "" : "4 4"}
                                />
                                {/* Y-Axis Label */}
                                <text 
                                    x={padding - 5} 
                                    y={y + 4} 
                                    className="text-xs fill-gray-500" 
                                    textAnchor="end"
                                >
                                    {yValue === 0 ? '$0' : `$${yValue / 1000}k`}
                                </text>
                            </g>
                        );
                    })}

                    {/* Shaded Area under the Curve */}
                    <path 
                        d={getAreaPath()} 
                        fill="#FFB347" 
                        fillOpacity="0.1"
                    />

                    {/* Curve Line */}
                    <path 
                        d={getCurvePath()} 
                        fill="none" 
                        stroke="#FFB347" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Data Points and Hover Interaction */}
                    {data.map((point, i) => {
                        const x = getX(i);
                        const y = getY(point.value);
                        
                        return (
                            <g 
                                key={i} 
                                onMouseEnter={() => setHoveredPoint(i)}
                                onMouseLeave={() => setHoveredPoint(null)}
                            >
                                {/* Invisible touch area for easier hovering */}
                                <circle 
                                    cx={x} 
                                    cy={y} 
                                    r="10" 
                                    fill="transparent"
                                />
                                
                                {/* Visible Data Point */}
                                <circle 
                                    cx={x} 
                                    cy={y} 
                                    r="4" 
                                    fill="#FFB347" 
                                    stroke="#FFFFFF" 
                                    strokeWidth="2"
                                    className="transition-all duration-150"
                                />

                                {/* Tooltip (only render if hovered) */}
                                {hoveredPoint === i && (
                                    <g>
                                        {/* Tooltip Background (Rectangle) */}
                                        <rect
                                            x={x + 10} // Offset from the point
                                            y={y - 40}
                                            width="100"
                                            height="30"
                                            rx="4"
                                            fill="#374151" // Dark background
                                        />
                                        
                                        {/* Tooltip Text */}
                                        <text
                                            x={x + 15} // Text padding
                                            y={y - 20}
                                            className="text-xs fill-white font-medium"
                                        >
                                            {point.month}: ${point.value.toLocaleString()}
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* X-Axis Labels (Months) */}
                <div className="flex justify-between px-4 mt-2">
                    {data.map((point, i) => (
                        <span key={i} className="text-xs text-gray-500 w-1/7 text-center">{point.month}</span>
                    ))}
                </div>
            </div>
        </Card>
    );
};

const PopularCategories = () => {
    const categories = [
        { name: 'Weddings', value: 55, color: 'bg-orange-400' },
        { name: 'Corporate', value: 72, color: 'bg-orange-500' },
        { name: 'Parties', value: 60, color: 'bg-orange-300' },
        { name: 'Concerts', value: 20, color: 'bg-orange-600' },
        { name: 'Expos', value: 45, color: 'bg-orange-200' },
    ];
    const maxValue = 80;

    return (
        <Card className="col-span-full md:col-span-1 h-full flex flex-col">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Popular Categories</h3>
            <p className="text-sm text-gray-500 mb-6">Event distribution by category.</p>
            <div className="flex-grow space-y-4">
                {categories.map((cat) => (
                    <div key={cat.name} className="flex items-center">
                        <span className="w-20 text-sm font-medium text-gray-700">{cat.name}</span>
                        <div className="flex-1 ml-4">
                            <div className="relative h-2.5 rounded-full bg-gray-200">
                                <div
                                    className={`absolute left-0 top-0 h-2.5 rounded-full transition-all duration-700 ${cat.color}`}
                                    style={{ width: `${(cat.value / maxValue) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <span className="w-8 text-right text-xs text-gray-600 ml-4 font-semibold">{cat.value}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};


const RecentOrdersTable = () => (
    <Card className="col-span-full xl:col-span-3">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Recent Orders</h3>
        <p className="text-sm text-gray-500 mb-6">An overview of your most recent bookings and inquiries.</p>

        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {/* Headers: INVOICE, CUSTOMER, EVENT TYPE, AMOUNT, STATUS */}
                        {['INVOICE', 'CUSTOMER', 'EVENT TYPE', 'AMOUNT', 'STATUS'].map((header) => (
                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {mockOrders.map((order, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">{order.invoice}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <img className="h-10 w-10 rounded-full object-cover mr-3" src={order.customer.avatar} alt={order.customer.name} />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                                        <div className="text-xs text-gray-500">{order.customer.email}</div>
                                    </div>
                                </div>
                            </td>
                            {/* The original code was missing a closing </td> tag after the customer block, 
                                and had an extra </td> after the customer block that was likely meant for the entire cell.
                                I've restructured the <td> elements inside the map function to ensure proper closing. 
                                The original file had the rest of the <td>'s inside the same customer block which was incorrect. 
                                I am moving them outside of the customer block, but remaining within the <tr> element.
                            */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.eventType}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">${order.amount.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <StatusPill status={order.status} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

const ReviewSummary = () => (
    <Card className="col-span-full xl:col-span-1">
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Customer Reviews</h3>
            <div className="flex items-center mt-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-2xl font-bold text-gray-900">4.8</span>
                <span className="text-sm text-gray-500 ml-2">(145 reviews)</span>
            </div>
        </div>

        {/* AI Summary Card */}
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg mb-6 shadow-md">
            <div className="flex items-center mb-2">
                <Bot className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-bold text-green-600">AI Summary:</span>
            </div>
            <p className="text-sm text-gray-700">
                Overall positive sentiment with high praise for service quality, quick response times, and attention to detail during wedding services.
            </p>
        </div>

        <button className="flex items-center text-orange-600 font-medium text-sm hover:text-orange-700 transition duration-150">
            View all reviews
            <ArrowRight className="w-4 h-4 ml-1" />
        </button>
    </Card>
);

const DashboardContent = () => (
  <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
    {/* Metric Cards - 4 columns on large screens */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard 
            title="Total Revenue" 
            value={mockAnalytics.totalRevenue} 
            change={mockAnalytics.revenueChange} 
            icon={metricIcons['Total Revenue']}
        />
        <MetricCard 
            title="Total Orders" 
            value={mockAnalytics.totalOrders} 
            change={mockAnalytics.ordersChange} 
            icon={metricIcons['Total Orders']}
        />
        <MetricCard 
            title="Customer Reviews" 
            value={mockAnalytics.customerReviews} 
            change={mockAnalytics.reviewsChange} 
            icon={metricIcons['Customer Reviews']}
        />
        <MetricCard 
            title="Active Campaigns" 
            value={mockAnalytics.activeCampaigns} 
            change={mockAnalytics.campaignsChange} 
            icon={metricIcons['Active Campaigns']}
        />
    </div>

    {/* Main Content Grid (Growth Analysis, Categories, Reviews, Orders) */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Top Row: Chart (2/3 width) and Categories (1/3 width) */}
        <div className="xl:col-span-2">
            <PerformanceChart />
        </div>
        <PopularCategories />

        {/* Bottom Row: Recent Orders (2/3 width) and Reviews (1/3 width) - rearranged for better flow */}
        <div className="xl:col-span-2">
            <RecentOrdersTable />
        </div>
        <ReviewSummary />
    </div>
  </div>
);

// Commented out for future implementation when Service Creation and Offers are added back
/*
const PlaceholderPage = ({ pageName }) => (
    <div className="p-10 text-center bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">{pageName}</h2>
        <p className="text-lg text-gray-600">This is the area for the {pageName} functionality, ready for implementation.</p>
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border-t-4 border-orange-500">
            <p className="text-gray-500 italic">
                {pageName === 'Venue Creation' && 'Here you will manage property details, gallery, capacity, and pricing tiers.'}
                {pageName === 'Service Creation' && 'Define and manage your add-on services like catering, decor, or specialized staffing packages.'}
                {pageName === 'Inquiries & Bookings' && 'A centralized scheduler and CRM for managing all customer interactions and confirmed reservations.'}
                {pageName === 'Offers' && 'Create, track, and activate promotional discounts or seasonal packages to boost bookings.'}
            </p>
        </div>
    </div>
);
*/


const PageRenderer = ({ activePage }) => {
  // Commented out since we're not using the PlaceholderPage component anymore
  // const pageName = useMemo(() => {
  //   return navItems.find(item => item.slug === activePage)?.name || 'Dashboard';
  // }, [activePage]);

  switch (activePage) {
    case 'dashboard':
      return <DashboardContent />;
    case 'venue':
      return <VenueManagement />;
    // Commented out for future implementation
    // case 'service':
    //  return <PlaceholderPage pageName={pageName} />;
    case 'bookings':
      return <InquiryQueue />;
    // Commented out for future implementation
    // case 'offers':
    //  return <PlaceholderPage pageName={pageName} />;
    default:
      return <DashboardContent />;
  }
};

const VendorDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile Menu State
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop Collapse State

  const handleCollapseToggle = () => setIsCollapsed(prev => !prev);
  const handleMenuToggle = () => setIsMenuOpen(prev => !prev);
  const handleMenuClose = () => setIsMenuOpen(false);


  return (
    <div className="flex h-screen bg-gray-100 antialiased">
      {/* Sidebar - Handles both desktop collapse and mobile overlay */}
      <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          isMenuOpen={isMenuOpen}
          onMenuClose={handleMenuClose}
          isCollapsed={isCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            vendorName="Venue Vendor Inc." 
            onMenuToggle={handleMenuToggle} 
            isCollapsed={isCollapsed}
            onCollapseToggle={handleCollapseToggle}
        />
        <main className="flex-1 overflow-y-auto">
          <PageRenderer activePage={activePage} />
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;
