// Cross-community events calendar and list view. Shows upcoming events across all of the
// user's communities with a monthly calendar picker and RSVP controls.
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsService } from '../services/events.service';
import { communitiesService } from '../services/communities.service';
import { Event as EventType, EventStatus, Community } from '../types';
import Header from '../components/layout/Header';

const Events: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventType[]>([]);
  const [myEvents, setMyEvents] = useState<EventType[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMyEvents, setShowMyEvents] = useState(false);
  const [message, setMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    communityId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchMyEvents();
    fetchCommunities();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await eventsService.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyEvents = async () => {
    try {
      const data = await eventsService.getMyEvents();
      setMyEvents(data);
    } catch (error) {
      console.error('Failed to fetch my events:', error);
    }
  };

  const fetchCommunities = async () => {
    try {
      const data = await communitiesService.getUserCommunities();
      setCommunities(data);
      if (data.length > 0 && !formData.communityId) {
        setFormData(prev => ({ ...prev, communityId: data[0].id }));
      }
    } catch (error) {
      console.error('Failed to fetch communities:', error);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.communityId) {
      setMessage('Please select a community.');
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    setIsSubmitting(true);

    try {
      const startDateTime = `${formData.startDate}T${formData.startTime || '00:00'}`;
      const endDateTime = `${formData.endDate}T${formData.endTime || '23:59'}`;

      await eventsService.createEvent({
        title: formData.title,
        description: formData.description,
        location: formData.location || undefined,
        startDate: new Date(startDateTime).toISOString(),
        endDate: new Date(endDateTime).toISOString(),
        communityId: formData.communityId,
      });

      setMessage('Event submitted for review! An admin will approve it shortly.');
      setTimeout(() => setMessage(''), 5000);
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        location: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        communityId: '',
      });
      fetchMyEvents();
    } catch (error) {
      setMessage('Failed to create event. Please try again.');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventsService.deleteEvent(eventId);
      fetchMyEvents();
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  // Calendar helpers
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  }, [firstDayOfMonth, daysInMonth]);

  const eventsOnDay = (day: number): EventType[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((event) => {
      const eventStart = event.startDate.substring(0, 10);
      const eventEnd = event.endDate.substring(0, 10);
      return dateStr >= eventStart && dateStr <= eventEnd;
    });
  };

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    return events
      .filter((e) => new Date(e.startDate) >= now && new Date(e.startDate) <= twoWeeks)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [events]);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const statusBadge = (status: EventStatus) => {
    switch (status) {
      case EventStatus.PENDING_REVIEW:
        return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Pending Review</span>;
      case EventStatus.APPROVED:
        return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Approved</span>;
      case EventStatus.REJECTED:
        return <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Rejected</span>;
    }
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Local Events</h1>
            <p className="text-gray-600 mt-1">Discover and share events in your community</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowMyEvents(!showMyEvents)}
              className={`px-4 py-2 rounded-xl font-medium transition ${
                showMyEvents
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              My Events
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-brand-red text-white px-4 py-2 rounded-xl hover:bg-brand-red-dark transition font-medium flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Submit Event
            </button>
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 rounded-2xl px-6 py-4 ${
            message.includes('submitted') || message.includes('success')
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`font-medium ${
              message.includes('submitted') || message.includes('success')
                ? 'text-green-700'
                : 'text-red-700'
            }`}>
              {message}
            </p>
          </div>
        )}

        {/* Create Event Form */}
        {showCreateForm && (
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Submit a New Event</h2>
            <p className="text-sm text-gray-500 mb-6">
              Events are reviewed by an admin before appearing on the calendar.
            </p>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Neighborhood Block Party"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="What's this event about?"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Lake Harriet Bandshell"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Community *</label>
                <select
                  value={formData.communityId}
                  onChange={(e) => setFormData({ ...formData, communityId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a community</option>
                  {communities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand-red text-white px-6 py-2 rounded-lg hover:bg-brand-red-dark transition font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-600 hover:text-gray-800 px-4 py-2 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Events Section */}
        {showMyEvents && (
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">My Submitted Events</h2>
            {myEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-6">You haven't submitted any events yet.</p>
            ) : (
              <div className="space-y-4">
                {myEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          {statusBadge(event.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>{formatDateTime(event.startDate)} — {formatDateTime(event.endDate)}</p>
                          {event.location && <p>Location: {event.location}</p>}
                          {event.community && <p>Community: {event.community.name}</p>}
                          {event.adminNotes && (
                            <p className="text-red-600 mt-2">Admin note: {event.adminNotes}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-500 hover:text-red-700 text-sm ml-4"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Calendar Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <h2 className="text-xl font-bold text-gray-900">{monthName}</h2>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-gray-100">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, idx) => {
                  const dayEvents = day ? eventsOnDay(day) : [];
                  return (
                    <div
                      key={idx}
                      className={`min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 border-b border-r border-gray-100 ${
                        !day ? 'bg-gray-50' : ''
                      } ${isToday(day || 0) ? 'bg-purple-50' : ''}`}
                    >
                      {day && (
                        <>
                          <span className={`text-xs sm:text-sm font-medium ${
                            isToday(day) ? 'text-purple-600 font-bold' : 'text-gray-700'
                          }`}>
                            {day}
                          </span>
                          <div className="mt-1 space-y-0.5">
                            {dayEvents.slice(0, 2).map((event) => (
                              <button
                                key={event.id}
                                onClick={() => setSelectedEvent(event)}
                                className="w-full text-left text-[10px] sm:text-xs bg-brand-red/10 text-brand-red px-1 py-0.5 rounded truncate hover:bg-brand-red/20 transition block"
                              >
                                {event.title}
                              </button>
                            ))}
                            {dayEvents.length > 2 && (
                              <span className="text-[10px] text-gray-500">+{dayEvents.length - 2} more</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Upcoming Events</h3>
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="w-8 h-8 border-3 border-brand-red border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : upcomingEvents.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No upcoming events in the next 2 weeks</p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-brand-red hover:shadow-sm transition"
                    >
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{event.title}</h4>
                      <p className="text-xs text-gray-500">
                        {new Date(event.startDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                      {event.location && (
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <span>Location:</span> {event.location}
                        </p>
                      )}
                      {event.community && (
                        <span className="inline-block mt-1 text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          {event.community.name}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-brand-red/10 rounded-3xl p-6 border-2 border-brand-red/30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-neutral-800 mb-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <h3 className="font-bold text-neutral-900 mb-2">Share an Event</h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Know about a local event? Submit it and once approved by an admin, it'll appear on the community calendar for everyone to see!
              </p>
            </div>
          </div>
        </div>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-600 mb-4">{selectedEvent.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-brand-red">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <span>{formatDateTime(selectedEvent.startDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-brand-red">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Ends: {formatDateTime(selectedEvent.endDate)}</span>
                </div>
                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-brand-red">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
                {selectedEvent.community && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-brand-red">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                    <span>{selectedEvent.community.name}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                Submitted by {selectedEvent.user.firstName} {selectedEvent.user.lastName}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
