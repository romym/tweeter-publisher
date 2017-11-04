
DROP DATABASE IF EXISTS tweeter;

CREATE DATABASE tweeter;

\connect tweeter;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id integer PRIMARY KEY,
	name varchar (100) NOT NULL,
	handle varchar (100) NOT NULL,
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
	tweet_uid varchar, 
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

DROP TABLE IF EXISTS views;

CREATE TABLE views (
	id serial PRIMARY KEY,
    user_view_id integer REFERENCES users(id),
	tweet_view_id integer REFERENCES tweets(id)
);

DROP TABLE IF EXISTS likes;

CREATE TABLE likes (
	id serial PRIMARY KEY,
    user_like_id integer REFERENCES users(id),
	tweet_like_id integer REFERENCES tweets(id)
);

DROP TABLE IF EXISTS impressions;

CREATE TABLE impressions (
	id serial PRIMARY KEY,
    user_impression_id integer REFERENCES users(id),
	tweet_impression_id integer REFERENCES tweets(id)
);

DROP TABLE IF EXISTS retweets;

CREATE TABLE retweets (
	id serial PRIMARY KEY,
    tweet_id integer REFERENCES users(id),
	parent_id integer REFERENCES users(id)
);

DROP TABLE IF EXISTS replies;

CREATE TABLE replies (
	id serial PRIMARY KEY,
    tweet_id integer REFERENCES users(id),
	parent_id integer REFERENCES users(id)
);

