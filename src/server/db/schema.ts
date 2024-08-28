import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccount } from "next-auth/adapters";
import { use } from "react";

const connectionString = process.env.DATABASE_URL!;
const pool = postgres(connectionString, { max: 1 });

export const db = drizzle(pool);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);


export const devices = pgTable("device", {
  dev_id: integer("dev_id").primaryKey(),
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  dev_eui: text("dev_eui"),
  family_id: integer("family_id"),
  product_id: integer("product_id"),
  temperature: integer("temperature"),
  humidity: integer("humidity"),
  join_eui: text("join_eui"),
  app_key: text("app_key"),
  lora_ack: integer("lora_ack"),
  lora_send_period: integer("lora_send_period"),
  lora_dr_adr_en: integer("lora_dr_adr_en"),
  lora_freq_reg: text("lora_freq_reg"),
  lora_hyb_asoff_mask0_1: integer("lora_hyb_asoff_mask0_1"),
  lora_mask2_5: integer("lora_mask2_5"),
  device_adc_delay: integer("device_adc_delay"),
  device_adc_en: integer("device_adc_en"),
  device_fw_ver: integer("device_fw_ver"),
  device_hw_ver: integer("device_hw_ver"),
  device_mov_thr: integer("device_mov_thr"),
  device_status: integer("device_status"),
});

