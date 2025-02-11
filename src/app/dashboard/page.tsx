import { DashboardContent } from "@/components/DashboardContent"


// Define the Space type
export type Space = {
  id: string
  name: string
}

async function getUsername() {
  // This is a placeholder. In a real app, this would be a database query
  return "John Doe"
}

async function getUserSpaces(): Promise<Space[]> {
  // This is a placeholder. In a real app, this would be a database query
  return [
    { id: "space1", name: "My Space" },
    { id: "space2", name: "Work Space" },
    { id: "space3", name: "Project X" },
  ]
}

export default async function DashboardPage() {
  const username = await getUsername()
  const spaces = await getUserSpaces()

  return <DashboardContent username={username} spaces={spaces} />
}

