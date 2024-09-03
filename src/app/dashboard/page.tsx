import Image from "next/image";
import Dashboard from "./dash";
import Footer from "../../lib/footer";
import PageVisitTelemetry from "@/lib/pageVisit";

export default function CredentialsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-2 md:py-4">
        <div className="container mx-auto px-4 flex items-center">
          <a href="/" className="flex flex-row items-center">
            <Image
              src="/calendar.svg"
              alt="Calendar Logo"
              width={40}
              height={40}
              className="mr-2 drop-shadow-md"
            />
            <h1 className="text-2xl font-bold">
              <span className="text-textc">Attendance</span>{" "}
              <span className="text-primary">Assistant</span>
            </h1>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-20 min-h-screen">
        <div className="mx-auto px-4 lg:w-1/2 md:w-3/4">
          <Dashboard />
        </div>
        <PageVisitTelemetry />
      </main>

      <Footer />
    </div>
  );
}
