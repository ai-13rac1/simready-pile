create table if not exists pile_item (
  id text primary key,
  x double precision not null,
  y double precision not null,
  z double precision not null,
  rx double precision not null,
  ry double precision not null,
  rz double precision not null,
  rw double precision not null,
  settled boolean not null default false,
  updated_at timestamptz not null default now()
);
