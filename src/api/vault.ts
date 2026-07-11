import { supabase } from '../lib/supabase'

const BUCKET = 'vault-files'

export type NoteRecord = {
  id: string
  vault_id: string
  content: string
  created_at: string
}

export type FileRecord = {
  id: string
  vault_id: string
  file_name: string
  storage_path: string
  file_type: string | null
  file_size: number | null
  uploaded_at: string
}

export type VaultData = {
  notes: NoteRecord[]
  files: FileRecord[]
}

/**
 * Upload files to Supabase Storage and save all metadata + notes to the DB.
 * If a vault with this hash already exists, upserts it (idempotent).
 */
export async function saveVault(
  vaultIdHash: string,
  note: string | null,
  files: File[]
): Promise<void> {
  // 1. Create vault row — check first to avoid upsert RLS edge cases
  const { data: existingVault } = await supabase
    .from('vaults')
    .select('vault_id')
    .eq('vault_id', vaultIdHash)
    .maybeSingle()

  if (!existingVault) {
    const { error: vaultError } = await supabase
      .from('vaults')
      .insert({ vault_id: vaultIdHash })

    if (vaultError) throw new Error(`Failed to create vault: ${vaultError.message}`)
  }

  // 2. Insert note if provided
  if (note && note.trim().length > 0) {
    const { error: noteError } = await supabase
      .from('notes')
      .insert({ vault_id: vaultIdHash, content: note.trim() })

    if (noteError) throw new Error(`Failed to save note: ${noteError.message}`)
  }

  // 3. Upload each file to storage and record metadata
  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `${vaultIdHash}/${Date.now()}_${safeName}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, { upsert: false })

    if (uploadError) throw new Error(`Failed to upload "${file.name}": ${uploadError.message}`)

    const { error: fileMetaError } = await supabase.from('files').insert({
      vault_id: vaultIdHash,
      file_name: file.name,
      storage_path: storagePath,
      file_type: file.type || null,
      file_size: file.size,
    })

    if (fileMetaError) throw new Error(`Failed to save file metadata: ${fileMetaError.message}`)
  }
}

/**
 * Deletes all database records and storage files associated with a vault.
 */
export async function deleteVault(vaultIdHash: string, storagePaths: string[]): Promise<void> {
  try {
    // 1. Delete storage files
    if (storagePaths.length > 0) {
      await supabase.storage.from(BUCKET).remove(storagePaths)
    }

    // 2. Delete vault database rows (notes and files tables, then vaults table)
    await supabase.from('notes').delete().eq('vault_id', vaultIdHash)
    await supabase.from('files').delete().eq('vault_id', vaultIdHash)
    await supabase.from('vaults').delete().eq('vault_id', vaultIdHash)
  } catch (err) {
    console.error(`Failed to purge expired vault ${vaultIdHash}:`, err)
  }
}

/**
 * Retrieve all notes and files for a given vault hash.
 * Returns null if the vault does not exist or has expired (older than 7 days).
 */
export async function getVault(vaultIdHash: string): Promise<VaultData | null> {
  // Check vault exists
  const { data: vaultRow, error: vaultError } = await supabase
    .from('vaults')
    .select('vault_id, created_at')
    .eq('vault_id', vaultIdHash)
    .maybeSingle()

  if (vaultError || !vaultRow) return null

  // Check 7-day expiration (7 days = 604,800,000 ms)
  const createdAt = new Date(vaultRow.created_at).getTime()
  const isExpired = Date.now() - createdAt > 7 * 24 * 60 * 60 * 1000

  if (isExpired) {
    // Fetch file metadata to get their storage paths so we can delete them from bucket
    const { data: files } = await supabase
      .from('files')
      .select('storage_path')
      .eq('vault_id', vaultIdHash)
    
    const paths = (files ?? []).map((f) => f.storage_path)

    // Trigger cleanup asynchronously
    deleteVault(vaultIdHash, paths).catch((err) => {
      console.error('Async vault purge error:', err)
    })

    return null // Return null to indicate the vault is gone/expired
  }

  // Fetch notes
  const { data: notes, error: notesError } = await supabase
    .from('notes')
    .select('*')
    .eq('vault_id', vaultIdHash)
    .order('created_at', { ascending: true })

  if (notesError) throw new Error(`Failed to fetch notes: ${notesError.message}`)

  // Fetch file metadata
  const { data: files, error: filesError } = await supabase
    .from('files')
    .select('*')
    .eq('vault_id', vaultIdHash)
    .order('uploaded_at', { ascending: true })

  if (filesError) throw new Error(`Failed to fetch files: ${filesError.message}`)

  return {
    notes: (notes ?? []) as NoteRecord[],
    files: (files ?? []) as FileRecord[],
  }
}

/**
 * Returns a public URL for a file stored in Supabase Storage.
 */
export function getFileUrl(storagePath: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}
