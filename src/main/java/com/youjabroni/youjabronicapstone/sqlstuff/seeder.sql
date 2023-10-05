CREATE DATABASE jabroni_db;
use jabroni_db;

INSERT INTO users (username, email, password)
VALUES ('user1', 'user1@example.com', 'password1'),
       ('user2', 'user2@example.com', 'password2'),
       ('user3', 'user3@example.com', 'password3'),
       ('user4', 'user4@example.com', 'password4'),
       ('user5', 'user5@example.com', 'password5'),
       ('user6', 'user6@example.com', 'password6'),
       ('user7', 'user7@example.com', 'password7'),
       ('user8', 'user8@example.com', 'password8');


INSERT INTO tournaments (winner_id, start_time)
VALUES ('1', '2023-09-26 14:30:00'),
       ('2', '2023-10-01 16:30:00'),
       ('2', '2023-10-02 16:30:00');


INSERT INTO rounds (round_num, tournament_id, meme_pic)
VALUES ('1', '1', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('1', '1', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('1', '1', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('1', '1', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('2', '1', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('2', '1', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('3', '1', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('1', '2', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('1', '2', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('1', '2', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('1', '2', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('2', '2', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('2', '2', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('3', '2', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('1', '3', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('1', '3', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('1', '3', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('1', '3', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('2', '3', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('2', '3', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966'),
       ('3', '3', 'https://assets.change.org/photos/9/be/ua/mdBeuawBAwcvRgk-1600x900-noPad.jpg?1526976966');


insert into meme_submission (caption,message_type, user_id, round_id)
VALUES ('user 1 round 1 caption', '1', '1'),
       ('user 2 round 1 caption', '2', '1'),
       ('user 3 round 1 caption', '3', '2'),
       ('user 4 round 1 caption', '4', '2'),
       ('user 5 round 1 caption', '5', '3'),
       ('user 6 round 1 caption', '6', '3'),
       ('user 7 round 1 caption', '7', '4'),
       ('user 8 round 1 caption', '8', '4'),
       ('user 1 round 2 caption', '1', '5'),
       ('user 3 round 2 caption', '3', '5'),
       ('user 5 round 2 caption', '5', '6'),
       ('user 7 round 2 caption', '7', '6'),
       ('user 1 round 3 caption', '1', '7'),
       ('user 7 round 3 caption', '7', '7'),
       ('user 1 round 1 caption', '1', '8'),
       ('user 2 round 1 caption', '2', '8'),
       ('user 3 round 1 caption', '3', '9'),
       ('user 4 round 1 caption', '4', '9'),
       ('user 5 round 1 caption', '5', '10'),
       ('user 6 round 1 caption', '6', '10'),
       ('user 7 round 1 caption', '7', '11'),
       ('user 8 round 1 caption', '8', '11'),
       ('user 1 round 2 caption', '1', '12'),
       ('user 3 round 2 caption', '3', '12'),
       ('user 5 round 2 caption', '5', '13'),
       ('user 7 round 2 caption', '7', '13'),
       ('user 1 round 3 caption', '1', '14'),
       ('user 7 round 3 caption', '7', '14'),
       ('user 1 round 1 caption', '1', '15'),
       ('user 2 round 1 caption', '2', '15'),
       ('user 3 round 1 caption', '3', '16'),
       ('user 4 round 1 caption', '4', '16'),
       ('user 5 round 1 caption', '5', '17'),
       ('user 6 round 1 caption', '6', '17'),
       ('user 7 round 1 caption', '7', '18'),
       ('user 8 round 1 caption', '8', '18'),
       ('user 1 round 2 caption', '1', '19'),
       ('user 3 round 2 caption', '3', '19'),
       ('user 5 round 2 caption', '5', '20'),
       ('user 7 round 2 caption', '7', '20'),
       ('user 1 round 3 caption', '1', '21'),
       ('user 7 round 3 caption', '7', '21');

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


