import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hwechroggsiogvoyctw.supabase.co'
const SUPABASE_KEY = 'sb_publishable_nfHqWLf4z33rFlcNrZz5Qg_bCSo97Uj'

export const db = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
})

// ── Workout Logs
export async function getLogs() {
  try {
    const { data, error } = await db.from('workout_logs').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data.map(r => ({ id:r.id, date:r.date, machine:r.machine, sets:r.sets, superset:r.superset, supersetWith:r.superset_with, notes:r.notes, isPR:r.is_pr }))
  } catch(e) { console.error('getLogs:', e); return []; }
}

export async function saveLog(entry) {
  try {
    await db.from('workout_logs').upsert({ id:entry.id, date:entry.date, machine:entry.machine, sets:entry.sets, superset:entry.superset, superset_with:entry.supersetWith, notes:entry.notes, is_pr:entry.isPR })
  } catch(e) { console.error('saveLog:', e); }
}

// ── Body Scans
export async function getBodyScans() {
  try {
    const { data, error } = await db.from('body_scans').select('*').order('created_at', { ascending: true })
    if (error) throw error
    return data.map(r => ({ id:r.id, date:r.date, source:r.source, score:r.score, weight:r.weight, bodyFat:r.body_fat, muscle:r.muscle, skeletalMuscle:r.skeletal_muscle, protein:r.protein, bodyWater:r.body_water, inorganicSalt:r.inorganic_salt, bmi:r.bmi, visceralFat:r.visceral_fat, bmr:r.bmr, bodyAge:r.body_age, fatFreeMass:r.fat_free_mass, subcutaneousFat:r.subcutaneous_fat, smi:r.smi, whr:r.whr, notes:r.notes }))
  } catch(e) { console.error('getBodyScans:', e); return []; }
}

export async function saveBodyScan(entry) {
  try {
    await db.from('body_scans').upsert({ id:entry.id, date:entry.date, source:entry.source, score:entry.score, weight:entry.weight, body_fat:entry.bodyFat, muscle:entry.muscle, skeletal_muscle:entry.skeletalMuscle, protein:entry.protein, body_water:entry.bodyWater, inorganic_salt:entry.inorganicSalt, bmi:entry.bmi, visceral_fat:entry.visceralFat, bmr:entry.bmr, body_age:entry.bodyAge, fat_free_mass:entry.fatFreeMass, subcutaneous_fat:entry.subcutaneousFat, smi:entry.smi, whr:entry.whr, notes:entry.notes })
  } catch(e) { console.error('saveBodyScan:', e); }
}

// ── Machines
export async function getMachines() {
  try {
    const { data, error } = await db.from('machines').select('name').order('name')
    if (error) throw error
    return data.map(r => r.name)
  } catch(e) { console.error('getMachines:', e); return []; }
}

export async function addMachine(name) {
  try { await db.from('machines').insert({ name }) } catch(e) { console.error('addMachine:', e); }
}

// ── Settings
export async function getSetting(key) {
  try {
    const { data } = await db.from('settings').select('value').eq('key', key).single()
    return data?.value || null
  } catch(e) { return null; }
}

export async function setSetting(key, value) {
  try { await db.from('settings').upsert({ key, value }) } catch(e) { console.error('setSetting:', e); }
}

// ── Cardio Logs
export async function getCardioLogs() {
  try {
    const { data, error } = await db.from('cardio_logs').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data.map(r => ({ id:r.id, date:r.date, machine:r.machine, duration:r.duration, calDisplay:r.cal_display, notes:r.notes, type:'cardio' }))
  } catch(e) { console.error('getCardioLogs:', e); return []; }
}

export async function saveCardioLog(entry) {
  try {
    await db.from('cardio_logs').upsert({ id:entry.id, date:entry.date, machine:entry.machine, duration:entry.duration, cal_display:entry.calDisplay, notes:entry.notes })
  } catch(e) { console.error('saveCardioLog:', e); }
}
