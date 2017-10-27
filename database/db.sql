
DROP DATABASE IF EXISTS tweeter;

CREATE DATABASE tweeter;

\connect tweeter;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id serial PRIMARY KEY,
	handle varchar (100) NOT NULL,
	name varchar (100) NOT NULL,
	timezone varchar(25), 
	publisher boolean
	);

DROP TABLE IF EXISTS tweets;

CREATE TYPE tweet_type AS ENUM (
  'Regular', 
  'Reply', 
  'Retweet');

CREATE TABLE tweets (
	id serial PRIMARY KEY,
    user_id integer REFERENCES users(id),
	message varchar (255) NOT NULL,
	created_at date ,
	views integer,
	likes integer,
	retweets integer,
	replies integer,
	impressions integer,
	type varchar (50)
);

DROP TABLE IF EXISTS follows;

CREATE TABLE follows (
	id serial PRIMARY KEY,
    follow_id integer REFERENCES users(id),
	follower_id integer REFERENCES users(id)
);

