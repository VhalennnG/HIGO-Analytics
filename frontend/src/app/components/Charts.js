"use client";

import { Bar, Pie, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function GenderChart({ data }) {
  const chartData = {
    labels: data.map((item) => item._id),
    datasets: [
      {
        label: "Gender Distribution",
        data: data.map((item) => item.count),
        backgroundColor: ["#ec4899", "#3b82f6"],
        borderWidth: 2,
        borderColor: ["#db2777", "#2563eb"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${
              context.label
            }: ${context.parsed.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Gender Distribution
      </h3>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

export function DeviceChart({ data }) {
  const chartData = {
    labels: data.map((item) => item._id),
    datasets: [
      {
        label: "Device Count",
        data: data.map((item) => item.count),
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#ec4899",
          "#14b8a6",
          "#f97316",
          "#06b6d4",
          "#84cc16",
        ],
        borderWidth: 1,
        borderColor: "#e5e7eb",
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const percentage = context.dataset.data.find((_, index) => {
              return data[index]._id === context.label;
            });
            const item = data.find((d) => d._id === context.label);
            return `${context.label}: ${context.parsed.x.toLocaleString()} (${
              item.percentage
            }%)`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Device Popularity
      </h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export function InterestChart({ data }) {
  const chartData = {
    labels: data.map((item) => item._id),
    datasets: [
      {
        label: "Interest Count",
        data: data.map((item) => item.count),
        backgroundColor: [
          "#3b82f6",
          "#ec4899",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#14b8a6",
          "#f97316",
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            const item = data.find((d) => d._id === context.label);
            return [
              `${
                context.label
              }: ${context.parsed.toLocaleString()} (${percentage}%)`,
              `Top Gender: ${item.topGender.gender}`,
            ];
          },
        },
      },
    },
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Interest Categories
      </h3>
      <Pie data={chartData} options={options} />
    </div>
  );
}

export function LocationChart({ data }) {
  const chartData = {
    labels: data.map((item) =>
      item._id
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    ),
    datasets: [
      {
        label: "Customer Count",
        data: data.map((item) => item.count),
        backgroundColor: "#8b5cf6",
        borderColor: "#7c3aed",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed.y * 100) / total).toFixed(1);
            return `${
              context.label
            }: ${context.parsed.y.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Location Distribution
      </h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}

// NEW: Peak Hours Chart berdasarkan data peakHours dari API
export function PeakHoursChart({ data }) {
  // Sort data by hour and clean up the hour format
  const sortedData = data
    .map((item) => ({
      ...item,
      hour: item.hour.replace(":", ""), // Remove colon if exists
      hourNum: parseInt(item.hour.replace(":", "")),
    }))
    .sort((a, b) => a.hourNum - b.hourNum);

  const chartData = {
    labels: sortedData.map((item) => `${item.hour}:00`),
    datasets: [
      {
        label: "Activity Count",
        data: sortedData.map((item) => item.count),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${
              context.label
            }: ${context.parsed.y.toLocaleString()} users`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Users",
        },
      },
      x: {
        title: {
          display: true,
          text: "Hour of Day",
        },
      },
    },
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Peak Activity Hours
      </h3>
      <Line data={chartData} options={options} />
    </div>
  );
}

// Gender breakdown in interests
export function InterestGenderChart({ data }) {
  const maleInterests = data.filter((item) => item.topGender.gender === "Male");
  const femaleInterests = data.filter(
    (item) => item.topGender.gender === "Female"
  );

  const chartData = {
    labels: ["Male-Dominated", "Female-Dominated"],
    datasets: [
      {
        label: "Interest Categories",
        data: [maleInterests.length, femaleInterests.length],
        backgroundColor: ["#3b82f6", "#ec4899"],
        borderWidth: 2,
        borderColor: ["#2563eb", "#db2777"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          afterLabel: function (context) {
            const interests =
              context.label === "Male-Dominated"
                ? maleInterests
                : femaleInterests;
            return interests.map((item) => `• ${item._id}`);
          },
        },
      },
    },
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Interest by Gender Preference
      </h3>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

// Statistics Overview Component - updated to match API structure
export function StatisticsOverview({ data }) {
  const stats = [
    {
      label: "Device Brands",
      value: data.devicePopularity?.length || "0",
      color: "bg-green-500",
      icon: "📱",
    },
    {
      label: "Interest Categories",
      value: data.interestCategories?.length || "0",
      color: "bg-purple-500",
      icon: "🎯",
    },
    {
      label: "Location Types",
      value: data.locationBreakdown?.length || "0",
      color: "bg-orange-500",
      icon: "📍",
    },
    {
      label: "Peak Hours Tracked",
      value: data.peakHours?.length || "0",
      color: "bg-pink-500",
      icon: "⏰",
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Overview Statistics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div
              className={`${stat.color} text-white p-4 rounded-lg mb-2 hover:shadow-lg transition-shadow`}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold">{stat.value}</div>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
