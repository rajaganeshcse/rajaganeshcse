import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
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
import { applySeo } from '../utils/seo';

export default function Home() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    API.get('/portfolio/')
      .then((res) => {
        if (!isMounted) return;
        setData(res.data);
      })
      .catch(() => {})
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
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
      <LoadingScreen
        eyebrow="Live Portfolio Sync"
        title="Shaping the first impression from fresh data."
        message="Hero details, projects, certifications, journals, and contact info are being pulled from the database so the landing page opens fully composed."
        steps={[
          {
            label: 'Fetching profile records',
            detail: 'Loading hero, about, and supporting profile details.',
          },
          {
            label: 'Arranging featured work',
            detail: 'Preparing projects, apps, workshops, and learning highlights.',
          },
          {
            label: 'Finalizing the front page',
            detail: 'Composing sections and media so the experience feels ready on arrival.',
          },
        ]}
      />
    );
  }

  const cgpa = data?.education?.find((item) => /cgpa/i.test(item.score || ''))?.score?.match(/[\d.]+/)?.[0] || '8.86';
  const stats = {
    cgpa,
    projectCount: data?.projects?.length || 0,
    certCount: data?.certifications?.length || 0,
    workshopCount: data?.workshops?.length || 0,
  };

  useEffect(() => {
    const hero = data?.hero;
    const siteUrl = hero?.portfolio || 'https://react-website-five-theta.vercel.app/';
    const name = hero?.name || 'Rajaganesh T';
    const title = `${name} | Java Developer and Android App Developer Portfolio`;
    const description = hero?.bio || 'Rajaganesh T is an aspiring Android app developer and Java developer showcasing projects, skills, certifications, internships, and contact details on his portfolio website.';
    const keywords = [
      name,
      'Rajaganesh',
      'RajaGanesh',
      'Java Developer',
      'Android App Developer',
      'Portfolio',
      'React',
      'Firebase',
      'Tamil Nadu',
    ].join(', ');

    applySeo({
      title,
      description,
      keywords,
      url: siteUrl,
      image: hero?.photo_url,
      structuredData: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Person',
            name,
            alternateName: 'Rajaganesh',
            url: siteUrl,
            image: hero?.photo_url,
            jobTitle: hero?.title || 'Aspiring Android App Developer',
            description,
            email: hero?.email ? `mailto:${hero.email}` : undefined,
            telephone: hero?.phone || undefined,
            address: hero?.location
              ? {
                  '@type': 'PostalAddress',
                  addressLocality: 'Cuddalore',
                  addressRegion: 'Tamil Nadu',
                  addressCountry: 'IN',
                }
              : undefined,
            alumniOf: hero?.college
              ? {
                  '@type': 'CollegeOrUniversity',
                  name: hero.college,
                }
              : undefined,
            sameAs: [hero?.github, hero?.linkedin].filter(Boolean),
            knowsAbout: ['Java', 'Android Development', 'React', 'Firebase', 'MySQL', 'Mobile App Development'],
          },
          {
            '@type': 'WebSite',
            name: `${name} Portfolio`,
            url: siteUrl,
            description,
          },
        ],
      },
    });
  }, [data]);

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
