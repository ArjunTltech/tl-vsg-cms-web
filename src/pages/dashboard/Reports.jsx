function Reports() {
    const reports = [
      { name: 'Monthly Sales Report', date: '2024-01-31', status: 'Completed' },
      { name: 'User Activity Log', date: '2024-01-30', status: 'Pending' },
      { name: 'Inventory Status', date: '2024-01-29', status: 'Processing' },
      { name: 'Revenue Analysis', date: '2024-01-28', status: 'Completed' },
    ];
  
    return (
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-6">Reports</h1>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Available Reports</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Generate New Report
              </button>
            </div>
  
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reports.map((report, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{report.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{report.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${report.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Download</button>
                        <button className="text-gray-600 hover:text-gray-900">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Reports;