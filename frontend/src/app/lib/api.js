const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export async function getCustomerCount() {
  const res = await fetch(`${API_BASE_URL}/api/customers/count`);
  if (!res.ok) throw new Error("Failed to fetch customer count");
  return res.json();
}

export async function getSummaryData() {
  const res = await fetch(`${API_BASE_URL}/api/summary`);
  if (!res.ok) throw new Error("Failed to fetch summary data");
  return res.json();
}

export async function getCustomers(
  page = 1,
  perPage = 10,
  sortBy = "createdAt",
  sortOrder = "desc"
) {
  const params = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
    sortBy,
    sortOrder,
  });

  const res = await fetch(`${API_BASE_URL}/api/customers?${params}`);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}
