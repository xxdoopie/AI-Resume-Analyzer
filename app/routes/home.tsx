
import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import ResumeCard from "../components/ResumeCard";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
export function meta({ }: Route.MetaArgs) {

  return [
    { title: "Resume Analyzer" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  const { auth, fs, kv } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list('resume:*', true)) as KVItem[];// list all the resumes
      const parsedResumes = resumes
        ?.filter((resume) => resume.value !== undefined && resume.value !== null)
        .map((resume) => JSON.parse(resume.value) as Resume);
      console.log(parsedResumes);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);

    }
    loadResumes();
  }, [])
  return <main className=" bg-[url('/images/bg-main.svg')] ">
    <Navbar />

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track Your Applications & Resume Ratings</h1>
        {!loadingResumes && resumes.length === 0 ? (
          <h2>No resumes found.</h2>
        ) : (
          <h2>Review your submissions and check AI powered feedback</h2>
        )}

      </div>

      {loadingResumes && (
        <div className='flex flex-col items-center justify-center'>
          <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="" />
        </div>
      )}


      {!loadingResumes && resumes.length > 0 && (
        <div className="resumes-section">

          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}

        </div>
      )}

      {!loadingResumes && resumes.length === 0 && (
        <div className='flex flex-col items-center justify-center mt-10 gap-4'>
          <Link to="/upload" className="primary-button w-fit text-xl font-semibold">Upload Resume</Link>
        </div>
      )}

    </section>

  </main >
}
