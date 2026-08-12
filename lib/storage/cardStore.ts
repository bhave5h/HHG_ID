import { createServerClient } from "@/lib/supabase/server";
import crypto from "crypto";

export interface CardRecord {
  id: string;
  name: string;
  stack: string;
  builderTitle: string;
  imageUrl: string;
  createdAt: string;
}

export function generateCardId(): string {
  return crypto.randomBytes(4).toString("hex");
}

export async function saveCard(data: {
  id: string;
  name: string;
  stack: string;
  builderTitle: string;
  imageBuffer: Buffer;
}): Promise<CardRecord> {
  const { id, name, stack, builderTitle, imageBuffer } = data;
  const fileName = `${id}.png`;

  const supabase = createServerClient();

  // 1. Upload PNG image to Supabase Storage bucket 'cards' at path '{id}.png'
  const { error: uploadError } = await supabase.storage
    .from("cards")
    .upload(fileName, imageBuffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (uploadError) {
    console.error("Supabase Storage upload error:", uploadError);
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  // 2. Get public image URL from Supabase Storage
  const { data: publicUrlData } = supabase.storage
    .from("cards")
    .getPublicUrl(fileName);

  const imageUrl = publicUrlData?.publicUrl;

  if (!imageUrl) {
    throw new Error("Failed to resolve public image URL from Supabase Storage.");
  }

  // 3. Insert record into public.cards database table
  const { data: insertData, error: insertError } = await supabase
    .from("cards")
    .insert([
      {
        id,
        name,
        stack,
        builder_title: builderTitle,
        image_url: imageUrl,
      },
    ])
    .select()
    .single();

  if (insertError) {
    console.error("Supabase Database insert error:", insertError);
    throw new Error(`Database insertion failed: ${insertError.message}`);
  }

  return {
    id: insertData.id,
    name: insertData.name,
    stack: insertData.stack,
    builderTitle: insertData.builder_title || insertData.builderTitle || "",
    imageUrl: insertData.image_url,
    createdAt: insertData.created_at,
  };
}

export async function getCard(id: string): Promise<CardRecord | null> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      if (error && error.code !== "PGRST116") {
        console.error("Supabase database fetch error:", error);
      }
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      stack: data.stack,
      builderTitle: data.builder_title || data.builderTitle || "",
      imageUrl: data.image_url,
      createdAt: data.created_at,
    };
  } catch (err) {
    console.error("Exception in getCard:", err);
    return null;
  }
}
