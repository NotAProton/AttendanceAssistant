import Image from "next/image";
import Link from "next/link";
import Footer from "./footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Section 1 */}
        <section className="text-center pb-10 pt-20 lg:py-40 bg-gradient-radial">
          <div className="container mx-auto px-4 ">
            <Image
              src="/calendar.svg"
              alt="Logo"
              height={100}
              width={100}
              className="mx-auto mb-8 drop-shadow-lg"
            />
            <h1 className="text-4xl lg:text-8xl font-bold mb-6">
              <span className="text-textc">Attendance</span>{" "}
              <span className="text-primary">Assistant</span>
            </h1>
            <p className="text-2xl font-bold mb-8">The last one.</p>
            <Link href="/credentials">
              <button className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-500 transition-all shadow-md hover:shadow-xl">
                Get Started
              </button>
            </Link>
          </div>
        </section>

        {/* Card Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <Card
                icon={
                  <Image
                    src="/locked.png"
                    width={50}
                    height={50}
                    alt="Secure"
                    className="drop-shadow-md"
                  />
                }
                title="Secure"
                description="Your LMS password never leaves your device"
              />
              <Card
                icon={
                  <Image
                    src="/stopwatch.png"
                    width={50}
                    height={50}
                    alt="Fast"
                    className="drop-shadow-md"
                  />
                }
                title="Fast"
                description="Get realtime details in one click"
              />
              <Card
                icon={
                  <Image
                    src="/counterclockwise-arrows-button.png"
                    width={50}
                    height={50}
                    alt="Smart"
                    className="drop-shadow-md"
                  />
                }
                title="Smart"
                description="Always in sync with your data"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Card({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg">
      <div className="flex flex-row items-center gap-2 mb-2">
        {icon}
        <h3 className="text-4xl font-semibold">{title}</h3>
      </div>
      <p>{description}</p>
    </div>
  );
}
