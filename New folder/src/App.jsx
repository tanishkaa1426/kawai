import { useEffect, useMemo, useState } from 'react'
import './App.css'

const defaultData = {
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
  quickActions: [
    'Start Focus',
    'Add Task',
    'Add Reminder',
    'Open Timetable',
    'Ask Assistant',
    'Play Focus Music',
  ],
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
    tips: ['Break large goals into 25-minute blocks', 'Keep your night session for problem solving', 'Take a 2-minute stretch after every focus round'],
  },
}

function formatClock(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function App() {
  const [data, setData] = useState(defaultData)
  const [theme, setTheme] = useState('sakura')
  const [timer, setTimer] = useState({ mode: 'Focus', duration: 25 * 60, remaining: 25 * 60, running: false, completed: 0 })

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((payload) => setData(payload))
      .catch(() => setData(defaultData))
  }, [])

  useEffect(() => {
    if (!timer.running) return undefined

    const id = setInterval(() => {
      setTimer((current) => {
        if (current.remaining <= 1) {
          const nextMode = current.mode === 'Focus' ? 'Break' : 'Focus'
          const nextDuration = nextMode === 'Focus' ? 25 * 60 : 5 * 60
          return {
            ...current,
            mode: nextMode,
            duration: nextDuration,
            remaining: nextDuration,
            completed: current.mode === 'Focus' ? current.completed + 1 : current.completed,
            running: false,
          }
        }
        return { ...current, remaining: current.remaining - 1 }
      })
    }, 1000)

    return () => clearInterval(id)
  }, [timer.running])

  const taskCount = data.tasks?.length ?? 0
  const completedTasks = data.tasks?.filter((task) => task.done).length ?? 0

  const topMetrics = useMemo(
    () => [
      { label: 'Study time today', value: data.overview?.studyTimeToday ?? '3h 45m', tone: 'lavender' },
      { label: 'Pomodoros', value: `${data.overview?.pomodorosCompleted ?? 8}`, tone: 'rose' },
      { label: 'Tasks done', value: `${completedTasks}/${taskCount}`, tone: 'mint' },
      { label: 'Current streak', value: `${data.overview?.currentStreak ?? 12} days`, tone: 'sky' },
    ],
    [completedTasks, data.overview, taskCount],
  )

  const toggleTask = (id) => {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    }))
  }

  const handleThemeChange = (next) => setTheme(next)

  return (
    <div className={`app-shell theme-${theme}`}>
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">M</div>
          <div>
            <p className="eyebrow">Study space</p>
            <h2>Mochi</h2>
          </div>
        </div>

        <nav className="side-nav">
          {['Home', 'Focus', 'Tasks', 'Timetable', 'Notes', 'Goals', 'Analytics', 'Music', 'Break Zone', 'AI Assistant', 'Profile'].map((item, idx) => (
            <button key={item} className={`nav-item ${idx === 0 ? 'active' : ''}`} type="button">
              <span>{item[0]}</span>
              {item}
            </button>
          ))}
        </nav>

        <div className="mini-card">
          <p>Current theme</p>
          <div className="theme-row">
            {['sakura', 'cloud', 'mint', 'midnight', 'lavender', 'peach'].map((option) => (
              <button
                key={option}
                type="button"
                className={`theme-dot ${theme === option ? 'selected' : ''}`}
                onClick={() => handleThemeChange(option)}
                aria-label={option}
              />
            ))}
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">{data.greeting}</p>
            <h1>Ready for a little study session?</h1>
          </div>
          <div className="topbar-actions">
            <button type="button" className="soft-btn">Search notes</button>
            <button type="button" className="primary-btn">Start Studying ✨</button>
          </div>
        </header>

        <section className="overview-grid">
          {topMetrics.map((metric) => (
            <article key={metric.label} className={`metric-card ${metric.tone}`}>
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </section>

        <section className="hero-row">
          <div className="dashboard-card wide-panel">
            <div className="card-header">
              <h3>Today's overview</h3>
              <span className="pill success">On track</span>
            </div>
            <div className="overview-row">
              <div>
                <span>Daily goal progress</span>
                <strong>{data.overview?.dailyGoal ?? 72}%</strong>
              </div>
              <div className="progress-rail">
                <span style={{ width: `${data.overview?.dailyGoal ?? 72}%` }} />
              </div>
            </div>
            <div className="mini-grid">
              <div>
                <p>Upcoming class</p>
                <strong>{data.overview?.upcomingClass}</strong>
              </div>
              <div>
                <p>Next reminder</p>
                <strong>{data.overview?.nextReminder}</strong>
              </div>
            </div>
          </div>

          <div className="dashboard-card companion-card">
            <div className="companion-avatar">🐰</div>
            <p>Study buddy</p>
            <strong>Feeling focused ✨</strong>
            <small>One more little session and then a break.</small>
          </div>
        </section>

        <section className="action-grid">
          {data.quickActions?.map((action) => (
            <button key={action} type="button" className="action-btn">
              <span>{action.split(' ')[0]}</span>
              {action}
            </button>
          ))}
        </section>

        <section className="content-grid">
          <div className="stacked-col">
            <article className="dashboard-card">
              <div className="card-header">
                <h3>Focus timer</h3>
                <span className="pill">Pomodoro</span>
              </div>

              <div className="timer-display">
                <div className={`timer-ring ${timer.mode === 'Break' ? 'break' : ''}`}>
                  <span>{formatClock(timer.remaining)}</span>
                </div>
                <div className="timer-meta">
                  <p>{timer.mode} session</p>
                  <strong>{timer.completed} completed</strong>
                </div>
              </div>

              <div className="timer-controls">
                {!timer.running ? (
                  <button type="button" className="primary-btn" onClick={() => setTimer((current) => ({ ...current, running: true }))}>Start</button>
                ) : (
                  <button type="button" className="soft-btn" onClick={() => setTimer((current) => ({ ...current, running: false }))}>Pause</button>
                )}
                <button type="button" className="soft-btn" onClick={() => setTimer((current) => ({ ...current, running: false, remaining: current.duration }))}>Reset</button>
                <button type="button" className="soft-btn" onClick={() => setTimer((current) => {
                  const nextMode = current.mode === 'Focus' ? 'Break' : 'Focus'
                  const nextDuration = nextMode === 'Focus' ? 25 * 60 : 5 * 60
                  return { ...current, mode: nextMode, duration: nextDuration, remaining: nextDuration, running: false }
                })}>Skip</button>
              </div>
            </article>

            <article className="dashboard-card">
              <div className="card-header">
                <h3>Task manager</h3>
                <span className="pill">Today</span>
              </div>
              <div className="task-list">
                {data.tasks?.map((task) => (
                  <label key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
                    <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />
                    <div>
                      <strong>{task.title}</strong>
                      <small>{task.subject} · {task.priority} · {task.time}</small>
                    </div>
                  </label>
                ))}
              </div>
            </article>
          </div>

          <div className="stacked-col">
            <article className="dashboard-card">
              <div className="card-header">
                <h3>AI assistant</h3>
                <span className="pill accent">Mochi ✨</span>
              </div>
              <p className="assistant-text">{data.assistant?.suggestion}</p>
              <ul className="tip-list">
                {data.assistant?.tips?.map((tip) => <li key={tip}>{tip}</li>)}
              </ul>
            </article>

            <article className="dashboard-card">
              <div className="card-header">
                <h3>Weekly timetable</h3>
                <span className="pill">This week</span>
              </div>
              <div className="timetable-list">
                {data.timetable?.map((slot) => (
                  <div key={`${slot.day}-${slot.subject}`} className="timetable-item">
                    <span>{slot.day}</span>
                    <div>
                      <strong>{slot.subject}</strong>
                      <small>{slot.time} · {slot.room}</small>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="lower-grid">
          <article className="dashboard-card">
            <div className="card-header">
              <h3>Productivity analytics</h3>
              <span className="pill">This week</span>
            </div>
            <div className="bar-chart">
              {data.analytics?.map((entry) => (
                <div key={entry.label} className="bar-item">
                  <span>{entry.label}</span>
                  <div className="bar-track"><i style={{ height: `${entry.value}%` }} /></div>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-card">
            <div className="card-header">
              <h3>Goals & habits</h3>
              <span className="pill">Progress</span>
            </div>
            <div className="goals-list">
              {data.goals?.map((goal) => (
                <div key={goal.title} className="goal-item">
                  <div className="goal-meta">
                    <strong>{goal.title}</strong>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="progress-rail small"><span className={goal.color} style={{ width: `${goal.progress}%` }} /></div>
                </div>
              ))}
            </div>
            <div className="habit-row">
              {data.habits?.map((habit) => (
                <div key={habit.name} className={`habit-pill ${habit.done ? 'done' : ''}`}>
                  {habit.name}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="lower-grid">
          <article className="dashboard-card">
            <div className="card-header">
              <h3>Focus music</h3>
              <span className="pill">Ambient mix</span>
            </div>
            <div className="music-list">
              {data.music?.map((track) => (
                <div key={track.name} className="music-item">
                  <span>{track.name}</span>
                  <div className="music-bar"><i style={{ width: `${track.level}%` }} /></div>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-card">
            <div className="card-header">
              <h3>Smart countdowns</h3>
              <span className="pill">Deadlines</span>
            </div>
            <div className="countdown-list">
              {data.countdowns?.map((item) => (
                <div key={item.title} className={`countdown-item ${item.accent}`}>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.days} days remaining</small>
                  </div>
                  <span>📚</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="final-grid">
          <article className="dashboard-card">
            <div className="card-header">
              <h3>Study notes</h3>
              <span className="pill">Pinned</span>
            </div>
            <div className="notes-list">
              {data.notes?.map((note) => (
                <div key={note.id} className="note-item">
                  <div>
                    <strong>{note.title}</strong>
                    <small>{note.tag}</small>
                  </div>
                  {note.pinned && <span>📌</span>}
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-card">
            <div className="card-header">
              <h3>Wellness</h3>
              <span className="pill">Healthy habits</span>
            </div>
            <div className="wellness-list">
              <div>Eye rest · 20 min</div>
              <div>Stretch · 1 min</div>
              <div>Water break · 4 glasses</div>
              <div>Sleep reminder · 10:30 PM</div>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App
