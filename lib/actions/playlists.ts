"use server"

import { getServerClient } from "@/lib/supabase/serverClient"
import { revalidatePath } from "next/cache"

export async function createPlaylist(formData: FormData) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const visibility = (formData.get("visibility") as string) || "private"

  const { data, error } = await supabase
    .from("playlists")
    .insert({
      title,
      description,
      visibility,
      owner: user.id
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/playlists")
  
  return { data }
}

export async function addToPlaylist(playlistId: string, recordingId: string) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const { count } = await supabase
    .from("playlist_items")
    .select("*", { count: "exact", head: true })
    .eq("playlist_id", playlistId)

  const position = (count || 0) + 1

  const { data, error } = await supabase
    .from("playlist_items")
    .insert({
      playlist_id: playlistId,
      recording_id: recordingId,
      position
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/playlists/${playlistId}`)
  
  return { data }
}

export async function removeFromPlaylist(playlistId: string, itemId: string) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase
    .from("playlist_items")
    .delete()
    .eq("id", itemId)
    .eq("playlist_id", playlistId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/playlists/${playlistId}`)
  
  return { success: true }
}

export async function updatePlaylist(id: string, updates: any) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("playlists")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("owner", user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/playlists/${id}`)
  revalidatePath("/playlists")
  
  return { data }
}

export async function deletePlaylist(id: string) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", id)
    .eq("owner", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/playlists")
  
  return { success: true }
}
