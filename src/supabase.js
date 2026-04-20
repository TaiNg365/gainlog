import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hwechroggsiogvoyctw.supabase.co'
const SUPABASE_KEY = 'sb_publishable_nfHqWLf4z33rFlcNrZz5Qg_bCSo97Uj'

export const db = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Workout Logs ──────────────────────────────────────────────────────────────
export async function getLogs() {
  const { data, error } = await db
    .from('workout_logs')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error('getLogs:', error); return []; }
  return data.map(r => ({
    id: r.id, date: r.date, machine: r.machine,
    sets: r.sets, superset: r.superset,
    supersetWith: r.superset_with, notes: r.notes, isPR: r.is_pr
  }));
}

export async function saveLog(entry) {
  const { error } = await db.from('workout_logs').upsert({
    id: entry.id, date: entry.date, machine: entry.machine,
    sets: entry.sets, superset: entry.superset,
    superset_with: entry.supersetWith, notes: entry.notes, is_pr: entry.isPR
  })
  if (error) console.error('saveLog:', error);
}

export async function deleteLog(id) {
  const { error } = await db.from('workout_logs').delete().eq('id', id)
  if (error) console.error('deleteLog:', error);
}

// ── Body Scans ────────────────────────────────────────────────────────────────
export async function getBodyScans() {
  const { data, error } = await db
    .from('body_scans')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) { console.error('getBodyScans:', error); return []; }
  return data.map(r => ({
    id: r.id, date: r.date, source: r.source,
    score: r.score, weight: r.weight, bodyFat: r.body_fat,
    muscle: r.muscle, skeletalMuscle: r.skeletal_muscle,
    protein: r.protein, bodyWater: r.body_water,
    inorganicSalt: r.inorganic_salt, bmi: r.bmi,
    visceralFat: r.visceral_fat, bmr: r.bmr, bodyAge: r.body_age,
    fatFreeMass: r.fat_free_mass, subcutaneousFat: r.subcutaneous_fat,
    smi: r.smi, whr: r.whr, notes: r.notes
  }));
}

export async function saveBodyScan(entry) {
  const { error } = await db.from('body_scans').upsert({
    id: entry.id, date: entry.date, source: entry.source,
    score: entry.score, weight: entry.weight, body_fat: entry.bodyFat,
    muscle: entry.muscle, skeletal_muscle: entry.skeletalMuscle,
    protein: entry.protein, body_water: entry.bodyWater,
    inorganic_salt: entry.inorganicSalt, bmi: entry.bmi,
    visceral_fat: entry.visceralFat, bmr: entry.bmr, body_age: entry.bodyAge,
    fat_free_mass: entry.fatFreeMass, subcutaneous_fat: entry.subcutaneousFat,
    smi: entry.smi, whr: entry.whr, notes: entry.notes
  })
  if (error) console.error('saveBodyScan:', error);
}

// ── Machines ──────────────────────────────────────────────────────────────────
export async function getMachines() {
  const { data, error } = await db
    .from('machines')
    .select('name')
    .order('name')
  if (error) { console.error('getMachines:', error); return []; }
  return data.map(r => r.name);
}

export async function addMachine(name) {
  const { error } = await db.from('machines').insert({ name })
  if (error) console.error('addMachine:', error);
}

// ── Settings ──────────────────────────────────────────────────────────────────
export async function getSetting(key) {
  const { data } = await db.from('settings').select('value').eq('key', key).single()
  return data?.value || null;
}

export async function setSetting(key, value) {
  await db.from('settings').upsert({ key, value })
}
