import React, { useState } from 'react';
import { 
  HelpCircle, 
  Book, 
  FileText, 
  Video, 
  Search 
} from 'lucide-react';

const HelpDocumentation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: [
        'Welcome to the Admin Dashboard Help Center',
        'This guide will help you navigate and utilize all features of our platform effectively.',
        'If you\'re a new admin, start here to understand the basic functionalities and layout of the dashboard.'
      ]
    },
    {
      id: 'user-management',
      title: 'User Management',
      content: [
        'Learn how to manage user accounts, permissions, and roles.',
        'Create, edit, and delete user profiles',
        'Set access levels and control system permissions'
      ]
    },
    {
      id: 'reporting',
      title: 'Reporting Tools',
      content: [
        'Understand how to generate and customize reports',
        'Export data in multiple formats (PDF, CSV, Excel)',
        'Create custom dashboards and data visualizations'
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      content: [
        'Common issues and their solutions',
        'Troubleshoot login problems',
        'Resolve data sync and permission errors',
        'Contact support if issues persist'
      ]
    }
  ];

  const filteredSections = sections.filter(section => 
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.some(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4 border-r">
        <div className="mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <HelpCircle className="mr-2" /> Help Center
          </h2>
        </div>

        {/* Search Input */}
        <div className="mb-4 relative">
          <input 
            type="text" 
            placeholder="Search documentation"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-8 border rounded-md"
          />
          <Search className="absolute left-2 top-3 text-gray-400" size={18} />
        </div>

        {/* Navigation Menu */}
        <nav>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                w-full text-left p-2 mb-2 rounded 
                flex items-center
                ${activeSection === section.id 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100'}
              `}
            >
              {section.id === 'getting-started' && <Book className="mr-2" />}
              {section.id === 'user-management' && <FileText className="mr-2" />}
              {section.id === 'reporting' && <Video className="mr-2" />}
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          {filteredSections.length > 0 ? (
            filteredSections
              .filter(section => section.id === activeSection)
              .map(section => (
                <div key={section.id}>
                  <h1 className="text-2xl font-bold mb-4">{section.title}</h1>
                  {section.content.map((paragraph, index) => (
                    <p key={index} className="mb-3 text-gray-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))
          ) : (
            <div className="text-center text-gray-500">
              No results found. Try a different search term.
            </div>
          )}

          {/* Contact Support */}
          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 className="font-semibold mb-2">Need More Help?</h3>
            <p className="text-sm text-gray-700 mb-3">
              If you can't find the information you need, contact our support team.
            </p>
            <div className="flex space-x-4">
              <a 
                href="mailto:support@example.com" 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Email Support
              </a>
              <a 
                href="tel:+1234567890" 
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Call Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpDocumentation;