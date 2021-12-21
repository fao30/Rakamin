const request = require("supertest");
const app = require("../app");
const { User, Room, Chat } = require("../models");
const appRequest = request(app);

beforeAll(async () => {
  await User.destroy({ truncate: true, restartIdentity: true, cascade: true });
  await Room.destroy({ truncate: true, restartIdentity: true, cascade: true });
  await Chat.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });

  let obj = {
    name: "test1",
    email: "t1@gmail.com",
    password: "t1",
  };
  await User.create(obj);

  let obj1 = {
    name: "test2",
    email: "t2@gmail.com",
    password: "t2",
  };
  await User.create(obj1);

  let obj2 = {
    id_room: 1,
    id_user: 1,
  };
  await Room.create(obj2);

  let obj3 = {
    id_room: 1,
    id_user: 2,
  };
  await Room.create(obj3);

  let obj4 = {
    message: "Halo apa kabar?",
    id_room: 1,
    id_user: 1,
  };
  await Chat.create(obj4);

  let obj5 = {
    message: "Baik kok",
    id_room: 1,
    id_user: 2,
  };
  await Chat.create(obj5);
});

test("Register account - success", (done) => {
  let obj = {
    name: "test3",
    email: "t3@gmail.com",
    password: "t3",
  };
  appRequest
    .post("/register")
    .expect(201)
    .send(obj)
    .then((resp) => {
      expect(resp.body.email).toEqual(obj.email);
      done();
    })
    .catch((err) => {
      done(err);
    });
});

test("Register account - failed, email is not unique", (done) => {
  let obj = {
    name: "test3",
    email: "t3@gmail.com",
    password: "t3",
  };
  appRequest
    .post("/register")
    .expect(400)
    .send(obj)
    .then((resp) => {
      expect(resp.statusCode).toEqual(400);
      done();
    })
    .catch((err) => {
      done(err);
    });
});

let access_token = "";

test("Login account - Success", (done) => {
  let obj = {
    email: "t3@gmail.com",
    password: "t3",
  };
  appRequest
    .post("/login")
    .expect(200)
    .send(obj)
    .then((resp) => {
      access_token = resp.body.access_token;
      expect(resp.body.email).toEqual(obj.email);
      expect(resp.statusCode).toEqual(200);
      done();
    })
    .catch((err) => {
      done(err);
    });
});

test("Login account - failed, unauthorized account", (done) => {
  let obj = {
    email: "t3@gmail.com",
    password: "hehehehe",
  };
  appRequest
    .post("/login")
    .expect(401)
    .send(obj)
    .then((resp) => {
      expect(resp.body.message).toEqual("You dont have an access");
      expect(resp.statusCode).toEqual(401);
      done();
    })
    .catch((err) => {
      done(err);
    });
});

test("Get Rooms - Success withouth room", (done) => {
  appRequest
    .get("/getroom")
    .expect(200)
    .set({
      access_token,
    })
    .then((resp) => {
      expect(resp.body).toEqual("Start conversation!!!!! Make a room");
      expect(resp.statusCode).toEqual(200);
      done();
    })
    .catch((err) => {
      done(err);
    });
});

test("Create room - Success", (done) => {
  appRequest
    .post("/createroom/1")
    .expect(201)
    .set({
      access_token,
    })
    .then((resp) => {
      expect(resp.body).toEqual(
        "Room id number 2 has been created beetwen user 1 & 3"
      );
      expect(resp.statusCode).toEqual(201);
      done();
    })
    .catch((err) => {
      done(err);
    });
});

test("Create room - Error, room is available", (done) => {
  appRequest
    .post("/createroom/1")
    .expect(400)
    .set({
      access_token,
    })
    .then((resp) => {
      expect(resp.body.message).toEqual(
        "Room has been created with person with id 1"
      );
      expect(resp.statusCode).toEqual(400);
      done();
    })
    .catch((err) => {
      done(err);
    });
});

test("Get chat from room - Success", (done) => {
  appRequest
    .get("/getchat/1")
    .expect(200)
    .set({
      access_token,
    })
    .then((resp) => {
      expect(resp.body[0].message).toEqual("Baik kok");
      expect(resp.statusCode).toEqual(200);
      done();
    })
    .catch((err) => {
      done(err);
    });
});

test("Send chat - Success", (done) => {
  let obj = {
    message: "siap lapan enam",
  };
  appRequest
    .post("/sendchat/2")
    .expect(200)
    .set({
      access_token,
    })
    .send(obj)
    .then((resp) => {
      expect(resp.body[0].message).toEqual(obj.message);
      expect(resp.statusCode).toEqual(200);
      done();
    })
    .catch((err) => {
      done(err);
    });
});

test("Send chat - fail, forbidden access", (done) => {
  let obj = {
    message: "siap lapan enam",
  };
  appRequest
    .post("/sendchat/1")
    .expect(403)
    .set({
      access_token,
    })
    .send(obj)
    .then((resp) => {
      expect(resp.body.message).toEqual(
        "You are forrbiden to send message to room 1"
      );
      expect(resp.statusCode).toEqual(403);
      done();
    })
    .catch((err) => {
      done(err);
    });
});
