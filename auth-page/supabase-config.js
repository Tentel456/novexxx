const SUPABASE_URL = 'https://fzxygibmatjirglgkppf.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6eHlnaWJtYXRqaXJnbGdrcHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwODY3NjAsImV4cCI6MjA5MTY2Mjc2MH0.xxj2XvzdC4G3xugqr7O7NaZwEHTZLJJrxxabVHoD6Wo'; 
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabaseClient = supabase;
