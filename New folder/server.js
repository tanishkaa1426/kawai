import express from 'express'
import cors from 'cors'

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

const dashboard = {
  greeting: 'Good evening, Tanishka 🌙',
  overview: {
    studyTimeToday: '3h 45m',
    pomodorosCompleted: 8,
    tasksCompleted: 4,
    currentStreak: 12,
    upcomingClass: 'DSA Lab · 4:00 PM',
    nextReminder: 'Project checkpoint · 7:30 PM',
    dailyGoal: 72,
  },
  quickActions: ['Start Focus', 'Add Task', 'Add Reminder', 'Open Timetable', 'Ask Assistant', 'Play Focus Music'],
  tasks: [
    { id: 1, title: 'Complete DSA arrays revision', subject: 'DSA', priority: 'High', done: false, time: '45 min' },
    { id: 2, title: 'Finish math assignment draft', subject: 'Assignments', priority: 'Medium', done: true, time: '1h' },
    { id: 3, title: 'Practice UI prototype polishing', subject: 'Projects', priority: 'High', done: false, time: '30 min' },
    { id: 4, title: 'Revise chemistry chapter', subject: 'Exams', priority: 'Low', done: false, time: '25 min' },
  ],
  timetable: [
    { day: 'Mon', subject: 'DSA', time: '9:00 AM', room: 'A-204' },
    { day: 'Tue', subject: 'Algorithms', time: '11:00 AM', room: 'B-101' },
    { day: 'Wed', subject: 'UI Design', time: '1:30 PM', room: 'Lab 3' },
    { day: 'Thu', subject: 'Physics', time: '10:30 AM', room: 'C-112' },
  ],
  goals: [
    { title: 'Study 3h/day', progress: 72, color: 'rose' },
    { title: 'Solve 50 DSA problems', progress: 66, color: 'lavender' },
    { title: 'Finish project by Friday', progress: 48, color: 'mint' },
  ],
  habits: [
    { name: 'Study', done: true },
    { name: 'Reading', done: true },
    { name: 'Exercise', done: false },
    { name: 'Water', done: true },
    { name: 'Sleep', done: false },
    { name: 'Revision', done: true },
    { name: 'Coding', done: true },
  ],
  analytics: [
    { label: 'Mon', value: 56 },
    { label: 'Tue', value: 72 },
    { label: 'Wed', value: 65 },
    { label: 'Thu', value: 82 },
    { label: 'Fri', value: 90 },
    { label: 'Sat', value: 74 },
    { label: 'Sun', value: 68 },
  ],
  notes: [
    { id: 1, title: 'DSA quick recap', tag: 'MCQ', pinned: true },
    { id: 2, title: 'Research paper outline', tag: 'Project', pinned: false },
    { id: 3, title: 'Biology formula sheet', tag: 'Exam', pinned: true },
  ],
  countdowns: [
    { title: 'DSA Midterm', days: 12, accent: 'rose' },
    { title: 'Project Submission', days: 4, accent: 'sky' },
    { title: 'Semester Exams', days: 37, accent: 'lavender' },
  ],
  music: [
    { name: 'Lo-fi', level: 72 },
    { name: 'Rain', level: 58 },
    { name: 'Piano', level: 68 },
  ],
  assistant: {
    suggestion: 'You usually focus best in the evening. Want to schedule your next session for 7:30 PM?',
    tips: [
      'Break large goals into 25-minute blocks',
      'Keep your night session for problem solving',
      'Take a 2-minute stretch after every focus round',
    ],
  },
}

app.get('/api/dashboard', (_req, res) => {
  res.json(dashboard)
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Study app backend ready' })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
