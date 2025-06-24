import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function Contact() {
  const [subject, setSubject] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [captchaToken, setCaptchaToken] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!subject || !email || !name || !content) {
      setError('Please fill in all fields.')
      return
    }
    if (!captchaToken) {
      setError('Please complete the reCAPTCHA.')
      return
    }
    // Here you would send the form data and captchaToken to your backend or email service
    setSuccess('Thank you for contacting us!')
    setSubject('')
    setEmail('')
    setName('')
    setContent('')
    setCaptchaToken(null)
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
        <ReCAPTCHA
          sitekey="6LfawGUrAAAAABe59Eg9pbpqYaqLQmail6DL14Un"
          onChange={token => setCaptchaToken(token)}
        />
        <br/>
        <button type="submit">Send</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {success && <p style={{color: 'green'}}>{success}</p>}
    </div>
  )
}
