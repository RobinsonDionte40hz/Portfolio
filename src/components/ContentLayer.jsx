import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, ExternalLink, GitBranch } from 'lucide-react';
import useGitHubRepo from '../hooks/useGitHubRepo';
import { config } from '../config';

const ContentLayer = () => {
  const [currentProject, setCurrentProject] = useState(0);
  const [contentVisible, setContentVisible] = useState(false);
  const techCarouselRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(true);
  const [formStatus, setFormStatus] = useState('');
  const { latestRepo: repoData, loading } = useGitHubRepo(config.github.username);

  // Fade in portfolio content after a delay
  useEffect(() => {
    setTimeout(() => setContentVisible(true), 800);
  }, []);

  // Auto-scroll technologies carousel
  useEffect(() => {
    if (!isScrolling) return;
    
    const container = techCarouselRef.current;
    if (!container) return;
    
    let scrollPosition = container.scrollLeft;
    
    const animate = () => {
      if (!container || !isScrolling) return;
      
      // Increment scroll position
      scrollPosition += 0.5;
      
      // Calculate the width of one set of technologies
      const oneSetWidth = container.scrollWidth / 2;
      
      // Reset position when we've scrolled one full set
      if (scrollPosition >= oneSetWidth) {
        scrollPosition = scrollPosition - oneSetWidth;
      }
      
      // Apply the scroll position
      container.scrollLeft = scrollPosition;
    };
    
    const intervalId = setInterval(animate, 20);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [isScrolling]);

  // Sample data
  const technologies = [
    { name: 'React', icon: '⚛️' },
    { name: 'TypeScript', icon: '📘' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'Python', icon: '🐍' },
    { name: 'Django', icon: '🎯' },
    { name: 'PostgreSQL', icon: '🐘' },
    { name: 'MySQL', icon: '🐬' },
    { name: 'MongoDB', icon: '🍃' },
    { name: 'Redis', icon: '🔴' },
    { name: 'Docker', icon: '🐳' },
    { name: 'AWS', icon: '☁️' },
    { name: 'Git', icon: '📚' },
    { name: 'Three.js', icon: '🎮' },
    { name: 'Tailwind', icon: '🎨' },
    { name: 'Next.js', icon: '▲' }
  ];

  const projects = [
    { 
      id: 1, 
      title: 'Neural Racing Ecosystem', 
      description: 'AI-powered racing simulation with autonomous betting system',
      tech: ['React', 'Canvas API', 'AI/ML'],
      color: 'bg-gradient-to-br from-palette-garnet to-palette-beaver'
    },
    { 
      id: 2, 
      title: 'Real-time Analytics Dashboard', 
      description: 'Live data visualization platform with predictive modeling',
      tech: ['Next.js', 'D3.js', 'WebSocket'],
      color: 'bg-gradient-to-br from-palette-beaver to-palette-olive'
    },
    { 
      id: 3, 
      title: 'Collaborative Code Editor', 
      description: 'Multi-user code editing with real-time synchronization',
      tech: ['React', 'Node.js', 'Socket.io'],
      color: 'bg-gradient-to-br from-palette-olive to-palette-bistre'
    },
    { 
      id: 4, 
      title: 'AI Content Generator', 
      description: 'Machine learning powered content creation platform',
      tech: ['Python', 'TensorFlow', 'React'],
      color: 'bg-gradient-to-br from-palette-bistre to-palette-garnet'
    }
  ];

  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('Message sent successfully! I\'ll get back to you soon.');
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormStatus('');
      e.target.reset();
    }, 3000);
  };

  return (
    <div className={`relative transition-opacity duration-1000 ${contentVisible ? 'opacity-100' : 'opacity-0'}`} style={{ zIndex: 2 }}>
      {/* Header */}
      <header className="flex justify-between items-center p-6 md:p-8">
        <a href="#" className="text-xl font-bold hover:text-palette-garnet transition-colors">
          home
        </a>
        <nav className="flex items-center space-x-6">
          <a href="#projects" className="hover:text-palette-garnet transition-colors">projects</a>
          <span className="text-palette-beaver">|</span>
          <a href="#about" className="hover:text-palette-garnet transition-colors">about</a>
          <span className="text-palette-beaver">|</span>
          <a href="#contact" className="hover:text-palette-garnet transition-colors">contact</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 md:px-8">
        {/* Hero Section */}
        <section className="min-h-[60vh] flex items-center justify-center mb-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-palette-garnet to-palette-olive bg-clip-text text-transparent">
              Current Work
            </h1>
            <p className="text-xl text-palette-beaver mb-8">
              Building intelligent systems that blur the line between code and creativity
            </p>
            
            {/* Latest Repository Display */}
            {repoData && !loading && (
              <div className="mb-8">
                <a 
                  href={repoData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 px-6 py-3 bg-palette-bistre border border-palette-olive rounded-lg hover:border-palette-garnet transition-all transform hover:scale-105 group"
                >
                  <GitBranch size={20} className="text-palette-garnet" />
                  <div className="text-left">
                    <p className="text-sm text-palette-beaver">Currently working on:</p>
                    <p className="font-semibold text-white group-hover:text-palette-garnet transition-colors">
                      {repoData.name}
                    </p>
                  </div>
                  <ExternalLink size={16} className="text-palette-beaver group-hover:text-palette-garnet transition-colors" />
                </a>
                {repoData.description && (
                  <p className="mt-3 text-sm text-palette-beaver max-w-md mx-auto">
                    {repoData.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Technologies Carousel */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-8 text-palette-garnet">Technologies</h2>
          <div className="relative group max-w-2xl mx-auto">
            <div
              ref={techCarouselRef}
              onMouseEnter={() => setIsScrolling(false)}
              onMouseLeave={() => setIsScrolling(true)}
              className="flex space-x-8 overflow-x-auto scrollbar-hide py-4"
            >
              {[...technologies, ...technologies].map((tech, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex flex-col items-center space-y-2 transform transition-transform hover:scale-110"
                >
                  <div className="w-16 h-16 bg-palette-bistre rounded-lg flex items-center justify-center text-2xl border border-palette-olive hover:border-palette-garnet transition-colors">
                    {tech.icon}
                  </div>
                  <span className="text-sm text-palette-beaver">{tech.name}</span>
                </div>
              ))}
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-palette-night to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-palette-night to-transparent pointer-events-none"></div>
          </div>
        </section>

        {/* Projects Slider */}
        <section id="projects" className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-8 text-palette-garnet">Projects</h2>
          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                              <button
                  onClick={prevProject}
                  className="p-3 bg-palette-bistre rounded-full hover:bg-palette-night transition-colors transform hover:scale-110"
                >
                <ChevronLeft size={24} />
              </button>

              <div className="flex-1 mx-8 overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentProject * 100}%)` }}
                >
                  {projects.map((project, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <div className={`${project.color} rounded-2xl p-1`}>
                        <div className="bg-palette-night rounded-2xl p-8">
                          <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                          <p className="text-palette-beaver mb-6">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech, i) => (
                                                              <span
                                  key={i}
                                  className="px-3 py-1 bg-palette-bistre rounded-full text-sm border border-palette-olive text-palette-garnet"
                                >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

                              <button
                  onClick={nextProject}
                  className="p-3 bg-palette-bistre rounded-full hover:bg-palette-night transition-colors transform hover:scale-110"
                >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Project Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentProject(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentProject ? 'bg-palette-garnet w-8' : 'bg-palette-olive'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-8 text-palette-garnet">About</h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-palette-bistre rounded-2xl p-8 border border-palette-olive">
              <p className="text-palette-beaver mb-6 leading-relaxed">
                I'm a full-stack developer passionate about creating intelligent systems that push the boundaries 
                of what's possible with code. With expertise in modern web technologies and AI/ML, I build 
                applications that are not just functional, but transformative.
              </p>
              <p className="text-palette-beaver mb-6 leading-relaxed">
                My work spans from building neural networks for autonomous systems to crafting beautiful, 
                responsive user interfaces. I believe in the power of technology to solve complex problems 
                and create meaningful experiences.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl mb-2">🚀</div>
                  <h3 className="text-palette-garnet font-semibold mb-1">Innovation</h3>
                  <p className="text-sm text-palette-beaver">Pushing boundaries with cutting-edge tech</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="text-palette-garnet font-semibold mb-1">Precision</h3>
                  <p className="text-sm text-palette-beaver">Clean, efficient, and scalable solutions</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🌟</div>
                  <h3 className="text-palette-garnet font-semibold mb-1">Impact</h3>
                  <p className="text-sm text-palette-beaver">Creating tools that make a difference</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-20 pb-10">
          <h2 className="text-2xl font-bold text-center mb-8 text-palette-garnet">Contact</h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-palette-bistre rounded-2xl p-8 border border-palette-olive">
              <p className="text-palette-beaver mb-8 text-center leading-relaxed">
                Let's build something amazing together. Whether you have a project in mind or just want to connect, 
                I'd love to hear from you.
              </p>
              
              {/* Contact Methods */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <a href={`mailto:${config.contact.email}`} className="group">
                  <div className="text-center p-6 bg-palette-night rounded-xl border border-palette-olive hover:border-palette-garnet transition-colors">
                    <div className="text-3xl mb-3">📧</div>
                    <h3 className="text-palette-garnet font-semibold mb-1">Email</h3>
                    <p className="text-sm text-palette-beaver group-hover:text-palette-garnet transition-colors">{config.contact.email}</p>
                  </div>
                </a>
                
                <a href={config.contact.githubUrl} target="_blank" rel="noopener noreferrer" className="group">
                  <div className="text-center p-6 bg-palette-night rounded-xl border border-palette-olive hover:border-palette-garnet transition-colors">
                    <div className="text-3xl mb-3">💻</div>
                    <h3 className="text-palette-garnet font-semibold mb-1">GitHub</h3>
                    <p className="text-sm text-palette-beaver group-hover:text-palette-garnet transition-colors">View my code</p>
                  </div>
                </a>
                
                <a href={config.contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="group">
                  <div className="text-center p-6 bg-palette-night rounded-xl border border-palette-olive hover:border-palette-garnet transition-colors">
                    <div className="text-3xl mb-3">💼</div>
                    <h3 className="text-palette-garnet font-semibold mb-1">LinkedIn</h3>
                    <p className="text-sm text-palette-beaver group-hover:text-palette-garnet transition-colors">Connect with me</p>
                  </div>
                </a>
              </div>
              
              {/* Contact Form */}
              <div className="border-t border-palette-olive pt-8">
                <h3 className="text-lg font-semibold text-palette-garnet mb-4 text-center">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      className="w-full px-4 py-3 bg-palette-night border border-palette-olive rounded-lg text-white placeholder-palette-beaver focus:border-palette-garnet focus:outline-none transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      required
                      className="w-full px-4 py-3 bg-palette-night border border-palette-olive rounded-lg text-white placeholder-palette-beaver focus:border-palette-garnet focus:outline-none transition-colors"
                    />
                  </div>
                  <textarea
                    placeholder="Your Message"
                    rows="4"
                    required
                    className="w-full px-4 py-3 bg-palette-night border border-palette-olive rounded-lg text-white placeholder-palette-beaver focus:border-palette-garnet focus:outline-none transition-colors resize-none"
                  ></textarea>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-palette-garnet text-white rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200"
                    >
                      Send Message
                    </button>
                  </div>
                  {formStatus && (
                    <p className="text-center mt-4 text-palette-garnet">{formStatus}</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContentLayer; 