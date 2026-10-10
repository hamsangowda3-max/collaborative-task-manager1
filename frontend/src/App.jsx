
import { useState } from 'react'
import './App.css'

const initialTasks = [
  { id: 1, title: 'Design new landing page', project: 'Website Redesign', person: 'JD', color: '#dbeafe', priority: 'High', status: 'In Progress', date: 'Oct 12' },
  { id: 2, title: 'Implement user authentication', project: 'Mobile App', person: 'AK', color: '#fce7f3', priority: 'High', status: 'In Progress', date: 'Oct 13' },
  { id: 3, title: 'Review API documentation', project: 'Backend API', person: 'SM', color: '#dcfce7', priority: 'Medium', status: 'To Do', date: 'Oct 14' },
  { id: 4, title: 'Write unit tests', project: 'Backend API', person: 'JD', color: '#dbeafe', priority: 'Low', status: 'Completed', date: 'Oct 09' },
  { id: 5, title: 'Update dashboard UI', project: 'Website Redesign', person: 'RK', color: '#fef3c7', priority: 'Medium', status: 'To Do', date: 'Oct 15' },
]

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
  localStorage.getItem("taskflow_logged_in") === "true"
);
const [loginMode, setLoginMode] = useState("login");
const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");
const [loginName, setLoginName] = useState("");
  const [tasks, setTasks] = useState(initialTasks)
  const [active, setActive] = useState('Overview')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [filter, setFilter] = useState('All')

  const filteredTasks = tasks.filter(task =>
    (task.title.toLowerCase().includes(search.toLowerCase()) ||
     task.project.toLowerCase().includes(search.toLowerCase())) &&
    (filter === 'All' || task.status === filter) &&
    (active !== 'My Tasks' || task.person === 'JD') &&
    (active !== 'Completed' || task.status === 'Completed')
  )

  function addTask(e) {
    e.preventDefault()
    if (!title.trim()) return
    setTasks([{ id: Date.now(), title, project: 'General', person: 'JD',
      color: '#dbeafe', priority, status: 'To Do', date: 'Oct 16' }, ...tasks])
    setTitle('')
    setShowForm(false)
  }

  function cycleStatus(id) {
    const order = ['To Do', 'In Progress', 'Completed']
    setTasks(tasks.map(t => t.id === id
      ? { ...t, status: order[(order.indexOf(t.status) + 1) % order.length] }
      : t))
  }

  const completed = tasks.filter(t => t.status === 'Completed').length
  const inProgress = tasks.filter(t => t.status === 'In Progress').length
  const overdue = tasks.filter(t => t.status !== 'Completed' && t.date === 'Oct 09').length

  if (!isLoggedIn) {
  return (
    <div className="login-page">
      <form
        className="login-card"
        onSubmit={(e) => {
          e.preventDefault();
          localStorage.setItem("taskflow_logged_in", "true");
          setIsLoggedIn(true);
        }}
      >
        <h1>✓ TaskFlow.</h1>
        <p>Welcome back! Sign in to your workspace.</p>

        {loginMode === "signup" && (
          <input
            placeholder="Full name"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email address"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          required
        />

        <button className="login-submit" type="submit">
          Sign In
        </button>

        <p>
          {loginMode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <button
            type="button"
            onClick={() =>
              setLoginMode(loginMode === "login" ? "signup" : "login")
            }
          >
            {loginMode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </form>
    </div>
  );
}
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          <span>TaskFlow<span className="brand-dot">.</span></span>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <div className="workspace"><span className="workspace-avatar">A</span><span>Acme Studio</span><span className="chevron">⌄</span></div>
        <div className="nav-label">MENU</div>
        {[
          ['Overview', '▦'], ['My Tasks', '☑'], ['Projects', '◫'],
          ['Team', '♧'], ['Completed', '✓']
        ].map(([name, icon]) => (
          <button key={name} className={`nav-item ${active === name ? 'active' : ''}`}
            onClick={() => { setActive(name); setFilter('All') }}>
            <span className="nav-icon">{icon}</span>{name}
            {name === 'My Tasks' && <span className="nav-count">{tasks.filter(t => t.person === 'JD' && t.status !== 'Completed').length}</span>}
          </button>
        ))}
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">✦</div>
            <strong>Upgrade your workflow</strong>
            <p>Get more done with your team.</p>
            <button onClick={() => alert('Thanks for your interest!')}>Explore plans ↗</button>
          </div>
          <div className="profile">
            <div className="profile-avatar">JD</div>
            <div className="profile-info"><strong>Jordan Davis</strong><span>jordan@example.com</span></div>
            <span>•••</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>{active}</strong></div>
          <div className="top-actions">
            <div className="search-box"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." /></div>
            <button className="icon-button" onClick={() => alert('You are all caught up!')} aria-label="Notifications">♧<i /></button>
            <div className="top-avatar">JD</div>
          </div>
        </header>

        <div className="content">
          <div className="welcome-row">
            <div><div className="eyebrow">FRIDAY, OCTOBER 10</div><h1>{active === 'Overview' ? 'Good morning, Jordan 👋' : active}</h1><p>Here's what's happening with your projects today.</p></div>
            <button className="primary-button" onClick={() => setShowForm(true)}><span>＋</span> New task</button>
          </div>

          {active === 'Projects' ? (
            <div className="project-grid">
              {[
                ['Website Redesign', '🎨', '12 tasks', '#ede9fe', '75%'],
                ['Mobile App', '📱', '8 tasks', '#dbeafe', '45%'],
                ['Backend API', '⚙️', '10 tasks', '#dcfce7', '60%']
              ].map(([name, icon, count, bg, progress]) => (
                <div className="project-card" key={name}><div className="project-icon" style={{background:bg}}>{icon}</div><h3>{name}</h3><p>{count}</p><div className="progress-track"><div style={{width:progress}} /></div><small>{progress} complete</small></div>
              ))}
            </div>
          ) : active === 'Team' ? (
            <div className="panel"><h2>Your team</h2>{[['JD','Jordan Davis','Project Manager'],['AK','Alex Kim','Developer'],['SM','Sam Morgan','Designer'],['RK','Riley Kapoor','Developer']].map(([initials,name,role])=><div className="team-row" key={initials}><div className="person-avatar">{initials}</div><div><strong>{name}</strong><p>{role}</p></div><span className="online-dot"/> <span className="team-online">Active</span></div>)}</div>
          ) : (
            <>
              <section className="stats-grid">
                <div className="stat-card"><div className="stat-top"><span>Total tasks</span><span className="stat-icon purple">▤</span></div><div className="stat-number">{tasks.length}</div><div className="stat-foot"><span className="trend">↗ All tasks</span> in your workspace</div></div>
                <div className="stat-card"><div className="stat-top"><span>In progress</span><span className="stat-icon blue">◷</span></div><div className="stat-number">{inProgress}</div><div className="stat-foot"><span className="blue-text">Active</span> tasks underway</div></div>
                <div className="stat-card"><div className="stat-top"><span>Completed</span><span className="stat-icon green">✓</span></div><div className="stat-number">{completed}</div><div className="stat-foot"><span className="trend">✓ Great work!</span> tasks finished</div></div>
                <div className="stat-card"><div className="stat-top"><span>Overdue</span><span className="stat-icon orange">⚑</span></div><div className="stat-number">{overdue}</div><div className="stat-foot"><span className="orange-text">Needs attention</span></div></div>
              </section>

              <section className="project-summary">
                <div className="section-heading"><div><h2>Project progress</h2><p>Track progress across your workspace</p></div><button className="text-button" onClick={() => setActive('Projects')}>All projects →</button></div>
                <div className="project-progress-grid">
                  {[['Website Redesign','12 tasks',75,'#8065e8'],['Mobile App','8 tasks',45,'#4194e8'],['Backend API','10 tasks',60,'#32ad83']].map(([name,count,percent,color])=>(
                    <div className="progress-item" key={name}><div className="progress-title"><strong>{name}</strong><span>{count}</span></div><div className="progress-track"><div style={{width:`${percent}%`,background:color}}/></div><div className="progress-percent">{percent}% complete</div></div>
                  ))}
                </div>
              </section>

              <section className="panel task-panel">
                <div className="section-heading task-heading"><div><h2>{active === 'Completed' ? 'Completed tasks' : active === 'My Tasks' ? 'My tasks' : 'Recent tasks'}</h2><p>Manage and track your team's work</p></div><button className="outline-button" onClick={() => setShowForm(true)}>＋ Add task</button></div>
                <div className="filter-row">{['All','To Do','In Progress','Completed'].map(f=><button key={f} onClick={()=>setFilter(f)} className={`filter-chip ${filter===f?'selected':''}`}>{f}</button>)}</div>
                <div className="task-table-wrap"><table className="task-table"><thead><tr><th>TASK NAME</th><th>PROJECT</th><th>PRIORITY</th><th>STATUS</th><th>DUE DATE</th><th></th></tr></thead>
                  <tbody>{filteredTasks.map(task=><tr key={task.id}><td><div className="task-name"><span className={`task-check ${task.status==='Completed'?'checked':''}`} onClick={()=>cycleStatus(task.id)}>{task.status==='Completed'?'✓':''}</span><span className={task.status==='Completed'?'strike':''}>{task.title}</span></div></td><td><span className="project-name">{task.project}</span></td><td><span className={`priority ${task.priority.toLowerCase()}`}><span/> {task.priority}</span></td><td><button className={`status-pill ${task.status.toLowerCase().replace(' ','-')}`} onClick={()=>cycleStatus(task.id)}>{task.status} <span>⌄</span></button></td><td className="date-cell">▦ &nbsp;{task.date}</td><td><button className="more-button" onClick={()=>cycleStatus(task.id)} title="Change task status">•••</button></td></tr>)}</tbody>
                </table>{filteredTasks.length===0&&<div className="empty-state">No tasks found. Try another filter or create a task.</div>}</div>
                <div className="table-footer">Showing <strong>{filteredTasks.length}</strong> of <strong>{tasks.length}</strong> tasks <span>Click a status to update it</span></div>
              </section>
            </>
          )}
          <footer className="footer">© 2026 TaskFlow <span>Made for better teamwork ✦</span></footer>
        </div>
      </main>

      {showForm && <div className="modal-backdrop" onClick={()=>setShowForm(false)}><form className="task-modal" onSubmit={addTask} onClick={e=>e.stopPropagation()}><button type="button" className="modal-close" onClick={()=>setShowForm(false)}>×</button><div className="eyebrow">TASK MANAGEMENT</div><h2>Create a new task</h2><p>Add a task to your workspace.</p><label>Task title<input autoFocus required value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Prepare project presentation"/></label><label>Priority<select value={priority} onChange={e=>setPriority(e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label><div className="modal-actions"><button type="button" className="outline-button" onClick={()=>setShowForm(false)}>Cancel</button><button className="primary-button" type="submit">Create task</button></div></form></div>}
    </div>
  )
}

export default App
