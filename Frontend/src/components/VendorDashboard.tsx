import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";

// The main VendorDashboard component that contains all the UI and logic
const VendorDashboard = () => {
  // State to manage UI elements
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentDealSlide, setCurrentDealSlide] = useState(0);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});

  // Hardcoded data for the dashboard
  const chartData = {
    growth: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      data: [1700, 3200, 2500, 890, 2100, 2400, 3400],
    },
    category: {
      labels: ["Weddings", "Corporate", "Parties", "Concerts", "Expos"],
      data: [45, 78, 52, 22, 65],
    },
  };

  const recentOrders = [
    {
      invoice: "INV-2024-001",
      date: "Nov 15, 2024",
      customer: "Olivia Martin",
      customerEmail: "olivia.martin@email.com",
      customerAvatar: "https://i.pravatar.cc/40?u=olivia",
      eventType: "Wedding Reception",
      amount: "$2,500.00",
      status: "Completed",
      services: [
        "Event planning and coordination",
        "Venue setup and decoration",
        "Audio/visual equipment",
        "On-site event management",
      ],
    },
    {
      invoice: "INV-2024-002",
      date: "Nov 14, 2024",
      customer: "Jackson Lee",
      customerEmail: "jackson.lee@email.com",
      customerAvatar: "https://i.pravatar.cc/40?u=jackson",
      eventType: "Corporate Gala",
      amount: "$8,500.00",
      status: "Completed",
      services: [
        "Venue rental",
        "Catering services",
        "Corporate branding",
        "Keynote speaker coordination",
      ],
    },
    {
      invoice: "INV-2024-003",
      date: "Nov 13, 2024",
      customer: "Isabella Nguyen",
      customerEmail: "isabella.nguyen@email.com",
      customerAvatar: "https://i.pravatar.cc/40?u=isabella",
      eventType: "Birthday Party",
      amount: "$850.00",
      status: "Pending",
      services: ["Party decorations", "Photography", "Music arrangement"],
    },
    {
      invoice: "INV-2024-004",
      date: "Nov 12, 2024",
      customer: "William Kim",
      customerEmail: "will@email.com",
      customerAvatar: "https://i.pravatar.cc/40?u=william",
      eventType: "Product Launch",
      amount: "$4,200.00",
      status: "Completed",
      services: [
        "Launch event planning",
        "Venue setup",
        "Product demo stations",
        "Guest management",
      ],
    },
  ];

  const featuredDeals = [
    {
      icon: "briefcase",
      title: "Corporate Event Bonanza",
      description:
        "Book your next corporate event with us and get a free catering upgrade.",
      price: "Save up to 30%",
      color: "from-orange-300 to-orange-400",
    },
    {
      icon: "heart",
      title: "Wedding Dreams Package",
      description:
        "Complete wedding planning with photography, decoration, and catering included.",
      price: "Starting at $1,999",
      color: "from-pink-300 to-pink-400",
    },
    {
      icon: "cake",
      title: "Birthday Bash Special",
      description:
        "Make birthdays memorable with our all-inclusive party packages for all ages.",
      price: "From $299",
      color: "from-purple-300 to-purple-400",
    },
  ];

  // Functions to handle UI interactions
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const nextSlide = () => {
    setCurrentDealSlide((prev) => (prev + 1) % featuredDeals.length);
  };

  const prevSlide = () => {
    setCurrentDealSlide(
      (prev) => (prev - 1 + featuredDeals.length) % featuredDeals.length
    );
  };

  const openInvoiceModal = (data) => {
    setInvoiceData(data);
    setIsInvoiceModalOpen(true);
  };

  const closeInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setInvoiceData({});
  };

  // useEffect hooks to handle side effects like chart rendering and carousel auto-play
  useEffect(() => {
    // Chart.js for Growth Analysis
    const growthCtx = document.getElementById("growthChart").getContext("2d");
    const growthChart = new Chart(growthCtx, {
      type: "line",
      data: {
        labels: chartData.growth.labels,
        datasets: [
          {
            label: "Revenue",
            data: chartData.growth.data,
            borderColor: "#FFB347",
            backgroundColor: "rgba(255, 179, 71, 0.1)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#FFB347",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#FFB347",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#000",
            titleFont: { family: "Poppins" },
            bodyFont: { family: "PT Sans" },
            callbacks: {
              label: function (context) {
                return `Revenue: $${context.formattedValue}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "$" + value / 1000 + "k";
              },
            },
          },
        },
      },
    });

    // Chart.js for Popular Categories
    const categoryCtx = document
      .getElementById("categoryChart")
      .getContext("2d");
    const categoryChart = new Chart(categoryCtx, {
      type: "bar",
      data: {
        labels: chartData.category.labels,
        datasets: [
          {
            label: "Event Count",
            data: chartData.category.data,
            backgroundColor: [
              "rgba(255, 179, 71, 0.7)",
              "rgba(235, 192, 89, 0.7)",
              "rgba(255, 179, 71, 0.7)",
              "rgba(235, 192, 89, 0.7)",
              "rgba(255, 179, 71, 0.7)",
            ],
            borderColor: [
              "#FFB347",
              "#EBC059",
              "#FFB347",
              "#EBC059",
              "#FFB347",
            ],
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#000",
            titleFont: { family: "Poppins" },
            bodyFont: { family: "PT Sans" },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { display: false },
          },
          y: {
            grid: { display: false },
          },
        },
      },
    });

    // Cleanup function for charts
    return () => {
      growthChart.destroy();
      categoryChart.destroy();
    };
  }, []);

  // Effect for the carousel auto-play
  useEffect(() => {
    const carouselInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(carouselInterval);
  }, [currentDealSlide]);

  // Effect to handle modal overflow and keyboard events
  useEffect(() => {
    if (isInvoiceModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && isInvoiceModalOpen) {
        closeInvoiceModal();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isInvoiceModalOpen]);

  // Icon components as SVG for a robust solution without external imports
  interface IconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
  }

  const TicketIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );

  const HomeIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );

  const ShoppingCartIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );

  const PackageIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.16" />
      <path d="M2.5 12.27l9 5.16" />
      <path d="m7.5 4.27-5 2.87v9.92l5 2.87 5-2.87v-9.92z" />
      <path d="m16.5 4.27-5 2.87v9.92l5 2.87 5-2.87v-9.92z" />
      <path d="M12.5 17.43 7.5 14.56" />
      <path d="M17.5 14.56 12.5 17.43" />
      <path d="M12.5 17.43v5.16" />
      <path d="M12.5 12.27l-5-2.87" />
    </svg>
  );

  const UsersIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  const StarIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );

  const LineChartIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m18 10-6 6-6-6" />
    </svg>
  );

  const SettingsIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.39a2 2 0 0 0 .73 2.73l.15.08a2 2 0 0 1 1 1.74v.18a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const MenuIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );

  const SearchIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );

  const CircleUserIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  );

  const DollarSignIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );

  const CreditCardIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );

  const ActivityIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );

  const ChevronLeftIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );

  const ChevronRightIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );

  const BriefcaseIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2z" />
      <path d="M12 2v20" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2" />
      <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2" />
    </svg>
  );

  const HeartIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );

  const CakeIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2" />
      <path d="M5.5 17l.31-1.39A2 2 0 0 1 7.2 14h9.6a2 2 0 0 1 1.39 1.61L18.5 17" />
      <path d="M8 14v-2" />
      <path d="M16 14v-2" />
      <path d="M16 12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2" />
      <path d="M12 4V2a2 2 0 0 0-2-2" />
      <path d="M12 4a2 2 0 0 1 2-2" />
    </svg>
  );

  const XIcon = (props: IconProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );

  // Individual components
  const Sidebar = () => (
    <aside
      id="sidebar"
      className={`w-64 flex-shrink-0 bg-white border-r border-gray-200 flex-col fixed lg:relative lg:flex h-full lg:h-auto z-20 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <TicketIcon className="h-7 w-7 text-[#FFB347]" />
        <span className="ml-3 font-poppins text-xl font-semibold text-gray-800">
          EventWala
        </span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-[#F8F3EC] text-[#FFB347]"
        >
          <HomeIcon className="mr-3 h-5 w-5" />
          Dashboard
        </a>
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
        >
          <ShoppingCartIcon className="mr-3 h-5 w-5" />
          Orders
          <span className="ml-auto inline-block py-0.5 px-2.5 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full">
            6
          </span>
        </a>
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
        >
          <PackageIcon className="mr-3 h-5 w-5" />
          Deals
        </a>
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
        >
          <UsersIcon className="mr-3 h-5 w-5" />
          Customers
        </a>
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
        >
          <StarIcon className="mr-3 h-5 w-5" />
          Reviews
        </a>
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
        >
          <LineChartIcon className="mr-3 h-5 w-5" />
          Analytics
        </a>
      </nav>
      <div className="mt-auto p-4 border-t border-gray-200">
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100"
        >
          <SettingsIcon className="mr-3 h-5 w-5" />
          Settings
        </a>
      </div>
    </aside>
  );

  const Header = () => (
    <header className="sticky top-0 z-10 flex items-center h-16 px-6 bg-[#F8F3EC]/80 backdrop-blur-sm border-b border-gray-200">
      <button
        id="menu-button"
        className="lg:hidden mr-4 p-2 rounded-md hover:bg-gray-200"
        onClick={toggleSidebar}
      >
        <MenuIcon className="h-6 w-6 text-gray-600" />
      </button>
      <div className="relative w-full max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-md focus:ring-[#EBC059] focus:border-[#EBC059]"
        />
      </div>
      <div className="ml-auto">
        <button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-gray-200">
          <CircleUserIcon className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </header>
  );

  const DashboardCard = ({ title, value, change, icon, iconColor }) => {
    const IconComponent = {
      "dollar-sign": DollarSignIcon,
      "credit-card": CreditCardIcon,
      star: StarIcon,
      activity: ActivityIcon,
    }[icon];

    return (
      <div className="card p-5 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="font-poppins text-sm font-medium text-gray-500">
            {title}
          </h3>
          {IconComponent && (
            <IconComponent className={`h-5 w-5 ${iconColor}`} />
          )}
        </div>
        <p className="text-3xl font-bold font-poppins mt-2 text-gray-800">
          {value}
        </p>
        <p className="text-xs text-green-600 mt-1">{change}</p>
      </div>
    );
  };

  const RecentOrdersTable = () => (
    <div className="xl:col-span-3 card p-5">
      <h3 className="font-poppins text-lg font-semibold text-gray-800">
        Recent Orders
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        An overview of your most recent orders.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase border-b">
            <tr>
              <th scope="col" className="py-3 px-2">
                Invoice
              </th>
              <th scope="col" className="py-3 px-2">
                Customer
              </th>
              <th scope="col" className="py-3 px-2">
                Event Type
              </th>
              <th scope="col" className="py-3 px-2 text-right">
                Amount
              </th>
              <th scope="col" className="py-3 px-2 text-center">
                Invoice Receipt
              </th>
              <th scope="col" className="py-3 px-2 text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-2">
                  <div className="font-mono text-sm font-medium text-[#FFB347]">
                    {order.invoice}
                  </div>
                  <div className="text-xs text-gray-500">{order.date}</div>
                </td>
                <td className="py-4 px-2 font-medium flex items-center">
                  <img
                    className="h-9 w-9 rounded-full mr-3"
                    src={order.customerAvatar}
                    alt={`${order.customer} avatar`}
                  />
                  <div>
                    <div>{order.customer}</div>
                    <div className="text-xs text-gray-500">
                      {order.customerEmail}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2">{order.eventType}</td>
                <td className="py-4 px-2 text-right font-medium">
                  {order.amount}
                </td>
                <td className="py-4 px-2 text-center">
                  <button
                    className="text-[#FFB347] hover:text-[#f2a537] underline text-sm font-medium"
                    onClick={() => openInvoiceModal(order)}
                  >
                    View Receipt
                  </button>
                </td>
                <td className="py-4 px-2 text-center">
                  <span
                    className={`status-badge ${
                      order.status === "Completed"
                        ? "status-completed"
                        : "status-pending"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const FeaturedDealsCarousel = () => (
    <div className="xl:col-span-2 card p-5">
      <h3 className="font-poppins text-lg font-semibold text-gray-800">
        Featured Deals
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Check out our latest offers and promotions.
      </p>
      <div className="relative overflow-hidden rounded-lg">
        <div
          id="deals-carousel"
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentDealSlide * 100}%)` }}
        >
          {featuredDeals.map((deal, index) => {
            const IconComponent = {
              briefcase: BriefcaseIcon,
              heart: HeartIcon,
              cake: CakeIcon,
            }[deal.icon];
            return (
              <div
                key={index}
                className="w-full flex-shrink-0 flex items-center bg-gray-50 rounded-lg p-4"
              >
                <div
                  className={`w-2/5 h-36 bg-gradient-to-br ${deal.color} rounded-lg flex items-center justify-center`}
                >
                  {IconComponent && (
                    <IconComponent className="h-12 w-12 text-white" />
                  )}
                </div>
                <div className="w-3/5 pl-5">
                  <h4 className="font-poppins font-semibold text-gray-800">
                    {deal.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {deal.description}
                  </p>
                  <div className="text-lg font-bold text-[#FFB347] mt-2">
                    {deal.price}
                  </div>
                  <button className="mt-3 py-2 px-4 bg-[#FFB347] text-white font-semibold rounded-lg text-sm hover:bg-[#f2a537] transition-colors">
                    View Deal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {/* Navigation buttons */}
        <button
          id="prev-deal"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all duration-200 opacity-75 hover:opacity-100"
          onClick={prevSlide}
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        <button
          id="next-deal"
          className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all duration-200 opacity-75 hover:opacity-100"
          onClick={nextSlide}
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-600" />
        </button>
        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {featuredDeals.map((_, index) => (
            <button
              key={index}
              className={`deal-indicator w-2 h-2 rounded-full transition-all ${
                currentDealSlide === index
                  ? "bg-[#FFB347]"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setCurrentDealSlide(index)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );

  // The main render function
  return (
    <div className="min-h-screen font-pt-sans">
      <style>
        {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=PT+Sans:wght@400;700&display=swap');
                
                body {
                    font-family: 'PT Sans', sans-serif;
                }
                .font-poppins {
                    font-family: 'Poppins', sans-serif;
                }
                .card {
                    background-color: white;
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
                .chart-container {
                    position: relative;
                    height: 288px;
                }
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 60px;
                    font-weight: 500;
                    padding: 0.25rem 0.5rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                }
                .status-completed {
                    color: #15803d;
                    background-color: #dcfce7;
                    border: 1px solid #bbf7d0;
                }
                .status-pending {
                    color: #d97706;
                    background-color: #fef3c7;
                    border: 1px solid #fde68a;
                }
                `}
      </style>

      <div className="flex">
        <Sidebar />
        <div
          className={`fixed inset-0 bg-black/60 z-10 lg:hidden ${
            isSidebarOpen ? "" : "hidden"
          }`}
          onClick={toggleSidebar}
        ></div>

        <main className="flex-1 min-w-0">
          <Header />

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <DashboardCard
                title="Total Revenue"
                value="$45,231.89"
                change="+20.1% from last month"
                icon="dollar-sign"
                iconColor="text-gray-400"
              />
              <DashboardCard
                title="Total Orders"
                value="12,234"
                change="+180.1% from last month"
                icon="credit-card"
                iconColor="text-gray-400"
              />
              <DashboardCard
                title="Customer Reviews"
                value="573"
                change="+19% from last month"
                icon="star"
                iconColor="text-gray-400"
              />
              <DashboardCard
                title="Active Campaigns"
                value="3"
                change="+2 since last hour"
                icon="activity"
                iconColor="text-gray-400"
              />

              <div className="xl:col-span-3 card p-5">
                <h3 className="font-poppins text-lg font-semibold text-gray-800">
                  Growth Analysis
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Your sales trends over the last 7 months.
                </p>
                <div className="chart-container">
                  <canvas id="growthChart"></canvas>
                </div>
              </div>

              <div className="xl:col-span-1 card p-5">
                <h3 className="font-poppins text-lg font-semibold text-gray-800">
                  Popular Categories
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Event distribution by category.
                </p>
                <div className="chart-container">
                  <canvas id="categoryChart"></canvas>
                </div>
              </div>

              <RecentOrdersTable />

              <div className="xl:col-span-1 card p-5">
                <h3 className="font-poppins text-lg font-semibold text-gray-800">
                  Customer Reviews
                </h3>
                <div className="text-sm mt-2 p-3 rounded-lg bg-green-50 border border-green-200">
                  <span className="text-green-700 font-semibold">
                    AI Summary:
                  </span>{" "}
                  <span className="text-gray-600">
                    Overall positive sentiment with high praise for wedding
                    services.
                  </span>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <img
                      className="h-10 w-10 rounded-full mr-3"
                      src="https://i.pravatar.cc/40?u=evelyn"
                      alt="Evelyn Reed avatar"
                    />
                    <div>
                      <p className="font-semibold text-sm">Evelyn Reed</p>
                      <div className="flex items-center text-yellow-500">
                        ★★★★★
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        The team at EventWala made our wedding day absolutely
                        perfect. Flawless execution and beautiful decor!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <img
                      className="h-10 w-10 rounded-full mr-3"
                      src="https://i.pravatar.cc/40?u=marcus"
                      alt="Marcus Thorne avatar"
                    />
                    <div>
                      <p className="font-semibold text-sm">Marcus Thorne</p>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★★★★</span>
                        <span className="text-gray-300">★</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Great corporate event. The planning was smooth, though
                        the audio setup had a minor hiccup initially.
                      </p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 bg-[#EBC059] text-white font-semibold rounded-lg hover:bg-[#d9b14f] transition-colors">
                  View All Reviews
                </button>
              </div>

              <FeaturedDealsCarousel />

              <div className="xl:col-span-2 card p-5">
                <h3 className="font-poppins text-lg font-semibold text-gray-800">
                  Team Members
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Manage your team and their status.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://i.pravatar.cc/40?u=aarav"
                      alt="Aarav Sharma avatar"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Aarav Sharma
                      </p>
                      <p className="text-xs text-gray-500">Lead Planner</p>
                    </div>
                    <div className="ml-auto flex items-center">
                      <span className="h-2.5 w-2.5 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-xs text-green-600 font-medium">
                        Online
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://i.pravatar.cc/40?u=priya"
                      alt="Priya Patel avatar"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Priya Patel
                      </p>
                      <p className="text-xs text-gray-500">Marketing Head</p>
                    </div>
                    <div className="ml-auto flex items-center">
                      <span className="h-2.5 w-2.5 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-xs text-green-600 font-medium">
                        Online
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://i.pravatar.cc/40?u=rohan"
                      alt="Rohan Mehta avatar"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Rohan Mehta
                      </p>
                      <p className="text-xs text-gray-500">Logistics Manager</p>
                    </div>
                    <div className="ml-auto flex items-center">
                      <span className="h-2.5 w-2.5 bg-gray-400 rounded-full mr-2"></span>
                      <span className="text-xs text-gray-500 font-medium">
                        Offline
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Invoice Receipt Modal */}
      <div
        className={`fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 ${
          isInvoiceModalOpen ? "" : "hidden"
        }`}
        onClick={closeInvoiceModal}
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-poppins font-semibold text-gray-800">
                Invoice Receipt
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={closeInvoiceModal}
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center border-b border-gray-200 pb-4">
                <div className="flex items-center justify-center mb-2">
                  <TicketIcon className="h-8 w-8 text-[#FFB347]" />
                  <span className="text-2xl font-poppins font-bold text-gray-800">
                    EventWala
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Professional Event Management Services
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Invoice Number
                  </label>
                  <p className="font-mono text-[#FFB347] font-medium">
                    #{invoiceData.invoice}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Date
                  </label>
                  <p className="text-gray-800">{invoiceData.date}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Customer
                </label>
                <p className="text-gray-800 font-medium">
                  {invoiceData.customer}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">
                  Event Type
                </label>
                <p className="text-gray-800">{invoiceData.eventType}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-800">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-[#FFB347]">
                    {invoiceData.amount}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <h4 className="font-medium text-gray-800 mb-2">
                  Services Included:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {invoiceData.services &&
                    invoiceData.services.map((service, index) => (
                      <li key={index}>• {service}</li>
                    ))}
                </ul>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="flex-1 py-3 bg-[#FFB347] text-white font-semibold rounded-lg hover:bg-[#f2a537] transition-colors">
                  Download PDF
                </button>
                <button className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
