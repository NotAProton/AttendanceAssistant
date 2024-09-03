import Image from "next/image";
import Form from "./form";
import Footer from "../../lib/footer";
import Head from "next/head";
import { ColorSchemeScript } from "@mantine/core";
import PageVisitTelemetry from "@/lib/pageVisit";

export default function CredentialsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <ColorSchemeScript />
      </Head>
      <header className="shadow-md py-4">
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
      <main className="flex-grow bg-gradient-radial py-20 min-h-[80vh]">
        <div className="container mx-auto px-4 max-w-md">
          <Form />
        </div>
        <PageVisitTelemetry />
      </main>

      <Footer />
    </div>
  );
}
