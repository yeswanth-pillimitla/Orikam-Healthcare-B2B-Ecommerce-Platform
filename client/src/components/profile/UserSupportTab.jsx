import React, { useState } from 'react';
import { FiHelpCircle, FiSend, FiMessageSquare, FiFileText, FiChevronDown, FiChevronUp, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserSupportTab() {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketPriority, setTicketPriority] = useState('Medium');
  const [showTicketSuccess, setShowTicketSuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // Live Chat Simulator states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello Dr. Olivia Rhye! Thank you for contacting Orikam HelpDesk. A clinical specialist will join this channel shortly.' },
    { sender: 'bot', text: 'Please specify your Order ID or describe the medical equipment issue you are facing.' }
  ]);

  const faqs = [
    {
      q: "What is Orikam Healthcare's returns policy?",
      a: "We offer a 7-day hassle-free return policy on most unopened, original dental and surgical consumables. High-value equipment like dental chairs have custom warranty periods."
    },
    {
      q: "How do I qualify for Free Delivery?",
      a: "Clinical orders totaling ₹5,000 or more qualify for 100% Free Shipping nationwide. For smaller orders, a flat ₹250 shipping charge is appended at checkout."
    },
    {
      q: "How do I request GST Tax Invoice claims?",
      a: "Enter your clinic's valid GSTIN under the My Profile tab. Once saved, all checkout transactions will automatically generate tax invoices containing your business name and GST registration details."
    }
  ];

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    // Simulate save
    setShowTicketSuccess(true);
    setTicketSubject('');
    setTicketMessage('');
    setTimeout(() => setShowTicketSuccess(false), 3000);
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Trigger mock responder delay
    setTimeout(() => {
      const botMsg = { sender: 'bot', text: 'Thank you for providing the details. Our medical support representative has been notified and will reply in 2 minutes.' };
      setChatMessages(prev => [...prev, botMsg]);
    }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start text-left w-full relative">
      
      {/* Left Column: FAQ & Raise Ticket */}
      <div className="w-full lg:w-2/3 flex flex-col gap-5">
        
        {/* FAQs */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-2xs">
          <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-1.5 font-outfit">
            <FiHelpCircle className="text-brand-red animate-pulse" size={13} />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="flex flex-col gap-2">
            {faqs.map((faq, idx) => {
              const isSelected = activeFaq === idx;
              return (
                <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(isSelected ? null : idx)}
                    className="w-full flex items-center justify-between p-3 text-xs font-bold text-gray-700 bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isSelected ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-3 text-[11px] text-gray-500 font-medium leading-relaxed bg-white border-t border-gray-50"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Raise Ticket Form */}
        <form onSubmit={handleTicketSubmit} className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-2xs">
          <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-1.5 font-outfit">
            <FiFileText className="text-brand-red" size={13} />
            <span>Raise Customer Ticket</span>
          </h3>

          <div className="flex flex-col gap-3 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Subject Title</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Shipment Delay on Autoclave"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Priority Level</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:bg-white cursor-pointer"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Ticket Message Details</label>
              <textarea
                rows={3}
                required
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Explain the technical parameter errors or delivery issues..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="submit"
              className="bg-brand-red hover:bg-brand-red-hover text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer font-outfit"
            >
              Submit Ticket
            </button>

            {showTicketSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded"
              >
                <FiCheckCircle size={12} />
                <span>Ticket Raised (ID: TKT-8942)</span>
              </motion.div>
            )}
          </div>
        </form>

      </div>

      {/* Right Column: Live Chat simulator link & Panel */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        
        {/* Slide toggle banner */}
        <div className="bg-gray-900 text-white rounded-xl p-4 shadow-sm text-left flex flex-col justify-between min-h-[160px]">
          <div>
            <h4 className="text-xs font-extrabold font-outfit uppercase tracking-wider text-amber-400">Orikam Live Support</h4>
            <p className="text-[10px] text-gray-300 font-medium leading-relaxed mt-1">Chat in real-time with our technical dentists and customer care experts.</p>
          </div>
          <button
            onClick={() => setChatOpen(true)}
            className="w-full mt-4 bg-white hover:bg-gray-100 text-gray-900 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
          >
            <FiMessageSquare size={12} />
            <span>Launch Live Chat</span>
          </button>
        </div>

        {/* Live Chat overlay panel */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="fixed bottom-4 right-4 z-50 w-80 h-96 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden flex flex-col justify-between"
            >
              {/* Chat Header */}
              <div className="bg-gray-900 text-white p-3 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-xs font-bold font-outfit">Orikam HelpDesk Live</span>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-gray-400 hover:text-white cursor-pointer font-black text-sm"
                >
                  ×
                </button>
              </div>

              {/* Chat Messages listing */}
              <div className="flex-1 p-3 overflow-y-auto bg-gray-50 flex flex-col gap-2.5">
                {chatMessages.map((msg, idx) => {
                  const isBot = msg.sender === 'bot';
                  return (
                    <div
                      key={idx}
                      className={`max-w-[80%] rounded-lg p-2 text-[10.5px] leading-relaxed font-medium ${
                        isBot 
                          ? 'bg-white border border-gray-100 text-gray-700 self-start text-left' 
                          : 'bg-brand-red text-white self-end text-left shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  );
                })}
              </div>

              {/* Chat input box */}
              <form onSubmit={handleSendChatMessage} className="p-2 border-t border-gray-100 flex gap-1.5 bg-white items-center shrink-0">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type support request..."
                  className="flex-1 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-full bg-brand-red hover:bg-brand-red-hover text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <FiSend size={11} />
                </button>
              </form>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
