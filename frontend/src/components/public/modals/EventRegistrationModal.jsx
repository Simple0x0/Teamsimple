import React, { useState } from 'react';
import { registerEventParticipant } from '../utils/registerEventParticipant';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import style from '../../../app/Style';
import Loading from '../ui/Loading';
import ErrorHandle from '../ui/ErrorHandle';

export default function EventRegistrationModal({ isOpen, onClose, eventId, eventTitle }) {
  const [form, setForm] = useState({
    FirstName: '', LastName: '', Nickname: '', Email: '', ContactNumber: '',
    Organization: '', Position: '', City: '', Country: '',
    RegistrationType: 'Attendee', ParticipantInput: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!form.Nickname || !form.Email) {
      setError('Nickname and Email are required.');
      setLoading(false);
      return;
    }

    try {
      const result = await registerEventParticipant(eventId, {
        ...form,
        EventID: eventId
      });
      if (result.ok) {
        setSuccess('Registration successful!');
        setForm({
          FirstName: '', LastName: '', Nickname: '', Email: '', ContactNumber: '',
          Organization: '', Position: '', City: '', Country: '',
          RegistrationType: 'Attendee', ParticipantInput: ''
        });
      } else {
        setError(result.error || 'Failed to register.');
      }
    } catch (err) {
      setError('Server error.');
    }
    setLoading(false);
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" aria-hidden="true" />
      <div className="relative w-full max-w-4xl mx-auto bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
        <Dialog.Panel className="w-full">
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-lime-400 to-lime-600 border-b border-lime-300">
            <Dialog.Title className="text-lg md:text-xl font-bold text-slate-900">
              Register for <span className="text-slate-800">{eventTitle || 'Event'}</span>
            </Dialog.Title>
            <button onClick={onClose} className="text-slate-800 hover:text-red-500 transition p-1 rounded-full">
              <X size={22} />
            </button>
          </div>

          <div className="px-6 md:px-10 py-8 bg-slate-950">
            {loading ? (
              <Loading />
            ) : error ? (
              <ErrorHandle type="Registration" errorType="server" message={error} />
            ) : success ? (
              <div className="text-green-400 font-bold text-center py-6 text-lg">{success}</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    'FirstName', 'LastName', 'Nickname*', 'Email*', 'ContactNumber',
                    'Organization', 'Position', 'City', 'Country'
                  ].map((field, i) => (
                    <input
                      key={i}
                      name={field.replace('*', '')}
                      value={form[field.replace('*', '')]}
                      onChange={handleChange}
                      placeholder={field}
                      className={`px-5 py-3 rounded-xl text-sm bg-slate-800 text-white border border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-500 w-full ${field.includes('*') ? 'font-semibold text-lime-300' : ''}`}
                      required={field.includes('*')}
                    />
                  ))}

                  <select
                    name="RegistrationType"
                    value={form.RegistrationType}
                    onChange={handleChange}
                    className="px-5 py-3 rounded-xl bg-slate-800 text-white border border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-500 w-full"
                  >
                    <option value="Attendee">Attendee</option>
                    <option value="Speaker">Speaker</option>
                    <option value="Sponsor">Sponsor</option>
                  </select>
                </div>

                <textarea
                  name="ParticipantInput"
                  value={form.ParticipantInput}
                  onChange={handleChange}
                  placeholder="Additional info, suggestion or questions"
                  className="w-full px-5 py-4 rounded-xl bg-slate-800 text-white border border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
                />

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-lime-400 to-lime-600 hover:from-lime-500 hover:to-lime-700 text-slate-950 font-bold rounded-full text-lg shadow-lg transition duration-200"
                >
                  Register
                </button>
              </form>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}