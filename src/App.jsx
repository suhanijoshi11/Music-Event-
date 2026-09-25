import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Camera,
  CheckCircle2,
  CloudRain,
  Download,
  Edit3,
  Heart,
  ListMusic,
  Lock,
  LogOut,
  MessageCircle,
  Music,
  PlayCircle,
  Plus,
  Radio,
  Save,
  Share2,
  Sparkles,
  Trash2,
  Users,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import { supabase } from './lib/supabase';

const APP_EVENT_ID = 'event_music_night_2026';
const EVENT_DISPLAY_NAME = 'Tofani Vayra 9';
const MEDIA_BUCKET = 'event-media';
const SESSION_KEY = 'music_night_audience_session_v1';
const SYNC_KEY = 'music_night_local_event_db_v4';
const ADMIN_PASSWORD = 'suhani1105';


const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
];

const UI_TEXT = {
  en: {
    welcome: 'Welcome to', experience: 'Choose your language, enter your name and join the live experience.',
    chooseLanguage: 'Choose language', firstName: 'First Name',
surname: 'Surname',
enterFirstName: 'Enter your first name',
enterSurname: 'Enter your surname',
    memoryPhoto: 'Photo for your memory card', optional: '(optional)', join: 'Join',
    continueAs: 'Continue as', liveEvent: 'Live Event', audienceExperience: 'Audience Experience',
    goodEvening: 'Good evening, {name} 👋', audienceMember: 'Audience Member', change: 'Change',
    nowPlaying: 'Now Playing', intermission: 'Intermission / Preparing Next Act',
    knowPerformer: 'Know the Performer', knowMore: 'Know more', liveInteraction: 'Live Interaction',
    guessSong: 'Guess the Song', tapOne: 'Tap one option', submitting: 'Submitting…',
    voteRecorded: 'Vote recorded ✓', alreadyAnswered: 'You already answered this one.',
    correct: 'Correct!', notQuite: 'Not quite — correct answer', reactPerformance: 'React to the performance',
    oneReaction: 'One reaction per performance', sending: 'Sending…', reactionSent: 'Reaction sent ✓',
    alreadyReacted: 'You already reacted to this performance.', knowMusicians: 'Know the Musicians',
    peopleCreatingSound: 'The people creating the live sound tonight', seeMusicianDetails: 'See musician details',
    anchorsTeam: 'Anchors & Organising Team', meetPeople: 'Meet the people making the evening happen',
    knowAnchorsTeam: 'Know More: Anchors & Team', yourMemory: 'Your Memory Card',
    builtFromParticipation: 'Built from your live participation tonight.', addPhoto: 'Add photo',
    download: 'Download', share: 'Share', yourMusicNight: 'Your Music Night', votes: 'Votes', reactions: 'Reactions',
    watchLine: 'WATCH → EXPERIENCE → PARTICIPATE → REMEMBER', knowMoreTitle: 'Know More', performingNow: 'Performing now',
    noTeam: 'No team members added yet.', performers: 'Performers', liveMusicians: 'Live Musicians', anchors: 'Anchors / MoC',
    organisingTeam: 'Organising Team', age: 'Age', work: 'Work', workplace: 'Workplace', achievements: 'Achievements',
    partOfTeam: 'Part of the team behind the evening.', languageSaved: 'Language preference saved for this event.'
  },
  hi: {
    welcome: 'स्वागत है', experience: 'अपनी भाषा चुनें, अपना नाम दर्ज करें और लाइव अनुभव में शामिल हों।',
    chooseLanguage: 'भाषा चुनें', firstName: 'पहला नाम',
surname: 'उपनाम',
enterFirstName: 'अपना पहला नाम दर्ज करें',
enterSurname: 'अपना उपनाम दर्ज करें',
    memoryPhoto: 'मेमोरी कार्ड के लिए फोटो', optional: '(वैकल्पिक)', join: 'शामिल हों',
    continueAs: 'के रूप में जारी रखें', liveEvent: 'लाइव कार्यक्रम', audienceExperience: 'दर्शक अनुभव',
    goodEvening: 'शुभ संध्या, {name} 👋', audienceMember: 'दर्शक सदस्य', change: 'बदलें',
    nowPlaying: 'अभी चल रहा है', intermission: 'अंतराल / अगली प्रस्तुति की तैयारी',
    knowPerformer: 'कलाकार के बारे में जानें', knowMore: 'और जानें', liveInteraction: 'लाइव सहभागिता',
    guessSong: 'गाना पहचानें', tapOne: 'एक विकल्प चुनें', submitting: 'भेजा जा रहा है…',
    voteRecorded: 'आपका उत्तर दर्ज हो गया ✓', alreadyAnswered: 'आपने इसका उत्तर पहले ही दिया है।',
    correct: 'सही!', notQuite: 'सही नहीं — सही उत्तर', reactPerformance: 'प्रस्तुति पर प्रतिक्रिया दें',
    oneReaction: 'हर प्रस्तुति पर एक प्रतिक्रिया', sending: 'भेजा जा रहा है…', reactionSent: 'प्रतिक्रिया भेज दी गई ✓',
    alreadyReacted: 'आपने इस प्रस्तुति पर पहले ही प्रतिक्रिया दी है।', knowMusicians: 'संगीतकारों से मिलें',
    peopleCreatingSound: 'आज की लाइव धुन बनाने वाले कलाकार', seeMusicianDetails: 'संगीतकारों की जानकारी',
    anchorsTeam: 'एंकर और आयोजन टीम', meetPeople: 'इस शाम को खास बनाने वाले लोगों से मिलें',
    knowAnchorsTeam: 'एंकर और टीम के बारे में जानें', yourMemory: 'आपका मेमोरी कार्ड',
    builtFromParticipation: 'आज की आपकी लाइव सहभागिता से बनाया गया।', addPhoto: 'फोटो जोड़ें',
    download: 'डाउनलोड', share: 'शेयर', yourMusicNight: 'आपकी म्यूज़िक नाइट', votes: 'उत्तर', reactions: 'प्रतिक्रियाएँ',
    watchLine: 'देखें → अनुभव करें → भाग लें → याद रखें', knowMoreTitle: 'और जानें', performingNow: 'अभी प्रस्तुति दे रहे हैं',
    noTeam: 'अभी कोई टीम सदस्य नहीं जोड़ा गया है।', performers: 'कलाकार', liveMusicians: 'लाइव संगीतकार', anchors: 'एंकर / संचालक',
    organisingTeam: 'आयोजन टीम', age: 'उम्र', work: 'कार्य', workplace: 'कार्यस्थल', achievements: 'उपलब्धियाँ',
    partOfTeam: 'इस शाम को बनाने वाली टीम का हिस्सा।', languageSaved: 'इस कार्यक्रम के लिए आपकी भाषा सुरक्षित है।'
  },
  gu: {
    welcome: 'આપનું સ્વાગત છે', experience: 'તમારી ભાષા પસંદ કરો, તમારું નામ લખો અને લાઇવ અનુભવમાં જોડાઓ.',
    chooseLanguage: 'ભાષા પસંદ કરો', firstName: 'નામ',
surname: 'અટક',
enterFirstName: 'તમારું નામ લખો',
enterSurname: 'તમારી અટક લખો',
    memoryPhoto: 'મેમરી કાર્ડ માટે ફોટો', optional: '(વૈકલ્પિક)', join: 'જોડાઓ',
    continueAs: 'તરીકે ચાલુ રાખો', liveEvent: 'લાઇવ કાર્યક્રમ', audienceExperience: 'પ્રેક્ષક અનુભવ',
    goodEvening: 'શુભ સાંજ, {name} 👋', audienceMember: 'પ્રેક્ષક સભ્ય', change: 'બદલો',
    nowPlaying: 'હમણાં ચાલી રહ્યું છે', intermission: 'વિરામ / આગળની રજૂઆતની તૈયારી',
    knowPerformer: 'પરફોર્મર વિશે જાણો', knowMore: 'વધુ જાણો', liveInteraction: 'લાઇવ ઇન્ટરૅક્શન',
    guessSong: 'ગીત ઓળખો', tapOne: 'એક વિકલ્પ પસંદ કરો', submitting: 'મોકલાઈ રહ્યું છે…',
    voteRecorded: 'તમારો જવાબ નોંધાયો ✓', alreadyAnswered: 'તમે આનો જવાબ પહેલેથી આપી દીધો છે.',
    correct: 'સાચું!', notQuite: 'સાચું નથી — સાચો જવાબ', reactPerformance: 'રજૂઆત પર પ્રતિક્રિયા આપો',
    oneReaction: 'દરેક રજૂઆત માટે એક પ્રતિક્રિયા', sending: 'મોકલાઈ રહ્યું છે…', reactionSent: 'પ્રતિક્રિયા મોકલાઈ ✓',
    alreadyReacted: 'તમે આ રજૂઆત પર પહેલેથી પ્રતિક્રિયા આપી છે.', knowMusicians: 'સંગીતકારોને જાણો',
    peopleCreatingSound: 'આજની લાઇવ ધૂન બનાવતા સંગીતકારો', seeMusicianDetails: 'સંગીતકારોની માહિતી',
    anchorsTeam: 'એન્કર અને આયોજન ટીમ', meetPeople: 'આ સાંજને ખાસ બનાવતા લોકોને મળો',
    knowAnchorsTeam: 'એન્કર અને ટીમ વિશે જાણો', yourMemory: 'તમારું મેમરી કાર્ડ',
    builtFromParticipation: 'આજની તમારી લાઇવ ભાગીદારી પરથી બનાવાયું છે.', addPhoto: 'ફોટો ઉમેરો',
    download: 'ડાઉનલોડ', share: 'શેર', yourMusicNight: 'તમારી મ્યુઝિક નાઇટ', votes: 'જવાબ', reactions: 'પ્રતિક્રિયાઓ',
    watchLine: 'જુઓ → અનુભવો → ભાગ લો → યાદ રાખો', knowMoreTitle: 'વધુ જાણો', performingNow: 'હમણાં રજૂઆત કરી રહ્યા છે',
    noTeam: 'હજુ સુધી કોઈ ટીમ સભ્ય ઉમેરાયો નથી.', performers: 'પરફોર્મર્સ', liveMusicians: 'લાઇવ સંગીતકારો', anchors: 'એન્કર / સંચાલક',
    organisingTeam: 'આયોજન ટીમ', age: 'ઉંમર', work: 'કામ', workplace: 'કાર્યસ્થળ', achievements: 'સિદ્ધિઓ',
    partOfTeam: 'આ સાંજ બનાવતી ટીમનો એક ભાગ.', languageSaved: 'આ કાર્યક્રમ માટે તમારી ભાષા સાચવવામાં આવી છે.'
  }
};

function uiText(language, key) {
  const pack = UI_TEXT[language] || UI_TEXT.en;
  return pack[key] || UI_TEXT.en[key] || key;
}

function uiTextWithName(language, key, name) {
  return uiText(language, key).replace('{name}', name);
}

const REACTION_OPTIONS = [
  { value: '❤️ Beautiful', emoji: '❤️', label: 'Beautiful' },
  { value: '🎶 Soulful', emoji: '🎶', label: 'Soulful' },
  { value: '👏 Great Work', emoji: '👏', label: 'Great Work' },
  { value: '✨ Mesmerizing', emoji: '✨', label: 'Mesmerizing' },
  { value: '🔥 Energetic', emoji: '🔥', label: 'Energetic' },
  { value: '💫 Amazing', emoji: '💫', label: 'Amazing' },
  { value: '🎤 Powerful', emoji: '🎤', label: 'Powerful' },
  { value: '🌟 Brilliant', emoji: '🌟', label: 'Brilliant' },
  { value: '🥹 Touching', emoji: '🥹', label: 'Touching' },
  { value: '💖 Heartfelt', emoji: '💖', label: 'Heartfelt' },
  { value: '🎵 Musical', emoji: '🎵', label: 'Musical' },
  { value: '👌 Well Performed', emoji: '👌', label: 'Well Performed' },
];

const DEFAULT_INTERACTIONS = [
  {
    type: 'poll',
    question: 'How are you feeling about the performance?',
    options: ['Amazing', 'I am loving it', 'Chill vibes', 'Give us more'],
  },
  {
    type: 'poll',
    question: 'Which mood should come next?',
    options: ['Romantic', 'Energetic', 'Nostalgic', 'Party'],
  },
  {
    type: 'guess_song',
    question: 'Can you guess the next song?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
  },
];

const INITIAL_SEED_DATA = {
  event: {
    id: APP_EVENT_ID,
    name: EVENT_DISPLAY_NAME,
    event_date: '2026-10-24',
    status: 'live',
    created_at: new Date().toISOString(),
  },
  performances: [],
  musicians: [],
  audience: [],
};

const EVENT_INTRO_DATA = {
  performers: [],
  anchors: [],
  musicians: [],
  organizers: [],
};

function getLocalDB() {
  try {
    const raw = localStorage.getItem(SYNC_KEY);
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.warn('Storage error', error);
  }
  return INITIAL_SEED_DATA;
}

function saveAndBroadcastLocalDB(data) {
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
}

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
      _fromDb: Boolean(byId.has(person.id)),
    };
  });

  const staticIds = new Set(staticPeople.map((person) => person.id));
  const extras = peopleRows
    .filter((person) => !staticIds.has(person.id))
    .map((person) => ({ ...person, photo: person.photo_url || person.photo || '', _fromDb: true }));

  return [...mergedStatic, ...extras].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
}

function getEngagementProfile(voteCount, reactionCount, language = 'en') {
  const score = Math.min(100, Math.round(voteCount * 20 + reactionCount * 10));
  const tags = {
    en: ['You are a good listener', 'You really feel the music', 'Your taste in music is excellent', "You're a true music enthusiast", 'Music flows with you'],
    hi: ['आप एक अच्छे श्रोता हैं', 'आप संगीत को महसूस करते हैं', 'संगीत में आपकी पसंद शानदार है', 'आप सच्चे संगीत प्रेमी हैं', 'संगीत आपके साथ बहता है'],
    gu: ['તમે સારા શ્રોતા છો', 'તમે સંગીતને દિલથી અનુભવો છો', 'સંગીતમાં તમારી પસંદ ખૂબ સરસ છે', 'તમે સાચા સંગીતપ્રેમી છો', 'સંગીત તમારી સાથે વહે છે'],
  };
  const labels = tags[language] || tags.en;
  let index = 0;
  if (score >= 25 && score < 50) index = 1;
  else if (score >= 50 && score < 75) index = 2;
  else if (score >= 75 && score < 90) index = 3;
  else if (score >= 90) index = 4;
  return { score, tag: labels[index] };
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

async function saveEventPerson(person, file = null) {
  if (!supabase) return { error: new Error('Supabase is not connected') };

  let photoUrl = person.photo_url || person.photo || '';

  if (file) {
    const upload = await uploadEventMedia(file, `people/${APP_EVENT_ID}`, person.id || person.name);
    if (upload.error) return { error: upload.error };
    photoUrl = upload.url;
  }

  const row = {
    id: person.id || `${person.category}_${Date.now()}`,
    event_id: APP_EVENT_ID,
    category: person.category,
    name: person.name,
    role: person.role || person.instrument || null,
    instrument: person.instrument || null,
    photo_url: photoUrl || null,
    age: person.age || null,
    work: person.work || null,
    workplace: person.workplace || null,
    intro: person.intro || null,
    achievements: person.achievements || null,
    display_order: Number(person.display_order) || 99,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('event_people').upsert(row, { onConflict: 'id' });
  return { error };
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

function downloadCsv(rows, filename) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (value) => {
    const text = value == null ? '' : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const csv = [headers.map(escape).join(','), ...rows.map((row) => headers.map((header) => escape(row[header])).join(','))].join('\n');
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), filename);
}

async function buildMemoryCardBlob({ name, photoUrl, score, tag, language = 'en' }) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 675;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 1200, 675);
  gradient.addColorStop(0, '#e0f2fe');
  gradient.addColorStop(0.5, '#f0f9ff');
  gradient.addColorStop(1, '#dbeafe');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.fillRect(38, 38, 1124, 599);

  ctx.strokeStyle = 'rgba(14,116,144,0.12)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 60; i += 1) {
    const x = 30 + ((i * 79) % 1160);
    const y = (i * 97) % 640;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 16, y + 48);
    ctx.stroke();
  }

  ctx.fillStyle = '#075985';
  ctx.font = '800 34px Arial';
  ctx.fillText('TOFANI VAYRA 9', 70, 90);
  ctx.fillStyle = '#0f766e';
  ctx.font = '700 20px Arial';
  ctx.fillText(language === 'hi' ? 'आपकी म्यूज़िक नाइट याद' : language === 'gu' ? 'તમારી મ્યુઝિક નાઇટ યાદ' : 'YOUR MUSIC NIGHT MEMORY', 70, 124);

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
        ctx.arc(180, 320, 110, 0, Math.PI * 2);
        ctx.clip();
        const ratio = Math.max(220 / image.width, 220 / image.height);
        const drawW = image.width * ratio;
        const drawH = image.height * ratio;
        ctx.drawImage(image, 180 - drawW / 2, 320 - drawH / 2, drawW, drawH);
        ctx.restore();
        photoDrawn = true;
      }
    } catch (error) {
      photoDrawn = false;
    }
  }

  if (!photoDrawn) {
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.arc(180, 320, 110, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#075985';
    ctx.font = '800 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText((name || 'A').charAt(0).toUpperCase(), 180, 348);
    ctx.textAlign = 'left';
  }

  ctx.fillStyle = '#0f172a';
  ctx.font = '800 56px Arial';
  ctx.fillText(name || 'Audience Member', 350, 250);
  ctx.fillStyle = '#0369a1';
  ctx.font = '700 25px Arial';
  ctx.fillText(tag, 350, 298);

  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  ctx.fillRect(350, 355, 760, 28);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(350, 355, 760 * (score / 100), 28);
  ctx.fillStyle = '#0f172a';
  ctx.font = '800 28px Arial';
  ctx.fillText(`${language === 'hi' ? 'भागीदारी' : language === 'gu' ? 'ભાગીદારી' : 'ENGAGEMENT'}  ${score}%`, 350, 414);

  ctx.fillStyle = '#155e75';
  ctx.font = '600 22px Arial';
  ctx.fillText(language === 'hi' ? 'आप सिर्फ दर्शक नहीं, इस संगीत का हिस्सा थे।' : language === 'gu' ? 'તમે માત્ર પ્રેક્ષક નહોતા, આ સંગીતનો એક ભાગ હતા.' : 'You were part of the music, not just the audience.', 70, 610);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Could not create memory card image'));
    }, 'image/png');
  });
}

function RainThemeStyles() {
  return (
    <style>{`
      @keyframes rainFall {
        0% { transform: translate3d(0, -15vh, 0); opacity: 0; }
        10% { opacity: .55; }
        90% { opacity: .4; }
        100% { transform: translate3d(-18px, 115vh, 0); opacity: 0; }
      }
      .rain-drop {
        position: absolute;
        top: -20vh;
        width: 2px;
        height: 72px;
        border-radius: 999px;
        background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(14,116,144,.45));
        animation: rainFall linear infinite;
      }
      .rain-theme [class*="bg-slate-950"] { background: rgba(248,252,255,.88) !important; }
      .rain-theme [class*="bg-slate-900"] { background: rgba(255,255,255,.82) !important; }
      .rain-theme [class*="bg-slate-800"] { background: rgba(224,242,254,.86) !important; }
      .rain-theme [class*="border-slate-8"] { border-color: rgba(100,116,139,.22) !important; }
      .rain-theme [class*="border-slate-7"] { border-color: rgba(100,116,139,.25) !important; }
      .rain-theme [class*="bg-purple-950"] { background: rgba(224,231,255,.72) !important; }
      .rain-theme [class*="bg-sky-950"] { background: rgba(240,249,255,.84) !important; }
      .rain-theme [class*="text-slate-1"] { color: #0f172a !important; }
      .rain-theme [class*="text-slate-2"] { color: #334155 !important; }
      .rain-theme [class*="text-slate-3"] { color: #475569 !important; }
      .rain-theme [class*="text-slate-4"] { color: #64748b !important; }
      .rain-theme [class*="text-slate-5"] { color: #64748b !important; }
      .rain-theme [class*="text-slate-6"] { color: #475569 !important; }
      .rain-theme [class*="bg-slate-950"] .text-white,
      .rain-theme [class*="bg-slate-900"] .text-white { color: #0f172a !important; }
    `}</style>
  );
}

function RainOverlay() {
  const drops = Array.from({ length: 34 }, (_, index) => index);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-70">
      {drops.map((drop) => (
        <span
          key={drop}
          className="rain-drop"
          style={{
            left: `${(drop * 19) % 100}%`,
            animationDuration: `${1.8 + (drop % 5) * 0.35}s`,
            animationDelay: `${-(drop * 0.19)}s`,
          }}
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

  const [supabasePerformances, setSupabasePerformances] = useState([]);
  const [supabaseAudience, setSupabaseAudience] = useState([]);
  const [liveAudienceCount, setLiveAudienceCount] = useState(0);
  const [supabaseInteractions, setSupabaseInteractions] = useState([]);
  const [supabaseVotes, setSupabaseVotes] = useState([]);
  const [supabaseReactions, setSupabaseReactions] = useState([]);
  const [supabasePeople, setSupabasePeople] = useState([]);
  const [analyticsSnapshots, setAnalyticsSnapshots] = useState([]);
  const [supabaseMemoryCards, setSupabaseMemoryCards] = useState([]);

  const isAdminRoute = currentRoute.startsWith('#/admin');

  useEffect(() => {
  if (!supabase || !isAdminRoute) return;

  const channel = supabase
    .channel('live-audience-count')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'audience',
      },
      (payload) => {
        const newAudience = payload.new;

        // Only count this event
        if (newAudience.event_id !== APP_EVENT_ID) return;

        setSupabaseAudience((prev) => {
          // Prevent duplicate counting
          if (
            prev.some(
              (person) => person.id === newAudience.id
            )
          ) {
            return prev;
          }

          return [...prev, newAudience];
        });

        setLiveAudienceCount((prev) => prev + 1);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'audience',
      },
      (payload) => {
        const deletedAudience = payload.old;

        if (deletedAudience.event_id !== APP_EVENT_ID) return;

        setSupabaseAudience((prev) =>
          prev.filter(
            (person) => person.id !== deletedAudience.id
          )
        );

        setLiveAudienceCount((prev) =>
          Math.max(0, prev - 1)
        );
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [isAdminRoute]);

  const refreshLiveData = async () => {
    if (!supabase) return;

    const [
      performancesResult,
      interactionsResult,
      votesResult,
      reactionsResult,
      peopleResult,
      audienceResult,
      snapshotsResult,
      memoryCardsResult,
    ] = await Promise.all([
      supabase
        .from('performances')
        .select('*')
        .eq('event_id', APP_EVENT_ID)
        .order('display_order', { ascending: true }),
      supabase
        .from('interactions')
        .select('*')
        .eq('event_id', APP_EVENT_ID)
        .order('created_at', { ascending: true }),
      supabase.from('interaction_votes').select('*'),
      supabase.from('performance_reactions').select('*'),
      supabase
        .from('event_people')
        .select('*')
        .eq('event_id', APP_EVENT_ID)
        .order('display_order', { ascending: true }),
      supabase
        .from('audience')
        .select('*', { count: 'exact' })
        .eq('event_id', APP_EVENT_ID)
        .order('joined_at', { ascending: true }),
      supabase
        .from('event_analytics_snapshots')
        .select('*')
        .eq('event_id', APP_EVENT_ID)
        .order('created_at', { ascending: false }),
      supabase
        .from('audience_memory_cards')
        .select('*')
        .eq('event_id', APP_EVENT_ID)
        .order('updated_at', { ascending: false }),
    ]);

    if (!performancesResult.error) setSupabasePerformances(performancesResult.data || []);
    else console.error('Live performances refresh error:', performancesResult.error);

    if (!interactionsResult.error) setSupabaseInteractions(interactionsResult.data || []);
    else console.error('Live interactions refresh error:', interactionsResult.error);

    if (!votesResult.error) setSupabaseVotes(votesResult.data || []);
    else console.error('Live votes refresh error:', votesResult.error);

    if (!reactionsResult.error) setSupabaseReactions(reactionsResult.data || []);
    else console.error('Live reactions refresh error:', reactionsResult.error);

    if (!peopleResult.error) setSupabasePeople(peopleResult.data || []);
    else console.error('Live people refresh error:', peopleResult.error);

    if (!audienceResult.error) {
      const audienceRows = audienceResult.data || [];
      setSupabaseAudience(audienceRows);
      setLiveAudienceCount(audienceResult.count ?? audienceRows.length);
    } else {
      console.error('Live audience refresh error:', audienceResult.error);
    }

    if (!snapshotsResult.error) setAnalyticsSnapshots(snapshotsResult.data || []);
    else console.error('Live analytics snapshot refresh error:', snapshotsResult.error);

    if (!memoryCardsResult.error) setSupabaseMemoryCards(memoryCardsResult.data || []);
    else console.error('Live memory card refresh error:', memoryCardsResult.error);
  };

  useEffect(() => {
    const loadEventData = async () => {
      if (!supabase) return;

      const [performancesResult, audienceResult, interactionsResult, votesResult, reactionsResult, peopleResult, snapshotsResult, memoryCardsResult] = await Promise.all([
        supabase.from('performances').select('*').eq('event_id', APP_EVENT_ID).order('display_order', { ascending: true }),
        supabase.from('audience').select('*').eq('event_id', APP_EVENT_ID).order('joined_at', { ascending: true }),
        supabase.from('interactions').select('*').eq('event_id', APP_EVENT_ID).order('created_at', { ascending: true }),
        supabase.from('interaction_votes').select('*'),
        supabase.from('performance_reactions').select('*'),
        supabase.from('event_people').select('*').eq('event_id', APP_EVENT_ID).order('display_order', { ascending: true }),
        supabase.from('event_analytics_snapshots').select('*').eq('event_id', APP_EVENT_ID).order('created_at', { ascending: false }),
        supabase.from('audience_memory_cards').select('*').eq('event_id', APP_EVENT_ID).order('updated_at', { ascending: false }),
      ]);

      if (performancesResult.error) console.error('Performances error:', performancesResult.error);
      if (audienceResult.error) console.error('Audience error:', audienceResult.error);
      if (interactionsResult.error) console.error('Interactions error:', interactionsResult.error);
      if (votesResult.error) console.error('Votes error:', votesResult.error);
      if (reactionsResult.error) console.error('Reactions error:', reactionsResult.error);
      if (peopleResult.error) console.warn('People error:', peopleResult.error);
      if (snapshotsResult.error) console.warn('Analytics snapshot error:', snapshotsResult.error);
      if (memoryCardsResult.error) console.warn('Memory card error:', memoryCardsResult.error);

      setSupabasePerformances(performancesResult.data || []);
      const initialAudienceRows = audienceResult.data || [];
      setSupabaseAudience(initialAudienceRows);
      setLiveAudienceCount(initialAudienceRows.length);
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
    refreshLiveData();
    const interval = setInterval(refreshLiveData, 2000);
    return () => clearInterval(interval);
  }, [isAdminRoute]);

  useEffect(() => {
    const handleHashChange = () => setCurrentRoute(window.location.hash || '#/');
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

  const handleAudienceJoin = async (
  firstName,
  surname,
  language = 'en',
  photoFile = null
) => {
  let existingSession = null;

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) existingSession = JSON.parse(raw);
  } catch (error) {
    console.warn('Session read error', error);
  }

  const cleanFirstName = (firstName || '').trim();
  const cleanSurname = (surname || '').trim();

  const cleanNickname =
    `${cleanFirstName} ${cleanSurname}`.trim() || 'Audience Guest';

  const cleanLanguage = ['en', 'hi', 'gu'].includes(language)
    ? language
    : 'en';

  /*
   * One browser/phone = one audience session.
   * The same phone keeps the same session after refresh.
   */
  const sessionId =
    existingSession?.sessionId ||
    `sess_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;

  let photoUrl = existingSession?.photoUrl || '';

  if (photoFile && supabase) {
    const upload = await uploadEventMedia(
      photoFile,
      `audience/${APP_EVENT_ID}`,
      sessionId
    );

    if (upload.error) {
      alert(`Photo upload failed: ${upload.error.message}`);
    } else {
      photoUrl = upload.url;
    }
  }

  const newSession = {
    firstName: cleanFirstName,
    surname: cleanSurname,
    nickname: cleanNickname,
    language: cleanLanguage,
    sessionId,
    eventId: APP_EVENT_ID,
    photoUrl,
    joinedAt: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  /*
   * Save the phone/browser session immediately.
   */
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(newSession)
  );

  setAudienceSession(newSession);

  /*
   * IMPORTANT:
   * Your actual audience table uses:
   * id, event_id, name, joined_at, photo_url, language
   *
   * Therefore:
   * audience.id = sessionId
   * audience.name = combined firstName + surname
   */
  if (supabase) {
    const { data: existingAudience, error: lookupError } =
      await supabase
        .from('audience')
        .select('id')
        .eq('event_id', APP_EVENT_ID)
        .eq('id', sessionId)
        .limit(1);

    if (lookupError) {
      console.error(
        'Audience lookup error:',
        lookupError
      );
    } else if (existingAudience?.length) {

      const { error: updateError } = await supabase
        .from('audience')
        .update({
          name: cleanNickname,
          photo_url: photoUrl || null,
          language: cleanLanguage,
        })
        .eq('id', sessionId)
        .eq('event_id', APP_EVENT_ID);

      if (updateError) {
        console.error(
          'Audience update error:',
          updateError
        );
      }

    } else {

      const { error: insertError } = await supabase
        .from('audience')
        .insert({
          id: sessionId,
          event_id: APP_EVENT_ID,
          name: cleanNickname,
          photo_url: photoUrl || null,
          language: cleanLanguage,
        });

      if (insertError) {
        console.error(
          'Audience registration error:',
          insertError
        );

        alert(
          `Could not register audience member: ${insertError.message}`
        );

        return;
      }

      /*
       * Update the Admin count immediately.
       * refreshLiveData() will also confirm the real DB count.
       */
      setLiveAudienceCount((current) => current + 1);
    }
  }

  await refreshLiveData();

  /*
   * Only move to the event after the audience record
   * has been written to Supabase.
   */
  navigate('#/event');
};
  const handleAudiencePhotoUpload = async (file) => {
  if (!file || !audienceSession || !supabase) return;

  const upload = await uploadEventMedia(
    file,
    `audience/${APP_EVENT_ID}`,
    audienceSession.sessionId
  );

  if (upload.error) {
    alert(`Photo upload failed: ${upload.error.message}`);
    return;
  }

  const { error } = await supabase
    .from('audience')
    .update({
      photo_url: upload.url,
    })
    .eq('event_id', APP_EVENT_ID)
    .eq('id', audienceSession.sessionId);

  if (error) {
    console.error('Audience photo update error:', error);
    return;
  }

  const nextSession = {
    ...audienceSession,
    photoUrl: upload.url,
  };

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(nextSession)
  );

  setAudienceSession(nextSession);

  await refreshLiveData();
};
  const nowPlayingPerformance = supabasePerformances.find((performance) => performance.status === 'playing') || null;
  const audienceVoteCount = useMemo(() => supabaseVotes.filter((vote) => vote.audience_id === audienceSession?.sessionId).length, [supabaseVotes, audienceSession]);
  const audienceReactionCount = useMemo(() => supabaseReactions.filter((reaction) => reaction.audience_id === audienceSession?.sessionId).length, [supabaseReactions, audienceSession]);

  useEffect(() => {
    if (!supabase || !audienceSession?.sessionId) return;
    const profile = getEngagementProfile(audienceVoteCount, audienceReactionCount, audienceSession.language || 'en');
    supabase.from('audience_memory_cards').upsert({
      event_id: APP_EVENT_ID,
      audience_id: audienceSession.sessionId,
      audience_name: audienceSession.nickname || 'Audience Guest',
      photo_url: audienceSession.photoUrl || null,
      engagement_score: profile.score,
      engagement_tag: profile.tag,
      snapshot: { votes: audienceVoteCount, reactions: audienceReactionCount, language: audienceSession.language || 'en' },
      updated_at: new Date().toISOString(),
    }, { onConflict: 'event_id,audience_id' }).then(({ error }) => {
      if (error) console.warn('Memory card sync skipped:', error.message);
    });
  }, [audienceSession, audienceVoteCount, audienceReactionCount]);

  const audienceData = supabaseAudience;
  const eventName = EVENT_DISPLAY_NAME;
  const people = useMemo(() => mergePeople(supabasePeople), [supabasePeople]);

  return (
    <div className="rain-theme min-h-screen bg-gradient-to-br from-sky-100 via-slate-50 to-indigo-100 text-slate-800 font-sans selection:bg-sky-300/40 antialiased relative overflow-x-hidden">
      <RainThemeStyles />
      <RainOverlay />

      <div className="bg-white/85 border-b border-sky-200/60 text-xs py-2 px-4 backdrop-blur sticky top-0 z-50 flex items-center justify-between flex-wrap gap-2 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-black text-sky-700"><CloudRain className="w-4 h-4" /><span>Music Night Live</span></div>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">Event: <strong className="text-slate-700">{eventName}</strong></span>
        </div>

        <div className="flex items-center bg-white/80 p-0.5 rounded-lg border border-sky-200/80">
          <button onClick={() => navigate(audienceSession ? '#/event' : '#/')} className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${currentRoute.startsWith('#/') && !currentRoute.startsWith('#/admin') ? 'bg-sky-600 text-white' : 'text-slate-500 hover:text-sky-700'}`}>Audience</button>
          <button onClick={() => navigate('#/admin')} className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${currentRoute.startsWith('#/admin') ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-indigo-700'}`}>Admin Room</button>
        </div>
      </div>

      {currentRoute === '#/' || currentRoute === '#/join' ? (
        <AudienceLanding session={audienceSession} onJoin={handleAudienceJoin} onContinue={() => navigate('#/event')} />
      ) : currentRoute === '#/event' ? (
        <AudienceHome
          session={audienceSession}
          language={audienceSession?.language || 'en'}
          nowPlaying={nowPlayingPerformance}
          supabaseInteractions={supabaseInteractions}
          supabaseVotes={supabaseVotes}
          supabaseReactions={supabaseReactions}
          people={people}
          audienceProfile={
  supabaseAudience.find(
    (row) =>
      row.id === audienceSession?.sessionId
  ) || null
}
          onAudiencePhotoUpload={handleAudiencePhotoUpload}
          onChangeNickname={() => navigate('#/join')}
        />
      ) : currentRoute === '#/admin/login' || (!isAdminLoggedIn && currentRoute.startsWith('#/admin')) ? (
        <AdminLogin onLogin={() => { setIsAdminLoggedIn(true); navigate('#/admin'); }} />
      ) : currentRoute.startsWith('#/admin') ? (
        <AdminDashboard
          dbData={dbData}
          updateDatabase={updateDatabase}
          activeTab={activeAdminTab}
          setActiveTab={setActiveAdminTab}
          onLogout={() => { setIsAdminLoggedIn(false); navigate('#/admin/login'); }}
          nowPlaying={nowPlayingPerformance}
          supabasePerformances={supabasePerformances}
          supabaseInteractions={supabaseInteractions}
          supabaseVotes={supabaseVotes}
          supabaseReactions={supabaseReactions}
          audienceCount={liveAudienceCount}
          supabaseAudience={audienceData}
          people={people}
          analyticsSnapshots={analyticsSnapshots}
          supabaseMemoryCards={supabaseMemoryCards}
          onRefresh={refreshLiveData}
        />
      ) : (
        <AudienceLanding session={audienceSession} onJoin={handleAudienceJoin} onContinue={() => navigate('#/event')} />
      )}
    </div>
  );
}

function AudienceLanding({ session, onJoin, onContinue }) {
  const [firstName, setFirstName] = useState(
    session?.firstName || ''
  );

  const [surname, setSurname] = useState(
    session?.surname || ''
  );

  const [language, setLanguage] = useState(
    session?.language || 'en'
  );

  const [photoFile, setPhotoFile] = useState(null);

  const t = (key) => uiText(language, key);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!firstName.trim() || !surname.trim()) return;

    onJoin(
      firstName.trim(),
      surname.trim(),
      language,
      photoFile
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative z-10">
      <div className="w-full max-w-md">

        <div className="bg-slate-950/75 border border-cyan-300/20 rounded-3xl p-7 shadow-2xl text-center backdrop-blur-2xl relative overflow-hidden">

          <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">

            <div className="w-20 h-20 mx-auto rounded-3xl bg-cyan-400/10 border border-cyan-300/20 flex items-center justify-center mb-5 shadow-lg shadow-cyan-900/30">
              <CloudRain className="w-10 h-10 text-cyan-300" />
            </div>

            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300 font-black mb-2">
              {t('welcome')}
            </p>

            <h1 className="text-3xl font-black text-white tracking-tight">
              {EVENT_DISPLAY_NAME}
            </h1>

            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              {t('experience')}
            </p>

            <div className="h-px bg-cyan-300/10 my-6" />

            <form
              onSubmit={handleSubmit}
              className="space-y-4 text-left"
            >

              <div>
                <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  {t('chooseLanguage')}
                </label>

                <div className="grid grid-cols-3 gap-2 mt-2">
                  {LANGUAGE_OPTIONS.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setLanguage(item.code)}
                      className={`rounded-xl border px-2 py-3 text-sm font-black transition ${
                        language === item.code
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-900/30'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {item.native}
                    </button>
                  ))}
                </div>

                <p className="text-[10px] text-slate-500 mt-2">
                  {t('languageSaved')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
                    {t('firstName')}
                  </label>

                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(event.target.value)
                    }
                    placeholder={t('enterFirstName')}
                    className="w-full mt-2 bg-white/10 border border-cyan-200/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-300/30 transition"
                    maxLength={25}
                    autoComplete="given-name"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
                    {t('surname')}
                  </label>

                  <input
                    type="text"
                    value={surname}
                    onChange={(event) =>
                      setSurname(event.target.value)
                    }
                    placeholder={t('enterSurname')}
                    className="w-full mt-2 bg-white/10 border border-cyan-200/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-300/30 transition"
                    maxLength={25}
                    autoComplete="family-name"
                  />
                </div>

              </div>

              <div>
                <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  {t('memoryPhoto')}{' '}
                  <span className="normal-case text-slate-500">
                    {t('optional')}
                  </span>
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setPhotoFile(
                      event.target.files?.[0] || null
                    )
                  }
                  className="w-full mt-2 text-xs text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-400/10 file:px-3 file:py-2 file:text-xs file:font-black file:text-cyan-300"
                />
              </div>

              <button
                type="submit"
                disabled={
                  !firstName.trim() ||
                  !surname.trim()
                }
                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 rounded-xl py-3.5 font-black text-sm transition flex items-center justify-center gap-2"
              >
                {t('join')} {EVENT_DISPLAY_NAME}
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

            {session?.nickname && (
              <button
                onClick={onContinue}
                className="w-full mt-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl py-3 text-sm font-bold transition border border-white/10"
              >
                {t('continueAs')} {session.nickname}
              </button>
            )}

            <div className="mt-7 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-slate-500">
              <Radio className="w-3 h-3" />
              {t('liveEvent')}
              <span>•</span>
              {t('audienceExperience')}
            </div>

          </div>
        </div>

        <p className="text-center text-[10px] text-slate-500 mt-5">
          {t('watchLine')}
        </p>

      </div>
    </div>
  );
}
function AudienceHome({ session, language = 'en', nowPlaying, supabaseInteractions, supabaseVotes, supabaseReactions, people, audienceProfile, onAudiencePhotoUpload, onChangeNickname }) {
  const nickname = session?.nickname || 'Guest';
  const lang = session?.language || language || 'en';
  const t = (key) => uiText(lang, key);
  const [showPeopleModal, setShowPeopleModal] = useState(false);
  const [peopleTab, setPeopleTab] = useState('anchor');
  const [voteMessage, setVoteMessage] = useState('');
  const [reactionMessage, setReactionMessage] = useState('');

  const liveInteraction = useMemo(() => supabaseInteractions.find((interaction) => interaction.event_id === APP_EVENT_ID && interaction.status === 'live') || null, [supabaseInteractions]);
  const currentPerformer = people.find((person) => person.category === 'performer' && person.name === nowPlaying?.performer) || null;
  const musicianPeople = people.filter((person) => person.category === 'musician');
  const anchorPeople = people.filter((person) => person.category === 'anchor');

  const hasVoted = Boolean(liveInteraction && session?.sessionId && supabaseVotes.some((vote) => vote.interaction_id === liveInteraction.id && vote.audience_id === session.sessionId));
  const myReaction = nowPlaying && session?.sessionId ? supabaseReactions.find((reaction) => reaction.performance_id === nowPlaying.id && reaction.audience_id === session.sessionId)?.reaction : null;
  const myVotes = session?.sessionId ? supabaseVotes.filter((vote) => vote.audience_id === session.sessionId) : [];
  const myReactions = session?.sessionId ? supabaseReactions.filter((row) => row.audience_id === session.sessionId) : [];
  const engagement = getEngagementProfile(myVotes.length, myReactions.length, lang);
  const photoUrl = audienceProfile?.photo_url || session?.photoUrl || '';

  const handleVote = async (option) => {
    if (!supabase || !liveInteraction || !session?.sessionId || hasVoted) return;
    setVoteMessage(t('submitting'));
    const sessionId = session.sessionId;
    const { error } = await supabase.from('interaction_votes').insert({ interaction_id: liveInteraction.id, audience_id: sessionId, selected_option: option });
    if (error) {
      setVoteMessage(error.code === '23505' ? t('alreadyAnswered') : `Vote failed: ${error.message}`);
      return;
    }
    if (liveInteraction.type === 'guess_song') {
      setVoteMessage(liveInteraction.correct_option === option ? `${t('correct')} 🎉` : `${t('notQuite')}: ${liveInteraction.correct_option}`);
    } else {
      setVoteMessage(t('voteRecorded'));
    }
  };

  const handleReaction = async (reaction) => {
    if (!supabase || !nowPlaying || !session?.sessionId || myReaction) return;
    setReactionMessage(t('sending'));
    console.log('REACTION BEING SENT:', JSON.stringify(reaction));
    const { error } = await supabase.from('performance_reactions').insert({ performance_id: nowPlaying.id, audience_id: session.sessionId, reaction });
    if (error) setReactionMessage(error.code === '23505' ? t('alreadyReacted') : `Reaction failed: ${error.message}`);
    else setReactionMessage(t('reactionSent'));
  };

  const interactionResults = liveInteraction ? (liveInteraction.options || []).map((option) => {
    const votes = supabaseVotes.filter((vote) => vote.interaction_id === liveInteraction.id && vote.selected_option === option).length;
    const total = supabaseVotes.filter((vote) => vote.interaction_id === liveInteraction.id).length;
    return { option, votes, percentage: total ? Math.round((votes / total) * 100) : 0 };
  }) : [];

  const performanceReactionCounts = nowPlaying ? REACTION_OPTIONS.map((reaction) => ({ ...reaction, count: supabaseReactions.filter((row) => row.performance_id === nowPlaying.id && row.reaction === reaction.value).length })) : [];

  const openPeople = (tab) => {
    setPeopleTab(tab);
    setShowPeopleModal(true);
  };

  const handleDownloadCard = async () => {
    const blob = await buildMemoryCardBlob({ name: nickname, photoUrl, score: engagement.score, tag: engagement.tag, language: lang });
    downloadBlob(blob, `${EVENT_DISPLAY_NAME.replace(/\s+/g, '-')}-${nickname.replace(/\s+/g, '-')}-memory.png`);
  };

  const handleShareCard = async () => {
    const blob = await buildMemoryCardBlob({ name: nickname, photoUrl, score: engagement.score, tag: engagement.tag, language: lang });
    const file = new File([blob], `${EVENT_DISPLAY_NAME.replace(/\s+/g, '-')}-memory.png`, { type: 'image/png' });
    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({ title: `${EVENT_DISPLAY_NAME} Memory`, text: `${nickname} • ${engagement.tag}`, files: [file] });
        return;
      }
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
    downloadBlob(blob, `${EVENT_DISPLAY_NAME.replace(/\s+/g, '-')}-memory.png`);
  };

  return (
    <>
      <div className="max-w-md mx-auto p-4 pb-20 space-y-5 relative z-10">
        <div className="bg-white/88 border border-sky-200 rounded-2xl p-4 backdrop-blur shadow-md flex items-center justify-between">
          <div><span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">{t('audienceMember')}</span><h2 className="text-lg font-black text-slate-900">{uiTextWithName(lang, 'goodEvening', nickname)}</h2></div>
          <button onClick={onChangeNickname} className="text-xs text-sky-700 hover:text-sky-900 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 font-bold transition">{t('change')}</button>
        </div>

        <div className="bg-white/88 border border-sky-200 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-sky-200/40 rounded-full blur-2xl pointer-events-none" />
          <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-sky-700 bg-sky-100 px-3.5 py-1 rounded-full border border-sky-200 mb-4"><CloudRain className="w-4 h-4" /> {t('nowPlaying')}</div>
          {nowPlaying ? <div className="space-y-4">
            {currentPerformer?.photo && <img src={currentPerformer.photo} alt={currentPerformer.name} className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-white shadow-xl" />}
            {!currentPerformer?.photo && <div className="w-28 h-28 mx-auto rounded-full bg-sky-100 border-4 border-white shadow-xl flex items-center justify-center"><Music className="w-10 h-10 text-sky-500" /></div>}
            <div><h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">🎤 {nowPlaying.title}</h1><p className="text-xl text-sky-700 font-black mt-1">{nowPlaying.performer}</p>{nowPlaying.song_artist && <p className="text-xs text-slate-400 mt-1">Original: {nowPlaying.song_artist}</p>}</div>
            {currentPerformer && <div className="grid grid-cols-2 gap-2 text-left"><div className="bg-sky-50 rounded-xl p-3"><span className="text-[9px] uppercase font-black text-slate-400">{t('age')}</span><p className="text-sm font-black text-slate-800">{currentPerformer.age || '—'}</p></div><div className="bg-sky-50 rounded-xl p-3"><span className="text-[9px] uppercase font-black text-slate-400">{t('work')}</span><p className="text-sm font-black text-slate-800">{currentPerformer.work || '—'}</p></div>{currentPerformer.workplace && <div className="col-span-2 bg-sky-50 rounded-xl p-3 text-left"><span className="text-[9px] uppercase font-black text-slate-400">{t('workplace')}</span><p className="text-sm font-black text-slate-800">{currentPerformer.workplace}</p></div>}
              {currentPerformer.intro && <p className="col-span-2 text-xs text-slate-500 leading-relaxed">{currentPerformer.intro}</p>}
            </div>}
            <div className="pt-1 flex justify-center items-center gap-1"><span className="w-1.5 h-4 bg-sky-500 rounded-full animate-bounce" /><span className="w-1.5 h-6 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" /><span className="w-1.5 h-3 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]" /></div>
          </div> : <div className="py-6"><Radio className="w-10 h-10 text-slate-300 mx-auto mb-2 animate-pulse" /><p className="text-slate-500 text-sm font-bold">{t('intermission')}</p></div>}
        </div>

        {nowPlaying && people.filter((person) => person.category === 'performer' && person.name !== nowPlaying.performer).length > 0 && <div className="bg-white/86 border border-sky-200 rounded-3xl p-5 shadow-xl"><div className="flex items-center justify-between mb-4"><div><h3 className="text-sm font-black text-slate-900">{t('performers')}</h3><p className="text-[11px] text-slate-500 mt-1">Know the other performers</p></div><Users className="w-5 h-5 text-sky-700" /></div><div className="grid grid-cols-2 gap-3">{people.filter((person) => person.category === 'performer' && person.name !== nowPlaying.performer).map((person) => <button key={person.id} onClick={() => { setPeopleTab('performer'); setShowPeopleModal(true); }} className="bg-white border border-slate-200 rounded-2xl p-3 text-left hover:border-sky-300 transition"><div className="flex items-center gap-3">{person.photo ? <img src={person.photo} alt={person.name} className="w-12 h-12 rounded-xl object-cover" /> : <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center"><Music className="w-5 h-5 text-sky-500" /></div>}<div><p className="text-xs font-black text-slate-900">{person.name}</p><span className="text-[9px] font-black text-sky-700">{t('knowMore')}</span></div></div></button>)}</div></div>}

        {liveInteraction && <div className="bg-white/86 border border-emerald-200 rounded-3xl p-5 shadow-xl"><div className="flex items-center justify-between mb-2"><div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-700"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {t('liveInteraction')}</div>{hasVoted && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}</div><h3 className="text-lg font-black text-slate-900">{liveInteraction.question || liveInteraction.title}</h3><p className="text-xs text-slate-500 mt-1">{liveInteraction.type === 'guess_song' ? t('guessSong') : t('tapOne')}</p><div className="space-y-2 mt-4">{interactionResults.map(({ option, votes, percentage }) => <button key={option} disabled={hasVoted} onClick={() => handleVote(option)} className={`w-full relative overflow-hidden border rounded-xl px-3 py-3 text-left transition ${hasVoted ? 'border-slate-200 bg-slate-50' : 'border-slate-200 hover:border-emerald-300 bg-white'}`}>{hasVoted && <div className="absolute inset-y-0 left-0 bg-emerald-100" style={{ width: `${percentage}%` }} />}<div className="relative flex items-center justify-between gap-3"><span className="text-sm text-slate-800 font-bold">{option}</span>{hasVoted && <span className="text-xs font-black text-emerald-700">{percentage}%</span>}</div>{hasVoted && <div className="relative mt-1 text-[10px] text-slate-500">{votes} {t('votes')}</div>}</button>)}</div>{voteMessage && <p className="text-xs text-emerald-700 mt-3 font-bold">{voteMessage}</p>}</div>}

        {nowPlaying && <div className="bg-white/86 border border-sky-200 rounded-3xl p-5 shadow-xl"><div className="flex items-center justify-between"><div><h3 className="text-sm font-black text-slate-900">{t('reactPerformance')}</h3><p className="text-[11px] text-slate-500 mt-1">{t('oneReaction')}</p></div><Heart className="w-5 h-5 text-pink-500" /></div><div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">{performanceReactionCounts.map(({ value, emoji, label, count }) => <button key={value} disabled={Boolean(myReaction)} onClick={() => handleReaction(value)} className={`rounded-2xl py-3 px-2 border transition ${myReaction === value ? 'bg-pink-50 border-pink-300 ring-2 ring-pink-100' : 'bg-white border-slate-200 hover:border-sky-300'}`}><div className="text-lg">{emoji}</div><div className="text-[11px] text-slate-700 font-black mt-1">{label}</div><div className="text-[10px] text-slate-400 mt-0.5">{count}</div></button>)}</div>{reactionMessage && <p className="text-xs text-pink-600 mt-3 font-bold">{reactionMessage}</p>}</div>}

        <div className="bg-white/86 border border-sky-200 rounded-3xl p-5"><div className="flex items-center justify-between mb-4"><div><h3 className="text-sm font-black text-slate-900">{t('knowMusicians')}</h3><p className="text-[11px] text-slate-500 mt-1">{t('peopleCreatingSound')}</p></div><Volume2 className="w-5 h-5 text-sky-700" /></div><div className="grid grid-cols-2 gap-3">{musicianPeople.map((person) => <PersonMiniPhotoCard key={person.id || person.name} person={person} />)}</div><button onClick={() => openPeople('musician')} className="w-full mt-4 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl py-2.5 text-xs font-black transition">{t('seeMusicianDetails')}</button></div>

        <div className="bg-white/86 border border-sky-200 rounded-3xl p-5"><div className="flex items-center justify-between"><div><h3 className="text-sm font-black text-slate-900">{t('anchorsTeam')}</h3><p className="text-[11px] text-slate-500 mt-1">{t('meetPeople')}</p></div><Sparkles className="w-5 h-5 text-sky-700" /></div><div className="grid grid-cols-2 gap-3 mt-4">{anchorPeople.slice(0, 2).map((person) => <PersonMiniPhotoCard key={person.id || person.name} person={person} />)}</div><button onClick={() => openPeople('anchor')} className="w-full mt-4 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl py-2.5 text-xs font-black transition">{t('knowAnchorsTeam')}</button></div>

        <div className="bg-white/88 border border-sky-200 rounded-3xl p-5"><div className="flex items-center justify-between"><div><div className="text-xs font-black uppercase tracking-widest text-sky-700 flex items-center gap-2"><Zap className="w-4 h-4" /> {t('yourMemory')}</div><h3 className="text-xl font-black text-slate-900 mt-2">{engagement.tag}</h3><p className="text-xs text-slate-500 mt-1">{t('builtFromParticipation')}</p></div><div className="text-3xl font-black text-sky-700">{engagement.score}%</div></div><div className="h-3 rounded-full bg-slate-100 mt-4 overflow-hidden"><div className="h-full bg-sky-500 rounded-full" style={{ width: `${engagement.score}%` }} /></div><div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 p-3 flex items-center gap-3"><div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-sky-100 flex items-center justify-center text-xl text-sky-700">{photoUrl ? <img src={photoUrl} alt={nickname} className="w-full h-full object-cover" /> : nickname.charAt(0).toUpperCase()}</div><div className="flex-1"><p className="text-xs text-slate-400">{t('memoryPhoto')}</p><p className="text-sm font-black text-slate-900">{nickname}</p></div>{!photoUrl && <label className="cursor-pointer text-[10px] font-black text-sky-700 bg-white border border-sky-200 rounded-lg px-2 py-1.5"><Camera className="w-3 h-3 inline mr-1" />{t('addPhoto')}<input type="file" accept="image/*" className="hidden" onChange={(event) => onAudiencePhotoUpload(event.target.files?.[0])} /></label>}</div><div className="flex gap-2 mt-3"><button onClick={handleDownloadCard} className="flex-1 bg-sky-600 text-white font-black text-xs rounded-xl py-2.5 flex items-center justify-center gap-2"><Download className="w-4 h-4" /> {t('download')}</button><button onClick={handleShareCard} className="flex-1 bg-indigo-600 text-white font-black text-xs rounded-xl py-2.5 flex items-center justify-center gap-2"><Share2 className="w-4 h-4" /> {t('share')}</button></div></div>

        <div className="bg-white/86 border border-sky-200 rounded-3xl p-5"><div className="flex items-center gap-2 text-sky-700 text-xs font-black uppercase tracking-widest"><Zap className="w-4 h-4" /> {t('yourMusicNight')}</div><div className="grid grid-cols-2 gap-3 mt-4"><StatBox label={t('votes')} value={myVotes.length} /><StatBox label={t('reactions')} value={myReactions.length} /></div></div>
        <div className="text-center text-[10px] uppercase font-black tracking-widest text-slate-400 pt-2">{t('watchLine')}</div>
      </div>

      {showPeopleModal && <EventPeopleModal people={people} initialTab={peopleTab} currentPerformer={currentPerformer} language={lang} onClose={() => setShowPeopleModal(false)} />}
    </>
  );
}

function PersonFeatureCard({ title, person, onClick }) {
  return <div className="bg-white/84 border border-sky-200 rounded-3xl p-5 shadow"><div className="flex items-center gap-4"><div className="w-20 h-20 rounded-2xl overflow-hidden bg-sky-100 border border-sky-200 flex items-center justify-center text-2xl">{person.photo ? <img src={person.photo} alt={person.name} className="w-full h-full object-cover" /> : '🎤'}</div><div className="flex-1"><p className="text-[10px] uppercase tracking-widest text-sky-700 font-black">{title}</p><h3 className="text-lg font-black text-slate-900 mt-1">{person.name}</h3><p className="text-xs text-slate-500 mt-1">{person.role || person.instrument}</p></div></div><p className="text-xs text-slate-500 leading-relaxed mt-3">{person.intro}</p><button onClick={onClick} className="mt-3 text-xs font-black text-sky-700">Know more →</button></div>;
}

function PersonMiniPhotoCard({ person }) {
  return <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm"><div className="w-full aspect-square max-h-32 rounded-xl overflow-hidden bg-sky-50 border border-sky-100 flex items-center justify-center text-2xl">{person.photo ? <img src={person.photo} alt={person.name} className="w-full h-full object-cover" /> : (person.category === 'musician' ? instrumentEmoji(person.instrument) : person.category === 'anchor' ? '🎙️' : '✨')}</div><p className="text-sm font-black text-slate-900 mt-2 truncate">{person.name}</p><p className="text-[11px] text-slate-500 truncate">{person.role || person.instrument}</p></div>;
}

function StatBox({ label, value }) {
  return <div className="bg-white border border-slate-200 rounded-2xl p-3 text-center shadow-sm"><div className="text-2xl font-black text-slate-900">{value}</div><div className="text-[10px] uppercase font-black tracking-wider text-slate-500 mt-1">{label}</div></div>;
}

function instrumentEmoji(instrument) {
  return { Guitar: '🎸', Keyboard: '🎹', Drums: '🥁', Bass: '🎸', Violin: '🎻', Flute: '🪈', Tabla: '🥁' }[instrument] || '🎵';
}

function EventPeopleModal({ people, currentPerformer, initialTab, language = 'en', onClose }) {
  const [tab, setTab] = useState(initialTab || 'performer');
  const t = (key) => uiText(language, key);
  const groups = {
    performer: { title: t('performers'), icon: '🎤', people: people.filter((person) => person.category === 'performer') },
    musician: { title: t('liveMusicians'), icon: '🎼', people: people.filter((person) => person.category === 'musician') },
    anchor: { title: t('anchors'), icon: '🎙️', people: people.filter((person) => person.category === 'anchor') },
    organizer: { title: t('organisingTeam'), icon: '✨', people: people.filter((person) => person.category === 'organizer') },
  };
  const currentGroup = groups[tab] || groups.performer;

  return <div className="fixed inset-0 z-[100] bg-sky-950/30 backdrop-blur-md flex items-center justify-center p-4"><div className="bg-white border border-sky-200 rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl"><div className="p-4 border-b border-sky-100 flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-widest text-sky-700 font-black">{EVENT_DISPLAY_NAME}</p><h2 className="text-lg font-black text-slate-900">{t('knowMoreTitle')}</h2></div><button onClick={onClose} className="p-2 rounded-xl bg-sky-50 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button></div><div className="flex gap-2 p-3 overflow-x-auto border-b border-sky-100">{Object.entries(groups).map(([key, group]) => <button key={key} onClick={() => setTab(key)} className={`whitespace-nowrap px-3 py-2 rounded-xl text-[11px] font-black border ${tab === key ? 'bg-sky-600 text-white border-sky-500' : 'bg-white text-slate-500 border-slate-200'}`}>{group.icon} {group.title}</button>)}</div><div className="overflow-y-auto max-h-[calc(90vh-130px)] p-4 space-y-4">{tab === 'performer' && currentPerformer && <div className="mb-2"><p className="text-[9px] uppercase tracking-widest text-sky-700 font-black mb-2">{t('performingNow')}</p><PersonDetailCard person={currentPerformer} language={language} /></div>}{currentGroup.people.length === 0 ? <div className="py-10 text-center text-slate-400 text-xs">{t('noTeam')}</div> : currentGroup.people.map((person) => <PersonDetailCard key={person.id || person.name} person={person} language={language} />)}</div></div></div>;
}

function PersonDetailCard({ person, language = 'en' }) {
  const t = (key) => uiText(language, key);
  return <div className="bg-sky-50/80 border border-sky-100 rounded-2xl p-4"><div className="flex items-start gap-3"><div className="w-16 h-16 rounded-xl bg-white border border-sky-200 flex items-center justify-center text-xl overflow-hidden">{person.photo ? <img src={person.photo} alt={person.name} className="w-full h-full object-cover" /> : (person.category === 'musician' ? instrumentEmoji(person.instrument) : person.category === 'anchor' ? '🎙️' : person.category === 'organizer' ? '✨' : '🎤')}</div><div className="flex-1"><h4 className="text-sm font-black text-slate-900">{person.name}</h4><p className="text-xs text-sky-700 font-bold">{person.role || person.instrument}</p></div></div><p className="text-xs text-slate-500 leading-relaxed mt-3">{person.intro || t('partOfTeam')}</p><div className="grid grid-cols-2 gap-2 mt-3"><InfoBox label={t('age')} value={person.age || '—'} /><InfoBox label={t('work')} value={person.work || '—'} /><div className="col-span-2"><InfoBox label={t('workplace')} value={person.workplace || '—'} /></div></div><div className="mt-2"><InfoBox label={t('achievements')} value={person.achievements || '—'} /></div></div>;
}

function InfoBox({ label, value }) {
  return <div className="bg-white rounded-xl p-2.5 border border-sky-100"><p className="text-[9px] uppercase text-slate-400 font-black">{label}</p><p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{value}</p></div>;
}

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError('');
      onLogin();
    } else {
      setError('Incorrect admin password.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-42px)] flex items-center justify-center p-6 relative z-10">
      <div className="w-full max-w-md bg-white/86 border border-sky-200 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="text-center space-y-2"><div className="inline-flex p-3 bg-sky-100 border border-sky-200 rounded-2xl text-sky-700 mb-2"><Lock className="w-8 h-8" /></div><h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Control Room</h2><p className="text-xs text-slate-500">{EVENT_DISPLAY_NAME}</p></div>
        <form onSubmit={handleSubmit} className="space-y-4"><div><label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-1.5">Admin Password</label><input autoFocus type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full bg-white border border-sky-200 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none" /></div>{error && <p className="text-xs font-bold text-rose-600">{error}</p>}<button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-3 rounded-xl text-sm transition flex items-center justify-center gap-2">Enter Control Dashboard <ArrowRight className="w-4 h-4" /></button></form>
      </div>
    </div>
  );
}

function AdminDashboard({ dbData, updateDatabase, activeTab, setActiveTab, onLogout, nowPlaying, supabasePerformances, supabaseInteractions, supabaseVotes, supabaseReactions, audienceCount, supabaseAudience, people, analyticsSnapshots, supabaseMemoryCards, onRefresh }) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'performances', label: 'Performances', icon: ListMusic },
    { id: 'musicians', label: 'Musicians', icon: Music },
    { id: 'people', label: 'People & Team', icon: Users },
    { id: 'audience', label: 'Audience', icon: Users },
    { id: 'interactions', label: 'Interactions', icon: MessageCircle },
    { id: 'analytics', label: 'Analytics', icon: Activity },
  ];

  return <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 relative z-10"><div className="bg-white/84 border border-sky-200 rounded-3xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4 backdrop-blur"><div className="flex items-center gap-3"><div className="p-3 bg-sky-100 border border-sky-200 rounded-2xl text-sky-700"><CloudRain className="w-6 h-6 animate-pulse" /></div><div><span className="text-[10px] font-black uppercase tracking-widest text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full border border-sky-200">Live Control Room</span><h1 className="text-2xl font-black text-slate-900 tracking-tight">{EVENT_DISPLAY_NAME}</h1></div></div><div className="flex items-center gap-3"><div className="bg-white/80 px-3 py-1.5 rounded-xl border border-sky-200 text-xs flex items-center gap-2"><Users className="w-4 h-4 text-sky-700" /><span className="text-slate-500">Audience:</span><strong className="text-slate-900 font-black text-sm">{audienceCount}</strong></div><button onClick={onLogout} className="p-2 bg-white hover:bg-sky-50 text-slate-600 rounded-xl border border-slate-200 transition text-xs flex items-center gap-1"><LogOut className="w-4 h-4" /> Logout</button></div></div><div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-sky-200">{tabs.map((tab) => { const Icon = tab.icon; const isActive = activeTab === tab.id; return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition whitespace-nowrap ${isActive ? 'bg-sky-600 text-white shadow-lg' : 'bg-white/80 text-slate-500 hover:text-sky-700 border border-slate-200'}`}><Icon className="w-4 h-4" /><span>{tab.label}</span></button>; })}</div>{activeTab === 'overview' && <AdminOverviewTab nowPlaying={nowPlaying} people={people} audienceCount={audienceCount} />}{activeTab === 'performances' && <AdminPerformancesTab supabasePerformances={supabasePerformances} onRefresh={onRefresh} />}{activeTab === 'musicians' && <AdminMusiciansTab people={people} onRefresh={onRefresh} />}{activeTab === 'people' && <AdminPeopleTab people={people} onRefresh={onRefresh} />}{activeTab === 'audience' && <AdminAudienceTab audience={supabaseAudience} audienceCount={audienceCount} supabaseVotes={supabaseVotes} supabaseReactions={supabaseReactions} supabaseInteractions={supabaseInteractions} />}{activeTab === 'interactions' && <AdminInteractionsTab supabaseInteractions={supabaseInteractions} supabaseVotes={supabaseVotes} supabaseAudience={supabaseAudience} supabaseReactions={supabaseReactions} supabasePerformances={supabasePerformances} />}{activeTab === 'analytics' && <AdminAnalyticsTab audienceCount={audienceCount} supabasePerformances={supabasePerformances} supabaseInteractions={supabaseInteractions} supabaseVotes={supabaseVotes} supabaseReactions={supabaseReactions} supabaseAudience={supabaseAudience} people={people} analyticsSnapshots={analyticsSnapshots} supabaseMemoryCards={supabaseMemoryCards} onRefresh={onRefresh} />}</div>;
}

function AdminOverviewTab({ nowPlaying, people, audienceCount }) {
  const musicianCount = people.filter((person) => person.category === 'musician').length;
  const endCurrentPerformance = async () => {
    if (!supabase || !nowPlaying) return;
    const { error } = await supabase.from('performances').update({ status: 'completed' }).eq('id', nowPlaying.id);
    if (error) alert(`Could not end performance: ${error.message}`);
  };

  return <div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><InfoCard title="Event Status"><div className="flex items-center justify-between"><h3 className="text-lg font-black text-slate-900">{EVENT_DISPLAY_NAME}</h3><span className="px-2.5 py-1 rounded-full text-xs font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">LIVE</span></div><p className="text-xs text-slate-500 mt-2">Date: 2026-10-15</p></InfoCard><InfoCard title="Live Audience"><div className="flex items-center justify-between"><h3 className="text-3xl font-black text-sky-700">{audienceCount}</h3><Users className="w-8 h-8 text-sky-300" /></div><p className="text-xs text-slate-500">Connected sessions</p></InfoCard><InfoCard title="Stage Musicians"><div className="flex items-center justify-between"><h3 className="text-3xl font-black text-indigo-700">{musicianCount}</h3><Music className="w-8 h-8 text-indigo-300" /></div><p className="text-xs text-slate-500">People in the music team</p></InfoCard></div><div className="bg-white/84 border border-sky-200 rounded-3xl p-6 space-y-4 shadow-xl"><div className="flex items-center justify-between border-b border-sky-100 pb-3"><div className="flex items-center gap-2"><Music className="w-5 h-5 text-sky-700" /><h3 className="text-base font-black text-slate-900">Current Stage Performance</h3></div>{nowPlaying && <button onClick={endCurrentPerformance} className="text-xs font-black text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200">End Performance</button>}</div>{nowPlaying ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"><div><span className="text-[10px] font-black text-sky-700 uppercase tracking-wider">Now Playing</span><h2 className="text-2xl font-black text-slate-900 mt-1">🎤 {nowPlaying.title}</h2><p className="text-sm font-black text-sky-700 mt-1">Performer: {nowPlaying.performer}</p><p className="text-xs text-slate-500 mt-0.5">Original: {nowPlaying.song_artist || '—'}</p></div><div className="bg-sky-50 p-4 rounded-2xl border border-sky-100"><span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-2">Live Musicians</span><div className="flex flex-wrap gap-2">{people.filter((person) => person.category === 'musician').map((musician) => <span key={musician.id} className="text-xs font-black bg-white text-sky-800 border border-sky-100 px-2.5 py-1 rounded-lg">{musician.name} ({musician.instrument || musician.role})</span>)}</div></div></div> : <div className="text-center py-6 text-slate-400 text-sm font-bold">No active song set.</div>}</div></div>;
}

function InfoCard({ title, children }) {
  return <div className="bg-white/84 border border-sky-200 rounded-2xl p-5 space-y-3 shadow-sm"><span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">{title}</span>{children}</div>;
}

async function ensureEventExists() {
  if (!supabase) return { error: new Error('Supabase is not connected') };
  const { data, error } = await supabase.from('events').select('id').eq('id', APP_EVENT_ID).maybeSingle();
  if (error) return { error };
  if (data) return { error: null };
  const { error: insertError } = await supabase.from('events').insert({
    id: APP_EVENT_ID,
    name: EVENT_DISPLAY_NAME,
    event_date: '2026-10-15',
    status: 'live',
  });
  return { error: insertError || null };
}

function AdminPerformancesTab({ supabasePerformances, onRefresh }) {
  const [songName, setSongName] = useState('');
  const [performerName, setPerformerName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [performerAge, setPerformerAge] = useState('');
  const [performerWork, setPerformerWork] = useState('');
  const [performerWorkplace, setPerformerWorkplace] = useState('');
  const [performerIntro, setPerformerIntro] = useState('');
  const [performerPhotoFile, setPerformerPhotoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);


  const resetForm = () => {
    setSongName('');
    setPerformerName('');
    setArtistName('');
    setPerformerAge('');
    setPerformerWork('');
    setPerformerWorkplace('');
    setPerformerIntro('');
    setPerformerPhotoFile(null);
    setEditingId(null);
  };

  const fillPerformerProfile = async (name) => {
    if (!supabase || !name.trim()) return;
    const { data } = await supabase
      .from('event_people')
      .select('*')
      .eq('event_id', APP_EVENT_ID)
      .eq('category', 'performer')
      .eq('name', name.trim())
      .limit(1);
    const person = data?.[0];
    if (!person) return;
    setPerformerAge(person.age || '');
    setPerformerWork(person.work || '');
    setPerformerWorkplace(person.workplace || '');
    setPerformerIntro(person.intro || '');
  };

  const handleAddOrUpdate = async (event) => {
    event.preventDefault();
    if (!supabase || !songName.trim() || !performerName.trim() || busy) return;
    setBusy(true);

    const eventResult = await ensureEventExists();
    if (eventResult.error) {
      alert(`Could not prepare event: ${eventResult.error.message}`);
      setBusy(false);
      return;
    }

    const cleanName = performerName.trim();
    const performerId = `performer_${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || Date.now()}`;
    const profileResult = await saveEventPerson({
      id: performerId,
      category: 'performer',
      name: cleanName,
      role: 'Performer',
      age: performerAge.trim(),
      work: performerWork.trim(),
      workplace: performerWorkplace.trim(),
      intro: performerIntro.trim(),
      display_order: 99,
    }, performerPhotoFile);

    if (profileResult.error) {
      alert(`Could not save performer profile: ${profileResult.error.message}`);
      setBusy(false);
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('performances')
        .update({
          title: songName.trim(),
          performer: cleanName,
          song_artist: artistName.trim(),
        })
        .eq('id', editingId);
      if (error) alert(`Could not update performance: ${error.message}`);
    } else {
      const newId = `perf_${Date.now()}`;
      const { error } = await supabase.from('performances').insert({
        id: newId,
        event_id: APP_EVENT_ID,
        title: songName.trim(),
        performer: cleanName,
        song_artist: artistName.trim(),
        display_order: supabasePerformances.length + 1,
        status: 'queued',
      });
      if (error) alert(`Could not add performance: ${error.message}`);
    }

    resetForm();
    setBusy(false);
    await onRefresh?.();
  };

  const handleSetPlaying = async (id) => {
    if (!supabase) return;
    const { error: stopError } = await supabase.from('performances').update({ status: 'queued' }).eq('event_id', APP_EVENT_ID).eq('status', 'playing');
    if (stopError) return alert(`Could not stop current performance: ${stopError.message}`);
    const { error } = await supabase.from('performances').update({ status: 'playing' }).eq('id', id).eq('event_id', APP_EVENT_ID);
    if (error) alert(`Could not make live: ${error.message}`);
    await onRefresh?.();
  };

  const handleEndPerformance = async (id) => {
    if (!supabase) return;
    const { error } = await supabase.from('performances').update({ status: 'completed' }).eq('id', id);
    if (error) alert(`Could not end performance: ${error.message}`);
    await onRefresh?.();
  };

  const handleDelete = async (id) => {
    if (!supabase || !window.confirm('Are you sure you want to delete this performance?')) return;
    const { error } = await supabase.from('performances').delete().eq('id', id);
    if (error) alert(`Could not delete performance: ${error.message}`);
    if (editingId === id) resetForm();
    await onRefresh?.();
  };

  const handleEdit = async (performance) => {
    setEditingId(performance.id);
    setSongName(performance.title || '');
    setPerformerName(performance.performer || '');
    setArtistName(performance.song_artist || '');
    await fillPerformerProfile(performance.performer || '');
  };

  return <div className="space-y-6">
    <form onSubmit={handleAddOrUpdate} className="bg-white/84 border border-sky-200 rounded-3xl p-5 shadow-lg space-y-5">
      <div><h3 className="text-sm font-black text-slate-900 flex items-center gap-2"><Plus className="w-4 h-4 text-sky-700" />{editingId ? 'Edit Performance' : 'Add New Performance'}</h3><p className="text-[11px] text-slate-500 mt-1">Performance details and the Know Your Performer profile are saved together.</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><FormInput label="Song Name" value={songName} setValue={setSongName} placeholder="e.g. Tum Hi Ho" /><FormInput label="Performer" value={performerName} setValue={setPerformerName} placeholder="e.g. Aarushi" /><FormInput label="Original Artist" value={artistName} setValue={setArtistName} placeholder="e.g. Mohit Chauhan" required={false} /></div>
      <div className="border-t border-sky-100 pt-4"><h4 className="text-xs font-black text-slate-900 flex items-center gap-2"><Users className="w-4 h-4 text-sky-700" /> Know Your Performer</h4><p className="text-[10px] text-slate-500 mt-1">This information is shown automatically on the audience landing page when this performer is live.</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><FormInput label="Age" value={performerAge} setValue={setPerformerAge} placeholder="e.g. 21" required={false} /><FormInput label="Work Type" value={performerWork} setValue={setPerformerWork} placeholder="e.g. Student" required={false} /><FormInput label="College / Workplace" value={performerWorkplace} setValue={setPerformerWorkplace} placeholder="e.g. Navrachana University" required={false} /></div>
      <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Performer Picture</label><input type="file" accept="image/*" onChange={(event) => setPerformerPhotoFile(event.target.files?.[0] || null)} className="w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-100 file:px-3 file:py-2 file:text-xs file:font-black file:text-sky-700" /></div>
      <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Short Introduction</label><textarea value={performerIntro} onChange={(event) => setPerformerIntro(event.target.value)} placeholder="A short introduction about the performer..." rows="3" className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500" /></div>
      <div className="flex gap-2"><button type="submit" disabled={busy} className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-300 text-white font-black text-xs px-4 py-2 rounded-xl">{busy ? 'Saving…' : editingId ? 'Save Changes' : 'Add Performance'}</button>{editingId && <button type="button" onClick={resetForm} className="bg-white text-slate-600 font-black text-xs px-4 py-2 rounded-xl border border-slate-200">Cancel</button>}</div>
    </form>
    <div className="bg-white/84 border border-sky-200 rounded-3xl p-5 space-y-3"><div className="flex items-center justify-between"><div><h3 className="text-sm font-black text-slate-900">Event Performance List</h3><p className="text-[10px] text-slate-500 mt-1">Control what the audience sees live</p></div><span className="text-[10px] text-emerald-700 font-black uppercase flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />Live Control</span></div><div className="space-y-2">{supabasePerformances.map((performance, index) => { const isPlaying = performance.status === 'playing'; return <div key={performance.id} className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${isPlaying ? 'bg-sky-50 border-sky-300' : 'bg-white border-slate-200'}`}><div className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-black text-xs">{index + 1}</span><div><h4 className="text-sm font-black text-slate-900 flex items-center gap-2">{performance.title}{isPlaying && <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">LIVE NOW</span>}</h4><p className="text-xs text-sky-700 font-bold">Singer: {performance.performer}</p>{performance.song_artist && <p className="text-[10px] text-slate-500 mt-0.5">Original: {performance.song_artist}</p>}</div></div><div className="flex items-center gap-2">{!isPlaying && <button onClick={() => handleSetPlaying(performance.id)} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black text-xs px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1"><PlayCircle className="w-3.5 h-3.5" />Make Live</button>}{isPlaying && <button onClick={() => handleEndPerformance(performance.id)} className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs px-3 py-1.5 rounded-xl border border-rose-200">End Performance</button>}<button onClick={() => handleEdit(performance)} className="p-1.5 bg-white hover:bg-sky-50 text-slate-600 rounded-lg border border-slate-200"><Edit3 className="w-3.5 h-3.5" /></button><button onClick={() => handleDelete(performance.id)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-100"><Trash2 className="w-3.5 h-3.5" /></button></div></div>; })}</div></div>
  </div>;
}

function FormInput({ label, value, setValue, placeholder, required = true }) {
  return <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">{label}</label><input type="text" value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} required={required} className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500" /></div>;
}

function AdminMusiciansTab({ people, onRefresh }) {
  const [name, setName] = useState('');
  const [instrument, setInstrument] = useState('Guitar');
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const musicians = people.filter((person) => person.category === 'musician');

  const handleAddMusician = async (event) => {
    event.preventDefault();
    if (!supabase || !name.trim() || saving) return;
    setSaving(true);
    const result = await saveEventPerson({ category: 'musician', name: name.trim(), role: instrument, instrument, display_order: 99 }, photoFile);
    setSaving(false);
    if (result.error) {
      alert(`Could not add musician: ${result.error.message}`);
      return;
    }
    setName('');
    setPhotoFile(null);
    await onRefresh?.();
  };

  const deleteMusician = async (person) => {
    if (!supabase || !person._fromDb || !window.confirm(`Delete ${person.name}?`)) return;
    const { error } = await supabase.from('event_people').delete().eq('id', person.id);
    if (error) return alert(`Could not delete musician: ${error.message}`);
    onRefresh?.();
  };

  return <div className="space-y-6"><form onSubmit={handleAddMusician} className="bg-white/84 border border-sky-200 rounded-3xl p-5 shadow-lg space-y-4"><h3 className="text-sm font-black text-slate-900 flex items-center gap-2"><Plus className="w-4 h-4 text-indigo-700" /> Add Live Stage Musician + Photo</h3><div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><FormInput label="Musician Name" value={name} setValue={setName} placeholder="e.g. Rahul" /><div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Instrument</label><select value={instrument} onChange={(event) => setInstrument(event.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none"><option>Guitar</option><option>Keyboard</option><option>Drums</option><option>Bass</option><option>Violin</option><option>Flute</option><option>Tabla</option></select></div><div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Photograph</label><input type="file" accept="image/*" onChange={(event) => setPhotoFile(event.target.files?.[0] || null)} className="w-full text-xs text-slate-500 file:mr-2 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-xs file:font-black file:text-indigo-700" /></div></div><button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-black text-xs px-4 py-2.5 rounded-xl">{saving ? 'Saving…' : 'Add Musician'}</button></form><div className="bg-white/84 border border-sky-200 rounded-3xl p-5 space-y-3"><h3 className="text-sm font-black text-slate-900">Configured Musicians</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{musicians.map((musician) => <div key={musician.id} className="bg-white border border-slate-200 p-3.5 rounded-2xl"><div className="flex items-center gap-3"><div className="w-14 h-14 rounded-xl overflow-hidden bg-sky-50 border border-sky-100 flex items-center justify-center">{musician.photo ? <img src={musician.photo} alt={musician.name} className="w-full h-full object-cover" /> : instrumentEmoji(musician.instrument)}</div><div className="flex-1"><p className="text-sm font-black text-slate-900">{musician.name}</p><p className="text-xs text-sky-700 font-bold">{musician.instrument || musician.role}</p></div>{musician._fromDb && <button onClick={() => deleteMusician(musician)} className="p-1.5 text-rose-700 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>}</div></div>)}</div></div></div>;
}

function AdminPeopleTab({ people, onRefresh }) {
  const blank = { category: 'organizer', name: '', role: '', instrument: 'Guitar', age: '', work: '', workplace: '', intro: '', achievements: '', display_order: 99 };
  const [form, setForm] = useState(blank);
  const [photoFile, setPhotoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const grouped = {
    performer: people.filter((person) => person.category === 'performer'),
    anchor: people.filter((person) => person.category === 'anchor'),
    musician: people.filter((person) => person.category === 'musician'),
    organizer: people.filter((person) => person.category === 'organizer'),
  };

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const reset = () => {
    setForm(blank);
    setPhotoFile(null);
    setEditingId(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!supabase || !form.name.trim() || saving) return;
    setSaving(true);
    const result = await saveEventPerson({ ...form, id: editingId || `${form.category}_${Date.now()}`, name: form.name.trim() }, photoFile);
    setSaving(false);
    if (result.error) {
      alert(`Could not save person: ${result.error.message}`);
      return;
    }
    reset();
    await onRefresh?.();
  };

  const editPerson = (person) => {
    setEditingId(person.id);
    setForm({
      category: person.category || 'organizer',
      name: person.name || '',
      role: person.role || '',
      instrument: person.instrument || 'Guitar',
      age: person.age || '',
      work: person.work || '',
      workplace: person.workplace || '',
      intro: person.intro || '',
      achievements: person.achievements || '',
      display_order: person.display_order || 99,
    });
    setPhotoFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deletePerson = async (person) => {
    if (!supabase || !person._fromDb || !window.confirm(`Delete ${person.name}?`)) return;
    const { error } = await supabase.from('event_people').delete().eq('id', person.id);
    if (error) return alert(`Could not delete person: ${error.message}`);
    onRefresh?.();
  };

  const updatePhoto = async (person, file) => {
    if (!file) return;
    const result = await saveEventPerson(person, file);
    if (result.error) alert(`Photo upload failed: ${result.error.message}`);
    else onRefresh?.();
  };

  const section = (key, title, icon) => <div className="bg-white/84 border border-sky-200 rounded-3xl p-5 shadow"><div className="flex items-center gap-2 mb-4"><span className="text-lg">{icon}</span><h3 className="text-sm font-black text-slate-900">{title}</h3></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{grouped[key].map((person) => <div key={person.id || person.name} className="bg-white border border-slate-200 rounded-2xl p-3"><div className="flex items-center gap-3"><div className="w-16 h-16 rounded-xl overflow-hidden bg-sky-50 border border-sky-100 flex items-center justify-center text-xl">{person.photo ? <img src={person.photo} alt={person.name} className="w-full h-full object-cover" /> : (person.category === 'musician' ? instrumentEmoji(person.instrument) : person.category === 'anchor' ? '🎙️' : person.category === 'organizer' ? '✨' : '🎤')}</div><div className="flex-1 min-w-0"><p className="text-sm font-black text-slate-900 truncate">{person.name}</p><p className="text-[11px] text-sky-700 truncate">{person.role || person.instrument}</p></div></div><div className="flex gap-2 mt-3"><button onClick={() => editPerson(person)} className="flex-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl py-2 text-[11px] font-black"><Edit3 className="w-3 h-3 inline mr-1" />Edit</button><label className="flex-1 cursor-pointer text-center bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl py-2 text-[11px] font-black">{person.photo ? 'Replace Photo' : 'Upload Photo'}<input type="file" accept="image/*" className="hidden" onChange={(event) => updatePhoto(person, event.target.files?.[0])} /></label>{person._fromDb && <button onClick={() => deletePerson(person)} className="p-2 text-rose-700 bg-rose-50 border border-rose-100 rounded-xl"><Trash2 className="w-4 h-4" /></button>}</div></div>)}</div></div>;

  return <div className="space-y-6"><form onSubmit={submit} className="bg-white/88 border border-sky-200 rounded-3xl p-5 shadow-xl space-y-4"><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-black text-slate-900">People & Team</h3><p className="text-xs text-slate-500 mt-1">Add performers, anchors, musicians and organisers with photographs and Know More details.</p></div><Camera className="w-5 h-5 text-sky-700" /></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Category</label><select value={form.category} onChange={(event) => setField('category', event.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"><option value="performer">Performer</option><option value="anchor">Anchor</option><option value="musician">Musician</option><option value="organizer">Organising Team</option></select></div><FormInput label="Name" value={form.name} setValue={(value) => setField('name', value)} placeholder="Name" /><FormInput label="Role" value={form.role} setValue={(value) => setField('role', value)} placeholder="e.g. Event Head / Vocalist" required={false} /></div>{form.category === 'musician' && <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Instrument</label><select value={form.instrument} onChange={(event) => setField('instrument', event.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"><option>Guitar</option><option>Keyboard</option><option>Drums</option><option>Bass</option><option>Violin</option><option>Flute</option><option>Tabla</option></select></div>}<div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><FormInput label="Age" value={form.age} setValue={(value) => setField('age', value)} placeholder="21" required={false} /><div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Photograph</label><input type="file" accept="image/*" onChange={(event) => setPhotoFile(event.target.files?.[0] || null)} className="w-full text-xs text-slate-500 file:mr-2 file:rounded-lg file:border-0 file:bg-sky-50 file:px-3 file:py-2 file:text-xs file:font-black file:text-sky-700" /></div></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><FormInput label="Work" value={form.work} setValue={(value) => setField('work', value)} placeholder="Student / Musician" required={false} /><FormInput label="Workplace" value={form.workplace} setValue={(value) => setField('workplace', value)} placeholder="Navrachana University" required={false} /></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><TextAreaInput label="Intro" value={form.intro} setValue={(value) => setField('intro', value)} placeholder="Short audience-facing introduction" /><TextAreaInput label="Achievements" value={form.achievements} setValue={(value) => setField('achievements', value)} placeholder="Achievements / experience" /></div><div className="flex gap-2"><button type="submit" disabled={saving} className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-300 text-white font-black text-xs px-4 py-2.5 rounded-xl">{saving ? 'Saving…' : editingId ? 'Save Person' : 'Add Person'}</button>{editingId && <button type="button" onClick={reset} className="bg-white text-slate-600 font-black text-xs px-4 py-2.5 rounded-xl border border-slate-200">Cancel</button>}</div></form>{section('performer', 'Performers', '🎤')}{section('anchor', 'Anchors / MoC', '🎙️')}{section('musician', 'Musicians', '🎼')}{section('organizer', 'Organising Team', '✨')}</div>;
}

function TextAreaInput({ label, value, setValue, placeholder }) {
  return <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">{label}</label><textarea value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} rows={4} className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 resize-none" /></div>;
}

function AdminAudienceTab({ audience, audienceCount, supabaseVotes, supabaseReactions, supabaseInteractions }) {
  const audienceMap = useMemo(() => new Map(audience.map((member) => [member.id, member])), [audience]);

  return <div className="space-y-6"><div className="bg-white/84 border border-sky-200 rounded-3xl p-5 shadow-lg"><div className="flex items-center justify-between"><h3 className="text-sm font-black text-slate-900 flex items-center gap-2"><Users className="w-4 h-4 text-sky-700" /> Live Audience Directory ({audienceCount})</h3><span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Live sync</span></div><div className="overflow-x-auto mt-4"><table className="w-full text-left text-xs"><thead><tr className="border-b border-slate-200 text-slate-500 uppercase font-black text-[10px]"><th className="pb-3 pl-2">Audience</th><th className="pb-3">Language</th><th className="pb-3">Joined</th><th className="pb-3">Votes</th><th className="pb-3">Reactions</th><th className="pb-3 pr-2 text-right">Status</th></tr></thead><tbody className="divide-y divide-slate-200">{audience.length ? audience.map((member) => { const votes = supabaseVotes.filter((vote) => vote.audience_id === member.id).length; const reactions = supabaseReactions.filter((reaction) => reaction.audience_id === member.id).length; return <tr key={member.id || member.id}><td className="py-3 pl-2 font-black text-slate-900"><div className="flex items-center gap-2"><div className="w-9 h-9 rounded-full overflow-hidden bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center font-black text-xs">{member.photo_url ? <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" /> : (member.name?.[0]?.toUpperCase() || 'A')}</div><div><div>{member.name}</div><div className="text-[9px] font-mono text-slate-400">{member.id?.slice(0, 12)}...</div></div></div></td><td className="py-3 text-slate-600">{LANGUAGE_OPTIONS.find((item) => item.code === member.language)?.native || '—'}</td><td className="py-3 text-slate-500">{formatJoined(member.joined_at || member.created_at)}</td><td className="py-3 font-black text-sky-700">{votes}</td><td className="py-3 font-black text-pink-600">{reactions}</td><td className="py-3 pr-2 text-right"><span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Active</span></td></tr>; }) : <tr><td colSpan="6" className="py-8 text-center text-slate-500">No audience members yet.</td></tr>}</tbody></table></div></div><div className="bg-white/84 border border-sky-200 rounded-3xl p-5 shadow-lg"><h3 className="text-sm font-black text-slate-900">Audience Response Summary</h3><div className="overflow-x-auto mt-4"><table className="w-full text-left text-xs"><thead><tr className="border-b border-slate-200 text-slate-500 uppercase text-[9px]"><th className="pb-3">Question</th><th className="pb-3">Audience</th><th className="pb-3">Answer</th><th className="pb-3">Time</th></tr></thead><tbody className="divide-y divide-slate-200">{supabaseInteractions.flatMap((interaction) => supabaseVotes.filter((vote) => vote.interaction_id === interaction.id).map((vote) => <tr key={vote.id}><td className="py-2 font-bold text-slate-800">{interaction.question}</td><td className="py-2 text-slate-600">{audienceMap.get(vote.audience_id)?.name || 'Unknown'}</td><td className="py-2 text-sky-700 font-bold">{vote.selected_option}</td><td className="py-2 text-slate-400">{new Date(vote.created_at).toLocaleTimeString()}</td></tr>))}</tbody></table></div></div></div>;
}

function formatJoined(value) {
  if (!value) return '—';
  if (typeof value === 'string' && (value.includes('AM') || value.includes('PM'))) return value;
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function AdminInteractionsTab({ supabaseInteractions, supabaseVotes, supabaseAudience, supabaseReactions, supabasePerformances }) {
  const [interactionType, setInteractionType] = useState('poll');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctOption, setCorrectOption] = useState('');
  const [performanceId, setPerformanceId] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState(null);

  const interactions = supabaseInteractions.filter((interaction) => ['poll', 'guess_song'].includes(interaction.type));
  const audienceMap = useMemo(() => new Map(supabaseAudience.map((member) => [member.id, member])), [supabaseAudience]);
  const performanceMap = useMemo(() => new Map(supabasePerformances.map((performance) => [performance.id, performance])), [supabasePerformances]);
  const livePerformance = supabasePerformances.find((performance) => performance.status === 'playing') || null;

  useEffect(() => {
    if (!performanceId && livePerformance) setPerformanceId(livePerformance.id);
  }, [performanceId, livePerformance]);

  const addOption = () => setOptions((current) => current.length < 4 ? [...current, ''] : current);
  const updateOption = (index, value) => setOptions((current) => current.map((option, optionIndex) => optionIndex === index ? value : option));
  const reset = () => { setQuestion(''); setOptions(['', '']); setCorrectOption(''); setInteractionType('poll'); setPerformanceId(livePerformance?.id || ''); };

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
      performance_id: performanceId || null,
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

  const addDefault = (preset) => {
    setInteractionType(preset.type);
    setQuestion(preset.question);
    setOptions(preset.options);
    setCorrectOption('');
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
  const responseRows = selectedInteraction ? supabaseVotes.filter((vote) => vote.interaction_id === selectedInteraction.id) : [];

  return <div className="space-y-6">
    <div className="bg-white/84 border border-sky-200 rounded-3xl p-5 shadow-lg">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5"><div><h3 className="text-sm font-black text-slate-900">Create Live Interaction</h3><p className="text-xs text-slate-500 mt-1">Attach every question to a song/performance so future analytics stay useful.</p></div><span className="text-[10px] uppercase font-black text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full">Live sync active</span></div>
      <div className="flex gap-2 mb-4"><button onClick={() => { setInteractionType('poll'); setCorrectOption(''); }} className={`px-3 py-2 rounded-xl text-xs font-black border ${interactionType === 'poll' ? 'bg-sky-600 text-white border-sky-500' : 'bg-white text-slate-500 border-slate-200'}`}>Poll</button><button onClick={() => setInteractionType('guess_song')} className={`px-3 py-2 rounded-xl text-xs font-black border ${interactionType === 'guess_song' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white text-slate-500 border-slate-200'}`}>Guess the Song</button></div>
      <div className="flex flex-wrap gap-2 mb-5">{DEFAULT_INTERACTIONS.map((preset, index) => <button key={index} onClick={() => addDefault(preset)} className="bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 px-3 py-1.5 rounded-lg text-[10px] font-black">Use default {index + 1}</button>)}</div>
      <div className="space-y-4">
        <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Related song / performer</label><select value={performanceId} onChange={(event) => setPerformanceId(event.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800"><option value="">General event interaction</option>{supabasePerformances.map((performance) => <option key={performance.id} value={performance.id}>{performance.title} • {performance.performer}</option>)}</select></div>
        <FormInput label="Question" value={question} setValue={setQuestion} placeholder="Ask the audience..." required />
        <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Options</label><div className="space-y-2">{options.map((option, index) => <input key={index} value={option} onChange={(event) => updateOption(index, event.target.value)} placeholder={`Option ${index + 1}`} className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500" />)}</div>{options.length < 4 && <button onClick={addOption} className="mt-3 text-xs font-black text-sky-700">+ Add Option</button>}</div>
        {interactionType === 'guess_song' && <div><label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Correct Answer</label><select value={correctOption} onChange={(event) => setCorrectOption(event.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800"><option value="">Select correct answer</option>{options.filter(Boolean).map((option) => <option key={option} value={option}>{option}</option>)}</select></div>}
        <button onClick={handleCreate} disabled={saving} className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-300 text-white font-black text-xs px-4 py-2.5 rounded-xl">{saving ? 'Creating…' : 'Create Interaction'}</button>
      </div>
    </div>

    <div className="bg-white/84 border border-sky-200 rounded-3xl p-5 shadow-lg"><div className="mb-5"><h3 className="text-sm font-black text-slate-900">Created Interactions + Answer Analysis</h3><p className="text-xs text-slate-500 mt-1">Option counts and audience names update automatically from Supabase.</p></div><div className="space-y-3">{interactions.length === 0 ? <p className="text-xs text-slate-500 text-center py-8">No interactions created yet.</p> : interactions.map((interaction) => { const isLive = interaction.status === 'live'; const total = countVotes(interaction.id); const attachedPerformance = performanceMap.get(interaction.performance_id); return <div key={interaction.id} className={`p-4 rounded-2xl border ${isLive ? 'bg-sky-50 border-sky-300' : 'bg-white border-slate-200'}`}><div className="flex items-start justify-between gap-4"><div className="flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{interaction.type === 'guess_song' ? 'Guess' : 'Poll'}</span>{isLive && <span className="text-[9px] uppercase font-black text-emerald-700">LIVE</span>}{attachedPerformance && <span className="text-[9px] uppercase font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">{attachedPerformance.title} • {attachedPerformance.performer}</span>}</div><h4 className="text-sm font-black text-slate-900 mt-2">{interaction.question}</h4><div className="space-y-2 mt-3">{(interaction.options || []).map((option) => { const votes = supabaseVotes.filter((vote) => vote.interaction_id === interaction.id && vote.selected_option === option).length; const percentage = total ? Math.round((votes / total) * 100) : 0; return <div key={option} className="grid grid-cols-[1fr_auto] items-center gap-3 text-xs"><div><div className="flex justify-between"><span className="text-slate-600 font-bold">{option}</span><span className="text-sky-700 font-black">{percentage}%</span></div><div className="h-2 bg-slate-100 rounded-full mt-1 overflow-hidden"><div className="h-full bg-sky-500 rounded-full" style={{ width: `${percentage}%` }} /></div></div><span className="text-slate-400 font-bold">{votes}</span></div>; })}</div><p className="text-[10px] text-slate-400 mt-3">{total} total response{total === 1 ? '' : 's'}</p></div><div className="flex flex-col gap-2">{isLive ? <button onClick={() => handleStop(interaction.id)} className="bg-rose-50 text-rose-700 font-black text-xs px-3 py-1.5 rounded-xl border border-rose-200">Stop</button> : <button onClick={() => handleMakeLive(interaction.id)} className="bg-emerald-50 text-emerald-700 font-black text-xs px-3 py-1.5 rounded-xl border border-emerald-200">Make Live</button>}<button onClick={() => setSelectedInteraction(selectedInteraction?.id === interaction.id ? null : interaction)} className="bg-sky-50 text-sky-700 font-black text-xs px-3 py-1.5 rounded-xl border border-sky-200">{selectedInteraction?.id === interaction.id ? 'Hide Responses' : 'See Responses'}</button></div></div>{selectedInteraction?.id === interaction.id && <div className="mt-4 bg-white border border-sky-100 rounded-2xl p-3"><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b border-slate-200 text-slate-400 uppercase text-[9px]"><th className="pb-2">Audience Name</th><th className="pb-2">Language</th><th className="pb-2">Answer</th><th className="pb-2">Time</th></tr></thead><tbody className="divide-y divide-slate-100">{responseRows.length ? responseRows.map((vote) => <tr key={vote.id}><td className="py-2 font-black text-slate-800">{audienceMap.get(vote.audience_id)?.name || 'Unknown audience'}</td><td className="py-2 text-slate-500">{LANGUAGE_OPTIONS.find((item) => item.code === audienceMap.get(vote.audience_id)?.language)?.native || '—'}</td><td className="py-2 text-sky-700 font-bold">{vote.selected_option}</td><td className="py-2 text-slate-400">{new Date(vote.created_at).toLocaleTimeString()}</td></tr>) : <tr><td colSpan="4" className="py-5 text-center text-slate-400">No responses yet.</td></tr>}</tbody></table></div></div>}</div>; })}</div></div>

    <div className="bg-white/84 border border-sky-200 rounded-3xl p-5 shadow-lg"><h3 className="text-sm font-black text-slate-900">Reaction Data</h3><div className="overflow-x-auto mt-4"><table className="w-full text-left text-xs"><thead><tr className="border-b border-slate-200 text-slate-400 uppercase text-[9px]"><th className="pb-2">Audience</th><th className="pb-2">Song / Performer</th><th className="pb-2">Reaction</th><th className="pb-2">Time</th></tr></thead><tbody className="divide-y divide-slate-100">{supabaseReactions.length ? supabaseReactions.map((reaction) => { const audience = audienceMap.get(reaction.audience_id); const performance = performanceMap.get(reaction.performance_id); return <tr key={reaction.id}><td className="py-2 font-black text-slate-800">{audience?.nickname || 'Unknown audience'}</td><td className="py-2 text-slate-600">{performance ? `${performance.title} • ${performance.performer}` : reaction.performance_id}</td><td className="py-2 text-lg">{reaction.reaction}</td><td className="py-2 text-slate-400">{new Date(reaction.created_at).toLocaleTimeString()}</td></tr>; }) : <tr><td colSpan="4" className="py-5 text-center text-slate-400">No reactions yet.</td></tr>}</tbody></table></div></div>
  </div>;
}

function AdminAnalyticsTab({ audienceCount, supabasePerformances, supabaseInteractions, supabaseVotes, supabaseReactions, supabaseAudience, people, analyticsSnapshots, supabaseMemoryCards, onRefresh }) {
  const [saving, setSaving] = useState(false);

  const interactionIds = useMemo(
    () => new Set(supabaseInteractions.map((interaction) => interaction.id)),
    [supabaseInteractions]
  );

  const performanceIds = useMemo(
    () => new Set(supabasePerformances.map((performance) => performance.id)),
    [supabasePerformances]
  );

  const eventVotes = supabaseVotes.filter((vote) => interactionIds.has(vote.interaction_id));
  const eventReactions = supabaseReactions.filter((reaction) => performanceIds.has(reaction.performance_id));

  const performanceMap = useMemo(
    () => new Map(supabasePerformances.map((performance) => [performance.id, performance])),
    [supabasePerformances]
  );

  const interactionDataSheet = supabaseInteractions.flatMap((interaction) => {
    const relatedPerformance = performanceMap.get(interaction.performance_id);
    const totalResponses = eventVotes.filter((vote) => vote.interaction_id === interaction.id).length;

    return (interaction.options || []).map((option) => {
      const selected = eventVotes.filter(
        (vote) => vote.interaction_id === interaction.id && vote.selected_option === option
      ).length;

      return {
        performance: relatedPerformance
          ? `${relatedPerformance.title} • ${relatedPerformance.performer}`
          : 'General event',
        question: interaction.question || interaction.title,
        type: interaction.type === 'guess_song' ? 'Guess the Song' : 'Poll',
        option,
        selected,
        percentage: totalResponses ? Math.round((selected / totalResponses) * 100) : 0,
        totalResponses,
      };
    });
  });

  const questionGroups = supabaseInteractions.map((interaction) => {
    const relatedPerformance = performanceMap.get(interaction.performance_id);
    const questionVotes = eventVotes.filter((vote) => vote.interaction_id === interaction.id);
    const totalResponses = questionVotes.length;

    return {
      id: interaction.id,
      question: interaction.question || interaction.title,
      type: interaction.type === 'guess_song' ? 'Guess the Song' : 'Poll',
      performance: relatedPerformance
        ? `${relatedPerformance.title} • ${relatedPerformance.performer}`
        : 'General event',
      totalResponses,
      options: (interaction.options || []).map((option) => {
        const selected = questionVotes.filter((vote) => vote.selected_option === option).length;
        return {
          option,
          selected,
          percentage: totalResponses ? Math.round((selected / totalResponses) * 100) : 0,
        };
      }),
    };
  });

  const saveSnapshot = async () => {
    if (!supabase || saving) return;

    setSaving(true);

    const snapshot = {
      captured_at: new Date().toISOString(),
      audience_count: audienceCount,
      performance_count: supabasePerformances.length,
      interaction_count: supabaseInteractions.length,
      total_votes: eventVotes.length,
      total_reactions: eventReactions.length,
      people_count: people.length,
      question_results: interactionDataSheet,
    };

    const { error } = await supabase
      .from('event_analytics_snapshots')
      .insert({
        event_id: APP_EVENT_ID,
        event_name: EVENT_DISPLAY_NAME,
        snapshot,
      });

    setSaving(false);

    if (error) {
      alert(`Could not save planning snapshot: ${error.message}`);
      return;
    }

    alert('Analytics snapshot saved.');
    await onRefresh?.();
  };

  const generateAllMemoryCards = async () => {
    if (!supabase || !supabaseAudience.length) {
      alert('No audience members found yet.');
      return;
    }

    const rows = supabaseAudience.map((member) => {
      const votes = eventVotes.filter((vote) => vote.audience_id === member.id).length;
      const reactions = eventReactions.filter((reaction) => reaction.audience_id === member.id).length;
      const profile = getEngagementProfile(votes, reactions, member.language || 'en');

      return {
        event_id: APP_EVENT_ID,
        audience_id: member.id,
        audience_name: member.name || 'Audience Guest',
        photo_url: member.photo_url || null,
        engagement_score: profile.score,
        engagement_tag: profile.tag,
        snapshot: {
          votes,
          reactions,
          language: member.language || 'en',
        },
        updated_at: new Date().toISOString(),
      };
    });

    const { error } = await supabase
      .from('audience_memory_cards')
      .upsert(rows, { onConflict: 'event_id,audience_id' });

    if (error) {
      alert(`Could not generate memory cards: ${error.message}`);
      return;
    }

    alert('Memory cards generated for the current audience.');
    await onRefresh?.();
  };

  const downloadInteractionSheet = () => {
    downloadCsv(
      interactionDataSheet.map((row) => ({
        'Song / Performer': row.performance,
        Question: row.question,
        Type: row.type,
        Option: row.option,
        'Selected Count': row.selected,
        Percentage: `${row.percentage}%`,
        'Total Responses': row.totalResponses,
      })),
      `${EVENT_DISPLAY_NAME.replace(/\s+/g, '-')}-question-data-sheet.csv`
    );
  };

  const exportAllData = () => {
    const payload = {
      event: {
        id: APP_EVENT_ID,
        name: EVENT_DISPLAY_NAME,
      },
      exported_at: new Date().toISOString(),
      performances: supabasePerformances,
      audience: supabaseAudience,
      people,
      interactions: supabaseInteractions,
      votes: eventVotes,
      reactions: eventReactions,
      analytics_snapshots: analyticsSnapshots,
      memory_cards: supabaseMemoryCards,
      question_results: interactionDataSheet,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });

    downloadBlob(
      blob,
      `${EVENT_DISPLAY_NAME.replace(/\s+/g, '-')}-event-data.json`
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Metric title="Live Audience" value={audienceCount} icon={<Users className="w-5 h-5" />} />
        <Metric title="Total Votes" value={eventVotes.length} icon={<MessageCircle className="w-5 h-5" />} />
        <Metric title="Reactions" value={eventReactions.length} icon={<Heart className="w-5 h-5" />} />
        <Metric title="Questions" value={supabaseInteractions.length} icon={<BarChart3 className="w-5 h-5" />} />
      </div>

      <div className="bg-white/84 border border-sky-200 rounded-3xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900">Analytics & Future Event Data</h3>
            <p className="text-xs text-slate-500 mt-1">
              Results are refreshed automatically every 2 seconds.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={saveSnapshot}
              disabled={saving}
              className="bg-sky-600 text-white font-black text-xs px-3 py-2 rounded-xl flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : 'Save Snapshot'}
            </button>

            <button
              onClick={generateAllMemoryCards}
              className="bg-indigo-600 text-white font-black text-xs px-3 py-2 rounded-xl flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate Memory Cards
            </button>

            <button
              onClick={downloadInteractionSheet}
              className="bg-emerald-600 text-white font-black text-xs px-3 py-2 rounded-xl flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Question Data Sheet
            </button>

            <button
              onClick={exportAllData}
              className="bg-white text-slate-700 font-black text-xs px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export All Data
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/84 border border-sky-200 rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-black text-slate-900">Poll & Interaction Results</h3>
            <p className="text-xs text-slate-500 mt-1">
              Exactly how many people selected each option and the current percentage.
            </p>
          </div>
          <span className="text-[10px] font-black text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full">
            {supabaseInteractions.length} questions
          </span>
        </div>

        <div className="space-y-4">
          {questionGroups.length ? questionGroups.map((question) => (
            <div
              key={question.id}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                      {question.type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {question.performance}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mt-2">
                    {question.question}
                  </h4>
                </div>

                <span className="text-[10px] font-black text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                  {question.totalResponses} response{question.totalResponses === 1 ? '' : 's'}
                </span>
              </div>

              <div className="space-y-3 mt-4">
                {question.options.map((option) => (
                  <div key={option.option}>
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-slate-700 font-bold">{option.option}</span>
                      <span className="text-sky-700 font-black whitespace-nowrap">
                        {option.selected} votes • {option.percentage}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all duration-500"
                        style={{ width: `${option.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )) : (
            <div className="py-10 text-center text-xs text-slate-500">
              No polls or interactions created yet.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/84 border border-sky-200 rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between gap-3 mb-4"><div><h3 className="text-sm font-black text-slate-900">Complete Audience List</h3><p className="text-xs text-slate-500 mt-1">Every audience member who joined this event, including people who did not vote or react.</p></div><span className="text-[10px] font-black text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full">{supabaseAudience.length} names</span></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b border-slate-200 text-slate-400 uppercase text-[9px]"><th className="pb-2">#</th><th className="pb-2">Audience Name</th><th className="pb-2">Language</th><th className="pb-2">Joined</th><th className="pb-2">Votes</th><th className="pb-2">Reactions</th></tr></thead><tbody className="divide-y divide-slate-100">{supabaseAudience.length ? supabaseAudience.map((member, index) => { const memberVotes = eventVotes.filter((vote) => vote.audience_id === member.id).length; const memberReactions = eventReactions.filter((reaction) => reaction.audience_id === member.id).length; return <tr key={member.id || member.id}><td className="py-2 text-slate-400">{index + 1}</td><td className="py-2 font-black text-slate-800">{member.name || 'Unnamed audience'}</td><td className="py-2 text-slate-500">{LANGUAGE_OPTIONS.find((item) => item.code === member.language)?.native || 'English'}</td><td className="py-2 text-slate-400">{member.joined_at ? new Date(member.joined_at).toLocaleTimeString() : '—'}</td><td className="py-2 text-sky-700 font-black">{memberVotes}</td><td className="py-2 text-pink-600 font-black">{memberReactions}</td></tr>; }) : <tr><td colSpan="6" className="py-8 text-center text-slate-400">No audience members have joined yet.</td></tr>}</tbody></table></div>
      </div>

      <div className="bg-white/84 border border-sky-200 rounded-3xl p-5 shadow-lg">
        <h3 className="text-sm font-black text-slate-900">Saved Planning Snapshots</h3>
        <div className="space-y-2 mt-4">
          {analyticsSnapshots.length ? analyticsSnapshots.map((snapshot) => (
            <div
              key={snapshot.id}
              className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-xs font-black text-slate-900">{snapshot.event_name}</p>
                <p className="text-[10px] text-slate-500">
                  {new Date(snapshot.created_at).toLocaleString()}
                </p>
              </div>
              <div className="text-[10px] text-sky-700 font-bold">
                {snapshot.snapshot?.audience_count || 0} audience • {snapshot.snapshot?.total_votes || 0} votes
              </div>
            </div>
          )) : (
            <p className="text-xs text-slate-500">No snapshots saved yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
function Metric({ title, value, icon }) {
  return <div className="bg-white/84 border border-sky-200 rounded-2xl p-5 shadow"><div className="flex items-center justify-between"><span className="text-[10px] uppercase font-black tracking-wider text-slate-500">{title}</span><span className="text-sky-700">{icon}</span></div><div className="text-3xl font-black text-slate-900 mt-2">{value}</div></div>;
}

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
];

const UI_TEXT = {
  en: {
    welcome: 'Welcome to', experience: 'Choose your language, enter your name and join the live experience.',
    chooseLanguage: 'Choose language', yourName: 'Your Name', enterName: 'Enter your name',
    memoryPhoto: 'Photo for your memory card', optional: '(optional)', join: 'Join',
    continueAs: 'Continue as', liveEvent: 'Live Event', audienceExperience: 'Audience Experience',
    goodEvening: 'Good evening, {name} 👋', audienceMember: 'Audience Member', change: 'Change',
    nowPlaying: 'Now Playing', intermission: 'Intermission / Preparing Next Act',
    knowPerformer: 'Know the Performer', knowMore: 'Know more', liveInteraction: 'Live Interaction',
    guessSong: 'Guess the Song', tapOne: 'Tap one option', submitting: 'Submitting…',
    voteRecorded: 'Vote recorded ✓', alreadyAnswered: 'You already answered this one.',
    correct: 'Correct!', notQuite: 'Not quite — correct answer', reactPerformance: 'React to the performance',
    oneReaction: 'One reaction per performance', sending: 'Sending…', reactionSent: 'Reaction sent ✓',
    alreadyReacted: 'You already reacted to this performance.', knowMusicians: 'Know the Musicians',
    peopleCreatingSound: 'The people creating the live sound tonight', seeMusicianDetails: 'See musician details',
    anchorsTeam: 'Anchors & Organising Team', meetPeople: 'Meet the people making the evening happen',
    knowAnchorsTeam: 'Know More: Anchors & Team', yourMemory: 'Your Memory Card',
    builtFromParticipation: 'Built from your live participation tonight.', addPhoto: 'Add photo',
    download: 'Download', share: 'Share', yourMusicNight: 'Your Music Night', votes: 'Votes', reactions: 'Reactions',
    watchLine: 'WATCH → EXPERIENCE → PARTICIPATE → REMEMBER', knowMoreTitle: 'Know More', performingNow: 'Performing now',
    noTeam: 'No team members added yet.', performers: 'Performers', liveMusicians: 'Live Musicians', anchors: 'Anchors / MoC',
    organisingTeam: 'Organising Team', age: 'Age', work: 'Work', workplace: 'Workplace', achievements: 'Achievements',
    partOfTeam: 'Part of the team behind the evening.', languageSaved: 'Language preference saved for this event.'
  },
  hi: {
    welcome: 'स्वागत है', experience: 'अपनी भाषा चुनें, अपना नाम दर्ज करें और लाइव अनुभव में शामिल हों।',
    chooseLanguage: 'भाषा चुनें', yourName: 'आपका नाम', enterName: 'अपना नाम दर्ज करें',
    memoryPhoto: 'मेमोरी कार्ड के लिए फोटो', optional: '(वैकल्पिक)', join: 'शामिल हों',
    continueAs: 'के रूप में जारी रखें', liveEvent: 'लाइव कार्यक्रम', audienceExperience: 'दर्शक अनुभव',
    goodEvening: 'शुभ संध्या, {name} 👋', audienceMember: 'दर्शक सदस्य', change: 'बदलें',
    nowPlaying: 'अभी चल रहा है', intermission: 'अंतराल / अगली प्रस्तुति की तैयारी',
    knowPerformer: 'कलाकार के बारे में जानें', knowMore: 'और जानें', liveInteraction: 'लाइव सहभागिता',
    guessSong: 'गाना पहचानें', tapOne: 'एक विकल्प चुनें', submitting: 'भेजा जा रहा है…',
    voteRecorded: 'आपका उत्तर दर्ज हो गया ✓', alreadyAnswered: 'आपने इसका उत्तर पहले ही दिया है।',
    correct: 'सही!', notQuite: 'सही नहीं — सही उत्तर', reactPerformance: 'प्रस्तुति पर प्रतिक्रिया दें',
    oneReaction: 'हर प्रस्तुति पर एक प्रतिक्रिया', sending: 'भेजा जा रहा है…', reactionSent: 'प्रतिक्रिया भेज दी गई ✓',
    alreadyReacted: 'आपने इस प्रस्तुति पर पहले ही प्रतिक्रिया दी है।', knowMusicians: 'संगीतकारों से मिलें',
    peopleCreatingSound: 'आज की लाइव धुन बनाने वाले कलाकार', seeMusicianDetails: 'संगीतकारों की जानकारी',
    anchorsTeam: 'एंकर और आयोजन टीम', meetPeople: 'इस शाम को खास बनाने वाले लोगों से मिलें',
    knowAnchorsTeam: 'एंकर और टीम के बारे में जानें', yourMemory: 'आपका मेमोरी कार्ड',
    builtFromParticipation: 'आज की आपकी लाइव सहभागिता से बनाया गया।', addPhoto: 'फोटो जोड़ें',
    download: 'डाउनलोड', share: 'शेयर', yourMusicNight: 'आपकी म्यूज़िक नाइट', votes: 'उत्तर', reactions: 'प्रतिक्रियाएँ',
    watchLine: 'देखें → अनुभव करें → भाग लें → याद रखें', knowMoreTitle: 'और जानें', performingNow: 'अभी प्रस्तुति दे रहे हैं',
    noTeam: 'अभी कोई टीम सदस्य नहीं जोड़ा गया है।', performers: 'कलाकार', liveMusicians: 'लाइव संगीतकार', anchors: 'एंकर / संचालक',
    organisingTeam: 'आयोजन टीम', age: 'उम्र', work: 'कार्य', workplace: 'कार्यस्थल', achievements: 'उपलब्धियाँ',
    partOfTeam: 'इस शाम को बनाने वाली टीम का हिस्सा।', languageSaved: 'इस कार्यक्रम के लिए आपकी भाषा सुरक्षित है।'
  },
  gu: {
    welcome: 'આપનું સ્વાગત છે', experience: 'તમારી ભાષા પસંદ કરો, તમારું નામ લખો અને લાઇવ અનુભવમાં જોડાઓ.',
    chooseLanguage: 'ભાષા પસંદ કરો', yourName: 'તમારું નામ', enterName: 'તમારું નામ લખો',
    memoryPhoto: 'મેમરી કાર્ડ માટે ફોટો', optional: '(વૈકલ્પિક)', join: 'જોડાઓ',
    continueAs: 'તરીકે ચાલુ રાખો', liveEvent: 'લાઇવ કાર્યક્રમ', audienceExperience: 'પ્રેક્ષક અનુભવ',
    goodEvening: 'શુભ સાંજ, {name} 👋', audienceMember: 'પ્રેક્ષક સભ્ય', change: 'બદલો',
    nowPlaying: 'હમણાં ચાલી રહ્યું છે', intermission: 'વિરામ / આગળની રજૂઆતની તૈયારી',
    knowPerformer: 'પરફોર્મર વિશે જાણો', knowMore: 'વધુ જાણો', liveInteraction: 'લાઇવ ઇન્ટરૅક્શન',
    guessSong: 'ગીત ઓળખો', tapOne: 'એક વિકલ્પ પસંદ કરો', submitting: 'મોકલાઈ રહ્યું છે…',
    voteRecorded: 'તમારો જવાબ નોંધાયો ✓', alreadyAnswered: 'તમે આનો જવાબ પહેલેથી આપી દીધો છે.',
    correct: 'સાચું!', notQuite: 'સાચું નથી — સાચો જવાબ', reactPerformance: 'રજૂઆત પર પ્રતિક્રિયા આપો',
    oneReaction: 'દરેક રજૂઆત માટે એક પ્રતિક્રિયા', sending: 'મોકલાઈ રહ્યું છે…', reactionSent: 'પ્રતિક્રિયા મોકલાઈ ✓',
    alreadyReacted: 'તમે આ રજૂઆત પર પહેલેથી પ્રતિક્રિયા આપી છે.', knowMusicians: 'સંગીતકારોને જાણો',
    peopleCreatingSound: 'આજની લાઇવ ધૂન બનાવતા સંગીતકારો', seeMusicianDetails: 'સંગીતકારોની માહિતી',
    anchorsTeam: 'એન્કર અને આયોજન ટીમ', meetPeople: 'આ સાંજને ખાસ બનાવતા લોકોને મળો',
    knowAnchorsTeam: 'એન્કર અને ટીમ વિશે જાણો', yourMemory: 'તમારું મેમરી કાર્ડ',
    builtFromParticipation: 'આજની તમારી લાઇવ ભાગીદારી પરથી બનાવાયું છે.', addPhoto: 'ફોટો ઉમેરો',
    download: 'ડાઉનલોડ', share: 'શેર', yourMusicNight: 'તમારી મ્યુઝિક નાઇટ', votes: 'જવાબ', reactions: 'પ્રતિક્રિયાઓ',
    watchLine: 'જુઓ → અનુભવો → ભાગ લો → યાદ રાખો', knowMoreTitle: 'વધુ જાણો', performingNow: 'હમણાં રજૂઆત કરી રહ્યા છે',
    noTeam: 'હજુ સુધી કોઈ ટીમ સભ્ય ઉમેરાયો નથી.', performers: 'પરફોર્મર્સ', liveMusicians: 'લાઇવ સંગીતકારો', anchors: 'એન્કર / સંચાલક',
    organisingTeam: 'આયોજન ટીમ', age: 'ઉંમર', work: 'કામ', workplace: 'કાર્યસ્થળ', achievements: 'સિદ્ધિઓ',
    partOfTeam: 'આ સાંજ બનાવતી ટીમનો એક ભાગ.', languageSaved: 'આ કાર્યક્રમ માટે તમારી ભાષા સાચવવામાં આવી છે.'
  }
};

function uiText(language, key) {
  const pack = UI_TEXT[language] || UI_TEXT.en;
  return pack[key] || UI_TEXT.en[key] || key;
}

function uiTextWithName(language, key, name) {
  return uiText(language, key).replace('{name}', name);
}

const REACTION_OPTIONS = [
  { value: '❤️ Beautiful', emoji: '❤️', label: 'Beautiful' },
  { value: '🎶 Soulful', emoji: '🎶', label: 'Soulful' },
  { value: '👏 Great Work', emoji: '👏', label: 'Great Work' },
  { value: '✨ Mesmerizing', emoji: '✨', label: 'Mesmerizing' },
  { value: '🔥 Energetic', emoji: '🔥', label: 'Energetic' },
  { value: '💫 Amazing', emoji: '💫', label: 'Amazing' },
  { value: '🎤 Powerful', emoji: '🎤', label: 'Powerful' },
  { value: '🌟 Brilliant', emoji: '🌟', label: 'Brilliant' },
  { value: '🥹 Touching', emoji: '🥹', label: 'Touching' },
  { value: '💖 Heartfelt', emoji: '💖', label: 'Heartfelt' },
  { value: '🎵 Musical', emoji: '🎵', label: 'Musical' },
  { value: '👌 Well Performed', emoji: '👌', label: 'Well Performed' },
];

const DEFAULT_INTERACTIONS = [
  {
    type: 'poll',
    question: 'How are you feeling about the performance?',
    options: ['Amazing', 'I am loving it', 'Chill vibes', 'Give us more'],
  },
  {
    type: 'poll',
    question: 'Which mood should come next?',
    options: ['Romantic', 'Energetic', 'Nostalgic', 'Party'],
  },
  {
    type: 'guess_song',
    question: 'Can you guess the next song?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
  },
];

const INITIAL_SEED_DATA = {
  event: {
    id: APP_EVENT_ID,
    name: EVENT_DISPLAY_NAME,
    event_date: '2026-10-24',
    status: 'live',
    created_at: new Date().toISOString(),
  },
  performances: [],
  musicians: [],
  audience: [],
};

const EVENT_INTRO_DATA = {
  performers: [],
  anchors: [],
  musicians: [],
  organizers: [],
};

function getLocalDB() {
  try {
    const raw = localStorage.getItem(SYNC_KEY);
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.warn('Storage error', error);
  }
  return INITIAL_SEED_DATA;
}

function saveAndBroadcastLocalDB(data) {
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
}

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
      _fromDb: Boolean(byId.has(person.id)),
    };
  });

  const staticIds = new Set(staticPeople.map((person) => person.id));
  const extras = peopleRows
    .filter((person) => !staticIds.has(person.id))
    .map((person) => ({ ...person, photo: person.photo_url || person.photo || '', _fromDb: true }));

  return [...mergedStatic, ...extras].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
}

function getEngagementProfile(voteCount, reactionCount, language = 'en') {
  const score = Math.min(100, Math.round(voteCount * 20 + reactionCount * 10));
  const tags = {
    en: ['You are a good listener', 'You really feel the music', 'Your taste in music is excellent', "You're a true music enthusiast", 'Music flows with you'],
    hi: ['आप एक अच्छे श्रोता हैं', 'आप संगीत को महसूस करते हैं', 'संगीत में आपकी पसंद शानदार है', 'आप सच्चे संगीत प्रेमी हैं', 'संगीत आपके साथ बहता है'],
    gu: ['તમે સારા શ્રોતા છો', 'તમે સંગીતને દિલથી અનુભવો છો', 'સંગીતમાં તમારી પસંદ ખૂબ સરસ છે', 'તમે સાચા સંગીતપ્રેમી છો', 'સંગીત તમારી સાથે વહે છે'],
  };
  const labels = tags[language] || tags.en;
  let index = 0;
  if (score >= 25 && score < 50) index = 1;
  else if (score >= 50 && score < 75) index = 2;
  else if (score >= 75 && score < 90) index = 3;
  else if (score >= 90) index = 4;
  return { score, tag: labels[index] };
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

async function saveEventPerson(person, file = null) {
  if (!supabase) return { error: new Error('Supabase is not connected') };

  let photoUrl = person.photo_url || person.photo || '';

  if (file) {
    const upload = await uploadEventMedia(file, `people/${APP_EVENT_ID}`, person.id || person.name);
    if (upload.error) return { error: upload.error };
    photoUrl = upload.url;
  }

  const row = {
    id: person.id || `${person.category}_${Date.now()}`,
    event_id: APP_EVENT_ID,
    category: person.category,
    name: person.name,
    role: person.role || person.instrument || null,
    instrument: person.instrument || null,
    photo_url: photoUrl || null,
    age: person.age || null,
    work: person.work || null,
    workplace: person.workplace || null,
    intro: person.intro || null,
    achievements: person.achievements || null,
    display_order: Number(person.display_order) || 99,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('event_people').upsert(row, { onConflict: 'id' });
  return { error };
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

function downloadCsv(rows, filename) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (value) => {
    const text = value == null ? '' : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const csv = [headers.map(escape).join(','), ...rows.map((row) => headers.map((header) => escape(row[header])).join(','))].join('\n');
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), filename);
}

async function buildMemoryCardBlob({ name, photoUrl, score, tag, language = 'en' }) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 675;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 1200, 675);
  gradient.addColorStop(0, '#e0f2fe');
  gradient.addColorStop(0.5, '#f0f9ff');
  gradient.addColorStop(1, '#dbeafe');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.fillRect(38, 38, 1124, 599);

  ctx.strokeStyle = 'rgba(14,116,144,0.12)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 60; i += 1) {
    const x = 30 + ((i * 79) % 1160);
    const y = (i * 97) % 640;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 16, y + 48);
    ctx.stroke();
  }

  ctx.fillStyle = '#075985';
  ctx.font = '800 34px Arial';
  ctx.fillText('TOFANI VAYRA 9', 70, 90);
  ctx.fillStyle = '#0f766e';
  ctx.font = '700 20px Arial';
  ctx.fillText(language === 'hi' ? 'आपकी म्यूज़िक नाइट याद' : language === 'gu' ? 'તમારી મ્યુઝિક નાઇટ યાદ' : 'YOUR MUSIC NIGHT MEMORY', 70, 124);

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
        ctx.arc(180, 320, 110, 0, Math.PI * 2);
        ctx.clip();
        const ratio = Math.max(220 / image.width, 220 / image.height);
        const drawW = image.width * ratio;
        const drawH = image.height * ratio;
        ctx.drawImage(image, 180 - drawW / 2, 320 - drawH / 2, drawW, drawH);
        ctx.restore();
        photoDrawn = true;
      }
    } catch (error) {
      photoDrawn = false;
    }
  }

  if (!photoDrawn) {
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.arc(180, 320, 110, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#075985';
    ctx.font = '800 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText((name || 'A').charAt(0).toUpperCase(), 180, 348);
    ctx.textAlign = 'left';
  }

  ctx.fillStyle = '#0f172a';
  ctx.font = '800 56px Arial';
  ctx.fillText(name || 'Audience Member', 350, 250);
  ctx.fillStyle = '#0369a1';
  ctx.font = '700 25px Arial';
  ctx.fillText(tag, 350, 298);

  ctx.fillStyle = 'rgba(15,23,42,0.10)';
  ctx.fillRect(350, 355, 760, 28);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(350, 355, 760 * (score / 100), 28);
  ctx.fillStyle = '#0f172a';
  ctx.font = '800 28px Arial';
  ctx.fillText(`${language === 'hi' ? 'भागीदारी' : language === 'gu' ? 'ભાગીદારી' : 'ENGAGEMENT'}  ${score}%`, 350, 414);

  ctx.fillStyle = '#155e75';
  ctx.font = '600 22px Arial';
  ctx.fillText(language === 'hi' ? 'आप सिर्फ दर्शक नहीं, इस संगीत का हिस्सा थे।' : language === 'gu' ? 'તમે માત્ર પ્રેક્ષક નહોતા, આ સંગીતનો એક ભાગ હતા.' : 'You were part of the music, not just the audience.', 70, 610);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Could not create memory card image'));
    }, 'image/png');
  });
}

// function RainThemeStyles() {
//   return (
//     <style>{`
//       @keyframes rainFall {
//         0% { transform: translate3d(0, -15vh, 0); opacity: 0; }
//         10% { opacity: .55; }
//         90% { opacity: .4; }
//         100% { transform: translate3d(-18px, 115vh, 0); opacity: 0; }
//       }
//       .rain-drop {
//         position: absolute;
//         top: -20vh;
//         width: 2px;
//         height: 72px;
//         border-radius: 999px;
//         background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(14,116,144,.45));
//         animation: rainFall linear infinite;
//       }
//       .rain-theme [class*="bg-slate-950"] { background: rgba(248,252,255,.88) !important; }
//       .rain-theme [class*="bg-slate-900"] { background: rgba(255,255,255,.82) !important; }
//       .rain-theme [class*="bg-slate-800"] { background: rgba(224,242,254,.86) !important; }
//       .rain-theme [class*="border-slate-8"] { border-color: rgba(100,116,139,.22) !important; }
//       .rain-theme [class*="border-slate-7"] { border-color: rgba(100,116,139,.25) !important; }
//       .rain-theme [class*="bg-purple-950"] { background: rgba(224,231,255,.72) !important; }
//       .rain-theme [class*="bg-sky-950"] { background: rgba(240,249,255,.84) !important; }
//       .rain-theme [class*="text-slate-1"] { color: #0f172a !important; }
//       .rain-theme [class*="text-slate-2"] { color: #334155 !important; }
//       .rain-theme [class*="text-slate-3"] { color: #475569 !important; }
//       .rain-theme [class*="text-slate-4"] { color: #64748b !important; }
//       .rain-theme [class*="text-slate-5"] { color: #64748b !important; }
//       .rain-theme [class*="text-slate-6"] { color: #475569 !important; }
//       .rain-theme [class*="bg-slate-950"] .text-white,
//       .rain-theme [class*="bg-slate-900"] .text-white { color: #0f172a !important; }
//     `}</style>
//   );
// }

// function RainOverlay() {
//   const drops = Array.from({ length: 34 }, (_, index) => index);
//   return (
//     <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-70">
//       {drops.map((drop) => (
//         <span
//           key={drop}
//           className="rain-drop"
//           style={{
//             left: `${(drop * 19) % 100}%`,
//             animationDuration: `${1.8 + (drop % 5) * 0.35}s`,
//             animationDelay: `${-(drop * 0.19)}s`,
//           }}
//         />
//       ))}
//     </div>
//   );
// }

function RainThemeStyles() {
  return (
    <style>{`
      @keyframes rainFall {
        0% {
          transform: translate3d(0, -15vh, 0) rotate(10deg);
          opacity: 0;
        }

        10% {
          opacity: .75;
        }

        85% {
          opacity: .55;
        }

        100% {
          transform: translate3d(-35px, 115vh, 0) rotate(10deg);
          opacity: 0;
        }
      }

      @keyframes mistFloat {
        0%, 100% {
          transform: translate3d(0, 0, 0) scale(1);
          opacity: .25;
        }

        50% {
          transform: translate3d(20px, -15px, 0) scale(1.08);
          opacity: .4;
        }
      }

      @keyframes waterPulse {
        0%, 100% {
          transform: scale(.8);
          opacity: .1;
        }

        50% {
          transform: scale(1.25);
          opacity: .35;
        }
      }

      .rain-drop {
        position: absolute;
        top: -20vh;
        width: 1.5px;
        height: 80px;
        border-radius: 999px;
        background: linear-gradient(
          to bottom,
          rgba(125,211,252,0),
          rgba(103,232,249,.65)
        );
        animation: rainFall linear infinite;
        filter: blur(.2px);
      }

      .rain-theme {
        background:
          radial-gradient(
            circle at 15% 10%,
            rgba(34,211,238,.13),
            transparent 30%
          ),
          radial-gradient(
            circle at 85% 25%,
            rgba(59,130,246,.15),
            transparent 32%
          ),
          linear-gradient(
            135deg,
            #020617 0%,
            #082f49 42%,
            #042f3b 72%,
            #020617 100%
          ) !important;

        color: #e0f2fe;
      }

      .rain-glow {
        animation: mistFloat 8s ease-in-out infinite;
      }

      .water-pulse {
        animation: waterPulse 3s ease-in-out infinite;
      }

      .rain-theme .bg-white\\/88,
      .rain-theme .bg-white\\/86,
      .rain-theme .bg-white\\/84 {
        background: rgba(7, 30, 45, .72) !important;
        border-color: rgba(103,232,249,.14) !important;
        backdrop-filter: blur(18px);
      }

      .rain-theme .bg-white {
        background: rgba(8, 35, 50, .82) !important;
      }

      .rain-theme .border-sky-200,
      .rain-theme .border-sky-100 {
        border-color: rgba(103,232,249,.16) !important;
      }

      .rain-theme .text-slate-900 {
        color: #ecfeff !important;
      }

      .rain-theme .text-slate-800 {
        color: #cffafe !important;
      }

      .rain-theme .text-slate-700 {
        color: #a5f3fc !important;
      }

      .rain-theme .text-slate-600 {
        color: #bae6fd !important;
      }

      .rain-theme .text-slate-500 {
        color: #94a3b8 !important;
      }

      .rain-theme .text-slate-400 {
        color: #64748b !important;
      }

      .rain-theme .bg-sky-50 {
        background: rgba(14,116,144,.15) !important;
      }

      .rain-theme .bg-sky-100 {
        background: rgba(14,116,144,.22) !important;
      }

      .rain-theme .bg-slate-50 {
        background: rgba(15,23,42,.45) !important;
      }

      .rain-theme .border-slate-200 {
        border-color: rgba(148,163,184,.16) !important;
      }

      .rain-theme .shadow-xl,
      .rain-theme .shadow-2xl {
        box-shadow:
          0 20px 60px rgba(0,0,0,.35),
          0 0 40px rgba(8,145,178,.08);
      }
    `}</style>
  );
}

function RainOverlay() {
  const drops = Array.from({ length: 85 }, (_, index) => index);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,.08),transparent_35%)]" />

      <div className="rain-glow absolute -top-20 left-[-10%] w-[50vw] h-[40vh] rounded-full bg-cyan-400/10 blur-[100px]" />

      <div className="rain-glow absolute top-[35%] right-[-15%] w-[55vw] h-[45vh] rounded-full bg-blue-500/10 blur-[120px]" />

      {drops.map((drop) => (
        <span
          key={drop}
          className="rain-drop"
          style={{
            left: `${(drop * 17.37) % 100}%`,
            animationDuration: `${1.4 + (drop % 7) * 0.28}s`,
            animationDelay: `${-(drop * 0.13)}s`,
            opacity: 0.35 + ((drop % 5) * 0.08),
          }}
        />
      ))}

      <div className="water-pulse absolute bottom-[8%] left-[18%] w-2 h-2 rounded-full bg-cyan-300/40 blur-[1px]" />
      <div className="water-pulse absolute bottom-[22%] right-[20%] w-3 h-3 rounded-full bg-blue-300/30 blur-[1px]" />

    </div>
  );
}

