import React from "react";

// Define the contact item type
interface ContactItem {
  icon: string;
  name: string;
  contact: string;
}

interface ContactTickerProps {
  contacts: ContactItem[];
}

const ContactTicker: React.FC<ContactTickerProps> = ({ contacts }) => {
  // Create a looped version of contacts for continuous scrolling
  const loopedContacts = [...contacts, ...contacts, ...contacts, ...contacts];

  return (
    <div className="flex w-full overflow-x-hidden bg-blue-900 p-2 text-white">
      <div className="flex gap-4">
        <div className="scroll-left flex w-max gap-4">
          {loopedContacts.map((contact, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <img
                src={contact.icon}
                alt={contact.name}
                className="fill-white"
              />
              <p className="text-sm">
                {contact.name}: {contact.contact}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactTicker;
