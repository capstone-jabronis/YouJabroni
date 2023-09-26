create DATABASE if not exists jabroni_db;

drop table if exists users;
create table users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username varchar(255) NOT NULL UNIQUE ,
    email varchar(255) not null unique,
    password varchar(255) not null unique
);

drop table if exists tournament;
create table tournament (
                       id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                       winner int,
                       start_time DATETIME not null,
                       FOREIGN KEY(winner) REFERENCES users(id)
);

drop table if exists rounds;
create table rounds (
                       id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                       round_num smallint NOT NULL ,
                       tournament_id int,
                       meme_pic varchar(255) not null,
                       foreign key (tournament_id) references tournament(id)
);

drop table if exists meme_submission;
create table meme_submission (
                       id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                       caption varchar(255) ,
                       user_id int,
                       round_id int,
                       foreign key(user_id) references users(id),
                       foreign key(round_id) references rounds(id)
);

drop table if exists votes;
create table votes (
                                 user_id int,
                                 meme_submission_id int,
                                 foreign key(user_id) references users(id),
                                 foreign key(meme_submission_id) references meme_submission(id)
);

