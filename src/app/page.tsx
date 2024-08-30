import Image from "next/image";
import Link from "next/link";

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

      {/* Footer */}
      <footer className="bg-gray-300 py-4 text-center text-stone-700 shadow-inner">
        <div className="text-xs max-w-2xl mx-auto">
          Copyright &copy; 2024 Akshat Saraswat, some rights reserved.
          <br />
          Licensed under the GNU Affero General Public License v3.0
          (gnu.org/licenses/agpl-3.0.en.html)
          <br />
          <div className="text-justify my-2 p-0">
            This program is free software: you can redistribute it and/or modify
            it under the terms of the GNU Affero General Public License as
            published by the Free Software Foundation, either version 3 of the
            License, or (at your option) any later version. <br />
            This program is distributed WITHOUT ANY WARRANTY; without even the
            implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
            PURPOSE. <br />
            NO LIABILITY: In no event shall the authors or copyright holders be
            liable for any claim, damages or other liability, whether in an
            action of contract, tort or otherwise, arising from, out of or in
            connection with the software or the use or other dealings in the
            software.
          </div>
          This project is based on the concept of &quot;Attendance
          Assistant&quot; by Harsh Iyer. <br />
          A copy of the database may be provided upon request for other GPL/AGPL
          or copyleft licensed projects. Email akshat@admins.iiitk.in for
          inquiries. <br />
          <div className="text-justify my-2 p-0">
            By using Attendance Assistant, you acknowledge and agree that this
            site automatically tracks, collects, and stores in perpetuity data
            related to your usage of the website. This data collection is
            integral to the functionality of Attendance Assistant and is used
            for purposes including, but not limited to, improving the site,
            studying usage patterns, and analyzing attendance statistics. You
            conset to such data collection and agree that you cannot opt out of
            this data collection while using Attendance Assistant. Your
            continued use of Attendance Assistant constitutes your agreement to
            this data collection.
          </div>
        </div>
      </footer>
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
