-- Migration: Make Game.whitePlayerId and Game.blackPlayerId nullable
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- OR via: cd packages/db && npx prisma db push
--
-- Rationale: Guest players don't have a Profile record (no auth required).
-- Guest games are saved with NULL player IDs — not rated, but history preserved.

ALTER TABLE public.games
  ALTER COLUMN white_player_id DROP NOT NULL,
  ALTER COLUMN black_player_id DROP NOT NULL;
