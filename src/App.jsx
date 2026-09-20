import React, { useEffect, useMemo, useState } from 'react';
import {
  Music, Users, BarChart3, PlayCircle, CheckCircle2, Heart, Flame,
  Sparkles, MessageCircle, Activity, X, Radio, ArrowRight, Database,
  ListMusic, Trash2, Edit3, Lock, LogOut, Plus, Volume2, Disc,
  ChevronRight, Copy, Check, Eye, Zap, AlertCircle, Upload, Download, Share2, CloudRain, Camera, Save
} from 'lucide-react';
import { supabase } from './lib/supabase';

const APP_EVENT_ID = 'event_music_night_2026';
const EVENT_DISPLAY_NAME = 'Tofani Vayra 9';
const MEDIA_BUCKET = 'event-media';
const SESSION_KEY = 'music_night_audience_session_v1';
const SYNC_KEY = 'music_night_local_event_db_v4';

const INITIAL_SEED_DATA = {
  event: {
    id: APP_EVENT_ID,
    name: EVENT_DISPLAY_NAME,
    event_date: '2026-10-15',
    status: 'live',
    created_at: new Date().toISOString(),
  },
  performances: [
    { id: 'perf_1', event_id: APP_EVENT_ID, title: 'Tum Se Hi', performer: 'Aarushi', song_artist: 'Mohit Chauhan', display_order: 1, status: 'playing' },
    { id: 'perf_2', event_id: APP_EVENT_ID, title: 'Agar Tum Saath Ho', performer: 'Riya', song_artist: 'Alka Yagnik & Arijit Singh', display_order: 2, status: 'queued' },
    { id: 'perf_3', event_id: APP_EVENT_ID, title: 'Pehla Nasha', performer: 'Dev', song_artist: 'Udit Narayan & Sadhana Sargam', display_order: 3, status: 'queued' },
    { id: 'perf_4', event_id: APP_EVENT_ID, title: 'Gallan Goodiyaan', performer: 'Group Performance', song_artist: 'Various Artists', display_order: 4, status: 'queued' },
  ],
  musicians: [
    { id: 'mus_1', event_id: APP_EVENT_ID, name: 'Rahul', instrument: 'Guitar' },
    { id: 'mus_2', event_id: APP_EVENT_ID, name: 'Meera', instrument: 'Keyboard' },
    { id: 'mus_3', event_id: APP_EVENT_ID, name: 'Aarav', instrument: 'Drums' },
    { id: 'mus_4', event_id: APP_EVENT_ID, name: 'Karan', instrument: 'Bass' },
  ],
  audience: [],
};

const EVENT_INTRO_DATA = {
  performers: [
    { id: 'performer_1', name: 'Aarushi', role: 'Performer', photo: '', age: '21', work: 'Student', workplace: 'Navrachana University', intro: 'A soulful voice bringing Bollywood melodies to life on the Music Night stage.', achievements: 'Trained vocalist with a passion for Bollywood and contemporary music.' },
    { id: 'performer_2', name: 'Riya', role: 'Performer', photo: '', age: '20', work: 'Student', workplace: 'Navrachana University', intro: 'A versatile singer known for expressive vocals and emotional performances.', achievements: 'Regular stage performer and music enthusiast.' },
    { id: 'performer_3', name: 'Dev', role: 'Performer', photo: '', age: '21', work: 'Student', workplace: 'Navrachana University', intro: 'Bringing a fresh energy and expressive style to the Music Night stage.', achievements: 'Passionate performer with an interest in live music.' },
  ],
  anchors: [
    { id: 'anchor_1', name: 'Your Anchor', role: 'Anchor / MoC', photo: '', age: '22', work: 'Student', workplace: 'Navrachana University', intro: 'Keeping the evening lively, engaging and connected from one performance to the next.', achievements: 'Experienced in stage hosting and audience interaction.' },
    { id: 'anchor_2', name: 'Co-Anchor', role: 'Anchor / MoC', photo: '', age: '21', work: 'Student', workplace: 'Navrachana University', intro: 'Adding energy, humour and warmth to the Music Night experience.', achievements: 'Active stage host and event presenter.' },
  ],
  musicians: [
    { id: 'mus_1', name: 'Rahul', instrument: 'Guitar', photo: '', age: '22', work: 'Musician', workplace: 'Independent', intro: 'Adding melodic depth and live guitar energy to every performance.', achievements: 'Live guitarist with experience accompanying vocal performances.' },
    { id: 'mus_2', name: 'Meera', instrument: 'Keyboard', photo: '', age: '22', work: 'Musician', workplace: 'Independent', intro: 'Creating the harmonic foundation behind the evening’s performances.', achievements: 'Keyboardist experienced in live stage accompaniment.' },
    { id: 'mus_3', name: 'Aarav', instrument: 'Drums', photo: '', age: '23', work: 'Musician', workplace: 'Independent', intro: 'Bringing rhythm, energy and groove to the live stage.', achievements: 'Live drummer with experience in group performances.' },
    { id: 'mus_4', name: 'Karan', instrument: 'Bass', photo: '', age: '22', work: 'Musician', workplace: 'Independent', intro: 'Holding the rhythm section together with a strong live bass presence.', achievements: 'Bass player experienced in live ensemble performances.' },
  ],
  organizers: [],
};

const REACTION_OPTIONS = ['❤️', '🔥', '👏', '✨'];

const getLocalDB = () => {
  try {
    const raw = localStorage.getItem(SYNC_KEY);
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.warn('Storage error', error);
  }
  return INITIAL_SEED_DATA;
};

const saveAndBroadcastLocalDB = (data) => {
  try {
    localStorage.setItem(SYNC_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Storage write error', error);
  }

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const channel = new BroadcastChannel('mn_realtime_bus');
      channel.postMessage(data);
      channel.close();
    } catch (error) {
      console.warn('Broadcast error', error);
    }
  }

  window.dispatchEvent(new CustomEvent('mn_db_update', { detail: data }));
};

const SUPABASE_SQL_SCHEMA = `
-- ============================================================
-- TOFANI VAYRA 9 - DATA, PEOPLE, ANALYTICS & MEMORY CARD SETUP
-- Run this in Supabase SQL Editor after your existing schema.
-- ============================================================

update public.events
set name = 'Tofani Vayra 9'
where id = 'event_music_night_2026';

alter table public.audience
  add column if not exists photo_url text;

create table if not exists public.event_people (
  id text primary key,
  event_id text not null,
  category text not null check (category in ('performer', 'anchor', 'musician', 'organizer')),
  name text not null,
  role text,
  instrument text,
  photo_url text,
  age text,
  work text,
  workplace text,
  intro text,
  achievements text,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_event_people_event on public.event_people(event_id);
create index if not exists idx_event_people_category on public.event_people(category);

create table if not exists public.event_analytics_snapshots (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  event_name text not null,
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_event_analytics_event on public.event_analytics_snapshots(event_id);

create table if not exists public.audience_memory_cards (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  audience_id text not null,
  audience_name text not null,
  photo_url text,
  engagement_score integer default 0,
  engagement_tag text,
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(event_id, audience_id)
);

create index if not exists idx_memory_cards_event on public.audience_memory_cards(event_id);

-- Prototype policies. Replace with authenticated-admin policies before production.
alter table public.event_people enable row level security;
alter table public.event_analytics_snapshots enable row level security;
alter table public.audience_memory_cards enable row level security;

drop policy if exists "Public read event people" on public.event_people;
create policy "Public read event people" on public.event_people for select to anon, authenticated using (true);

drop policy if exists "Prototype write event people" on public.event_people;
create policy "Prototype write event people" on public.event_people for all to anon, authenticated using (true) with check (true);

drop policy if exists "Public read analytics snapshots" on public.event_analytics_snapshots;
create policy "Public read analytics snapshots" on public.event_analytics_snapshots for select to anon, authenticated using (true);

drop policy if exists "Prototype insert analytics snapshots" on public.event_analytics_snapshots;
create policy "Prototype insert analytics snapshots" on public.event_analytics_snapshots for insert to anon, authenticated with check (true);

drop policy if exists "Public read memory cards" on public.audience_memory_cards;
create policy "Public read memory cards" on public.audience_memory_cards for select to anon, authenticated using (true);

drop policy if exists "Prototype write memory cards" on public.audience_memory_cards;
create policy "Prototype write memory cards" on public.audience_memory_cards for all to anon, authenticated using (true) with check (true);

drop policy if exists "Prototype audience photo update" on public.audience;
create policy "Prototype audience photo update" on public.audience for update to anon, authenticated using (true) with check (true);

-- Public event-media bucket for prototype photo uploads.
insert into storage.buckets (id, name, public)
values ('event-media', 'event-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Event media public read" on storage.objects;
create policy "Event media public read" on storage.objects for select to anon, authenticated using (bucket_id = 'event-media');

drop policy if exists "Event media prototype upload" on storage.objects;
create policy "Event media prototype upload" on storage.objects for insert to anon, authenticated with check (bucket_id = 'event-media');

drop policy if exists "Event media prototype update" on storage.objects;
create policy "Event media prototype update" on storage.objects for update to anon, authenticated using (bucket_id = 'event-media') with check (bucket_id = 'event-media');

do $$
begin
  begin alter publication supabase_realtime add table public.event_people; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.event_analytics_snapshots; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.audience_memory_cards; exception when duplicate_object then null; end;
end $$;
`


function flattenStaticPeople() {
  return [
    ...EVENT_INTRO_DATA.performers.map((person, index) => ({ ...person, category: 'performer', display_order: index + 1 })),
    ...EVENT_INTRO_DATA.anchors.map((person, index) => ({ ...person, category: 'anchor', display_order: index + 1 })),
    ...EVENT_INTRO_DATA.musicians.map((person, index) => ({ ...person, category: 'musician', role: person.instrument, display_order: index + 1 })),
  ];
}

function mergePeople(peopleRows = []) {
  const staticPeople = flattenStaticPeople();
  const byId = new Map(peopleRows.map((person) => [person.id, person]));
  const mergedStatic = staticPeople.map((person) => {
    const dbPerson = byId.get(person.id) || {};
    return {
      ...person,
      ...dbPerson,
      photo: dbPerson.photo_url || dbPerson.photo || person.photo || '',
    };
  });
  const staticIds = new Set(staticPeople.map((person) => person.id));
  const extras = peopleRows.filter((person) => !staticIds.has(person.id));
  return [...mergedStatic, ...extras].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
}

function getEngagementProfile(voteCount, reactionCount) {
  const score = Math.min(100, Math.round(voteCount * 20 + reactionCount * 10));
  let tag = 'You are a good listener';
  if (score >= 25 && score < 50) tag = 'You really feel the music';
  else if (score >= 50 && score < 75) tag = 'Your taste in music is excellent';
  else if (score >= 75 && score < 90) tag = "You're a true music enthusiast";
  else if (score >= 90) tag = 'Music flows with you';
  return { score, tag };
}

async function uploadEventMedia(file, folder, filenameBase) {
  if (!supabase || !file) return { url: '', error: new Error('Supabase or file missing') };
  const safeName = (filenameBase || 'image').replace(/[^a-zA-Z0-9_-]/g, '_');
  const extension = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${folder}/${safeName}_${Date.now()}.${extension}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type || 'image/jpeg',
    cacheControl: '3600',
  });
  if (error) return { url: '', error };
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { url: data?.publicUrl || '', error: null };
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function buildMemoryCardBlob({ name, photoUrl, score, tag }) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 675;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 1200, 675);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(0.55, '#1e3a5f');
  gradient.addColorStop(1, '#312e81');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(186,230,253,0.18)';
  ctx.lineWidth = 2;
  for (let x = 20; x < 1200; x += 70) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - 120, 675);
    ctx.stroke();
  }

  ctx.fillStyle = '#e0f2fe';
  ctx.font = '700 34px Arial';
  ctx.fillText('TOFANI VAYRA 9', 64, 72);

  ctx.fillStyle = 'rgba(224,242,254,0.75)';
  ctx.font = '500 20px Arial';
  ctx.fillText('YOUR MUSIC NIGHT MEMORY', 64, 108);

  let photoDrawn = false;
  if (photoUrl) {
    try {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      await new Promise((resolve) => {
        image.onload = () => resolve(true);
        image.onerror = () => resolve(false);
        image.src = photoUrl;
      });
      if (image.complete && image.naturalWidth) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(170, 290, 105, 0, Math.PI * 2);
        ctx.clip();
        const ratio = Math.max(210 / image.width, 210 / image.height);
        const drawW = image.width * ratio;
        const drawH = image.height * ratio;
        ctx.drawImage(image, 170 - drawW / 2, 290 - drawH / 2, drawW, drawH);
        ctx.restore();
        photoDrawn = true;
      }
    } catch (error) {
      photoDrawn = false;
    }
  }

  if (!photoDrawn) {
    ctx.fillStyle = 'rgba(125,211,252,0.2)';
    ctx.beginPath();
    ctx.arc(170, 290, 105, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e0f2fe';
    ctx.font = '700 72px Arial';
    ctx.textAlign = 'center';
    ctx.fillText((name || 'A').charAt(0).toUpperCase(), 170, 316);
    ctx.textAlign = 'left';
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 54px Arial';
  ctx.fillText(name || 'Audience Member', 330, 245);
  ctx.fillStyle = '#bae6fd';
  ctx.font = '500 24px Arial';
  ctx.fillText(tag, 330, 292);

  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  ctx.fillRect(330, 350, 760, 26);
  ctx.fillStyle = '#7dd3fc';
  ctx.fillRect(330, 350, 760 * (score / 100), 26);
  ctx.fillStyle = '#e0f2fe';
  ctx.font = '700 28px Arial';
  ctx.fillText(`ENGAGEMENT  ${score}%`, 330, 410);

  ctx.fillStyle = 'rgba(224,242,254,0.75)';
  ctx.font = '500 22px Arial';
  ctx.fillText('You were part of the music, not just the audience.', 64, 610);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Could not create memory card image'));
    }, 'image/png');
  });
}

function RainOverlay() {
  const drops = Array.from({ length: 18 }, (_, index) => index);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-20">
      {drops.map((drop) => (
        <span
          key={drop}
          className="absolute top-[-15%] h-20 w-px bg-sky-200/50 animate-pulse"
          style={{ left: `${(drop * 17) % 100}%`, animationDelay: `${drop * 0.18}s` }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');
  const [dbData, setDbData] = useState(getLocalDB);
  const [audienceSession, setAudienceSession] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('overview');
  const [showSqlModal, setShowSqlModal] = useState(false);

  const [supabaseEvents, setSupabaseEvents] = useState([]);
  const [supabasePerformances, setSupabasePerformances] = useState([]);
  const [supabaseMusicians, setSupabaseMusicians] = useState([]);
  const [supabaseAudience, setSupabaseAudience] = useState([]);
  const [supabaseInteractions, setSupabaseInteractions] = useState([]);
  const [supabaseVotes, setSupabaseVotes] = useState([]);
  const [supabaseReactions, setSupabaseReactions] = useState([]);
  const [supabasePeople, setSupabasePeople] = useState([]);
  const [analyticsSnapshots, setAnalyticsSnapshots] = useState([]);
  const [supabaseMemoryCards, setSupabaseMemoryCards] = useState([]);

  useEffect(() => {
    const loadEventData = async () => {
      if (!supabase) return;

      const [eventsResult, performancesResult, musiciansResult, audienceResult, interactionsResult, votesResult, reactionsResult, peopleResult, snapshotsResult, memoryCardsResult] = await Promise.all([
        supabase.from('events').select('*').eq('id', APP_EVENT_ID),
        supabase.from('performances').select('*').eq('event_id', APP_EVENT_ID).order('display_order', { ascending: true }),
        supabase.from('musicians').select('*'),
        supabase.from('audience').select('*').eq('event_id', APP_EVENT_ID).order('joined_at', { ascending: true }),
        supabase.from('interactions').select('*').eq('event_id', APP_EVENT_ID).order('created_at', { ascending: false }),
        supabase.from('interaction_votes').select('*'),
        supabase.from('performance_reactions').select('*'),
        supabase.from('event_people').select('*').eq('event_id', APP_EVENT_ID).order('display_order', { ascending: true }),
        supabase.from('event_analytics_snapshots').select('*').eq('event_id', APP_EVENT_ID).order('created_at', { ascending: false }),
        supabase.from('audience_memory_cards').select('*').eq('event_id', APP_EVENT_ID).order('updated_at', { ascending: false }),
      ]);

      if (eventsResult.error) console.error('Events error:', eventsResult.error);
      if (performancesResult.error) console.error('Performances error:', performancesResult.error);
      if (musiciansResult.error) console.error('Musicians error:', musiciansResult.error);
      if (audienceResult.error) console.error('Audience error:', audienceResult.error);
      if (interactionsResult.error) console.error('Interactions error:', interactionsResult.error);
      if (votesResult.error) console.error('Votes error:', votesResult.error);
      if (reactionsResult.error) console.error('Reactions error:', reactionsResult.error);
      if (peopleResult.error) console.warn('People table not ready yet:', peopleResult.error);
      if (snapshotsResult.error) console.warn('Analytics snapshot table not ready yet:', snapshotsResult.error);
      if (memoryCardsResult.error) console.warn('Memory card table not ready yet:', memoryCardsResult.error);

      setSupabaseEvents(eventsResult.data || []);
      setSupabasePerformances(performancesResult.data || []);
      setSupabaseMusicians(musiciansResult.data || []);
      setSupabaseAudience(audienceResult.data || []);
      setSupabaseInteractions(interactionsResult.data || []);
      setSupabaseVotes(votesResult.data || []);
      setSupabaseReactions(reactionsResult.data || []);
      setSupabasePeople(peopleResult.data || []);
      setAnalyticsSnapshots(snapshotsResult.data || []);
      setSupabaseMemoryCards(memoryCardsResult.data || []);
    };

    loadEventData();
  }, []);

  useEffect(() => {
    if (!supabase) return undefined;

    const channel = supabase
      .channel('music-night-live-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'performances' }, (payload) => {
        setSupabasePerformances((current) => applyRealtimeRowChange(current, payload));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'interactions' }, (payload) => {
        setSupabaseInteractions((current) => applyRealtimeRowChange(current, payload));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'interaction_votes' }, (payload) => {
        setSupabaseVotes((current) => current.some((row) => row.id === payload.new.id) ? current : [...current, payload.new]);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'performance_reactions' }, (payload) => {
        setSupabaseReactions((current) => current.some((row) => row.id === payload.new.id) ? current : [...current, payload.new]);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'audience' }, (payload) => {
        setSupabaseAudience((current) => applyRealtimeRowChange(current, payload));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_people' }, (payload) => {
        setSupabasePeople((current) => applyRealtimeRowChange(current, payload));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_analytics_snapshots' }, (payload) => {
        setAnalyticsSnapshots((current) => applyRealtimeRowChange(current, payload));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'audience_memory_cards' }, (payload) => {
        setSupabaseMemoryCards((current) => applyRealtimeRowChange(current, payload));
      })
      .subscribe((status) => {
        console.log('🔥 REALTIME STATUS:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      if (savedSession) setAudienceSession(JSON.parse(savedSession));
    } catch (error) {
      console.warn('Session restore error', error);
    }
  }, []);

  useEffect(() => {
    const handleSync = (data) => {
      if (data) setDbData(data);
    };

    const onCustomEvent = (event) => handleSync(event.detail);
    window.addEventListener('mn_db_update', onCustomEvent);

    let bc = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('mn_realtime_bus');
        bc.onmessage = (event) => handleSync(event.data);
      } catch (error) {
        console.warn('Broadcast setup error', error);
      }
    }

    const onStorage = (event) => {
      if (event.key === SYNC_KEY && event.newValue) {
        try {
          setDbData(JSON.parse(event.newValue));
        } catch (error) {
          console.warn('Storage parse error', error);
        }
      }
    };

    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('mn_db_update', onCustomEvent);
      window.removeEventListener('storage', onStorage);
      if (bc) bc.close();
    };
  }, []);

  const navigate = (hash) => {
    window.location.hash = hash;
    setCurrentRoute(hash);
  };

  const updateDatabase = (updater) => {
    setDbData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveAndBroadcastLocalDB(next);
      return next;
    });
  };

  const handleAudienceJoin = async (nickname, photoFile = null) => {
    let existingSession = null;
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) existingSession = JSON.parse(raw);
    } catch (error) {
      console.warn('Session read error', error);
    }

    const cleanNickname = (nickname || '').trim() || 'Audience Guest';
    const sessionId = existingSession?.sessionId || `sess_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`;
    let photoUrl = existingSession?.photoUrl || '';

    if (photoFile && supabase) {
      const upload = await uploadEventMedia(photoFile, `audience/${APP_EVENT_ID}`, sessionId);
      if (upload.error) {
        console.error('Audience photo upload error:', upload.error);
        alert(`Photo upload failed: ${upload.error.message}. You can continue without a photo.`);
      } else {
        photoUrl = upload.url;
      }
    }

    const newSession = {
      nickname: cleanNickname,
      sessionId,
      eventId: APP_EVENT_ID,
      photoUrl,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    } catch (error) {
      console.warn('Session write error', error);
    }
    setAudienceSession(newSession);

    updateDatabase((prev) => {
      const exists = prev.audience.some((audience) => audience.session_id === sessionId);
      if (exists) {
        return {
          ...prev,
          audience: prev.audience.map((audience) => audience.session_id === sessionId
            ? { ...audience, nickname: cleanNickname, photo_url: photoUrl, last_active_at: new Date().toISOString() }
            : audience),
        };
      }

      return {
        ...prev,
        audience: [
          ...prev.audience,
          {
            id: `aud_${Date.now()}`,
            event_id: APP_EVENT_ID,
            nickname: cleanNickname,
            session_id: sessionId,
            photo_url: photoUrl,
            joined_at: newSession.joinedAt,
            last_active_at: new Date().toISOString(),
          },
        ],
      };
    });

    if (supabase) {
      const { data: existingAudience, error: lookupError } = await supabase
        .from('audience')
        .select('id')
        .eq('event_id', APP_EVENT_ID)
        .eq('session_id', sessionId)
        .limit(1);

      if (!lookupError && (!existingAudience || existingAudience.length === 0)) {
        const { error: insertError } = await supabase.from('audience').insert({
          event_id: APP_EVENT_ID,
          nickname: cleanNickname,
          session_id: sessionId,
          photo_url: photoUrl || null,
        });
        if (insertError) console.error('Audience registration error:', insertError);
      } else if (!lookupError && existingAudience?.length) {
        await supabase.from('audience').update({ nickname: cleanNickname, photo_url: photoUrl || null }).eq('id', existingAudience[0].id);
      }
    }

    navigate('#/event');
  };

  const handleAudiencePhotoUpload = async (file) => {
    if (!file || !audienceSession || !supabase) return;
    const upload = await uploadEventMedia(file, `audience/${APP_EVENT_ID}`, audienceSession.sessionId);
    if (upload.error) {
      alert(`Photo upload failed: ${upload.error.message}`);
      return;
    }
    await supabase.from('audience').update({ photo_url: upload.url }).eq('event_id', APP_EVENT_ID).eq('session_id', audienceSession.sessionId);
    const nextSession = { ...audienceSession, photoUrl: upload.url };
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setAudienceSession(nextSession);
  };


  const nowPlayingPerformance = supabasePerformances.find((performance) => performance.status === 'playing') || null;

  useEffect(() => {
    if (!supabase || !audienceSession?.sessionId) return;
    const myVotes = supabaseVotes.filter((vote) => vote.audience_id === audienceSession.sessionId).length;
    const myReactions = supabaseReactions.filter((reaction) => reaction.audience_id === audienceSession.sessionId).length;
    const profile = getEngagementProfile(myVotes, myReactions);
    supabase.from('audience_memory_cards').upsert({
      event_id: APP_EVENT_ID,
      audience_id: audienceSession.sessionId,
      audience_name: audienceSession.nickname || 'Audience Guest',
      photo_url: audienceSession.photoUrl || null,
      engagement_score: profile.score,
      engagement_tag: profile.tag,
      snapshot: { votes: myVotes, reactions: myReactions },
      updated_at: new Date().toISOString(),
    }, { onConflict: 'event_id,audience_id' }).then(({ error }) => {
      if (error) console.warn('Memory card sync skipped:', error.message);
    });
  }, [audienceSession, supabaseVotes, supabaseReactions]);

  const audienceData = supabaseAudience.length > 0 ? supabaseAudience : dbData.audience;
  const musiciansData = supabaseMusicians.length > 0 ? supabaseMusicians : dbData.musicians;
  const eventName = EVENT_DISPLAY_NAME;
  const people = useMemo(() => mergePeople(supabasePeople), [supabasePeople]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-950 via-slate-900 to-indigo-950 text-slate-100 font-sans selection:bg-sky-400/40 antialiased relative overflow-x-hidden">
      <RainOverlay />
      <div className="bg-slate-900/90 border-b border-slate-800 text-xs py-2 px-4 backdrop-blur sticky top-0 z-50 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-bold text-purple-400">
            <Music className="w-4 h-4" />
            <span>Music Night Live</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
            Event: <strong className="text-slate-200">{eventName}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSqlModal(true)}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-purple-300 px-2.5 py-1 rounded-lg border border-purple-500/20 text-[11px] font-medium transition"
          >
            <Database className="w-3 h-3 text-purple-400" /> Supabase SQL
          </button>

          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => navigate(audienceSession ? '#/event' : '#/')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${currentRoute.startsWith('#/') && !currentRoute.startsWith('#/admin') ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Audience
            </button>
            <button
              onClick={() => navigate('#/admin')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${currentRoute.startsWith('#/admin') ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Admin Room
            </button>
          </div>
        </div>
      </div>

      {currentRoute === '#/' || currentRoute === '#/join' ? (
        <AudienceLanding session={audienceSession} onJoin={handleAudienceJoin} onContinue={() => navigate('#/event')} />
      ) : currentRoute === '#/event' ? (
        <AudienceHome
          session={audienceSession}
          dbData={dbData}
          musicians={musiciansData}
          nowPlaying={nowPlayingPerformance}
          supabaseInteractions={supabaseInteractions}
          supabaseVotes={supabaseVotes}
          supabaseReactions={supabaseReactions}
          people={people}
          audienceProfile={supabaseAudience.find((row) => row.session_id === audienceSession?.sessionId) || dbData.audience.find((row) => row.session_id === audienceSession?.sessionId) || null}
          onAudiencePhotoUpload={handleAudiencePhotoUpload}
          onChangeNickname={() => navigate('#/join')}
        />
      ) : currentRoute === '#/admin/login' || (!isAdminLoggedIn && currentRoute.startsWith('#/admin')) ? (
        <AdminLogin
          onLogin={() => {
            setIsAdminLoggedIn(true);
            navigate('#/admin');
          }}
        />
      ) : currentRoute.startsWith('#/admin') ? (
        <AdminDashboard
          dbData={dbData}
          updateDatabase={updateDatabase}
          activeTab={activeAdminTab}
          setActiveTab={setActiveAdminTab}
          onLogout={() => {
            setIsAdminLoggedIn(false);
            navigate('#/admin/login');
          }}
          nowPlaying={nowPlayingPerformance}
          supabasePerformances={supabasePerformances}
          supabaseInteractions={supabaseInteractions}
          supabaseVotes={supabaseVotes}
          supabaseReactions={supabaseReactions}
          audienceCount={audienceData.length}
          supabaseAudience={supabaseAudience}
          people={people}
          analyticsSnapshots={analyticsSnapshots}
          supabaseMemoryCards={supabaseMemoryCards}
        />
      ) : (
        <AudienceLanding session={audienceSession} onJoin={handleAudienceJoin} onContinue={() => navigate('#/event')} />
      )}

      {showSqlModal && <SupabaseSqlModal onClose={() => setShowSqlModal(false)} />}
    </div>
  );
}

function applyRealtimeRowChange(current, payload) {
  if (payload.eventType === 'INSERT') {
    return current.some((row) => row.id === payload.new.id) ? current : [payload.new, ...current];
  }
  if (payload.eventType === 'UPDATE') {
    return current.map((row) => row.id === payload.new.id ? payload.new : row);
  }
  if (payload.eventType === 'DELETE') {
    return current.filter((row) => row.id !== payload.old.id);
  }
  return current;
}

function AudienceLanding({ session, onJoin, onContinue }) {
  const [nickname, setNickname] = useState(session?.nickname || '');
  const [photoFile, setPhotoFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (nickname.trim()) onJoin(nickname.trim(), photoFile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative z-10">
      <div className="w-full max-w-md">
        <div className="bg-sky-950/80 border border-sky-200/10 rounded-3xl p-7 shadow-2xl text-center backdrop-blur-xl">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-sky-300/10 border border-sky-200/20 flex items-center justify-center mb-5">
            <CloudRain className="w-10 h-10 text-sky-200" />
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-sky-200 font-bold mb-2">Welcome to</p>
          <h1 className="text-3xl font-black text-white tracking-tight">{EVENT_DISPLAY_NAME}</h1>
          <p className="text-sm text-sky-100/65 mt-3 leading-relaxed">Experience the performances, interact with the stage, and be part of the evening.</p>
          <div className="h-px bg-sky-100/10 my-6" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-left">
              <label className="text-xs font-bold text-sky-100/70 uppercase tracking-wider">Your Name</label>
              <input type="text" value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder="Enter your name" className="w-full mt-2 bg-slate-950/70 border border-sky-100/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-sky-100/30 outline-none focus:border-sky-300 focus:ring-1 focus:ring-sky-300 transition" maxLength={30} autoComplete="off" />
            </div>
            <div className="text-left">
              <label className="text-xs font-bold text-sky-100/70 uppercase tracking-wider">Photo for your memory card <span className="normal-case text-sky-100/30">(optional)</span></label>
              <input type="file" accept="image/*" onChange={(event) => setPhotoFile(event.target.files?.[0] || null)} className="w-full mt-2 text-xs text-sky-100/60 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-200/10 file:px-3 file:py-2 file:text-xs file:font-bold file:text-sky-100" />
            </div>
            <button type="submit" disabled={!nickname.trim()} className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 rounded-xl py-3.5 font-black text-sm transition flex items-center justify-center gap-2">Join {EVENT_DISPLAY_NAME} <ArrowRight className="w-4 h-4" /></button>
          </form>
          {session?.nickname && <button onClick={onContinue} className="w-full mt-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl py-3 text-sm font-semibold transition">Continue as {session.nickname}</button>}
          <div className="mt-7 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-sky-100/35"><Radio className="w-3 h-3" /> Live Event <span>•</span> Audience Experience</div>
        </div>
        <p className="text-center text-[10px] text-sky-100/35 mt-5">WATCH → FEEL → PARTICIPATE → REMEMBER</p>
      </div>
    </div>
  );
}

function AudienceHome({ session, dbData, musicians, nowPlaying, supabaseInteractions, supabaseVotes, supabaseReactions, people, audienceProfile, onAudiencePhotoUpload, onChangeNickname }) {
  const nickname = session?.nickname || 'Guest';
  const [showPeopleModal, setShowPeopleModal] = useState(false);
  const [peopleTab, setPeopleTab] = useState('anchor');
  const [voteMessage, setVoteMessage] = useState('');
  const [reactionMessage, setReactionMessage] = useState('');

  const liveInteraction = useMemo(() => supabaseInteractions.find((interaction) => interaction.event_id === APP_EVENT_ID && interaction.status === 'live') || null, [supabaseInteractions]);
  const currentPerformer = people.find((person) => person.category === 'performer' && person.name === nowPlaying?.performer) || people.find((person) => person.category === 'performer') || null;
  const musicianPeople = people.filter((person) => person.category === 'musician');
  const anchorPeople = people.filter((person) => person.category === 'anchor');
  const organizerPeople = people.filter((person) => person.category === 'organizer');

  const hasVoted = Boolean(liveInteraction && session?.sessionId && supabaseVotes.some((vote) => vote.interaction_id === liveInteraction.id && vote.audience_id === session.sessionId));
  const myReaction = nowPlaying && session?.sessionId ? supabaseReactions.find((reaction) => reaction.performance_id === nowPlaying.id && reaction.audience_id === session.sessionId)?.reaction : null;
  const myVotes = session?.sessionId ? supabaseVotes.filter((vote) => vote.audience_id === session.sessionId) : [];
  const myReactions = session?.sessionId ? supabaseReactions.filter((row) => row.audience_id === session.sessionId) : [];
  const engagement = getEngagementProfile(myVotes.length, myReactions.length);
  const photoUrl = audienceProfile?.photo_url || session?.photoUrl || '';

  const handleVote = async (option) => {
    if (!supabase || !liveInteraction || !session?.sessionId || hasVoted) return;
    setVoteMessage('Submitting…');
    const { error } = await supabase.from('interaction_votes').insert({ interaction_id: liveInteraction.id, audience_id: session.sessionId, selected_option: option });
    if (error) {
      setVoteMessage(error.code === '23505' ? 'You already answered this one.' : `Vote failed: ${error.message}`);
      return;
    }
    setVoteMessage(liveInteraction.type === 'guess_song' ? (liveInteraction.correct_option === option ? 'Correct! 🎉' : `Not quite — correct answer: ${liveInteraction.correct_option}`) : 'Vote recorded ✓');
  };

  const handleReaction = async (reaction) => {
    if (!supabase || !nowPlaying || !session?.sessionId || myReaction) return;
    setReactionMessage('Sending…');
    const { error } = await supabase.from('performance_reactions').insert({ performance_id: nowPlaying.id, audience_id: session.sessionId, reaction });
    if (error) setReactionMessage(error.code === '23505' ? 'You already reacted to this performance.' : `Reaction failed: ${error.message}`);
    else setReactionMessage('Reaction sent ✓');
  };

  const interactionResults = liveInteraction ? liveInteraction.options.map((option) => {
    const votes = supabaseVotes.filter((vote) => vote.interaction_id === liveInteraction.id && vote.selected_option === option).length;
    const total = supabaseVotes.filter((vote) => vote.interaction_id === liveInteraction.id).length;
    return { option, votes, percentage: total ? Math.round((votes / total) * 100) : 0 };
  }) : [];

  const performanceReactionCounts = nowPlaying ? REACTION_OPTIONS.map((reaction) => ({ reaction, count: supabaseReactions.filter((row) => row.performance_id === nowPlaying.id && row.reaction === reaction).length })) : [];

  const openPeople = (tab) => {
    setPeopleTab(tab);
    setShowPeopleModal(true);
  };

  const handleDownloadCard = async () => {
    const blob = await buildMemoryCardBlob({ name: nickname, photoUrl, score: engagement.score, tag: engagement.tag });
    downloadBlob(blob, `${EVENT_DISPLAY_NAME.replace(/\s+/g, '-')}-${nickname.replace(/\s+/g, '-')}-memory.png`);
  };

  const handleShareCard = async () => {
    const blob = await buildMemoryCardBlob({ name: nickname, photoUrl, score: engagement.score, tag: engagement.tag });
    const file = new File([blob], `${EVENT_DISPLAY_NAME.replace(/\s+/g, '-')}-memory.png`, { type: 'image/png' });
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      try {
        await navigator.share({ title: `${EVENT_DISPLAY_NAME} Memory`, text: `${nickname} • ${engagement.tag}`, files: [file] });
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }
    downloadBlob(blob, `${EVENT_DISPLAY_NAME.replace(/\s+/g, '-')}-memory.png`);
  };

  return (
    <>
      <div className="max-w-md mx-auto p-4 pb-20 space-y-5 relative z-10">
        <div className="flex items-center justify-between bg-sky-950/70 border border-sky-100/10 rounded-2xl p-4 backdrop-blur shadow-md">
          <div><span className="text-[11px] font-bold text-sky-100/50 uppercase tracking-wider block">Audience Member</span><h2 className="text-lg font-bold text-white">Good evening, {nickname} 👋</h2></div>
          <button onClick={onChangeNickname} className="text-xs text-sky-200 hover:text-white bg-sky-300/10 px-2.5 py-1 rounded-lg border border-sky-200/20 font-medium transition">Change</button>
        </div>

        <div className="bg-gradient-to-br from-sky-950 via-slate-900 to-indigo-950 border border-sky-200/15 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-sky-300/10 rounded-full blur-2xl pointer-events-none" />
          <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-sky-200 bg-sky-300/10 px-3.5 py-1 rounded-full border border-sky-200/20 mb-4"><CloudRain className="w-4 h-4" /> Now Playing</div>
          {nowPlaying ? <div className="space-y-4"><h1 className="text-3xl md:text-4xl font-black text-white tracking-tight font-serif leading-tight">🎤 {nowPlaying.title}</h1><p className="text-xl text-sky-200 font-semibold">{nowPlaying.performer}</p>{currentPerformer && <p className="text-xs text-sky-100/70 leading-relaxed max-w-xs mx-auto">{currentPerformer.intro}</p>}<div className="pt-1 flex justify-center items-center gap-1"><span className="w-1.5 h-4 bg-sky-300 rounded-full animate-bounce" /><span className="w-1.5 h-6 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.2s]" /><span className="w-1.5 h-3 bg-cyan-300 rounded-full animate-bounce [animation-delay:0.4s]" /></div></div> : <div className="py-6"><Radio className="w-10 h-10 text-sky-100/25 mx-auto mb-2 animate-pulse" /><p className="text-sky-100/50 text-sm font-medium">Intermission / Preparing Next Act</p></div>}
        </div>

        {nowPlaying && currentPerformer && <PersonFeatureCard title="Know the Performer" person={currentPerformer} buttonText="Know more" onClick={() => openPeople('performer')} accent="sky" />}

        {liveInteraction && <div className="bg-slate-900/85 border border-emerald-300/25 rounded-3xl p-5 shadow-xl"><div className="flex items-center justify-between mb-2"><div className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-emerald-300"><span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" /> Live Interaction</div>{hasVoted && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}</div><h3 className="text-lg font-black text-white">{liveInteraction.question || liveInteraction.title}</h3><p className="text-xs text-slate-400 mt-1">{liveInteraction.type === 'guess_song' ? 'Guess the song' : 'Tap one option'}</p><div className="space-y-2 mt-4">{interactionResults.map(({ option, votes, percentage }) => <button key={option} disabled={hasVoted} onClick={() => handleVote(option)} className={`w-full relative overflow-hidden border rounded-xl px-3 py-3 text-left transition ${hasVoted ? 'border-slate-700 bg-slate-950' : 'border-slate-700 hover:border-emerald-300 bg-slate-950'}`}>{hasVoted && <div className="absolute inset-y-0 left-0 bg-emerald-300/10" style={{ width: `${percentage}%` }} />}<div className="relative flex items-center justify-between gap-3"><span className="text-sm text-white font-medium">{option}</span>{hasVoted && <span className="text-xs font-bold text-emerald-300">{percentage}%</span>}</div>{hasVoted && <div className="relative mt-1 text-[10px] text-slate-500">{votes} vote{votes === 1 ? '' : 's'}</div>}</button>)}</div>{voteMessage && <p className="text-xs text-emerald-300 mt-3">{voteMessage}</p>}</div>}

        {nowPlaying && <div className="bg-slate-900/85 border border-cyan-200/15 rounded-3xl p-5 shadow-xl"><div className="flex items-center justify-between"><div><h3 className="text-sm font-black text-white">React to the performance</h3><p className="text-[11px] text-slate-400 mt-1">One reaction per performance</p></div><Heart className="w-5 h-5 text-pink-300" /></div><div className="grid grid-cols-4 gap-2 mt-4">{performanceReactionCounts.map(({ reaction, count }) => <button key={reaction} disabled={Boolean(myReaction)} onClick={() => handleReaction(reaction)} className={`rounded-2xl py-3 border transition ${myReaction === reaction ? 'bg-pink-500/20 border-pink-300/60' : 'bg-slate-950 border-slate-800 hover:border-cyan-200/50'}`}><div className="text-xl">{reaction}</div><div className="text-[10px] text-slate-400 mt-1">{count}</div></button>)}</div>{reactionMessage && <p className="text-xs text-pink-200 mt-3">{reactionMessage}</p>}</div>}

        <div className="bg-slate-900/80 border border-sky-200/10 rounded-3xl p-5 backdrop-blur"><div className="flex items-center justify-between mb-4"><div><h3 className="text-sm font-bold text-white">Know the Musicians</h3><p className="text-[11px] text-slate-400 mt-1">The people creating the live sound tonight</p></div><Volume2 className="w-5 h-5 text-sky-200" /></div><div className="grid grid-cols-2 gap-3">{musicianPeople.map((person) => <PersonMiniPhotoCard key={person.id || person.name} person={person} />)}</div><button onClick={() => openPeople('musician')} className="w-full mt-4 bg-sky-300/10 hover:bg-sky-300/15 text-sky-100 border border-sky-200/15 rounded-xl py-2.5 text-xs font-bold transition">See musician details</button></div>

        <div className="bg-slate-900/80 border border-sky-200/10 rounded-3xl p-5 backdrop-blur"><div className="flex items-center justify-between"><div><h3 className="text-sm font-bold text-white">Anchors & Organising Team</h3><p className="text-[11px] text-slate-400 mt-1">Meet the people making the evening happen</p></div><Sparkles className="w-5 h-5 text-sky-200" /></div><div className="grid grid-cols-2 gap-3 mt-4">{anchorPeople.slice(0, 2).map((person) => <PersonMiniPhotoCard key={person.id || person.name} person={person} />)}</div><button onClick={() => openPeople('anchor')} className="w-full mt-4 bg-sky-300/10 hover:bg-sky-300/15 text-sky-100 border border-sky-200/15 rounded-xl py-2.5 text-xs font-bold transition">Know More: Anchors & Team</button></div>

        <div className="bg-gradient-to-r from-sky-950/80 to-indigo-950/70 border border-sky-200/10 rounded-3xl p-5"><div className="flex items-center justify-between"><div><div className="text-xs font-bold uppercase tracking-widest text-sky-200 flex items-center gap-2"><Zap className="w-4 h-4" /> Your Memory Card</div><h3 className="text-xl font-black text-white mt-2">{engagement.tag}</h3><p className="text-xs text-sky-100/60 mt-1">Built from your live participation tonight.</p></div><div className="text-3xl font-black text-sky-200">{engagement.score}%</div></div><div className="h-3 rounded-full bg-white/10 mt-4 overflow-hidden"><div className="h-full bg-sky-300 rounded-full" style={{ width: `${engagement.score}%` }} /></div><div className="mt-4 rounded-2xl border border-sky-100/10 bg-slate-950/40 p-3 flex items-center gap-3"><div className="w-14 h-14 rounded-xl overflow-hidden bg-sky-300/10 border border-sky-100/10 flex items-center justify-center text-xl text-sky-100">{photoUrl ? <img src={photoUrl} alt={nickname} className="w-full h-full object-cover" /> : (nickname.charAt(0).toUpperCase())}</div><div className="flex-1"><p className="text-xs text-sky-100/45">Memory card name</p><p className="text-sm font-bold text-white">{nickname}</p>{!photoUrl && <p className="text-[10px] text-sky-100/40 mt-1">Add a photo for a personal memory card.</p>}</div>{!photoUrl && <label className="cursor-pointer text-[10px] font-bold text-sky-100 bg-sky-300/10 border border-sky-100/10 rounded-lg px-2 py-1.5"><Camera className="w-3 h-3 inline mr-1" /> Add<input type="file" accept="image/*" className="hidden" onChange={(event) => onAudiencePhotoUpload(event.target.files?.[0])} /></label>}</div><div className="flex gap-2 mt-3"><button onClick={handleDownloadCard} className="flex-1 bg-sky-300 text-slate-950 font-black text-xs rounded-xl py-2.5 flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Download</button><button onClick={handleShareCard} className="flex-1 bg-slate-800 text-white font-bold text-xs rounded-xl py-2.5 flex items-center justify-center gap-2 border border-slate-700"><Share2 className="w-4 h-4" /> Share</button></div></div>

        <div className="bg-slate-900/65 border border-sky-200/10 rounded-3xl p-5"><div className="flex items-center gap-2 text-sky-200 text-xs font-bold uppercase tracking-widest"><Zap className="w-4 h-4" /> Your Music Night</div><div className="grid grid-cols-2 gap-3 mt-4"><StatBox label="Votes" value={myVotes.length} /><StatBox label="Reactions" value={myReactions.length} /></div></div>
        <div className="text-center text-[10px] uppercase font-bold tracking-widest text-sky-100/30 pt-2">WATCH → EXPERIENCE → PARTICIPATE → REMEMBER</div>
      </div>

      {showPeopleModal && <EventPeopleModal people={people} initialTab={peopleTab} currentPerformer={currentPerformer} onClose={() => setShowPeopleModal(false)} />}
    </>
  );
}

function PersonFeatureCard({ title, person, onClick }) {
  return <div className="bg-slate-900/85 border border-sky-200/15 rounded-3xl p-5"><div className="flex items-center gap-4"><div className="w-16 h-16 rounded-2xl overflow-hidden bg-sky-300/10 border border-sky-200/15 flex items-center justify-center text-2xl">{person.photo ? <img src={person.photo} alt={person.name} className="w-full h-full object-cover" /> : '🎤'}</div><div className="flex-1"><p className="text-[10px] uppercase tracking-widest text-sky-200 font-bold">{title}</p><h3 className="text-lg font-black text-white mt-1">{person.name}</h3><p className="text-xs text-slate-400 mt-1">{person.role}</p></div></div><p className="text-xs text-sky-100/65 leading-relaxed mt-3">{person.intro}</p><button onClick={onClick} className="mt-3 text-xs font-bold text-sky-200">Know more →</button></div>;
}

function PersonMiniPhotoCard({ person }) {
  return <div className="bg-slate-950/70 border border-sky-200/10 p-3 rounded-2xl"><div className="w-full aspect-square max-h-32 rounded-xl overflow-hidden bg-sky-300/10 border border-sky-100/10 flex items-center justify-center text-2xl">{person.photo ? <img src={person.photo} alt={person.name} className="w-full h-full object-cover" /> : (person.icon || (person.category === 'musician' ? instrumentEmoji(person.instrument) : '🎙️'))}</div><p className="text-sm font-bold text-white mt-2 truncate">{person.name}</p><p className="text-[11px] text-sky-200/70 truncate">{person.role || person.instrument}</p></div>;
}

function StatBox({ label, value }) {
  return <div className="bg-slate-950 border border-sky-200/10 rounded-2xl p-3 text-center"><div className="text-2xl font-black text-white">{value}</div><div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">{label}</div></div>;
}

function instrumentEmoji(instrument) {
  return { Guitar: '🎸', Keyboard: '🎹', Drums: '🥁', Bass: '🎸', Violin: '🎻', Flute: '🪈', Tabla: '🥁' }[instrument] || '🎵';
}

function EventPeopleModal({ people, currentPerformer, initialTab, onClose }) {
  const [tab, setTab] = useState(initialTab || 'performer');
  const groups = {
    performer: { title: 'Performers', icon: '🎤', people: people.filter((person) => person.category === 'performer') },
    musician: { title: 'Live Musicians', icon: '🎼', people: people.filter((person) => person.category === 'musician') },
    anchor: { title: 'Anchors / MoC', icon: '🎙️', people: people.filter((person) => person.category === 'anchor') },
    organizer: { title: 'Organising Team', icon: '✨', people: people.filter((person) => person.category === 'organizer') },
  };
  const currentGroup = groups[tab] || groups.performer;

  return <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"><div className="bg-sky-950 border border-sky-100/10 rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl"><div className="p-4 border-b border-sky-100/10 flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-widest text-sky-200 font-bold">{EVENT_DISPLAY_NAME}</p><h2 className="text-lg font-black text-white">Know More</h2></div><button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button></div><div className="flex gap-2 p-3 overflow-x-auto border-b border-sky-100/10">{Object.entries(groups).map(([key, group]) => <button key={key} onClick={() => setTab(key)} className={`whitespace-nowrap px-3 py-2 rounded-xl text-[11px] font-bold border ${tab === key ? 'bg-sky-300 text-slate-950 border-sky-200' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>{group.icon} {group.title}</button>)}</div><div className="overflow-y-auto max-h-[calc(90vh-130px)] p-4 space-y-4">{tab === 'performer' && currentPerformer && <div className="mb-2"><p className="text-[9px] uppercase tracking-widest text-sky-200 font-bold mb-2">Performing now</p><PersonDetailCard person={currentPerformer} /></div>}{currentGroup.people.length === 0 ? <div className="py-10 text-center text-slate-500 text-xs">No team members added yet.</div> : currentGroup.people.map((person) => <PersonDetailCard key={person.id || person.name} person={person} />)}</div></div></div>;
}

function PersonDetailCard({ person }) {
  return <div className="bg-slate-950/85 border border-sky-200/10 rounded-2xl p-4"><div className="flex items-start gap-3"><div className="w-14 h-14 rounded-xl bg-sky-300/10 border border-sky-100/10 flex items-center justify-center text-xl overflow-hidden">{person.photo ? <img src={person.photo} alt={person.name} className="w-full h-full object-cover" /> : (person.icon || (person.category === 'musician' ? instrumentEmoji(person.instrument) : person.category === 'anchor' ? '🎙️' : person.category === 'organizer' ? '✨' : '🎤'))}</div><div className="flex-1"><h4 className="text-sm font-bold text-white">{person.name}</h4><p className="text-xs text-sky-200/80">{person.role || person.instrument}</p></div></div><p className="text-xs text-sky-100/65 leading-relaxed mt-3">{person.intro || 'Part of the team behind the evening.'}</p><div className="grid grid-cols-2 gap-2 mt-3"><InfoBox label="Age" value={person.age || '—'} /><InfoBox label="Work" value={person.work || '—'} /><div className="col-span-2"><InfoBox label="Workplace" value={person.workplace || '—'} /></div></div><div className="mt-2"><InfoBox label="Achievements" value={person.achievements || '—'} /></div></div>;
}

function InfoBox({ label, value }) {
  return <div className="bg-slate-900 rounded-xl p-2.5"><p className="text-[9px] uppercase text-slate-500 font-bold">{label}</p><p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{value}</p></div>;
}
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('admin@musicnight.live');
  const [password, setPassword] = useState('stage2026');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-[calc(100vh-42px)] flex items-center justify-center p-6 max-w-md mx-auto">
      <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400 mb-2"><Lock className="w-8 h-8" /></div>
          <h2 className="text-2xl font-black text-white tracking-tight font-serif">Stage Control Login</h2>
          <p className="text-xs text-slate-400">Authorized Event Admin Control Room Access</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Admin Email</label><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none" /></div>
          <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Password</label><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none" /></div>
          <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2">Enter Control Dashboard <ArrowRight className="w-4 h-4" /></button>
        </form>
        <div className="text-center pt-2 border-t border-slate-800"><p className="text-[11px] text-slate-500">Prototype admin gate — connect Supabase Auth before production.</p></div>
      </div>
    </div>
  );
}

function AdminDashboard({ dbData, updateDatabase, activeTab, setActiveTab, onLogout, nowPlaying, supabasePerformances, supabaseInteractions, supabaseVotes, supabaseReactions, audienceCount, supabaseAudience, people, analyticsSnapshots, supabaseMemoryCards }) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'performances', label: 'Performances', icon: ListMusic },
    { id: 'musicians', label: 'Musicians', icon: Music },
    { id: 'people', label: 'People & Team', icon: Users },
    { id: 'audience', label: 'Audience', icon: Users },
    { id: 'interactions', label: 'Interactions', icon: MessageCircle },
    { id: 'analytics', label: 'Analytics', icon: Activity },
  ];

  return <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 relative z-10"><div className="bg-sky-950/75 border border-sky-100/10 rounded-3xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4 backdrop-blur"><div className="flex items-center gap-3"><div className="p-3 bg-sky-300/10 border border-sky-200/15 rounded-2xl text-sky-200"><CloudRain className="w-6 h-6 animate-pulse" /></div><div><span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-200 bg-sky-300/10 px-2 py-0.5 rounded-full border border-sky-200/10">Live Control Room</span><h1 className="text-2xl font-black text-white tracking-tight font-serif">{EVENT_DISPLAY_NAME}</h1></div></div><div className="flex items-center gap-3"><div className="bg-slate-950/70 px-3 py-1.5 rounded-xl border border-sky-100/10 text-xs flex items-center gap-2"><Users className="w-4 h-4 text-sky-200" /><span className="text-slate-400">Audience:</span><strong className="text-white font-bold text-sm">{audienceCount}</strong></div><button onClick={onLogout} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition text-xs flex items-center gap-1"><LogOut className="w-4 h-4" /> Logout</button></div></div><div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-sky-100/10">{tabs.map((tab) => { const Icon = tab.icon; const isActive = activeTab === tab.id; return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${isActive ? 'bg-sky-400 text-slate-950 shadow-lg' : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'}`}><Icon className="w-4 h-4" /><span>{tab.label}</span></button>; })}</div>{activeTab === 'overview' && <AdminOverviewTab nowPlaying={nowPlaying} dbData={dbData} audienceCount={audienceCount} />}{activeTab === 'performances' && <AdminPerformancesTab supabasePerformances={supabasePerformances} />}{activeTab === 'musicians' && <AdminMusiciansTab dbData={dbData} updateDatabase={updateDatabase} />}{activeTab === 'people' && <AdminPeopleTab people={people} />}{activeTab === 'audience' && <AdminAudienceTab dbData={dbData} audienceCount={audienceCount} supabaseAudience={supabaseAudience} />}{activeTab === 'interactions' && <AdminInteractionsTab supabaseInteractions={supabaseInteractions} supabaseVotes={supabaseVotes} />}{activeTab === 'analytics' && <AdminAnalyticsTab supabasePerformances={supabasePerformances} supabaseInteractions={supabaseInteractions} supabaseVotes={supabaseVotes} supabaseReactions={supabaseReactions} supabaseAudience={supabaseAudience} people={people} analyticsSnapshots={analyticsSnapshots} supabaseMemoryCards={supabaseMemoryCards} />}</div>;
}

function AdminOverviewTab({ nowPlaying, dbData, audienceCount }) {
  const endCurrentPerformance = async () => {
    if (!supabase || !nowPlaying) return;
    const { error } = await supabase.from('performances').update({ status: 'completed' }).eq('id', nowPlaying.id);
    if (error) alert(`Could not end performance: ${error.message}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title="Event Status"><div className="flex items-center justify-between"><h3 className="text-lg font-bold text-white">{EVENT_DISPLAY_NAME}</h3><span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">LIVE</span></div><p className="text-xs text-slate-400 mt-2">Date: 2026-10-15</p></InfoCard>
        <InfoCard title="Live Audience"><div className="flex items-center justify-between"><h3 className="text-3xl font-black text-purple-400">{audienceCount}</h3><Users className="w-8 h-8 text-purple-500/40" /></div><p className="text-xs text-slate-400">Connected sessions</p></InfoCard>
        <InfoCard title="Stage Musicians"><div className="flex items-center justify-between"><h3 className="text-3xl font-black text-pink-400">{dbData.musicians.length}</h3><Music className="w-8 h-8 text-pink-500/40" /></div><p className="text-xs text-slate-400">Configured musicians</p></InfoCard>
      </div>

      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 border border-purple-500/30 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2"><Disc className="w-5 h-5 text-purple-400" /><h3 className="text-base font-bold text-white">Current Stage Performance</h3></div>
          {nowPlaying && <button onClick={endCurrentPerformance} className="text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-xl border border-rose-500/30">End Performance</button>}
        </div>
        {nowPlaying ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"><div><span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Now Playing</span><h2 className="text-2xl font-black text-white font-serif mt-1">🎤 {nowPlaying.title}</h2><p className="text-sm font-semibold text-purple-300 mt-1">Performer: {nowPlaying.performer}</p><p className="text-xs text-slate-400 mt-0.5">Original: {nowPlaying.song_artist || '—'}</p></div><div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Live Musicians On Stage</span><div className="flex flex-wrap gap-2">{dbData.musicians.map((musician) => <span key={musician.id} className="text-xs font-semibold bg-purple-950/50 text-purple-200 border border-purple-500/20 px-2.5 py-1 rounded-lg">{musician.name} ({musician.instrument})</span>)}</div></div></div> : <div className="text-center py-6 text-slate-400 text-sm">No active song set.</div>}
      </div>
    </div>
  );
}

function InfoCard({ title, children }) {
  return <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{title}</span>{children}</div>;
}

function AdminPerformancesTab({ supabasePerformances }) {
  const [songName, setSongName] = useState('');
  const [performerName, setPerformerName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);

  const resetForm = () => {
    setSongName('');
    setPerformerName('');
    setArtistName('');
    setEditingId(null);
  };

  const handleAddOrUpdate = async (event) => {
    event.preventDefault();
    if (!supabase || !songName.trim() || !performerName.trim() || busy) return;
    setBusy(true);

    if (editingId) {
      const { error } = await supabase.from('performances').update({ title: songName.trim(), performer: performerName.trim(), song_artist: artistName.trim() }).eq('id', editingId);
      if (error) alert(`Could not update performance: ${error.message}`);
    } else {
      const newId = `perf_${Date.now()}`;
      const { error } = await supabase.from('performances').insert({ id: newId, event_id: APP_EVENT_ID, title: songName.trim(), performer: performerName.trim(), song_artist: artistName.trim(), display_order: supabasePerformances.length + 1, status: 'queued' });
      if (error) alert(`Could not add performance: ${error.message}`);
    }

    resetForm();
    setBusy(false);
  };

  const handleSetPlaying = async (id) => {
    if (!supabase) return;

    console.log('🔥 MAKE LIVE CLICKED:', id);

    const { data: currentLive, error: findError } = await supabase
      .from('performances')
      .select('id, status')
      .eq('event_id', APP_EVENT_ID)
      .eq('status', 'playing');

    if (findError) {
      console.error('🚨 FIND LIVE ERROR:', findError);
      alert(`Could not read current performance: ${findError.message}`);
      return;
    }

    if (currentLive?.length) {
      const { error: stopError } = await supabase
        .from('performances')
        .update({ status: 'queued' })
        .eq('event_id', APP_EVENT_ID)
        .eq('status', 'playing');

      if (stopError) {
        console.error('🚨 STOP ERROR:', stopError);
        alert(`Could not stop current performance: ${stopError.message}`);
        return;
      }
    }

    const { error: playError } = await supabase
      .from('performances')
      .update({ status: 'playing' })
      .eq('id', id)
      .eq('event_id', APP_EVENT_ID);

    if (playError) {
      console.error('🚨 MAKE LIVE ERROR:', playError);
      alert(`Could not make live: ${playError.message}`);
      return;
    }

    console.log('✅ PERFORMANCE IS LIVE:', id);
  };

  const handleEndPerformance = async (id) => {
    if (!supabase) return;
    const { error } = await supabase.from('performances').update({ status: 'completed' }).eq('id', id);
    if (error) alert(`Could not end performance: ${error.message}`);
  };

  const handleDelete = async (id) => {
    if (!supabase || !window.confirm('Are you sure you want to delete this performance?')) return;
    const { error } = await supabase.from('performances').delete().eq('id', id);
    if (error) alert(`Could not delete performance: ${error.message}`);
    if (editingId === id) resetForm();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddOrUpdate} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2"><Plus className="w-4 h-4 text-purple-400" />{editingId ? 'Edit Performance' : 'Add New Performance'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FormInput label="Song Name" value={songName} setValue={setSongName} placeholder="e.g. Tum Hi Ho" />
          <FormInput label="Performer" value={performerName} setValue={setPerformerName} placeholder="e.g. Aarushi" />
          <FormInput label="Original Artist" value={artistName} setValue={setArtistName} placeholder="e.g. Mohit Chauhan" required={false} />
        </div>
        <div className="flex gap-2"><button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl">{busy ? 'Saving…' : editingId ? 'Save Changes' : 'Add Performance'}</button>{editingId && <button type="button" onClick={resetForm} className="bg-slate-800 text-slate-300 font-bold text-xs px-4 py-2 rounded-xl">Cancel</button>}</div>
      </form>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
        <div className="flex items-center justify-between"><div><h3 className="text-sm font-bold text-white">Event Performance List</h3><p className="text-[10px] text-slate-500 mt-1">Control what the audience sees live</p></div><span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />Live Control</span></div>
        <div className="space-y-2">
          {supabasePerformances.map((performance, index) => {
            const isPlaying = performance.status === 'playing';
            return <div key={performance.id} className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${isPlaying ? 'bg-purple-950/40 border-purple-500/50' : 'bg-slate-950/60 border-slate-800'}`}>
              <div className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs">{index + 1}</span><div><h4 className="text-sm font-bold text-white flex items-center gap-2">{performance.title}{isPlaying && <span className="text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">LIVE NOW</span>}</h4><p className="text-xs text-purple-300">Singer: {performance.performer}</p>{performance.song_artist && <p className="text-[10px] text-slate-500 mt-0.5">Original: {performance.song_artist}</p>}</div></div>
              <div className="flex items-center gap-2">
                {!isPlaying && <button onClick={() => handleSetPlaying(performance.id)} className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1"><PlayCircle className="w-3.5 h-3.5" />Make Live</button>}
                {isPlaying && <button onClick={() => handleEndPerformance(performance.id)} className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-bold text-xs px-3 py-1.5 rounded-xl border border-rose-500/30">End Performance</button>}
                <button onClick={() => { setEditingId(performance.id); setSongName(performance.title || ''); setPerformerName(performance.performer || ''); setArtistName(performance.song_artist || ''); }} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(performance.id)} className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>;
          })}
        </div>
      </div>
    </div>
  );
}

function FormInput({ label, value, setValue, placeholder, required = true }) {
  return <div><label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</label><input type="text" value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} required={required} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500" /></div>;
}

function AdminMusiciansTab({ dbData, updateDatabase }) {
  const [name, setName] = useState('');
  const [instrument, setInstrument] = useState('Guitar');

  const handleAddMusician = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    updateDatabase((prev) => ({ ...prev, musicians: [...prev.musicians, { id: `mus_${Date.now()}`, event_id: APP_EVENT_ID, name: name.trim(), instrument }] }));
    setName('');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddMusician} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2"><Plus className="w-4 h-4 text-pink-400" /> Add Live Stage Musician</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput label="Musician Name" value={name} setValue={setName} placeholder="e.g. Rahul, Meera..." />
          <div><label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Instrument</label><select value={instrument} onChange={(event) => setInstrument(event.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"><option>Guitar</option><option>Keyboard</option><option>Drums</option><option>Bass</option><option>Violin</option><option>Flute</option><option>Tabla</option></select></div>
        </div>
        <button type="submit" className="bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs px-4 py-2 rounded-xl">Add Musician</button>
      </form>
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3"><h3 className="text-sm font-bold text-white">Configured Musicians</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{dbData.musicians.map((musician) => <div key={musician.id} className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between"><div><p className="text-sm font-bold text-white">{musician.name}</p><p className="text-xs text-purple-400">{musician.instrument}</p></div><button onClick={() => updateDatabase((prev) => ({ ...prev, musicians: prev.musicians.filter((row) => row.id !== musician.id) }))} className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>)}</div></div>
    </div>
  );
}

function AdminAudienceTab({ dbData, audienceCount, supabaseAudience }) {
  const audience = supabaseAudience.length > 0 ? supabaseAudience : dbData.audience;
  return <div className="bg-slate-900 border border-sky-100/10 rounded-3xl p-5 space-y-4 shadow-lg"><div className="flex items-center justify-between"><h3 className="text-sm font-bold text-white flex items-center gap-2"><Users className="w-4 h-4 text-sky-200" /> Live Audience Directory ({audienceCount})</h3><span className="text-xs text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">Realtime</span></div><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b border-slate-800 text-slate-400 uppercase font-extrabold text-[10px]"><th className="pb-3 pl-2">Audience Member</th><th className="pb-3">Joined</th><th className="pb-3">Session</th><th className="pb-3 pr-2 text-right">Status</th></tr></thead><tbody className="divide-y divide-slate-800/60">{audience.length ? audience.map((member) => <tr key={member.id || member.session_id}><td className="py-3 pl-2 font-bold text-white"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full overflow-hidden bg-sky-300/10 text-sky-200 border border-sky-200/10 flex items-center justify-center font-bold text-xs">{member.photo_url ? <img src={member.photo_url} alt={member.nickname} className="w-full h-full object-cover" /> : (member.nickname?.[0]?.toUpperCase() || 'A')}</div>{member.nickname}</div></td><td className="py-3 text-slate-300">{formatJoined(member.joined_at)}</td><td className="py-3 font-mono text-[11px] text-slate-500">{member.session_id?.slice(0, 16)}...</td><td className="py-3 pr-2 text-right"><span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20"><span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />Active</span></td></tr>) : <tr><td colSpan="4" className="py-8 text-center text-slate-500">No audience members yet.</td></tr>}</tbody></table></div></div>;
}

function formatJoined(value) {
  if (!value) return '—';
  if (value.includes('AM') || value.includes('PM')) return value;
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function AdminPeopleTab({ people }) {
  const [category, setCategory] = useState('organizer');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [saving, setSaving] = useState(false);

  const uploadPhoto = async (person, file) => {
    if (!supabase || !file) return;
    const upload = await uploadEventMedia(file, `people/${APP_EVENT_ID}`, person.id || person.name);
    if (upload.error) {
      alert(`Photo upload failed: ${upload.error.message}`);
      return;
    }
    const row = {
      id: person.id || `${person.category}_${Date.now()}`,
      event_id: APP_EVENT_ID,
      category: person.category,
      name: person.name,
      role: person.role || person.instrument || '',
      instrument: person.instrument || null,
      photo_url: upload.url,
      age: person.age || null,
      work: person.work || null,
      workplace: person.workplace || null,
      intro: person.intro || null,
      achievements: person.achievements || null,
      display_order: person.display_order || 0,
    };
    const { error } = await supabase.from('event_people').upsert(row, { onConflict: 'id' });
    if (error) alert(`Could not save person: ${error.message}`);
  };

  const addOrganizer = async (event) => {
    event.preventDefault();
    if (!supabase || !name.trim()) return;
    setSaving(true);
    const id = `organizer_${Date.now()}`;
    const { error } = await supabase.from('event_people').insert({ id, event_id: APP_EVENT_ID, category, name: name.trim(), role: role.trim() || 'Organising Team', display_order: 99 });
    setSaving(false);
    if (error) {
      alert(`Could not add team member: ${error.message}`);
      return;
    }
    setName('');
    setRole('');
  };

  const grouped = {
    performer: people.filter((person) => person.category === 'performer'),
    anchor: people.filter((person) => person.category === 'anchor'),
    musician: people.filter((person) => person.category === 'musician'),
    organizer: people.filter((person) => person.category === 'organizer'),
  };

  const section = (key, title, icon) => <div className="bg-slate-900 border border-sky-100/10 rounded-3xl p-5"><div className="flex items-center gap-2 mb-4"><span className="text-lg">{icon}</span><h3 className="text-sm font-bold text-white">{title}</h3></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{grouped[key].map((person) => <div key={person.id || person.name} className="bg-slate-950/70 border border-sky-100/10 rounded-2xl p-3"><div className="flex items-center gap-3"><div className="w-14 h-14 rounded-xl overflow-hidden bg-sky-300/10 border border-sky-200/10 flex items-center justify-center text-xl">{person.photo ? <img src={person.photo} alt={person.name} className="w-full h-full object-cover" /> : (person.category === 'musician' ? instrumentEmoji(person.instrument) : person.category === 'anchor' ? '🎙️' : person.category === 'organizer' ? '✨' : '🎤')}</div><div className="flex-1"><p className="text-sm font-bold text-white">{person.name}</p><p className="text-[11px] text-sky-200/70">{person.role || person.instrument}</p></div></div><label className="mt-3 cursor-pointer block text-center text-[11px] font-bold text-sky-200 bg-sky-300/10 border border-sky-200/10 rounded-xl px-3 py-2">{person.photo ? 'Replace Photo' : 'Upload Photo'}<input type="file" accept="image/*" className="hidden" onChange={(event) => uploadPhoto(person, event.target.files?.[0])} /></label></div>)}</div></div>;

  return <div className="space-y-6"><div className="bg-slate-900 border border-sky-100/10 rounded-3xl p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-bold text-white">People & Team</h3><p className="text-xs text-slate-400 mt-1">Upload photos once and they stay attached to this event for the audience and future archives.</p></div><Camera className="w-5 h-5 text-sky-200" /></div><form onSubmit={addOrganizer} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5"><div><label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Category</label><select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"><option value="organizer">Organising Team</option><option value="anchor">Anchor</option><option value="performer">Performer</option><option value="musician">Musician</option></select></div><FormInput label="Name" value={name} setValue={setName} placeholder="Name" /><FormInput label="Role" value={role} setValue={setRole} placeholder="e.g. Event Head" required={false} /><div className="sm:col-span-3"><button type="submit" disabled={saving} className="bg-sky-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl">{saving ? 'Saving…' : 'Add Person / Team Member'}</button></div></form></div>{section('performer', 'Performers', '🎤')}{section('anchor', 'Anchors / MoC', '🎙️')}{section('musician', 'Musicians', '🎼')}{section('organizer', 'Organising Team', '✨')}</div>;
}

function AdminInteractionsTab({ supabaseInteractions, supabaseVotes }) {
  const [interactionType, setInteractionType] = useState('poll');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctOption, setCorrectOption] = useState('');
  const [saving, setSaving] = useState(false);

  const interactions = supabaseInteractions.filter((interaction) => ['poll', 'guess_song'].includes(interaction.type));

  const addOption = () => setOptions((current) => current.length < 4 ? [...current, ''] : current);
  const updateOption = (index, value) => setOptions((current) => current.map((option, optionIndex) => optionIndex === index ? value : option));

  const reset = () => {
    setQuestion('');
    setOptions(['', '']);
    setCorrectOption('');
    setInteractionType('poll');
  };

  const handleCreate = async () => {
    if (!supabase || saving) return;
    const cleanQuestion = question.trim();
    const cleanOptions = options.map((option) => option.trim()).filter(Boolean);
    if (!cleanQuestion) return alert('Please enter a question.');
    if (cleanOptions.length < 2) return alert('Please add at least 2 options.');
    if (interactionType === 'guess_song' && !correctOption) return alert('Please select the correct answer.');

    setSaving(true);
    const { error } = await supabase.from('interactions').insert({
      event_id: APP_EVENT_ID,
      type: interactionType,
      title: cleanQuestion,
      question: cleanQuestion,
      options: cleanOptions,
      correct_option: interactionType === 'guess_song' ? correctOption : null,
      status: 'draft',
    });
    setSaving(false);
    if (error) {
      alert(`Could not create interaction: ${error.message}`);
      return;
    }
    reset();
  };

  const handleMakeLive = async (id) => {
    if (!supabase) return;
    const { error: stopError } = await supabase.from('interactions').update({ status: 'stopped' }).eq('event_id', APP_EVENT_ID).eq('status', 'live');
    if (stopError) return alert(`Could not stop current interaction: ${stopError.message}`);
    const { error } = await supabase.from('interactions').update({ status: 'live' }).eq('id', id);
    if (error) alert(`Could not make live: ${error.message}`);
  };

  const handleStop = async (id) => {
    if (!supabase) return;
    const { error } = await supabase.from('interactions').update({ status: 'stopped' }).eq('id', id);
    if (error) alert(`Could not stop interaction: ${error.message}`);
  };

  const countVotes = (interactionId) => supabaseVotes.filter((vote) => vote.interaction_id === interactionId).length;

  return <div className="space-y-6">
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5"><div><h3 className="text-sm font-bold text-white">Create Live Interaction</h3><p className="text-xs text-slate-500 mt-1">Polls and Guess the Song are broadcast instantly to every audience screen.</p></div><span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">Supabase Realtime</span></div>
      <div className="flex gap-2 mb-4"><button onClick={() => { setInteractionType('poll'); setCorrectOption(''); }} className={`px-3 py-2 rounded-xl text-xs font-bold border ${interactionType === 'poll' ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-950 text-slate-400 border-slate-700'}`}>Poll</button><button onClick={() => setInteractionType('guess_song')} className={`px-3 py-2 rounded-xl text-xs font-bold border ${interactionType === 'guess_song' ? 'bg-pink-600 text-white border-pink-500' : 'bg-slate-950 text-slate-400 border-slate-700'}`}>Guess the Song</button></div>
      <div className="space-y-4"><FormInput label="Question" value={question} setValue={setQuestion} placeholder={interactionType === 'poll' ? 'Which song should we hear next?' : 'Which song is this?'} required />
        <div><label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Options</label><div className="space-y-2">{options.map((option, index) => <input key={index} value={option} onChange={(event) => updateOption(index, event.target.value)} placeholder={`Option ${index + 1}`} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500" />)}</div>{options.length < 4 && <button onClick={addOption} className="mt-3 text-xs font-bold text-purple-400">+ Add Option</button>}</div>
        {interactionType === 'guess_song' && <div><label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Correct Answer</label><select value={correctOption} onChange={(event) => setCorrectOption(event.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"><option value="">Select correct answer</option>{options.filter(Boolean).map((option) => <option key={option} value={option}>{option}</option>)}</select></div>}
        <button onClick={handleCreate} disabled={saving} className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl">{saving ? 'Creating…' : 'Create Interaction'}</button>
      </div>
    </div>

    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5"><div className="mb-5"><h3 className="text-sm font-bold text-white">Created Interactions</h3><p className="text-xs text-slate-500 mt-1">Only one live interaction is shown to the audience at a time.</p></div><div className="space-y-3">{interactions.length === 0 ? <p className="text-xs text-slate-500 text-center py-8">No interactions created yet.</p> : interactions.map((interaction) => { const isLive = interaction.status === 'live'; return <div key={interaction.id} className={`p-4 rounded-2xl border ${isLive ? 'bg-purple-950/40 border-purple-500/50' : 'bg-slate-950/60 border-slate-800'}`}><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{interaction.type === 'guess_song' ? 'Guess' : 'Poll'}</span>{isLive && <span className="text-[9px] uppercase font-bold text-emerald-400">LIVE</span>}</div><h4 className="text-sm font-bold text-white mt-2">{interaction.question}</h4><div className="flex flex-wrap gap-2 mt-2">{interaction.options?.map((option, index) => <span key={index} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-lg">{option}</span>)}</div><p className="text-[10px] text-slate-500 mt-2">{countVotes(interaction.id)} response{countVotes(interaction.id) === 1 ? '' : 's'}</p></div><div>{isLive ? <button onClick={() => handleStop(interaction.id)} className="bg-rose-600/20 text-rose-400 font-bold text-xs px-3 py-1.5 rounded-xl border border-rose-500/30">Stop</button> : <button onClick={() => handleMakeLive(interaction.id)} className="bg-emerald-600/20 text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-500/30">Make Live</button>}</div></div></div>; })}</div></div>
  </div>;
}

function AdminAnalyticsTab({ supabasePerformances, supabaseInteractions, supabaseVotes, supabaseReactions, supabaseAudience, people, analyticsSnapshots, supabaseMemoryCards }) {
  const [saving, setSaving] = useState(false);
  const interactionIds = new Set(supabaseInteractions.map((interaction) => interaction.id));
  const performanceIds = new Set(supabasePerformances.map((performance) => performance.id));
  const eventVotes = supabaseVotes.filter((vote) => interactionIds.has(vote.interaction_id));
  const eventReactions = supabaseReactions.filter((reaction) => performanceIds.has(reaction.performance_id));

  const audienceEngagement = supabaseAudience.map((member) => {
    const votes = eventVotes.filter((vote) => vote.audience_id === member.session_id).length;
    const reactions = eventReactions.filter((reaction) => reaction.audience_id === member.session_id).length;
    const profile = getEngagementProfile(votes, reactions);
    return { ...member, votes, reactions, ...profile };
  });

  const topPerformance = [...supabasePerformances].map((performance) => ({
    ...performance,
    reactions: eventReactions.filter((reaction) => reaction.performance_id === performance.id).length,
  })).sort((a, b) => b.reactions - a.reactions).slice(0, 5);

  const topInteractions = [...supabaseInteractions].map((interaction) => ({
    ...interaction,
    responses: eventVotes.filter((vote) => vote.interaction_id === interaction.id).length,
  })).sort((a, b) => b.responses - a.responses).slice(0, 5);

  const saveSnapshot = async () => {
    if (!supabase || saving) return;
    setSaving(true);
    const snapshot = {
      captured_at: new Date().toISOString(),
      audience_count: supabaseAudience.length,
      performance_count: supabasePerformances.length,
      interaction_count: supabaseInteractions.length,
      total_votes: eventVotes.length,
      total_reactions: eventReactions.length,
      people_count: people.length,
      top_performances: topPerformance.map(({ id, title, performer, reactions }) => ({ id, title, performer, reactions })),
      top_interactions: topInteractions.map(({ id, question, type, responses }) => ({ id, question, type, responses })),
      audience_engagement: audienceEngagement.map(({ session_id, nickname, votes, reactions, score, tag }) => ({ session_id, nickname, votes, reactions, score, tag })),
    };
    const { error } = await supabase.from('event_analytics_snapshots').insert({ event_id: APP_EVENT_ID, event_name: EVENT_DISPLAY_NAME, snapshot });
    setSaving(false);
    if (error) alert(`Could not save planning snapshot: ${error.message}`);
  };

  const exportAllData = () => {
    const payload = {
      event: { id: APP_EVENT_ID, name: EVENT_DISPLAY_NAME },
      exported_at: new Date().toISOString(),
      performances: supabasePerformances,
      audience: supabaseAudience,
      people,
      interactions: supabaseInteractions,
      votes: eventVotes,
      reactions: eventReactions,
      analytics_snapshots: analyticsSnapshots,
      memory_cards: supabaseMemoryCards,
      audience_engagement: audienceEngagement,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `${EVENT_DISPLAY_NAME.replace(/\s+/g, '-')}-event-data.json`);
  };

  return <div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-4 gap-4"><Metric title="Audience" value={supabaseAudience.length} icon={<Users className="w-5 h-5" />} /><Metric title="Votes" value={eventVotes.length} icon={<MessageCircle className="w-5 h-5" />} /><Metric title="Reactions" value={eventReactions.length} icon={<Heart className="w-5 h-5" />} /><Metric title="Performances" value={supabasePerformances.length} icon={<Music className="w-5 h-5" />} /></div><div className="bg-slate-900 border border-sky-100/10 rounded-3xl p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-bold text-white">Event Data Archive</h3><p className="text-xs text-slate-400 mt-1">Save snapshots for future event planning and export all raw data.</p></div><div className="flex gap-2"><button onClick={saveSnapshot} disabled={saving} className="bg-sky-300 text-slate-950 font-black text-xs px-3 py-2 rounded-xl flex items-center gap-2"><Save className="w-4 h-4" />{saving ? 'Saving…' : 'Save Snapshot'}</button><button onClick={exportAllData} className="bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-2"><Download className="w-4 h-4" />Export All Data</button></div></div><div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4"><div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4"><h4 className="text-xs font-bold uppercase tracking-widest text-sky-200">Top Performances by Reactions</h4><div className="space-y-2 mt-3">{topPerformance.length ? topPerformance.map((performance) => <div key={performance.id} className="flex items-center justify-between text-xs"><span className="text-slate-300">{performance.title} • {performance.performer}</span><strong className="text-sky-200">{performance.reactions}</strong></div>) : <p className="text-slate-500 text-xs">No reactions yet.</p>}</div></div><div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4"><h4 className="text-xs font-bold uppercase tracking-widest text-sky-200">Top Interactions by Responses</h4><div className="space-y-2 mt-3">{topInteractions.length ? topInteractions.map((interaction) => <div key={interaction.id} className="flex items-center justify-between text-xs"><span className="text-slate-300">{interaction.question}</span><strong className="text-sky-200">{interaction.responses}</strong></div>) : <p className="text-slate-500 text-xs">No interaction responses yet.</p>}</div></div></div></div><div className="bg-slate-900 border border-sky-100/10 rounded-3xl p-5"><div className="flex items-center gap-2 mb-4"><BarChart3 className="w-5 h-5 text-sky-200" /><h3 className="text-sm font-bold text-white">Audience Engagement Profiles</h3></div><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b border-slate-800 text-slate-500 uppercase text-[9px]"><th className="pb-3">Name</th><th className="pb-3">Votes</th><th className="pb-3">Reactions</th><th className="pb-3">Engagement</th><th className="pb-3">Music Tag</th></tr></thead><tbody className="divide-y divide-slate-800">{audienceEngagement.map((member) => <tr key={member.session_id}><td className="py-3 font-bold text-white">{member.nickname}</td><td className="py-3 text-slate-300">{member.votes}</td><td className="py-3 text-slate-300">{member.reactions}</td><td className="py-3 min-w-40"><div className="h-2 rounded-full bg-slate-800 overflow-hidden"><div className="h-full bg-sky-300" style={{ width: `${member.score}%` }} /></div><span className="text-[10px] text-sky-200">{member.score}%</span></td><td className="py-3 text-sky-100/70">{member.tag}</td></tr>)}</tbody></table>{audienceEngagement.length === 0 && <p className="text-xs text-slate-500 text-center py-6">Audience participation will appear here.</p>}</div></div><div className="bg-slate-900 border border-sky-100/10 rounded-3xl p-5"><h3 className="text-sm font-bold text-white">Saved Planning Snapshots</h3><div className="space-y-2 mt-4">{analyticsSnapshots.length ? analyticsSnapshots.map((snapshot) => <div key={snapshot.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex items-center justify-between"><div><p className="text-xs font-bold text-white">{snapshot.event_name}</p><p className="text-[10px] text-slate-500">{new Date(snapshot.created_at).toLocaleString()}</p></div><div className="text-[10px] text-sky-200">{snapshot.snapshot?.audience_count || 0} audience • {snapshot.snapshot?.total_votes || 0} votes • {snapshot.snapshot?.total_reactions || 0} reactions</div></div>) : <p className="text-xs text-slate-500">No snapshots saved yet.</p>}</div></div></div>;
}

function Metric({ title, value, icon }) {
  return <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5"><div className="flex items-center justify-between"><span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{title}</span><span className="text-purple-400">{icon}</span></div><div className="text-3xl font-black text-white mt-2">{value}</div></div>;
}

function SupabaseSqlModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const copySchema = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('Clipboard error', error);
    }
  };

  return <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"><div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"><div className="p-4 border-b border-slate-800 flex items-center justify-between"><div className="flex items-center gap-2 font-bold text-sm text-white"><Database className="w-4 h-4 text-purple-400" />Supabase Database Schema</div><button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"><X className="w-5 h-5" /></button></div><div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-300 bg-slate-950"><pre className="whitespace-pre-wrap select-all">{SUPABASE_SQL_SCHEMA}</pre></div><div className="p-4 border-t border-slate-800 flex justify-between items-center gap-3 bg-slate-900"><p className="text-xs text-slate-400">Reference schema for the interaction features.</p><button onClick={copySchema} className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied' : 'Copy SQL'}</button></div></div></div>;
}
