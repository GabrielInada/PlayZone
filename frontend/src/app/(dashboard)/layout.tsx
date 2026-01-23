import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-6 py-4">
        {children}
      </main>

      <Footer />
    </div>
  );
}
