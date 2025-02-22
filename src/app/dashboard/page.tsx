import { DashboardContent } from "@/components/DashboardContent"

async function getUsername() {
  // This is a placeholder. In a real app, this would be a database query
  return "John Doe"
}

export default async function DashboardPage() {
  const username = await getUsername()
 
  return <DashboardContent username={username} />
}

