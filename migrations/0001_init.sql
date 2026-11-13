-- Content schema. List-valued columns (highlights, tags, items, details) hold JSON arrays of strings.

CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

CREATE TABLE case_studies (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT NOT NULL UNIQUE,
  title      TEXT NOT NULL,
  summary    TEXT NOT NULL DEFAULT '',
  period     TEXT NOT NULL DEFAULT '',
  role       TEXT NOT NULL DEFAULT '',
  result     TEXT NOT NULL DEFAULT '',
  tags       TEXT NOT NULL DEFAULT '[]',
  body_md    TEXT NOT NULL DEFAULT '',
  sort       INTEGER NOT NULL DEFAULT 0,
  published  INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE roles (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  company    TEXT NOT NULL,
  title      TEXT NOT NULL,
  location   TEXT NOT NULL DEFAULT '',
  start      TEXT NOT NULL DEFAULT '',
  end        TEXT NOT NULL DEFAULT '',
  url        TEXT NOT NULL DEFAULT '',
  summary    TEXT NOT NULL DEFAULT '',
  highlights TEXT NOT NULL DEFAULT '[]',
  tags       TEXT NOT NULL DEFAULT '[]',
  sort       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE projects (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  period      TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  details     TEXT NOT NULL DEFAULT '[]',
  tags        TEXT NOT NULL DEFAULT '[]',
  image_url   TEXT NOT NULL DEFAULT '',
  link_url    TEXT NOT NULL DEFAULT '',
  link_label  TEXT NOT NULL DEFAULT '',
  sort        INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE education (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  school   TEXT NOT NULL,
  degree   TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  period   TEXT NOT NULL DEFAULT '',
  sort     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE skill_groups (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL,
  items TEXT NOT NULL DEFAULT '[]',
  sort  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE posts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  summary      TEXT NOT NULL DEFAULT '',
  body_md      TEXT NOT NULL DEFAULT '',
  published_at TEXT NOT NULL DEFAULT '',
  published    INTEGER NOT NULL DEFAULT 0
);
