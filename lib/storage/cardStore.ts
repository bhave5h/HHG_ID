import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface CardRecord {
  id: string;
  name: string;
  stack: string;
  builderTitle: string;
  imageUrl: string;
  createdAt: string;
}

// In-memory fallback cache for fast server response
const memoryCardStore = new Map<string, CardRecord>();
const memoryImageStore = new Map<string, Buffer>();

// Local filesystem fallback directory for dev/local persistence
const LOCAL_CARD_DIR = path.join(process.cwd(), "public", "generated-cards");

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    return createClient(supabaseUrl, supabaseKey);
  }
  return null;
}

export function generateCardId(): string {
  // Generate a clean, random 7-character alphanumeric ID like '8f72ka9'
  return crypto.randomBytes(4).toString("hex");
}

export async function saveCard(data: {
  id: string;
  name: string;
  stack: string;
  builderTitle: string;
  imageBuffer: Buffer;
  baseUrl: string;
}): Promise<CardRecord> {
  const { id, name, stack, builderTitle, imageBuffer, baseUrl } = data;
  const fileName = `${id}.png`;
  const createdAt = new Date().toISOString();

  let finalImageUrl = "";
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      // 1. Upload image to Supabase Storage bucket 'cards'
      const { error: uploadError } = await supabase.storage
        .from("cards")
        .upload(fileName, imageBuffer, {
          contentType: "image/png",
          upsert: true,
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("cards")
          .getPublicUrl(fileName);
        finalImageUrl = publicUrlData.publicUrl;

        // 2. Insert metadata into Supabase table 'cards'
        await supabase.from("cards").insert([
          {
            id,
            name,
            stack,
            builder_title: builderTitle,
            image_url: finalImageUrl,
            created_at: createdAt,
          },
        ]);
      }
    } catch (e) {
      console.warn("Supabase save attempt failed, using fallback storage:", e);
    }
  }

  // Fallback if Supabase not configured or failed
  if (!finalImageUrl) {
    try {
      if (!fs.existsSync(LOCAL_CARD_DIR)) {
        fs.mkdirSync(LOCAL_CARD_DIR, { recursive: true });
      }
      fs.writeFileSync(path.join(LOCAL_CARD_DIR, fileName), imageBuffer);
      finalImageUrl = `${baseUrl}/generated-cards/${fileName}`;
    } catch {
      // Memory store fallback
      finalImageUrl = `${baseUrl}/api/card-image/${id}`;
    }
  }

  const record: CardRecord = {
    id,
    name,
    stack,
    builderTitle,
    imageUrl: finalImageUrl,
    createdAt,
  };

  // Cache in memory
  memoryCardStore.set(id, record);
  memoryImageStore.set(id, imageBuffer);

  return record;
}

export async function getCard(id: string, baseUrl = ""): Promise<CardRecord | null> {
  // Check memory store
  if (memoryCardStore.has(id)) {
    return memoryCardStore.get(id)!;
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("id", id)
        .single();

      if (data && !error) {
        const record: CardRecord = {
          id: data.id,
          name: data.name,
          stack: data.stack,
          builderTitle: data.builder_title || data.builderTitle,
          imageUrl: data.image_url,
          createdAt: data.created_at,
        };
        memoryCardStore.set(id, record);
        return record;
      }
    } catch (e) {
      console.warn("Supabase lookup error:", e);
    }
  }

  // Check local filesystem
  const localPath = path.join(LOCAL_CARD_DIR, `${id}.png`);
  if (fs.existsSync(localPath)) {
    const record: CardRecord = {
      id,
      name: "HH Goa Builder",
      stack: "AI × Design × Dev",
      builderTitle: "THE PIXEL ARCHITECT",
      imageUrl: `${baseUrl}/generated-cards/${id}.png`,
      createdAt: new Date().toISOString(),
    };
    memoryCardStore.set(id, record);
    return record;
  }

  return null;
}

export function getCardImageBuffer(id: string): Buffer | null {
  if (memoryImageStore.has(id)) {
    return memoryImageStore.get(id)!;
  }
  const localPath = path.join(LOCAL_CARD_DIR, `${id}.png`);
  if (fs.existsSync(localPath)) {
    return fs.readFileSync(localPath);
  }
  return null;
}
