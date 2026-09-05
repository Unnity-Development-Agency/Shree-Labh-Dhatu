import test from "node:test";
import assert from "node:assert/strict";
import { approachAngle, frameDelta, wrapAngle } from "../src/components/home/heroMotion.mjs";

test("a suspended tab or reversed timestamp cannot create a large animation step", () => {
  assert.equal(frameDelta(90000, null), 0);
  assert.equal(frameDelta(90000, 1000), 1 / 30);
  assert.equal(frameDelta(900, 1000), 0);
  assert.ok(Math.abs(approachAngle(0, 2, frameDelta(90000, 1000))) <= 0.85 / 30);
});

test("reset after multiple full turns takes the short path without spinning", () => {
  const target = -0.58;
  let angle = target + 20 * Math.PI + 0.2;
  let totalTravel = 0;
  for (let frame = 0; frame < 240; frame++) {
    const next = approachAngle(angle, target, 1 / 60);
    totalTravel += Math.abs(wrapAngle(next - angle));
    angle = next;
  }
  assert.ok(totalTravel <= 0.201);
  assert.ok(Math.abs(wrapAngle(angle - target)) < 0.001);
});

test("crossing the angle boundary does not turn almost a full revolution", () => {
  const start = Math.PI - 0.01;
  const next = approachAngle(start, -Math.PI + 0.01, 1 / 60);
  assert.ok(wrapAngle(next - start) > 0);
  assert.ok(wrapAngle(next - start) < 0.02);
});

test("large alternating drag targets stay within the angular speed limit", () => {
  let angle = -0.58;
  for (let frame = 0; frame < 500; frame++) {
    const target = wrapAngle(frame * 127 * (frame % 2 ? 1 : -1));
    const next = approachAngle(angle, target, 1 / 60);
    assert.ok(Math.abs(wrapAngle(next - angle)) <= 0.85 / 60 + 1e-12);
    assert.ok(next >= -Math.PI && next < Math.PI);
    angle = next;
  }
});

test("60 Hz and 144 Hz displays settle to the same orientation", () => {
  const simulate = fps => {
    let angle = -0.58;
    for (let frame = 0; frame < fps * 3; frame++) angle = approachAngle(angle, 0.42, 1 / fps);
    return angle;
  };
  assert.ok(Math.abs(simulate(60) - simulate(144)) < 0.001);
});
