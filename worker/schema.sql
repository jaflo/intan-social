-- wrangler d1 execute intan-prod --local --file=./worker/schema.sql

-- example:
-- DROP TABLE IF EXISTS users;
-- CREATE TABLE users (
--   user_id INTEGER PRIMARY KEY AUTOINCREMENT,
--   display_name TEXT NOT NULL,
--   email_address TEXT NOT NULL,
--   firebase_id TEXT NOT NULL,
--   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );
-- CREATE INDEX idx_users_email_address ON users (email_address);
-- CREATE INDEX idx_users_firebase_id ON users (firebase_id);

-- wanted database tables (all have created_at, updated_at, needed indices):
-- users: user_incrementing_id, user_id (text), display_name, email_address, home_location, google_user_id, google_access_token, google_token_expires_at, google_refresh_token, google_calendar_notification_channel_id
-- transitions: transition_id, user_id, time_start, to_location, gcal_event_id (text, can be null)
-- groups: group_id, owner_user_id, share_id (text), title, match_condition (text)
-- group_members: group_member_id, group_id, user_id


-- drop tables if they exist
DROP TABLE IF EXISTS group_members;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS transitions;
DROP TABLE IF EXISTS users;

-- create users table
CREATE TABLE users (
  user_incrementing_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  email_address TEXT NOT NULL,
  home_location TEXT,
  google_user_id TEXT,
  google_access_token TEXT,
  google_token_expires_at INTEGER,
  google_refresh_token TEXT,
  google_calendar_notification_channel_id TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email_address ON users (email_address);
CREATE INDEX idx_users_google_user_id ON users (google_user_id);

-- create transitions table
CREATE TABLE transitions (
  transition_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  time_start TIMESTAMP NOT NULL,
  to_location TEXT NOT NULL,
  gcal_event_id TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_transitions_user_id ON transitions (user_id);
CREATE INDEX idx_transitions_to_location ON transitions (to_location);

-- create groups table
CREATE TABLE groups (
  group_id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_user_id INTEGER NOT NULL,
  share_id TEXT NOT NULL,
  title TEXT NOT NULL,
  match_condition TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_groups_owner_user_id ON groups (owner_user_id);
CREATE INDEX idx_groups_share_id ON groups (share_id);

-- create group_members table
CREATE TABLE group_members (
  group_member_id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_group_members_group_id ON group_members (group_id);
CREATE INDEX idx_group_members_user_id ON group_members (user_id);
