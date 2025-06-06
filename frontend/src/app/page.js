"use client";

import { useState, useEffect } from "react";
import { FiUsers, FiRefreshCw, FiUser } from "react-icons/fi";
import {
  HiOutlineUsers,
  HiOutlineDevicePhoneMobile,
  HiOutlineChartBar,
  HiOutlineTableCells,
  HiOutlineClock,
} from "react-icons/hi2";
import { getCustomerCount, getSummaryData } from "./lib/api";
import StatsCard from "./components/StatsCard";
import {
  GenderChart,
  DeviceChart,
  InterestChart,
  LocationChart,
  PeakHoursChart,
  AgeChart,
  InterestGenderChart,
  StatisticsOverview,
} from "./components/Charts";
import DataTable from "./components/DataTable";
import Footer from "./components/Footer";

export default function Home() {
  const [activeView, setActiveView] = useState("charts");
  const [countData, setCountData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [count, summary] = await Promise.all([
          getCustomerCount(),
          getSummaryData(),
        ]);
        setCountData(count);
        setSummaryData(summary);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center">
            <FiRefreshCw className="animate-spin h-12 w-12 text-blue-600" />
          </div>
          <p className="text-gray-600 mt-4 text-center">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const peakHour = summaryData?.data.peakHours?.reduce((prev, current) =>
    prev.count > current.count ? prev : current
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Customer Analytics Dashboard
              </h1>
              <p className="mt-2 text-blue-100 text-lg">
                Real-time insights into customer data
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-sm text-blue-100">Last Updated</span>
                <p className="font-semibold">
                  {summaryData
                    ? new Date(summaryData.generatedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard
            title="Total Customers"
            value={summaryData?.data.totalCustomers?.toLocaleString() || "0"}
            icon={<HiOutlineUsers className="text-3xl" />}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatsCard
            title="Male Customers"
            value={
              summaryData?.data.genderDistribution
                .find((g) => g._id === "Male")
                ?.count.toLocaleString() || "0"
            }
            icon={<FiUser className="text-3xl" />}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatsCard
            title="Female Customers"
            value={
              summaryData?.data.genderDistribution
                .find((g) => g._id === "Female")
                ?.count.toLocaleString() || "0"
            }
            icon={<FiUsers className="text-3xl" />}
            color="bg-gradient-to-r from-pink-500 to-pink-600"
          />
          <StatsCard
            title="Most Popular Device"
            value={summaryData?.data.devicePopularity?.[0]?._id || "N/A"}
            icon={<HiOutlineDevicePhoneMobile className="text-3xl" />}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatsCard
            title="Peak Hour"
            value={peakHour ? `${peakHour.hour.replace(":", "")}:00` : "N/A"}
            icon={<HiOutlineClock className="text-3xl" />}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
        </div>

        {summaryData?.data && (
          <div className="mb-8">
            <StatisticsOverview data={summaryData.data} />
          </div>
        )}

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-lg p-1 flex">
            <button
              onClick={() => setActiveView("charts")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeView === "charts"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <HiOutlineChartBar className="text-xl" />
              <span>Chart Analytics</span>
            </button>
            <button
              onClick={() => setActiveView("table")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeView === "table"
                  ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md transform scale-105"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <HiOutlineTableCells className="text-xl" />
              <span>Data List</span>
            </button>
          </div>
        </div>

        <div className="transition-all duration-500 ease-in-out">
          {activeView === "charts" ? (
            <div className="space-y-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Analytics Overview
                </h2>
                <p className="text-gray-600">
                  Visual representation of your customer data insights
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <GenderChart
                    data={summaryData?.data.genderDistribution || []}
                  />
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <DeviceChart
                    data={summaryData?.data.devicePopularity || []}
                  />
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <LocationChart
                    data={summaryData?.data.locationBreakdown || []}
                  />
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <PeakHoursChart data={summaryData?.data.peakHours || []} />
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <InterestChart
                    data={summaryData?.data.interestCategories || []}
                  />
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <InterestGenderChart
                    data={summaryData?.data.interestCategories || []}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Customer Data Table
                </h2>
                <p className="text-gray-600">
                  Detailed view of all customer information
                </p>
              </div>

              {/* Enhanced Data Table Container */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <DataTable />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Enhanced Footer */}
      <Footer />
    </div>
  );
}
