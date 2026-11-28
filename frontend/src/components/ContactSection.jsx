import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Mail, MapPin } from 'lucide-react';
import { portfolioApi } from '../services/api';

const INITIAL_FORM = {
  name: '',
  email: '',
  subject: '',
  message: '',
  website: '',
};

export function ContactSection({ profile }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const name = form.name.trim();
    const email = form.email.trim();
    const subject = form.subject.trim();
    const message = form.message.trim();

    if (!name || !email || !subject || !message) {
      setFeedback({ type: 'error', text: 'Please fill out all required fields.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    if (message.length < 10) {
      setFeedback({ type: 'error', text: 'Message must be at least 10 characters long.' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await portfolioApi.submitContact({
        name,
        email,
        subject,
        message,
        website: form.website,
      });
      setFeedback({
        type: 'success',
        text: response.message || 'Thank you! Your message has been saved.',
      });
      setForm(INITIAL_FORM);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.message || 'There was a problem sending your message.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full py-16 border-t border-[#ffffff10]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg text-[var(--sec)] mb-2 shiny-sec reveal">Let&apos;s talk</h2>
        <h3 className="text-4xl md:text-5xl font-medium text-[var(--white)] mb-8 reveal">
          Contact
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-[var(--white-icon)] space-y-5 reveal">
            <p className="leading-relaxed">
              Have a question, project idea, or role in mind? Feel free to reach out—every message is stored securely in PostgreSQL.
            </p>

            <div className="space-y-3 text-sm">
              {profile?.location && (
                <div className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-[var(--sec)]" />
                  <span>Location:</span>
                  <span className="text-[var(--white)] font-medium">{profile.location}</span>
                </div>
              )}

              {profile?.email && (
                <div className="flex items-center gap-2.5">
                  <Mail size={16} className="text-[var(--sec)]" />
                  <span>Email:</span>
                  <a href={`mailto:${profile.email}`} className="text-[var(--white)] hover:text-[var(--sec)] transition">
                    {profile.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="reveal">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {feedback && (
                <div
                  role="alert"
                  className={`flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm border ${
                    feedback.type === 'success'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 size={17} className="flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={17} className="flex-shrink-0 mt-0.5" />
                  )}
                  <span>{feedback.text}</span>
                </div>
              )}

              {/* Honeypot */}
              <div className="hp-field" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={handleChange}
                />
              </div>

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className="px-4 py-3 bg-[#1414149c] text-[var(--white)] border border-[var(--white-icon-tr)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sec)]"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="px-4 py-3 bg-[#1414149c] text-[var(--white)] border border-[var(--white-icon-tr)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sec)]"
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="px-4 py-3 bg-[#1414149c] text-[var(--white)] border border-[var(--white-icon-tr)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sec)]"
              />

              <textarea
                name="message"
                placeholder="Message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
                className="px-4 py-3 bg-[#1414149c] text-[var(--white)] border border-[var(--white-icon-tr)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sec)] resize-none"
              />

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-3 bg-[var(--white-icon-tr)] text-[var(--white)] rounded-lg border border-[var(--white-icon-tr)] hover:bg-[#a476ff28] hover:border-[var(--sec)] transition font-medium disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
