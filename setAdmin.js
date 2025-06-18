const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://llslxcymbxcvwrufjaqm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc2x4Y3ltYnhjdndydWZqYXFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDA3OTUyNiwiZXhwIjoyMDY1NjU1NTI2fQ.46CPV8wXbEbspW9OS-aGCCE9i2lVo_DJ14PX3RVoWeE'
)

const userId = '70f2eb82-f807-4f06-8805-f80aa654d59e'

async function setAdmin() {
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role: 'admin' }
  });
  if (error) {
    console.error(error)
  } else {
    console.log('User updated:', data)
  }
}

setAdmin()