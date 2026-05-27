import { useEffect, useState } from 'react'

export default function HobbyLifeTracker() {
  const schedule = [
    {
      day: 'Monday',
      tasks: [
        {
          time: '7:30 AM – 8:30 AM',
          name: 'Morning Routine',
        },
        {
          time: '9:00 AM – 10:00 AM',
          name: 'Home Workout',
        },
        {
          time: '10:30 AM – 1:30 PM',
          name: 'Freelancing',
        },
        {
          time: '4:00 PM – 9:00 PM',
          name: 'Office',
        },
      ],
    },

    {
      day: 'Tuesday',
      tasks: [
        {
          time: '8:00 AM – 9:00 AM',
          name: 'Morning Routine',
        },
        {
          time: '10:00 AM – 12:00 PM',
          name: 'Guitar Lessons',
        },
        {
          time: '12:30 PM – 2:30 PM',
          name: 'Freelancing',
        },
        {
          time: '4:00 PM – 9:00 PM',
          name: 'Office',
        },
      ],
    },

    {
      day: 'Wednesday',
      tasks: [
        {
          time: '8:00 AM – 9:00 AM',
          name: 'Morning Routine',
        },
        {
          time: '9:30 AM – 11:00 AM',
          name: 'Dance Lessons',
        },
        {
          time: '11:30 AM – 2:00 PM',
          name: 'Freelancing',
        },
        {
          time: '4:00 PM – 9:00 PM',
          name: 'Office',
        },
      ],
    },

    {
      day: 'Thursday',
      tasks: [
        {
          time: '8:00 AM – 9:00 AM',
          name: 'Morning Routine',
        },
        {
          time: '10:00 AM – 12:00 PM',
          name: 'Roller Skating',
        },
        {
          time: '12:30 PM – 2:30 PM',
          name: 'Light Freelancing',
        },
        {
          time: '4:00 PM – 9:00 PM',
          name: 'Office',
        },
      ],
    },

    {
      day: 'Friday',
      tasks: [
        {
          time: '8:00 AM – 9:00 AM',
          name: 'Home Workout',
        },
        {
          time: '10:00 AM – 1:00 PM',
          name: 'Deep Freelance Work',
        },
        {
          time: '3:00 PM – 7:00 PM',
          name: 'Office',
        },
        {
          time: '8:00 PM',
          name: 'Rest Night',
        },
      ],
    },

    {
      day: 'Saturday',
      tasks: [
        {
          time: '10:00 AM – 3:00 PM',
          name: 'Office',
        },
        {
          time: '5:00 PM – 6:00 PM',
          name: 'Practice Session',
        },
        {
          time: '8:00 PM',
          name: 'Relax',
        },
      ],
    },

    {
      day: 'Sunday',
      tasks: [
        {
          time: 'Morning',
          name: 'Rest',
        },
        {
          time: 'Afternoon',
          name: 'Meal Prep',
        },
        {
          time: 'Evening',
          name: 'Guitar Review',
        },
      ],
    },
  ]

  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem(
      'life-reset-progress'
    )
    return saved ? JSON.parse(saved) : {}
  })
const [currentTime, setCurrentTime] = useState(
  new Date()
)

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date())
  }, 1000)

  return () => clearInterval(timer)
}, [])
useEffect(() => {
  if (!todaySchedule) return

  const checkReminders = () => {
    const now = new Date()

    const currentMinutes =
      now.getHours() * 60 +
      now.getMinutes()

    todaySchedule.tasks.forEach((task) => {
      const timeParts =
        task.time.split('–')

      if (timeParts.length < 2) return

      const startTime =
        parseTime(timeParts[0].trim())

      if (!startTime) return

      const difference =
        startTime - currentMinutes

      if (difference === 15) {
        new Notification(
          `Upcoming Task 🔔`,
          {
            body: `${task.name} starts in 15 minutes`,
          }
        )
      }

      if (difference === 0) {
        new Notification(
          `Time To Start 🚀`,
          {
            body: `${task.name} is starting now`,
          }
        )
      }
    })
  }

  const interval = setInterval(
    checkReminders,
    60000
  )

  return () => clearInterval(interval)
}, [todaySchedule])
  useEffect(() => {
    localStorage.setItem(
      'life-reset-progress',
      JSON.stringify(completedTasks)
    )
  }, [completedTasks])
const today = currentTime.toLocaleDateString(
  'en-US',
  {
    weekday: 'long',
  }
)

const todaySchedule = schedule.find(
  (day) => day.day === today
)
const currentHour = currentTime.getHours()
const currentMinute = currentTime.getMinutes()

const currentTimeInMinutes =
  currentHour * 60 + currentMinute

const parseTime = (timeString) => {
  const match = timeString.match(
    /(\d+):(\d+)\s?(AM|PM)/
  )

  if (!match) return null

  let [_, hour, minute, period] = match

  hour = parseInt(hour)
  minute = parseInt(minute)

  if (period === 'PM' && hour !== 12)
    hour += 12

  if (period === 'AM' && hour === 12)
    hour = 0

  return hour * 60 + minute
}

let activeTask = null
let nextTask = null

if (todaySchedule) {
  for (let i = 0; i < todaySchedule.tasks.length; i++) {
    const task = todaySchedule.tasks[i]

    const timeParts =
      task.time.split('–')

    if (timeParts.length < 2) continue

    const start = parseTime(
      timeParts[0].trim()
    )

    const end = parseTime(
      timeParts[1].trim()
    )

    if (
      start !== null &&
      end !== null
    ) {
      if (
        currentTimeInMinutes >= start &&
        currentTimeInMinutes <= end
      ) {
        activeTask = task
        nextTask =
          todaySchedule.tasks[i + 1]
        break
      }

      if (
        currentTimeInMinutes < start &&
        !nextTask
      ) {
        nextTask = task
      }
    }
  }
}
const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission =
      await Notification.requestPermission()

    if (permission === 'granted') {
      new Notification(
        'Life Reset Tracker 🔥',
        {
          body: 'Notifications enabled successfully!',
        }
      )
    }
  }
}
  const toggleTask = (day, task) => {
    const key = `${day}-${task}`

    setCompletedTasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold">
            Life Reset Tracker
          </h1>

          <p className="text-gray-400 mt-2">
            Track your hobbies, growth,
            workouts, and consistency.
            <button
  onClick={requestNotificationPermission}
  className="mt-4 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-2xl font-semibold transition-all"
>
  Enable Notifications 🔔
</button>
          </p>
        </div>
<div className="bg-zinc-900 rounded-3xl p-5 shadow-2xl mb-6">
  <div className="flex justify-between items-center">
    <div>
      <p className="text-gray-400 text-sm">
        Today
      </p>

      <h2 className="text-2xl font-bold">
        {today}
      </h2>
    </div>

    <div className="text-right">
      <p className="text-gray-400 text-sm">
        Current Time
      </p>

      <h2 className="text-xl font-bold">
        {currentTime.toLocaleTimeString(
          [],
          {
            hour: '2-digit',
            minute: '2-digit',
          }
        )}
      </h2>
    </div>
  </div>
{activeTask && (
  <div className="mt-4 bg-green-500/20 border border-green-500 rounded-2xl p-4">
    <p className="text-sm text-green-300 mb-1">
      Currently Doing
    </p>

    <h3 className="text-xl font-bold">
      {activeTask.name}
    </h3>

    <p className="text-sm text-gray-300">
      {activeTask.time}
    </p>
  </div>
)}
{nextTask && (
  <div className="mt-3 bg-blue-500/20 border border-blue-500 rounded-2xl p-4">
    <p className="text-sm text-blue-300 mb-1">
      Up Next
    </p>

    <h3 className="text-lg font-bold">
      {nextTask.name}
    </h3>

    <p className="text-sm text-gray-300">
      {nextTask.time}
    </p>
  </div>
)}
  {todaySchedule && (
    <div className="mt-4 bg-zinc-800 rounded-2xl p-4">
      <p className="text-sm text-gray-400 mb-2">
        Today's Focus
      </p>

      <div className="space-y-2">
        {todaySchedule.tasks.map(
          (task, index) => (
            <div
              key={index}
              className="flex justify-between text-sm"
            >
              <span>{task.name}</span>

              <span className="text-gray-400">
                {task.time}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  )}
</div>
        <div className="bg-zinc-900 rounded-3xl p-5 shadow-2xl mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Weekly Goal
          </h2>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Overall Progress</span>

                <span>
                  {
                    Object.values(
                      completedTasks
                    ).filter(Boolean).length
                  }
                  /
                  {schedule.reduce(
                    (acc, day) =>
                      acc + day.tasks.length,
                    0
                  )}
                </span>
              </div>

              <div className="w-full bg-zinc-700 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (
                        Object.values(
                          completedTasks
                        ).filter(Boolean)
                          .length /
                        schedule.reduce(
                          (acc, day) =>
                            acc +
                            day.tasks.length,
                          0
                        )
                      ) *
                      100
                    }%`,
                  }}
                ></div>
              </div>

              <p className="text-center mt-2 text-sm text-gray-300">
                {Math.round(
                  (
                    Object.values(
                      completedTasks
                    ).filter(Boolean)
                      .length /
                    schedule.reduce(
                      (acc, day) =>
                        acc + day.tasks.length,
                      0
                    )
                  ) *
                    100
                )}
                % completed
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {schedule.map((item, index) => (
            <div
              key={index}
              className="bg-zinc-900 rounded-3xl p-4 shadow-lg"
            >
              <h3 className="text-lg font-bold mb-3">
                {item.day}
              </h3>

              <div className="space-y-2">
                {item.tasks.map(
                  (taskItem, taskIndex) => (
                    <label
                      key={taskIndex}
                      className="flex items-center gap-3 bg-zinc-800 p-3 rounded-2xl"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5"
                        checked={
                          completedTasks[
                            `${item.day}-${taskItem.name}`
                          ] || false
                        }
                        onChange={() =>
                          toggleTask(
                            item.day,
                            taskItem.name
                          )
                        }
                      />

                      <div>
                        <p className="font-medium">
                          {taskItem.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          {taskItem.time}
                        </p>
                      </div>
                    </label>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-5 text-center shadow-2xl">
          <h2 className="text-xl font-bold">
            Reminder
          </h2>

          <p className="mt-2 text-sm text-gray-100">
            You don't need to master
            everything immediately.
            Consistency first.
            Clarity later.
          </p>
        </div>
      </div>
    </div>
  )
}