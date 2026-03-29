import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Gallery from '../components/Gallery/Gallery';

import Skills from '../components/Skills/Skills';
import Projects from '../components/Projects/Projects';
import Apps from '../components/Apps/Apps';
import Internships from '../components/Internships/Internships';
import Education from '../components/Education/Education';
import Journal from '../components/Journal/Journal';
import Certifications from '../components/Certifications/Certifications';
import Workshops from '../components/Workshops/Workshops';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer/Footer';

export default function Home() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/portfolio/')
      .then((res) => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [data]);

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:48, height:48, border:'4px solid #e2e8f0', borderTopColor:'var(--primary)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
          <p style={{ fontFamily:'var(--fh)', color:'var(--muted)', fontSize:'0.9rem', fontWeight:600 }}>Loading portfolio...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const cgpa = data?.education?.find((item) => /cgpa/i.test(item.score || ''))?.score?.match(/[\d.]+/)?.[0] || '8.86';
  const stats = {
    cgpa,
    projectCount: data?.projects?.length || 0,
    certCount: data?.certifications?.length || 0,
    workshopCount: data?.workshops?.length || 0,
  };

  return (
    <>
      <Navbar />
      <Hero           data={data?.hero} stats={stats} />
      <About          data={data?.hero} stats={stats} />
      <Gallery />
      
      <Skills         data={data?.skills          || []} />
      <Projects       data={data?.projects         || []} />
      <Apps           data={data?.apps             || []} />
      <Internships    data={data?.internships       || []} />
      <Education      data={data?.education         || []} />
      <Journal        data={data?.journals          || []} />
      <Certifications data={data?.certifications    || []} />
      <Workshops      data={data?.workshops         || []} />
      <Contact        hero={data?.hero} />
      <Footer         hero={data?.hero} />
    </>
  );
}
