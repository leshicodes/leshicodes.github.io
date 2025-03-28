import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

// Social icons - you can replace these with any icons you prefer
const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

// Personal interests section with styled cards
function PersonalInterests() {
  const interests = [
    {
      title: 'Poetry',
      description: 'Creative expressions and personal reflections',
      link: '/blog/tags/poetry',
      color: 'var(--ifm-color-primary)',
    },
    {
      title: 'DIY Projects',
      description: 'Home improvement and crafting adventures',
      link: '/blog/tags/DIY',
      color: '#e86d32',
    },
    {
      title: 'Kitchen',
      description: 'Culinary experiments and recipes',
      link: '/blog/tags/kitchen',
      color: '#32a852',
    },
  ];

  return (
    <div className={styles.interestsContainer}>
      <Heading as="h2" className={styles.sectionHeading}>
        Personal Interests
      </Heading>
      <div className={styles.interestsGrid}>
        {interests.map((interest, idx) => (
          <Link key={idx} to={interest.link} className={styles.interestCard} style={{ backgroundColor: interest.color }}>
            <h3>{interest.title}</h3>
            <p>{interest.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Technical achievements section
function TechnicalAchievements() {
  return (
    <div className={styles.technicalContainer}>
      <Heading as="h2" className={styles.sectionHeading}>
        Technical Portfolio
      </Heading>
      <div className={styles.techContent}>
        <div className={styles.techDescription}>
          <p>
            I'm a software engineer with expertise in web development, cloud infrastructure, and system architecture.
            Check out my technical blog posts and project documentation to learn more about my work.
          </p>
          <div className={styles.techButtons}>
            <Link to="/blog/tags/tech" className="button button--primary button--lg">
              Technical Blog
            </Link>
            <Link to="/docs/intro" className="button button--secondary button--lg">
              Project Docs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.profileSection}>
          <div className={styles.profileImageContainer}>
            <img 
              src="/img/profile.png" 
              alt="Profile" 
              className={styles.profileImage}
              onError={(e) => {
                e.currentTarget.onerror = null; 
                e.currentTarget.src = "https://github.com/leshicodes.png";
              }} 
            />
          </div>
          <div className={styles.profileContent}>
            <Heading as="h1" className={styles.heroTitle}>
              James Ambrose
            </Heading>
            <p className={styles.heroSubtitle}>
              Software Engineer & Creative Enthusiast
            </p>
            <div className={styles.socialLinks}>
              <a href="https://github.com/leshicodes" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <GitHubIcon />
              </a>
              <a href="https://bsky.app/profile/leshicodes.bsky.social" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                📱
              </a>
              {/* Add more social links as needed */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="James Ambrose - Software Engineer & Creative Enthusiast">
      <HomepageHeader />
      <main>
        <TechnicalAchievements />
        <PersonalInterests />
      </main>
    </Layout>
  );
}