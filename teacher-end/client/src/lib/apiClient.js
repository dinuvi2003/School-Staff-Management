export async function getCurrentUser() {
  const res = await fetch("http://localhost:5000/api/me", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Not authenticated");
  }

  const { data } = await res.json();
  console.log("data", data);
  return data;
}
