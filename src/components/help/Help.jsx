import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, HelpCircleIcon, DownloadIcon } from 'lucide-react';
import './Help.css'; 

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <button
        className="faq-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="faq-question">{question}</h3>
        <div className={`faq-icon ${isOpen ? 'open' : ''}`}>
          {isOpen ? (
            <ChevronUpIcon className="icon" />
          ) : (
            <ChevronDownIcon className="icon" />
          )}
        </div>
      </button>
      <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
};

const faqData = [
  {
    question: "What is Ticket-Mitra?",
    answer: "Ticket-Mitra is a comprehensive ticket management system designed to streamline support operations. It helps businesses efficiently track and manage support tickets, assign engineers, and handle related tasks with ease."
  },
  {
    question: "How do I create a new ticket?",
    answer: "To create a new ticket, navigate to the 'Engineers' page from your dashboard. There you will see an option to Add Tickets. Fill in the required details such as the issue description, priority, and any relevant attachments. Once you've entered all the necessary information, submit the form to create your ticket."
  },
  {
    question: "How can I view assigned tickets?",
    answer: "To view assigned tickets, go to the 'Reports' page. Here, you'll find a list of all tickets assigned. You can easily filter and sort these tickets based on various criteria such as priority, status, or date to manage your workload effectively."
  },
  {
    question: "Can I update a ticket?",
    answer: "Yes, you can update a ticket at any time. Simply go to the 'Update Ticket' on the 'Engineers' page and select the ticket you wish to modify. Make the necessary changes to the ticket details, add comments, or update the status. Once you've made your changes, submit the form to update the ticket."
  },
  {
    question: "How do I prioritize tickets?",
    answer: "Ticket prioritization is based on urgency and impact. When creating or updating a ticket, you can set its priority level. High-priority tickets are typically those that affect critical business operations or a large number of users. Always consider the ticket's impact on business continuity when setting priorities."
  },
  {
    question: "Can I attach pictures to a ticket?",
    answer: "Yes, you can attach pictures to tickets. When updating a ticket, look for the file attachment option. This feature allows you to upload screenshots and images that can help in resolving the issue more efficiently."
  },
  {
    question: "How do I contact customer support?",
    answer: "You can contact customer support by emailing us at support@ticket-mitra.com. Our support team is available to assist you with any issues or questions you may have. We strive to respond to all inquiries within 24 hours."
  },
  {
    question: "Is there a mobile app available?",
    answer: "Currently, Ticket-Mitra does not have a dedicated mobile app. However, our website is fully responsive and can be accessed on mobile devices for managing tickets and support tasks on the go."
  },
  {
    question: "How do I set the priority of a ticket?",
    answer: "When creating or updating a ticket, you can set its priority level to low, medium, or high. The priority should reflect the urgency and impact of the issue on the client's operations. High-priority tickets are addressed first, followed by medium and low-priority tickets."
  },
  {
    question: "What happens if an engineer is not available?",
    answer: "If an engineer is not available, the ticket can be reassigned to another engineer based on availability and expertise."
  },
  {
    question: "How to add new locations?",
    answer: "To add a location, you can go to the 'Locations' option on the nav-bar. On the locations page, there will be options to add a location. Fill up the necessary details, and the location gets added. You can also update the location."
  },
  {
    question: "Can I download a CSV file of tickets assigned to a particular Engineer?",
    answer: "Yes! In the Reports section, you can see the filters are available. Based on the filtered data, you can download the CSV file by simply clicking the download button."
  },
  {
    question: "What is Ticket Support?",
    answer: "Ticket Support is basically a page where any additional issues in existing tickets are raised by engineers."
  }
];

export default function Help() {
  return (
    <div className="help-page">
      <header className="header">
        <div className="icon-container">
          <HelpCircleIcon className="header-icon" />
        </div>
        <h1 className="title">Help & Support</h1>
        <p className="subtitle">Find answers to your questions</p>
      </header>

      <h2 className="faq-title">Frequently Asked Questions</h2>
      <a 
          href="/NXT%20Gen%20ticketing%20software%20guide.pdf" 
          className="download-button" 
          download
          title="Download guide" 
        >
          <DownloadIcon className="icon" />
        </a>
      <div className="faq-list">
        {faqData.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      <footer className="footer">
        <p>Still need help? We're here for you!</p>
        <p>support@ticket-mitra.com</p>
      </footer>
    </div>
  );
}
