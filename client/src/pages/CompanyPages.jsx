import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryNavbar from '../components/CategoryNavbar';
import { AppContext } from '../context/AppContext';
import { 
  FiBriefcase, 
  FiFileText, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCheckCircle, 
  FiHelpCircle, 
  FiChevronDown, 
  FiChevronUp,
  FiBookOpen,
  FiTruck,
  FiRotateCcw,
  FiLock,
  FiSend
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompanyPages({ type }) {
  const { navigateTo } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState(type || 'about');

  // Sync state if type prop changes from external navigations (e.g. clicking a footer link from another page)
  useEffect(() => {
    if (type) {
      setActiveTab(type);
    }
  }, [type]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigateTo(tab); // sync routing state
  };

  // Careers Submission State
  const [careerSubmitted, setCareerSubmitted] = useState(false);
  const [careerForm, setCareerForm] = useState({ name: '', email: '', role: 'Sales Executive (Dental Consumables)', message: '' });

  // Contact Inquiry Submission State
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: 'Product Demonstration', message: '' });

  // Interactive FAQs Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const menuItems = [
    { id: 'about', label: 'About Us', icon: <FiFileText /> },
    { id: 'careers', label: 'Careers', icon: <FiBriefcase /> },
    { id: 'blog', label: 'Blog & Portal', icon: <FiBookOpen /> },
    { id: 'contact', label: 'Contact Us', icon: <FiMail /> },
    { id: 'help', label: 'Help Center & FAQs', icon: <FiHelpCircle /> },
    { id: 'shipping', label: 'Shipping & Delivery', icon: <FiTruck /> },
    { id: 'returns', label: 'Returns & Exchange', icon: <FiRotateCcw /> },
    { id: 'terms', label: 'Terms & Conditions', icon: <FiLock /> },
  ];

  // Mock Career Openings
  const jobs = [
    {
      title: "Sales Executive (Dental Consumables)",
      location: "Bengaluru / Mumbai / Chennai",
      type: "Full-Time",
      dept: "Sales & Distribution",
      desc: "Drive growth of Orikam chemical consumables, rotary files, and general supplies. Prior experience in B2B medical/dental sales required."
    },
    {
      title: "Clinical Product Specialist",
      location: "Gurgaon Head Office",
      type: "Full-Time",
      dept: "Training & Product Support",
      desc: "Coordinate clinical demonstrations of NanoPix Intraoral Sensors and AI solutions. BDS degree preferred."
    },
    {
      title: "Field Service Engineer (3D Imaging)",
      location: "Mumbai",
      type: "Full-Time",
      dept: "Service & Engineering",
      desc: "Install, calibrate, and support Helios Intraoral scanners and dental equipment at dental clinics."
    },
    {
      title: "R&D Assistant (Dental Chemicals)",
      location: "Gurgaon",
      type: "Contract",
      dept: "Research & Development",
      desc: "Assist in developing alginates, Calcium Hydroxide based materials, and chemical formulations in our state-of-the-art laboratory."
    }
  ];

  // Real Orikam-related FAQ list
  const faqs = [
    {
      q: "How do I request a product demonstration for NanoPix sensors?",
      a: "You can request a demo by calling our B2B helpline at 0124-4361189 or by filling out the Contact Inquiry form under the Contact Us tab. Our regional product specialist will contact you to schedule an on-site or digital demonstration."
    },
    {
      q: "Are the rotary files and endodontic items manufactured in India?",
      a: "Yes. Orikam Healthcare is a pioneer in the Indian dental industry and stands as the only manufacturer of rotary files in the Indian subcontinent. We also operate a dental chemical laboratory focused on high-quality consumables like EDTA and Gutta-Percha solvers."
    },
    {
      q: "What is the warranty period on dental equipment?",
      a: "Orikam provides a standard 1-year manufacturing warranty on all diagnostic technology (including NanoPix sensors and portable X-ray units). Extended warranty contracts are available upon registration on our Orikam Service App."
    },
    {
      q: "Can I return opened dental consumables?",
      a: "Due to medical hygiene standards and B2B sterilization guidelines, consumables (including rotary files, cements, composites, and chemical pastes) that have been opened or had their safety seals unsealed cannot be returned. Please refer to our Returns Policy section for full details."
    },
    {
      q: "What are your shipping timelines?",
      a: "All clinical products are packaged and dispatched from our Gurgaon distribution center within 24 hours of order receipt. Delivery to Metro cities takes 2-3 business days, while other locations take 4-5 business days."
    }
  ];

  // Mock Blog Articles
  const articles = [
    {
      title: "Revolutionizing Diagnostics with NanoPix Intraoral Sensor and NANO AI",
      date: "June 20, 2026",
      readTime: "5 min read",
      summary: "Explore how artificial intelligence is changing dental radiography, aiding clinicians in spot-on caries diagnostics and automated bone-loss analysis.",
      author: "Dr. A. Verma, Clinical Expert"
    },
    {
      title: "A Guide to Rotary Endodontic Files: Selecting the Neoendo Series",
      date: "May 15, 2026",
      readTime: "7 min read",
      summary: "Understand file metallurgy, file taper, and sequencing algorithms to perform safer, quicker root canals with minimum risks of instrument separation.",
      author: "Clinical Support Team, Orikam"
    },
    {
      title: "Optimal Sterilization Protocols in B2B Dental Clinics",
      date: "April 11, 2026",
      readTime: "4 min read",
      summary: "A practical walkthrough on maintaining autoclave sterilization logs, understanding Class B features, and ensuring compliance with B2B safety standards.",
      author: "Quality Assurance Division"
    },
    {
      title: "Dental Impression Materials Selection: Putty vs Alginates",
      date: "March 02, 2026",
      readTime: "6 min read",
      summary: "Compare dimensional stability, detail reproduction, and tear strength between addition silicones and alginates to achieve perfect clinical margins.",
      author: "Dr. Olivia Rhye"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col font-sans gap-2 text-left">
      <Header />
      
      <main className="flex-1 flex flex-col gap-2 pb-2">
        <CategoryNavbar />

        {/* Page Container */}
        <section className="w-full px-4 md:px-6 py-2.5">
          <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-5 items-start">
            
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-72 bg-white rounded-2xl p-5 shadow-xs shrink-0 border border-gray-100/60">
              <h2 className="text-sm font-extrabold text-gray-400 uppercase tracking-wider mb-4 font-outfit">Company & Support</h2>
              <nav className="flex flex-col gap-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                      activeTab === item.id 
                        ? 'bg-red-50 text-brand-red shadow-2xs border-l-4 border-brand-red' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Content Area */}
            <div className="flex-1 w-full bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-gray-100/60 min-h-[500px]">
              
              {/* Tab: About Us */}
              {activeTab === 'about' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest font-outfit">Since 2013</span>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-outfit mt-1">About Orikam Healthcare</h1>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    Orikam Healthcare India Pvt. Ltd. is a leading dental device company headquartered in Gurugram, India. Over the last decade, we have evolved from a specialized endodontics provider to a multi-specialty manufacturer and B2B distributor of premium dental technology, chemical consumables, and clinical solutions.
                  </p>

                  {/* Trust Counters */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-100 bg-gray-50/50 p-4 rounded-xl">
                    <div className="text-center">
                      <div className="text-3xl font-extrabold text-brand-red font-outfit">10+</div>
                      <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Years of Innovation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-extrabold text-brand-red font-outfit">150+</div>
                      <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Skilled Staff</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-extrabold text-brand-red font-outfit">10k+</div>
                      <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Dentists Served</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-extrabold text-brand-red font-outfit">100%</div>
                      <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Clinical Compliant</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 text-left">
                    <h3 className="text-base md:text-lg font-bold text-gray-800 font-outfit">Our Mission & Values</h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      Our mission is to provide innovative product solutions that empower healthcare professionals to excel and stay ahead in their field. We stand committed to introducing global quality standards to Indian clinicians, helping them enhance patient outcomes, improve practice efficiency, and set new benchmarks in dental therapeutics.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 text-left">
                    <h3 className="text-base md:text-lg font-bold text-gray-800 font-outfit">State-of-the-Art Indian Manufacturing</h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      Orikam is recognized as the ONLY manufacturer of rotary files in the Indian subcontinent. We operates an advanced chemical testing laboratory for clinical pastes, root canal lubricants, and silicones. Supported by branch hubs in Mumbai and Chennai, we deliver premium products with unmatched speed and compliance.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab: Careers */}
              {activeTab === 'careers' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest font-outfit">Join the Team</span>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-outfit mt-1">Careers at Orikam</h1>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    At Orikam, we believe that empowering dental clinics begins with hiring passionate, innovative professionals. We offer a competitive work culture, technical challenges, and immense growth opportunities.
                  </p>

                  <div className="flex flex-col gap-4">
                    <h3 className="text-base md:text-lg font-bold text-gray-800 font-outfit">Current Openings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {jobs.map((job, idx) => (
                        <div key={idx} className="border border-gray-100 p-4 rounded-xl bg-gray-50/50 hover:shadow-2xs transition-shadow">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-bold text-brand-red bg-red-50 px-2 py-0.5 rounded">{job.dept}</span>
                            <span className="text-[10px] text-gray-400 font-semibold">{job.type}</span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-800 font-outfit">{job.title}</h4>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold mt-1.5 mb-2.5">
                            <FiMapPin size={11} /> <span>{job.location}</span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed">{job.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Career Application Form */}
                  <div className="border border-gray-100 p-6 rounded-xl bg-gray-50/50 mt-4">
                    <h3 className="text-base font-bold text-gray-800 font-outfit mb-1">Quick Application Form</h3>
                    <p className="text-xs text-gray-400 mb-4 font-semibold">Interested in joining our healthcare team? Submit your details below.</p>
                    
                    {careerSubmitted ? (
                      <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl flex items-start gap-2.5 border border-emerald-100">
                        <FiCheckCircle className="text-lg shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold">Application Received!</h4>
                          <p className="text-xs font-semibold mt-1">Dr./Mr./Ms. {careerForm.name}, thank you for your submission. Our recruitment team will review your profile and contact you back at {careerForm.email} shortly.</p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={(e) => { e.preventDefault(); if (careerForm.name && careerForm.email) setCareerSubmitted(true); }} className="flex flex-col gap-3.5 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-400 font-extrabold uppercase">Full Name</label>
                            <input
                              type="text"
                              required
                              value={careerForm.name}
                              onChange={(e) => setCareerForm({...careerForm, name: e.target.value})}
                              placeholder="Enter your name"
                              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-gray-300"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-400 font-extrabold uppercase">Email Address</label>
                            <input
                              type="email"
                              required
                              value={careerForm.email}
                              onChange={(e) => setCareerForm({...careerForm, email: e.target.value})}
                              placeholder="Enter your email"
                              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-gray-300"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-gray-400 font-extrabold uppercase">Role of Interest</label>
                          <select
                            value={careerForm.role}
                            onChange={(e) => setCareerForm({...careerForm, role: e.target.value})}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
                          >
                            {jobs.map((j, i) => <option key={i}>{j.title}</option>)}
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-gray-400 font-extrabold uppercase">Cover Message / Experience Brief</label>
                          <textarea
                            rows="3"
                            value={careerForm.message}
                            onChange={(e) => setCareerForm({...careerForm, message: e.target.value})}
                            placeholder="Introduce yourself or drop experience brief..."
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-gray-300"
                          />
                        </div>

                        <button type="submit" className="bg-brand-red hover:bg-brand-red-hover text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5">
                          <FiSend />
                          <span>Submit Application</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Blog & Knowledge Portal */}
              {activeTab === 'blog' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest font-outfit">Knowledge base</span>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-outfit mt-1">Orikam Knowledge Portal & Blog</h1>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    Access expert dental insights, product usage guides, and the latest clinical technology research published by Orikam clinical specialists.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                    {articles.map((art, idx) => (
                      <div key={idx} className="border border-gray-100/80 rounded-xl p-5 flex flex-col justify-between hover:shadow-2xs transition-shadow bg-gray-50/20">
                        <div className="text-left">
                          <div className="flex items-center justify-between text-[9px] text-gray-400 font-bold mb-2 uppercase tracking-wide">
                            <span>{art.date}</span>
                            <span>{art.readTime}</span>
                          </div>
                          <h3 className="text-sm font-bold text-gray-800 leading-snug font-outfit mb-2 hover:text-brand-red transition-colors cursor-pointer">{art.title}</h3>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">{art.summary}</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                          <span className="text-[9px] text-gray-400 font-bold">By: {art.author}</span>
                          <span className="text-[10px] text-brand-red font-bold hover:underline cursor-pointer">Read Full →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Contact Us */}
              {activeTab === 'contact' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest font-outfit">Get in Touch</span>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-outfit mt-1">Contact Orikam Healthcare</h1>
                  </div>

                  {/* Registered office cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                      <div className="text-brand-red mb-1.5"><FiMapPin size={18} /></div>
                      <h4 className="text-xs font-bold text-gray-900 font-outfit uppercase">Gurgaon Head Office</h4>
                      <p className="text-[10px] text-gray-500 mt-1 font-semibold leading-relaxed">
                        Orikam Healthcare India Pvt. Ltd. #9753, 3rd Floor, Arogyam Building, Subhash Nagar, New Railway Road, Gurgaon – 122001, Haryana, India
                      </p>
                    </div>

                    <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                      <div className="text-brand-red mb-1.5"><FiMapPin size={18} /></div>
                      <h4 className="text-xs font-bold text-gray-900 font-outfit uppercase">Mumbai Branch</h4>
                      <p className="text-[10px] text-gray-500 mt-1 font-semibold leading-relaxed">
                        OHI Marketing, 4143, 2nd Floor, Rustomjee Eaze Zone Mall, Sunder Nagar, Malad West, Mumbai – 400064, Maharashtra, India
                      </p>
                    </div>

                    <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                      <div className="text-brand-red mb-1.5"><FiMapPin size={18} /></div>
                      <h4 className="text-xs font-bold text-gray-900 font-outfit uppercase">Bengaluru Branch</h4>
                      <p className="text-[10px] text-gray-500 mt-1 font-semibold leading-relaxed">
                        No 319/53, 3rd Block, 59th Cross, Vatal Nagaraj Road, Near Ram Mandir Ground, Rajajinagar, Bengaluru – 560010, Karnataka, India
                      </p>
                    </div>
                  </div>

                  {/* Details strip */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b border-gray-100 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-brand-red flex items-center justify-center shrink-0">
                        <FiPhone size={16} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-[10px] text-gray-400 font-extrabold uppercase leading-none">Call Support</h4>
                        <span className="text-sm font-extrabold text-gray-800 font-outfit block mt-1">+91 124 436 1189</span>
                        <span className="text-[10px] text-gray-400 font-semibold block">+91 95603 94007</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-brand-red flex items-center justify-center shrink-0">
                        <FiMail size={16} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-[10px] text-gray-400 font-extrabold uppercase leading-none">Email Address</h4>
                        <span className="text-sm font-extrabold text-gray-800 font-outfit block mt-1">info@orikam.in</span>
                        <span className="text-[10px] text-gray-400 font-semibold block">support@orikam.in</span>
                      </div>
                    </div>
                  </div>

                  {/* Inquiry form */}
                  <div className="border border-gray-100 p-6 rounded-xl bg-gray-50/50 mt-2">
                    <h3 className="text-base font-bold text-gray-800 font-outfit mb-1">Submit an Inquiry</h3>
                    <p className="text-xs text-gray-400 mb-4 font-semibold">Need custom pricing, bulk orders, or product demos? Contact us.</p>
                    
                    {contactSubmitted ? (
                      <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl flex items-start gap-2.5 border border-emerald-100">
                        <FiCheckCircle className="text-lg shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold">Inquiry Sent!</h4>
                          <p className="text-xs font-semibold mt-1">Thank you {contactForm.name}. Your inquiry regarding "{contactForm.subject}" has been submitted. Our sales desk will call you at {contactForm.phone || 'your registered number'} within 12 hours.</p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={(e) => { e.preventDefault(); if (contactForm.name && contactForm.email) setContactSubmitted(true); }} className="flex flex-col gap-3.5 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-400 font-extrabold uppercase">Your Name</label>
                            <input
                              type="text"
                              required
                              value={contactForm.name}
                              onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                              placeholder="Enter your name"
                              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-gray-300"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-400 font-extrabold uppercase">Email Address</label>
                            <input
                              type="email"
                              required
                              value={contactForm.email}
                              onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                              placeholder="Enter your email"
                              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-gray-300"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-400 font-extrabold uppercase">Phone Number</label>
                            <input
                              type="tel"
                              value={contactForm.phone}
                              onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                              placeholder="Enter phone number"
                              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-gray-300"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-gray-400 font-extrabold uppercase">Inquiry Subject</label>
                          <select
                            value={contactForm.subject}
                            onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
                          >
                            <option>Product Demonstration</option>
                            <option>Bulk Order Discount</option>
                            <option>Technical Service/Warranty</option>
                            <option>Distribution Partnerships</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-gray-400 font-extrabold uppercase">Message / Requirement Details</label>
                          <textarea
                            rows="4"
                            required
                            value={contactForm.message}
                            onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                            placeholder="List clinical products you want demos for or details..."
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-gray-300"
                          />
                        </div>

                        <button type="submit" className="bg-brand-red hover:bg-brand-red-hover text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5">
                          <FiSend />
                          <span>Send Message</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Help Center */}
              {activeTab === 'help' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest font-outfit">FAQ Dashboard</span>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-outfit mt-1">Help Center & FAQs</h1>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    Find quick answers to common support queries about Orikam healthcare orders, warranty policies, and technical dental equipment installation.
                  </p>

                  <div className="flex flex-col gap-3 mt-2">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border border-gray-100 rounded-xl overflow-hidden shadow-2xs">
                        <button
                          onClick={() => toggleFaq(index)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50/50 text-left font-bold text-xs md:text-sm text-gray-800 cursor-pointer focus:outline-none hover:bg-gray-50"
                        >
                          <span className="font-outfit pr-4">{faq.q}</span>
                          <span className="text-gray-400 shrink-0">
                            {openFaq === index ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                          </span>
                        </button>
                        
                        <AnimatePresence initial={false}>
                          {openFaq === index && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden bg-white"
                            >
                              <div className="p-4 border-t border-gray-100 text-xs md:text-sm text-gray-600 leading-relaxed font-medium">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>

                  {/* Service App Callout */}
                  <div className="bg-[#1b73e8] text-white p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
                    <div className="text-left">
                      <h4 className="text-base font-extrabold font-outfit">Download Orikam Service App</h4>
                      <p className="text-xs text-white/95 mt-1 font-semibold max-w-lg">Get direct support tickets, track sensor warranty logs, and request priority support at your clinical doorstep.</p>
                    </div>
                    <button className="bg-white hover:bg-gray-100 text-[#1b73e8] text-xs font-bold px-4 py-2 rounded-lg transition-colors shrink-0 cursor-pointer">
                      Download Now
                    </button>
                  </div>
                </div>
              )}

              {/* Tab: Shipping & Delivery */}
              {activeTab === 'shipping' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest font-outfit">Logistics Policy</span>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-outfit mt-1">Shipping & Delivery</h1>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    We ensure all clinical consumables and lab devices are safely packaged, sterilized, and delivered to your clinic destination with robust tracking records.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                      <div className="text-brand-red mb-1.5"><FiTruck size={18} /></div>
                      <h4 className="text-xs font-bold text-gray-900 font-outfit uppercase">Free B2B Shipping</h4>
                      <p className="text-[10px] text-gray-500 mt-1 font-semibold leading-relaxed">
                        We offer complimentary shipping across India for all clinical orders with a cart subtotal exceeding ₹5,000.
                      </p>
                    </div>

                    <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                      <div className="text-brand-red mb-1.5"><FiMapPin size={18} /></div>
                      <h4 className="text-xs font-bold text-gray-900 font-outfit uppercase">Flat Logistics Fees</h4>
                      <p className="text-[10px] text-gray-500 mt-1 font-semibold leading-relaxed">
                        Orders below ₹5,000 incur a nominal flat shipping fee of ₹250. This fee covers clinical grade packaging materials.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 text-left">
                    <h3 className="text-base font-bold text-gray-800 font-outfit">Dispatch & Delivery Timelines</h3>
                    <ul className="list-disc pl-5 text-xs md:text-sm text-gray-600 font-medium flex flex-col gap-2.5 leading-relaxed">
                      <li><strong>Dispatch Window:</strong> All orders are verified and dispatched within 24 hours from our centralized Haryana warehouse.</li>
                      <li><strong>Metros (Delhi-NCR, Mumbai, Bengaluru, Chennai):</strong> Expect delivery within 2 to 3 business days.</li>
                      <li><strong>Tier 2 & Tier 3 Cities:</strong> Delivery takes 4 to 5 business days.</li>
                      <li><strong>Tracking:</strong> Digital tracking links from BlueDart, DHL, or Delhivery will be sent via SMS and Email.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab: Returns & Refunds */}
              {activeTab === 'returns' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest font-outfit">Exchange Policy</span>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-outfit mt-1">Returns & Exchange Policy</h1>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    At Orikam, we seek absolute customer satisfaction. We provide a transparent returns policy for our B2B dental products.
                  </p>

                  <div className="flex flex-col gap-4 text-left">
                    <h3 className="text-base font-bold text-gray-800 font-outfit">7-Day Window</h3>
                    <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
                      All products (excluding sterile consumables) are eligible for return or exchange within 7 days from the date of physical delivery, provided they are in unused condition and in original packaging.
                    </p>
                  </div>

                  <div className="bg-red-50 text-brand-red p-5 rounded-xl border border-red-100 flex items-start gap-3">
                    <FiRotateCcw className="text-lg shrink-0 mt-0.5" />
                    <div className="text-left leading-normal">
                      <h4 className="text-xs font-extrabold uppercase font-outfit">Consumables Warning (Important)</h4>
                      <p className="text-[11px] font-bold mt-1 leading-relaxed">
                        To maintain clinical hygiene standards, dental consumables (such as rotary files, endodontic materials, composites, impression silicones, and cements) whose primary safety seals or boxes have been unsealed/opened are strictly EXCLUDED from returns and refunds.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 text-left">
                    <h3 className="text-base font-bold text-gray-800 font-outfit">Refund Processing</h3>
                    <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
                      Upon receipt and validation of the returned package at our Haryana warehouse, refunds are initiated back to the original source payment method (Visa, Mastercard, UPI, or Corporate Bank Account) within 5 to 7 business days.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab: Terms & Conditions */}
              {activeTab === 'terms' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest font-outfit">Legal Terms</span>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-outfit mt-1">Terms & Conditions</h1>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    This document governs the B2B purchase of dental clinical devices and supplies from Orikam Healthcare India Pvt. Ltd.
                  </p>

                  <div className="flex flex-col gap-4 text-left">
                    <h4 className="text-sm font-bold text-gray-800 font-outfit uppercase tracking-wider">1. Clinical B2B Eligibility</h4>
                    <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
                      Purchasing products from Orikam is restricted to certified clinical professionals, dental practitioners, dental labs, and dental healthcare institutions. Users must provide valid clinical registration details or GSTIN if requested.
                    </p>

                    <h4 className="text-sm font-bold text-gray-800 font-outfit uppercase tracking-wider">2. Product Compliance</h4>
                    <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
                      All diagnostic, imaging, and chemical consumables comply with the standards set by the Drugs and Cosmetics Act of India. Product warranties are void if installation or usage is not performed in accordance with clinical safety manuals.
                    </p>

                    <h4 className="text-sm font-bold text-gray-800 font-outfit uppercase tracking-wider">3. Taxation & Invoicing</h4>
                    <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
                      All item prices listed on the e-commerce store are exclusive of 18% GST. Appropriate B2B GST tax invoices will be issued at the checkout stage, enabling clinicians to claim input tax credits.
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
