
import React from 'react';

const LinkedInScraperDocs = () => {
  const tableContainerClass = 'overflow-x-auto mb-6';
  const tableClass =
    'min-w-full table-fixed border-collapse border border-gray-400';
  const thClass =
    'bg-gray-100 text-left font-semibold text-gray-800 px-4 py-2 border border-gray-400';
  const tdClass =
    'text-gray-700 px-4 py-2 border border-gray-400 align-top';

    const renderTable = (rows) => (
        <div className="overflow-x-auto mb-6">
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #ccc',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <th
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    fontWeight: '600',
                    textAlign: 'left',
                    minWidth: '120px',
                  }}
                >
                  Field
                </th>
                <th
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    fontWeight: '600',
                    textAlign: 'left',
                  }}
                >
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([field, description], index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      fontWeight: '500',
                      verticalAlign: 'top',
                    }}
                  >
                    {field}
                  </td>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      verticalAlign: 'top',
                    }}
                  >
                    {description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
          <span>🛠</span> LinkedIn Scraper Configuration Guide
        </h1>

        <section>
          <h2 className="text-2xl font-semibold text-green-700 mb-2">🟢 Required Fields</h2>
          <p className="mb-4 text-gray-700">These fields are <strong>mandatory</strong> for every job.</p>
          {renderTable([
            ['Access Token', 'The authentication token used to access the LinkedIn API via RapidAPI.'],
            ['Username', 'The unique identifier of the LinkedIn person or organization.'],
            ['Type', 'Entity type: choose between "Person" or "Company".'],
          ])}
          <p className="text-sm text-gray-600 mb-2">Example URLs:</p>
          <ul className="list-disc list-inside text-sm text-gray-700 ml-4 mb-6">
            <li><code>https://www.linkedin.com/in/<strong>anishsb</strong>/</code></li>
            <li><code>https://www.linkedin.com/company/<strong>kiwiq-ai</strong>/</code></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">🔧 Task Assignment</h2>
          {renderTable([
            ['Profile Info', 'Extracts profile information only.'],
            ['Post Scrap', 'Scrapes the posts created by the user.'],
            ['Activity Comments', 'Scrapes posts that the user has commented on.'],
            ['Activity Reactions', 'Scrapes posts that the user has reacted to.'],
          ])}
          <p className="text-sm text-gray-500 italic mb-6">
            Note: Profile Info does not involve any posts. Other tasks require post configuration.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-700 mb-2">⚙️ Post Configuration</h2>
          {renderTable([
            ['Post Comments', 'Scrapes the commenters from each post.'],
            ['Post Reactions', 'Scrapes the reactors from each post.'],
            ['Media Flag', 'If "Yes", saves raw binary media, otherwise saves media URLs.'],
          ])}
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-cyan-700 mb-2">🔁 Other Options</h2>
          {renderTable([
            ['Caching', 'If "Yes", fetches from DB if the same username & task exist.'],
          ])}
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-pink-700 mb-2">📊 Limits</h2>
          {renderTable([
            ['Post Limit', 'Max posts to scrape.'],
            ['Comment Limit', 'Max commenters per post.'],
            ['Reaction Limit', 'Max reactors per post.'],
          ])}
        </section>

        <div className="text-sm text-gray-500 italic mt-8 border-t pt-4">
          Sample JSON configuration and code examples coming soon...
        </div>
      </div>
    </div>
  );
};

export default LinkedInScraperDocs;
