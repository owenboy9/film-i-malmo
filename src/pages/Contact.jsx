import React, { useState } from 'react'

// Generate a random math question
function generateHumanQuestion() {
  const a = Math.floor(Math.random() * 10) + 1
  const b = Math.floor(Math.random() * 10) + 1
  return {
    question: `What is ${a} + ${b}?`,
    answer: (a + b).toString()
  }
}

export default function Contact() {
  const [subject, setSubject] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [human, setHuman] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [humanQ, setHumanQ] = useState(generateHumanQuestion())

  const resetForm = () => {
    setSubject('')
    setEmail('')
    setName('')
    setContent('')
    setHuman('')
    setHumanQ(generateHumanQuestion())
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!subject || !email || !name || !content) {
      setError('Please fill in all fields.')
      setHumanQ(generateHumanQuestion())
      return
    }
    if (human.trim() !== humanQ.answer) {
      setError('Human validation failed.')
      setHuman('')
      setHumanQ(generateHumanQuestion())
      return
    }
    // Here you would send the form data to your backend or email service
    setSuccess('Thank you for contacting us!')
    resetForm()
  }

  return (
    <div>
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        /><br/>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br/>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
        /><br/>
        <textarea
          placeholder="Your message"
          value={content}
          onChange={e => setContent(e.target.value)}
        /><br/>
        <label>
          {humanQ.question}
          <input
            type="text"
            placeholder="Answer"
            value={human}
            onChange={e => setHuman(e.target.value)}
          />
        </label>
        <br/>
        <button type="submit">Send</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {success && <p style={{color: 'green'}}>{success}</p>}
    </div>
  )
}
