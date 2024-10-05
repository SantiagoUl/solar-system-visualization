// Mutual Attract// The Nature of Code

let movers = [];
let sun;
let qtree;
let G = 0.35;

function setup() {
  createCanvas(1800, 950);

  for (let i = 0; i < 100; i++) {
    let pos = p5.Vector.random2D();
    let vel = pos.copy();
    vel.setMag(random(10, 20));
    pos.setMag(random(300, 400));
    vel.rotate(PI / 2);
    let m = random(5, 25);
    movers[i] = new Mover(pos.x, pos.y, vel.x, vel.y, m);
  }
  sun = new Mover(0, 0, 0, 0, 500);
  background(0);
}

function draw() {
//   sun = new Mover(mouseX, mouseY, 0, 0, 500);
//   console.log(mouseX, mouseY)
  clear();
  background(0);
  blendMode(ADD);
  let boundary = new Rectangle(0, 0, width, height);
  qtree = QuadTree.create(boundary, 8);

  // Display and move all Things
  for (let m of movers) {
    let point = new Point(m.pos.x, m.pos.y, m);
    qtree.insert(point);
  }

  for (let mover of movers) {
    attract(mover, qtree);
    sun.attract(mover);
  }

  push();
  translate(width / 2, height / 2);

  for (let mover of movers) {
    mover.update();
    mover.show();
  }

  show(qtree);
  pop();
//   sun.show();
}

function attract(m, qtree) {
  let d = dist(m.pos.x, m.pos.y, qtree.boundary.x, qtree.boundary.y);
  if (d < 25) {
    if (qtree.points) {
      for (let p of qtree.points) {
        if (m != p.userData) {
          p.userData.attract(m);
        }
      }
    }
  } else {
    if (qtree.points) {
      let temp = new Mover(
        qtree.boundary.x,
        qtree.boundary.y,
        0,
        0,
        m.mass * qtree.points.length
      );
      temp.attract(m);
    }
  }

  if (qtree.divided) {
    attract(m, qtree.northeast);
    attract(m, qtree.northwest);
    attract(m, qtree.southeast);
    attract(m, qtree.southwest);
  }
}

function show(qtree) {
  stroke(255);
  noFill();
  strokeWeight(0.25);
  rectMode(CENTER);
  rect(
    qtree.boundary.x,
    qtree.boundary.y,
    qtree.boundary.w,
    qtree.boundary.h
  );

  if (qtree.divided) {
    show(qtree.northeast);
    show(qtree.northwest);
    show(qtree.southeast);
    show(qtree.southwest);
  }
}
