drop table if exists pages;
create table pages (
	id integer primary key autoincrement,
	name text not null,
	score integer not null
);
