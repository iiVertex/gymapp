import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://vpcjsuoozdexrpkdapqs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwY2pzdW9vemRleHJwa2RhcHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NjQ2MzksImV4cCI6MjA3OTI0MDYzOX0.sjArL0y8qByw3b2KEKgnerdacY6KEXuTEU4sitovisc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
