import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function FarmerProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/farmer/login");
  }

  if (session.user.role !== "FARMER") {
    redirect("/consumer");
  }

  return <>{children}</>;
}