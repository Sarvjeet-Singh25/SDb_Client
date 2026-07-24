import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Briefcase } from "lucide-react";
import { apiGet } from "../lib/api";

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await apiGet("/api/jobs?limit=3");

        const list = Array.isArray(res)
          ? res
          : res?.jobs || res?.data || [];

        setJobs(list.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  if (loading) return null;

  return (
    <section className="bg-[#faf8f3] py-24">
      <div className="container-page">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">

          <div className="max-w-3xl">
            <span className="eyebrow">
              FEATURED JOBS
            </span>

            <h2 className="mt-4 font-serif text-4xl md:text-5xl text-navy leading-tight">
              Find Your Next International Career.
            </h2>

            <p className="mt-6 text-muted-foreground text-lg leading-8">
              Explore verified overseas jobs from trusted employers. Whether
              you're looking for work in Canada, the UAE, Europe or Australia,
              your next opportunity starts here.
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 rounded-full border border-navy px-6 py-3 text-sm font-semibold uppercase tracking-wider text-navy hover:bg-navy hover:text-white transition"
          >
            View All Jobs
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {jobs.map((job) => (

            <div
              key={job._id}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >

              {/* Top Bar */}
              <div className="h-2 bg-navy"></div>

              <div className="p-7">

                <span className="inline-flex rounded-full bg-[#F5EAD6] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#B8860B]">
                  {job.category}
                </span>

                <h3 className="mt-5 font-serif text-2xl text-navy transition-colors group-hover:text-[#B8860B]">
                  {job.title}
                </h3>

                <div className="mt-6 space-y-3 text-gray-600">

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#B8860B]" />
                    <span>{job.country}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-[#B8860B]" />
                    <span>{job.employmentType}</span>
                  </div>

                </div>

                <p className="mt-6 text-gray-600 line-clamp-3 leading-7">
                  {job.description}
                </p>

                <div className="mt-8 flex items-center justify-between">

                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400">
                      Salary
                    </p>

                    <p className="font-serif text-2xl text-[#B8860B]">
                      {job.salary}
                    </p>
                  </div>

                  <Link
                    to={`/jobs/${job._id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-medium text-white transition hover:bg-[#B8860B]"
                  >
                    Apply Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}