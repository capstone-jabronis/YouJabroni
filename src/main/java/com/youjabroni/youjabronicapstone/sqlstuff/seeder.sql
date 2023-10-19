CREATE DATABASE jabroni_db;
use jabroni_db;
# CREATE YOUR PROFILE FIRST  THEN RUN THE SEEDER ALL USERS WILL HAVE THE SAME PASSWORD AS YOU!
INSERT INTO users (username, email, password)
VALUES ('user1', 'user1@example.com', 'password1'),
       ('user2', 'user2@example.com', 'password2'),
       ('user3', 'user3@example.com', 'password3'),
       ('user4', 'user4@example.com', 'password4'),
       ('user5', 'user5@example.com', 'password5'),
       ('user6', 'user6@example.com', 'password6'),
       ('user7', 'user7@example.com', 'password7'),
       ('user8', 'user8@example.com', 'password8');
SET @password = (SELECT password FROM users WHERE id = 1);
UPDATE users
SET password = @password
WHERE id <> 1;

INSERT INTO tournaments (winner_id)
VALUES ('1'),
       ('1');



INSERT INTO rounds (round_num, meme_pic)
VALUES ('1',  'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('1',  'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966');

insert into meme_submission (caption, user_id)
VALUES ('user 1 round 1 caption tournament 1', '1'),
       ('user 2 round 1 caption tournament 1', '1');


INSERT INTO posts(description, meme_id, user_id)
values ('post for user id 1 and meme id 1', '1','1'),
       ('post for user id 2 and meme id 2', '2','1');


INSERT INTO votes (user_id, meme_submission_id)
VALUES ('3', '1'),
       ('4', '1'),
       ('5', '1'),
       ('6', '1'),
       ('7', '1'),
       ('8', '1'),
       ('3', '2'),
       ('4', '2'),
       ('5', '2'),
       ('6', '2'),
       ('7', '2'),
       ('8', '2'),
       ('1', '3'),
       ('2', '3'),
       ('5', '3'),
       ('6', '3'),
       ('7', '3'),
       ('8', '3'),
       ('1', '4'),
       ('2', '4'),
       ('5', '4'),
       ('6', '4'),
       ('7', '4'),
       ('8', '4'),
       ('1', '5'),
       ('2', '5'),
       ('3', '5'),
       ('4', '5'),
       ('7', '5'),
       ('8', '5'),
       ('1', '6'),
       ('2', '6'),
       ('3', '6'),
       ('4', '6'),
       ('7', '6'),
       ('8', '6'),
       ('1', '7'),
       ('2', '7'),
       ('3', '7'),
       ('4', '7'),
       ('5', '7'),
       ('6', '7'),
       ('1', '8'),
       ('2', '8'),
       ('3', '8'),
       ('4', '8'),
       ('5', '8'),
       ('6', '8'),
       ('2', '9'),
       ('4', '9'),
       ('5', '9'),
       ('6', '9'),
       ('7', '9'),
       ('8', '9'),
       ('2', '10'),
       ('4', '10'),
       ('5', '10'),
       ('6', '10'),
       ('7', '10'),
       ('8', '10'),
       ('1', '11'),
       ('2', '11'),
       ('3', '11'),
       ('4', '11'),
       ('6', '11'),
       ('8', '11'),
       ('1', '12'),
       ('2', '12'),
       ('3', '12'),
       ('4', '12'),
       ('6', '12'),
       ('8', '12'),
       ('2', '13'),
       ('3', '13'),
       ('4', '13'),
       ('5', '13'),
       ('6', '13'),
       ('8', '13'),
       ('2', '14'),
       ('3', '14'),
       ('4', '14'),
       ('5', '14'),
       ('6', '14'),
       ('8', '14');


