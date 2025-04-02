#! /usr/bin/env node
const { Client } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const posts = [
  {
    id: 1,
    content:
      "Life is too short to wait! Spontaneously booked a trip to Bali, and I could not be more excited. Any must-visit spots? Drop your recommendations below! #Wanderlust",
    post_date: new Date(),
  },
  {
    id: 2,
    content:
      "Finally hit my fitness goal after months of hard work!  No shortcuts, no excuses—just pure dedication. If I can do it, so can you! #FitnessJourney #StayMotivated",
    post_date: new Date(),
  },
  {
    id: 3,
    content:
      "Some days are coffee, books, and solitude. Today is one of those days.  Who else loves a quiet evening with a good read? #BookwormLife #IntrovertVibes",
    post_date: new Date(),
  },
  {
    id: 4,
    content:
      "Just restored my dads old Mustang, and it is looking brand new! Cannot wait to take it out for a drive this weekend. Any classic car lovers out here? #RestorationProject",
    post_date: new Date(),
  },
  {
    id: 5,
    content:
      "Cooking up something special tonight! Trying a new pasta recipe—wish me luck.  Drop your favorite recipes below! #HomeCooking #FoodLover",
    post_date: new Date(),
  },
  {
    id: 6,
    content:
      "Tech geeks, unite! Just got my hands on the latest gadget, and I am beyond impressed. Cannot wait to test all its features! Who else is excited? #TechLife #GadgetLover",
    post_date: new Date(),
  },
  {
    id: 7,
    content:
      "Spent the night stargazing, and it was absolutely breathtaking. The universe is a masterpiece. What is the most beautiful sky you have ever seen? #NightSky #NatureLover",
    post_date: new Date(),
  },
  {
    id: 8,
    content:
      "Surfed the biggest wave of my life today!  There is nothing quite like the thrill of the ocean. Who else loves the sea? #SurferLife #OceanVibes",
    post_date: new Date(),
  },
  {
    id: 9,
    content:
      "Finally started painting again, and I feel so refreshed!  Creativity is the best therapy. What hobbies bring you peace? #ArtTherapy #CreativeSoul",
    post_date: new Date(),
  },
  {
    id: 10,
    content:
      "Hiking through the mountains today reminded me how small we are in this vast world. Nature is humbling and powerful. #HikingAdventures #NatureLover",
    post_date: new Date(),
  },
];

const users = [
  {
    firstName: "Emily",
    lastName: "Carter",
    email: "emilycarter92@email.com",
    password: process.env.ENCRYPTED_PWD1,
    member: true,
    admin: false,
  },
  {
    firstName: "Daniel",
    lastName: "Rodriguez",
    email: "daniel.rdz88@mail.net",
    password: process.env.ENCRYPTED_PWD2,
    member: true,
    admin: false,
  },
  {
    firstName: "Sarah",
    lastName: "Thompson",
    email: "sarah.t92@inbox.org",
    password: process.env.ENCRYPTED_PWD2,
    member: true,
    admin: false,
  },
  {
    firstName: "Jason",
    lastName: "Miller",
    email: "jmiller47@webmail.com",
    password: process.env.ENCRYPTED_PWD3,
    member: true,
    admin: false,
  },
  {
    firstName: "Olivia",
    lastName: "Garcia",
    email: "oliviag.arc10@fastmail.net",
    password: process.env.ENCRYPTED_PWD4,
    member: true,
    admin: false,
  },
  {
    firstName: "Michael",
    lastName: "Brown",
    email: "mikebrown23@live.com",
    password: process.env.ENCRYPTED_PWD5,
    member: true,
    admin: false,
  },
  {
    firstName: "Jessica",
    lastName: "Lee",
    email: "jesslee_99@outlook.com",
    password: process.env.ENCRYPTED_PWD6,
    member: true,
    admin: false,
  },
  {
    firstName: "Christopher",
    lastName: "Walker",
    email: "chris.w89@mail.com",
    password: process.env.ENCRYPTED_PWD7,
    member: true,
    admin: false,
  },
  {
    firstName: "Ashley",
    lastName: "Johnson",
    email: "ashley.j21@gmail.com",
    password: process.env.ENCRYPTED_PWD8,
    member: true,
    admin: false,
  },
  {
    firstName: "Ryan",
    lastName: "Scott",
    email: "ryanscott77@zmail.com",
    $password: process.env.ENCRYPTED_PWD9,
    member: true,
    admin: false,
  },
  {
    firstName: "Taiga",
    lastName: "Saejima",
    email: "taigas@kamu.ro",
    password: process.env.ENCRYPTED_PWD10,
    member: true,
    admin: true,
  },
];

const SQL = `

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR (255),
    last_name VARCHAR (255),
    email VARCHAR (255),
    password VARCHAR (255),
    member boolean,
    admin boolean
);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    content VARCHAR (255),
    post_date DATE
);
`;
const insertString = `
INSERT INTO users (first_name, last_name, email, password, member, admin) 
VALUES 
('Emily', 'Carter', 'emilycarter92@email.com', $1, true, false),
('Daniel', 'Rodriguez', 'daniel.rdz88@mail.net', $2, true, false),
('Sarah', 'Thompson', 'sarah.t92@inbox.org', $3, true, false),
('Jason', 'Miller', 'jmiller47@webmail.com', $4, true, false),
('Olivia', 'Garcia', 'oliviag.arc10@fastmail.net', $5, true, false),
('Michael', 'Brown', 'mikebrown23@live.com', $6, true, false),
('Jessica', 'Lee', 'jesslee_99@outlook.com', $7, true, false),
('Christopher', 'Walker', 'chris.w89@mail.com', $8, true, false),
('Ashley', 'Johnson', 'ashley.j21@gmail.com', $9, true, false),
('Ryan', 'Scott', 'ryanscott77@zmail.com', $10, true, false),
('Taiga', 'Saejima', 'taigas@kamu.ro', $11, true, true );

INSERT INTO posts (user_id, content, post_date) 
VALUES 
`;

async function main() {
  console.log("seeding...");
  try {
    const client = new Client({
      connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    });
    await client.connect();
    await client.query(SQL);
    for await (const user of users) {
      await client.query(
        "INSERT INTO users (first_name, last_name, email, password, member, admin) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          user.firstName,
          user.lastName,
          user.email,
          user.password,
          user.member,
          user.admin,
        ]
      );
    }
    for await (const post of posts) {
      await client.query(
        "INSERT INTO posts (user_id, content, post_date) VALUES  ($1, $2, $3)",
        [post.id, post.content, post.post_date]
      );
    }
    await client.end();
    console.log("done");
  } catch (err) {
    console.error(err);
  }
}

main();
