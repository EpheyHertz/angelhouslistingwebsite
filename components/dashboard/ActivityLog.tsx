"use client"
import { useState } from 'react'

// Mock data for activity log
const mockActivityLog = [
  { id: 1, user: 'John Doe', action: 'Added new listing', timestamp: '2023-06-15T10:30:00Z' },
  { id: 2, user: 'Admin', action: 'Approved listing #1234', timestamp: '2023-06-15T11:45:00Z' },
  { id: 3, user: 'Jane Smith', action: 'Updated profile', timestamp: '2023-06-15T13:15:00Z' },
  { id: 4, user: 'Admin', action: 'Banned user #5678', timestamp: '2023-06-15T14:30:00Z' },
  { id: 5, user: 'Mike Johnson', action: 'Commented on listing #2345', timestamp: '2023-06-15T16:00:00Z' },
]

export default function ActivityLog() {
  const [activityLog, setActivityLog] = useState(mockActivityLog)

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {activityLog.map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activityLog.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center ring-8 ring-white dark:ring-gray-900">
                    <span className="text-white text-sm">{activity.user.charAt(0)}</span>
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      <span className="font-medium text-gray-900 dark:text-white">{activity.user}</span> {activity.action}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-300">
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

