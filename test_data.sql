
-- password
INSERT INTO users(username, password, role) VALUES ('admin', '$argon2id$v=19$m=65536,t=3,p=4$0toyJJQ6Xdv5rUQq1cCoCQ$hYs/2qQrQDy4gld9v4fy0kiQnBzpAu/FWyJgyTq3Ito', 'admin');

-- abc
INSERT INTO users(username, password, role) VALUES ('applesauce', '$argon2id$v=19$m=65536,t=3,p=4$aet/Up/t2f9Bu8teKj5SZA$KTYJ35q136nHVyphnqR3Zs9an5gS0hn1inw5YUoi8TU', 'user');

-- fiddlesticks
INSERT INTO users(username, password, role) VALUES ('bananabread', '$argon2id$v=19$m=65536,t=3,p=4$KwUDBdwmyFhYtFmdiUI+Nw$aVYp48DsGXYrBYMELdUbj4iO89eS8BwOhK9OPhYHQOE', 'user');

-- correcthorsebatterystaple
INSERT INTO users(username, password, role) VALUES ('coconutcake', '$argon2id$v=19$m=65536,t=3,p=4$A2+TzjOmpPShDeSaGiBjEg$zf1NFDQYKZWHXhge/f9ZhjrmmnzQ8v8q4UWHXX75SMI', 'admin');


INSERT INTO authors(user_id, name, bio) VALUES 
    (1, 'J.K. Rowling', 'Joanne Rowling is a British author, philanthropist, film producer, television producer, and screenwriter. She is best known for writing the Harry Potter fantasy series, which has won multiple awards and sold more than 500 million copies, becoming the best-selling book series in history'),
    (2, 'Stephenie Meyer', 'Stephenie Meyer is an American novelist and film producer, best known for her vampire romance series Twilight.'),
    (3, 'George R.R. Martin', 'George Raymond Richard Martin, also known as GRRM, is an American novelist and short story writer in the fantasy, horror, and science fiction genres, screenwriter, and television producer. He is best known for his series of epic fantasy novels, A Song of Ice and Fire, which was adapted into the HBO series Game of Thrones (2011–2019).');

INSERT INTO books(author_id, title, pub_year, genre) VALUES 
    (1, 'Harry Potter and the Philosopher Stone', '1997', 'Fantasy'),
    (1, 'Harry Potter and the Chamber of Secrets', '1998', 'Fantasy'),
    (1, 'Harry Potter and the Prisoner of Azkaban', '1999', 'Fantasy'),
    (2, 'Twilight', '2005', 'Fantasy, Romance'),
    (2, 'New Moon', '2006', 'Fantasy, Romance'),
    (2, 'Eclipse', '2007', 'Fantasy, Romance'),
    (3, 'A Game of Thrones', '1996', 'Fantasy'),
    (3, 'A Clash of Kings', '1998', 'Fantasy'),
    (3, 'A Storm of Swords', '2000', 'Fantasy');
