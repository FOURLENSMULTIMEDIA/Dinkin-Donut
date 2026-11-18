// Soft Hands Academy lessons. Server-side only: the full lessons are sent to members, the public gets a preview.
// Units are feet. Net at x = 0 (34 in at the centre, 36 in at the posts), kitchen lines at x = ±7, baselines at ±22.
// Caption words wrapped in *stars* are highlighted. Players: x position, dir (1 faces right), from/to pose names.
const SIDE = { x: 0, y: 3.6, z: 1.0 }, WIDE = { x: 0, y: 4.2, z: 0.64 }, NEAR = { x: -6, y: 3.2, z: 0.95 }, CLOSE = { x: -8.2, y: 3.2, z: 2.1 }, NET = { x: 0, y: 2.4, z: 1.3 };
const opp = (pose = "ready", x = 8.5) => ({ x, dir: -1, from: pose, dim: true });

const LESSONS = [
  {
    id: "dink", title: "The Dink: push, don't flick", level: "Foundation", mins: 2,
    summary: "Why great dinks come from the shoulder, where the apex belongs, and how to make the ball drop into the kitchen.",
    keys: ["Lift from the shoulder; keep the wrist quiet.", "The paddle face stays set through contact: a push, not a flick.", "Apex on your side of the net, so the ball falls into their kitchen.", "Grip pressure around 3 out of 10."],
    drills: [["Shoulder-only dinks", "Hold your wrist with your other hand's fingers lightly on it. 50 dinks cross-court, no wrist movement."], ["Apex gate", "Place a towel 1 ft on your side of the net. Every dink must peak over the towel."], ["Kitchen landings", "10 in a row landing in the kitchen, then move the target closer to the net."]],
    mistakes: [["Flicking the wrist", "Face angle changes at contact, so height and depth are random."], ["Apex over their side", "The ball is still rising as it crosses: an easy attack for them."], ["Squeezing the grip", "Tension sends the ball long. Soft hands, around 3/10."]],
    quiz: [["Where should the apex of a dink be?", ["On your side of the net", "Right over the net", "On their side"], 0], ["What creates a consistent dink?", ["Flicking the wrist", "Lifting from the shoulder with a set paddle face", "Hitting harder"], 1], ["How tight should your grip be?", ["9 out of 10", "About 3 out of 10", "As loose as possible"], 1]],
    scenes: [
      { dur: 4, cam: CLOSE, cap: "Most missed dinks come from one habit: you're *flicking* the ball.", players: [{ x: -8.5, from: "flickBack", to: "flickThru" }], note: "X-ray illustration · side view" },
      { dur: 4.5, cam: CLOSE, cap: "When your wrist *flicks,* the paddle face turns at contact.", players: [{ x: -8.5, from: "flickBack", to: "flickThru", ghost: true }], callout: { kind: "flick", at: "paddle", label: "PADDLE FACE", pos: [0.72, 0.3] }, note: "Strokes: equal time steps" },
      { dur: 4.5, cam: SIDE, kitchen: "both", cap: "So the *apex* lands anywhere: too high, too long, or into the net.", players: [{ x: -8.5, from: "flickBack", to: "flickThru", t0: 0, t1: 0.3 }, opp()], ball: { from: [-7.6, 1.6], to: [9, 0], apex: 6.2, apexAt: 0.62, t0: 0.15, t1: 0.95, showApex: true, bounce: true }, note: "Arc heights illustrative" },
      { dur: 4.5, cam: CLOSE, cap: "Now *push* it instead.", players: [{ x: -8.5, from: "dinkBack", to: "dinkThru", ghost: true }], callout: { kind: "push", at: "paddle", label: "SET FACE · PUSH", pos: [0.72, 0.3] } },
      { dur: 4.5, cam: CLOSE, cap: "Keep the wrist quiet and lift from your *shoulder,* so your arm and paddle move as one.", players: [{ x: -8.5, from: "dinkBack", to: "dinkThru" }], callout: { kind: "grip", value: 3, at: "wrist", label: "GRIP PRESSURE", pos: [0.74, 0.28] } },
      { dur: 5, cam: SIDE, kitchen: "both", cap: "You're at the kitchen line. The net is lowest in the *middle.*", hud: [["KITCHEN LINE → NET", 7, "FT"], ["NET, POSTS", 36, "IN"], ["NET, MIDDLE", 34, "IN"]], players: [{ x: -7.6, from: "ready" }, opp("ready", 7.6)], note: "USA Pickleball rulebook: 2.B, 2.C" },
      { dur: 5.5, cam: SIDE, kitchen: "right", cap: "Push so the arc peaks over your *own* side.", players: [{ x: -7.6, from: "dinkBack", to: "dinkThru", t0: 0, t1: 0.3 }, opp("ready", 7.6)], ball: { from: [-6.7, 1.3], to: [4.6, 0], apex: 3.9, apexAt: 0.4, t0: 0.18, t1: 0.95, showApex: true, bounce: true }, note: "Arc heights illustrative" },
      { dur: 5, cam: NET, kitchen: "right", cap: "It *drops* into their kitchen, below the net tape.", players: [opp("ready", 7.6)], ball: { from: [-4, 3.6], to: [4.6, 0], apex: 3.9, apexAt: 0.2, t0: 0, t1: 0.9, bounce: true }, callout: { kind: "height", at: [0.6, 2.8], label: "BALL VS NET TAPE", pos: [0.78, 0.25] } },
      { dur: 5, cam: SIDE, kitchen: "both", cap: "So they can't attack. They have to dink *up,* and you keep control.", players: [{ x: -7.6, from: "ready" }, { x: 7.6, dir: -1, from: "dinkBack", to: "dinkThru", dim: true, t0: 0, t1: 0.3 }], ball: { from: [6.8, 0.6], to: [-4.6, 0], apex: 3.4, apexAt: 0.45, t0: 0.2, t1: 0.95, bounce: true } },
      { dur: 4.5, cam: SIDE, kitchen: "both", cap: "A good dink is a *push,* and it peaks on your side of the net. *Soft* *hands.*", players: [{ x: -7.6, from: "dinkBack", to: "dinkThru", t0: 0, t1: 0.3 }, opp("ready", 7.6)], ball: { from: [-6.7, 1.3], to: [4.6, 0], apex: 3.9, apexAt: 0.4, t0: 0.18, t1: 0.95, showApex: true, bounce: true } },
    ],
  },
  {
    id: "drop", title: "The Third-Shot Drop", level: "Intermediate", mins: 2,
    summary: "The shot that gets your team from the baseline to the kitchen. Arc, apex and why it must land soft.",
    keys: ["After the return, your team is back at the baseline; the drop buys time to move up.", "Lift from the shoulder with an open face; long, slow swing.", "Apex on your side, then the ball falls into their kitchen.", "Follow your drop in: split-step every time they hit."],
    drills: [["Drop and step", "Partner feeds deep. Drop, take 2–3 steps in, split-step. Repeat 20 times."], ["Kitchen target", "Mark the opponent's kitchen. Score 1 point per drop that lands inside; play to 15."], ["Transition ladder", "Drop from the baseline, then from mid-court, then a dink at the line. Three in a row to advance."]],
    mistakes: [["Hitting it like a drive", "Too much pace: it pops up and gets attacked."], ["Not moving in", "A great drop is wasted if you stay at the baseline."], ["Apex over the net", "The ball is still rising on their side: attackable."]],
    quiz: [["Why hit a third-shot drop?", ["To win the point right away", "To give your team time to reach the kitchen", "Because volleys are not allowed"], 1], ["Where is the apex of a good drop?", ["On your side of the net", "Over their kitchen", "At the baseline"], 0], ["What do you do right after the drop?", ["Stay at the baseline", "Move in and split-step", "Run to the net and stop"], 1]],
    scenes: [
      { dur: 4.5, cam: SIDE, kitchen: "both", cap: "After the serve and return, the *serving* team is still back at the baseline.", players: [{ x: -20, from: "ready" }, opp("ready", 7.6)], note: "Court to scale" },
      { dur: 5, cam: SIDE, kitchen: "both", cap: "Drive it, and they *volley* it straight back at your feet.", players: [{ x: -20, from: "attackBack", to: "attackThru", t0: 0, t1: 0.25 }, { x: 7.6, dir: -1, from: "block", dim: true }], ball: { from: [-19, 3], to: [7, 4.2], apex: 4.8, apexAt: 0.5, t0: 0.12, t1: 0.55 } },
      { dur: 5, cam: { x: -12, y: 3, z: 0.9 }, cap: "Instead, lift from the *shoulder,* with an open paddle face.", players: [{ x: -20, from: "dropBack", to: "dropThru", ghost: true }], callout: { kind: "push", at: "paddle", label: "OPEN FACE · LIFT", pos: [0.72, 0.28] } },
      { dur: 6, cam: SIDE, kitchen: "right", cap: "The arc *peaks* on your side, then falls into their kitchen.", players: [{ x: -20, from: "dropBack", to: "dropThru", t0: 0, t1: 0.2 }, opp("ready", 7.6)], ball: { from: [-19.2, 1.6], to: [4.2, 0], apex: 8.5, apexAt: 0.62, t0: 0.12, t1: 0.95, showApex: true, bounce: true }, note: "Arc heights illustrative" },
      { dur: 5, cam: SIDE, kitchen: "both", cap: "While it floats, *move* in. Split-step when they hit.", players: [{ x: -11, from: "ready" }, { x: 7.6, dir: -1, from: "dinkBack", to: "dinkThru", dim: true, t0: 0.4, t1: 0.7 }] },
      { dur: 4.5, cam: SIDE, kitchen: "both", cap: "Now you're at the kitchen line too. The *dinking* game starts even.", players: [{ x: -7.6, from: "ready" }, opp("ready", 7.6)], hud: [["BASELINE → KITCHEN", 15, "FT"], ["TIME TO MOVE UP", 2, "SEC"]] },
    ],
  },
  {
    id: "ready", title: "Ready Position & Paddle Up", level: "Foundation", mins: 1,
    summary: "The stance that makes everything else faster: knees, weight, paddle height and the split-step.",
    keys: ["Feet shoulder-width, knees bent, weight on the balls of your feet.", "Paddle up in front of your chest, not hanging by your knees.", "Split-step as your opponent hits.", "Reset to ready after every shot."],
    drills: [["Paddle-up freeze", "Partner calls 'freeze' at random. Your paddle should be up and in front every time."], ["Split-step timing", "Hop as your partner's paddle meets the ball, 30 reps."], ["Wall volleys", "50 volleys against a wall, returning to ready between each."]],
    mistakes: [["Paddle down", "Every fast ball arrives before you're ready."], ["Standing tall", "Straight legs mean slow first steps."], ["Flat-footed", "No split-step, no push-off."]],
    quiz: [["Where should your paddle be when waiting?", ["Down by your knees", "Up in front of your chest", "Behind your back"], 1], ["When do you split-step?", ["After you hit", "As your opponent hits", "Never"], 1]],
    scenes: [
      { dur: 4, cam: NEAR, cap: "Most players wait with the paddle *down.*", players: [{ x: -8, from: "stand" }] },
      { dur: 4.5, cam: NEAR, cap: "Bend the *knees,* weight forward on the balls of your feet.", players: [{ x: -8, from: "stand", to: "ready", ghost: true }] },
      { dur: 4.5, cam: NEAR, cap: "Paddle *up,* in front of your chest. Every ball is now closer.", players: [{ x: -8, from: "ready" }], callout: { kind: "grip", value: 4, at: "wrist", label: "RELAXED GRIP", pos: [0.74, 0.28] } },
      { dur: 4.5, cam: SIDE, kitchen: "both", cap: "As they hit, *split-step,* then move.", players: [{ x: -7.6, from: "stand", to: "ready" }, { x: 7.6, dir: -1, from: "attackBack", to: "attackThru", dim: true }] },
    ],
  },
  {
    id: "kitchen", title: "The Kitchen (Non-Volley Zone)", level: "Foundation", mins: 2,
    summary: "The 7 ft rule everyone breaks: what counts as a volley, the line, and momentum.",
    keys: ["The kitchen is 7 ft from the net, both sides. The line is part of the kitchen.", "You can't volley while touching the kitchen or its line.", "If your momentum carries you into the kitchen after a volley, it's a fault.", "You can enter the kitchen any time to play a ball that bounced."],
    drills: [["Toes behind the line", "Volley 20 balls with toes just behind the line. Partner calls any touch."], ["Bounce and back", "Step in to dink a bounced ball, then recover behind the line before the next shot."]],
    mistakes: [["Toes on the line while volleying", "The line counts as the kitchen. Fault."], ["Falling forward after a volley", "Momentum into the kitchen is still a fault, even after the ball is dead."]],
    quiz: [["Is the kitchen line part of the kitchen?", ["Yes", "No"], 0], ["Can you step into the kitchen to hit a ball that bounced?", ["Yes", "No, never"], 0], ["Your volley wins, then you stumble into the kitchen. Result?", ["Your point stands", "It's a fault"], 1]],
    scenes: [
      { dur: 4.5, cam: SIDE, kitchen: "both", cap: "The kitchen is *7 feet* from the net, on both sides.", hud: [["KITCHEN DEPTH", 7, "FT"], ["COURT WIDTH", 20, "FT"]], players: [{ x: -8, from: "ready" }, opp("ready", 8)] },
      { dur: 4.5, cam: { x: -6.6, y: 2, z: 2.4 }, cap: "The *line* is part of the kitchen.", players: [{ x: -7.6, from: "ready" }], callout: { kind: "toes", at: [-7, 0.1], label: "LINE = KITCHEN", pos: [0.74, 0.3] } },
      { dur: 5, cam: SIDE, kitchen: "left", cap: "You can't *volley* while touching it. Hit the ball out of the air in there: fault.", players: [{ x: -6.2, from: "block", to: "attackThru" }, opp("attackThru", 8)], ball: { from: [7, 3.5], to: [-5.6, 3.2], apex: 4, apexAt: 0.4, t0: 0, t1: 0.6 } },
      { dur: 4.5, cam: SIDE, kitchen: "left", cap: "Let it *bounce,* and you can step in to play it.", players: [{ x: -5, from: "dinkBack", to: "dinkThru", t0: 0.5, t1: 0.8 }, opp("ready", 7.6)], ball: { from: [6.8, 1], to: [-4.2, 0], apex: 3.4, apexAt: 0.4, t0: 0, t1: 0.55, bounce: true } },
      { dur: 4.5, cam: SIDE, kitchen: "both", cap: "Then get *back* behind the line before the next volley.", players: [{ x: -8, from: "ready" }, opp("ready", 7.6)] },
    ],
  },
  {
    id: "serve", title: "The Serve", level: "Foundation", mins: 2,
    summary: "A legal, reliable serve that goes deep: underhand, contact below the waist, diagonal and past the kitchen.",
    keys: ["Underhand: the paddle moves in an upward arc.", "Contact below your waist (navel).", "Serve diagonally, past the kitchen line: a serve landing on the kitchen line is a fault.", "Aim deep. A deep serve keeps the returner back."],
    drills: [["Deep targets", "Put a towel 3 ft from the baseline. 20 serves; count how many land beyond it."], ["Same motion", "10 serves with your eyes closed after the toss to groove a repeatable swing."]],
    mistakes: [["Contact above the waist", "Illegal serve."], ["Serving short", "A short serve lets the returner attack and move in."], ["Trying to ace every serve", "Missed serves give away points; depth beats power."]],
    quiz: [["Where must you contact the ball on a volley serve?", ["Below the waist", "At shoulder height", "Anywhere"], 0], ["Your serve lands on the kitchen line. Result?", ["Good serve", "Fault"], 1], ["Which is better: deep and steady, or hard and risky?", ["Deep and steady", "Hard and risky"], 0]],
    scenes: [
      { dur: 4.5, cam: { x: -19, y: 3.2, z: 1.15 }, cap: "The serve is *underhand,* with contact below your waist.", players: [{ x: -22.5, from: "serveBack", to: "serveThru", ghost: true }], note: "USA Pickleball rulebook: 4.A" },
      { dur: 5.5, cam: SIDE, kitchen: "right", cap: "It travels *diagonally* and must clear the kitchen, line included.", players: [{ x: -22.5, from: "serveBack", to: "serveThru", t0: 0, t1: 0.25 }, opp("ready", 21)], ball: { from: [-21.8, 1.9], to: [17.5, 0], apex: 9, apexAt: 0.48, t0: 0.15, t1: 0.95, bounce: true } },
      { dur: 4.5, cam: SIDE, cap: "Aim *deep.* A deep serve keeps them back at the baseline.", players: [{ x: -22.5, from: "serveThru" }, opp("ready", 21)], hud: [["BASELINE → BASELINE", 44, "FT"], ["TARGET: LAST", 5, "FT"]] },
    ],
  },
  {
    id: "twobounce", title: "Two-Bounce Rule & Return Deep", level: "Foundation", mins: 2,
    summary: "Why the serve and the return must both bounce, and how a deep return wins you the kitchen.",
    keys: ["The return of serve must bounce: no volleying the serve.", "The serving team must let the return bounce too.", "After two bounces, volleys are allowed.", "Return deep, then run to the kitchen."],
    drills: [["Deep returns", "Partner serves; every return must land in the back third. 20 reps."], ["Return and run", "Return, then sprint to the kitchen line and split-step before the third shot."]],
    mistakes: [["Volleying the return", "Fault: the two-bounce rule."], ["Short return", "Lets the servers move in early."], ["Staying back after returning", "You give up the kitchen line."]],
    quiz: [["Can the serving team volley the return?", ["Yes", "No, it must bounce"], 1], ["After returning, where should you go?", ["Stay at the baseline", "Move up to the kitchen line"], 1]],
    scenes: [
      { dur: 5, cam: SIDE, cap: "The serve must *bounce* before it's returned.", players: [{ x: -22, from: "serveBack", to: "serveThru", t0: 0, t1: 0.2 }, { x: 21, dir: -1, from: "ready" }], ball: { from: [-21.3, 1.9], to: [17, 0], apex: 9, apexAt: 0.5, t0: 0.1, t1: 0.9, bounce: true } },
      { dur: 5, cam: SIDE, cap: "And the return must *bounce* before the servers hit it.", players: [{ x: -21, from: "ready" }, { x: 21, dir: -1, from: "dropBack", to: "dropThru", t0: 0, t1: 0.2 }], ball: { from: [20.2, 1.6], to: [-17, 0], apex: 8, apexAt: 0.5, t0: 0.1, t1: 0.9, bounce: true } },
      { dur: 4.5, cam: SIDE, kitchen: "right", cap: "Return *deep,* then run to the kitchen line while it travels.", players: [{ x: -20, from: "ready" }, { x: 8, dir: -1, from: "ready" }], hud: [["BOUNCES BEFORE VOLLEYS", 2, ""], ["YOUR RUN TO KITCHEN", 15, "FT"]] },
    ],
  },
  {
    id: "reset", title: "The Reset: Soft Hands", level: "Advanced", mins: 2,
    summary: "Turn a hard drive into a soft ball in their kitchen. Grip, paddle angle and absorbing pace.",
    keys: ["Loosen the grip as the ball arrives (2–3/10).", "Short or no backswing: block, don't swing.", "Slightly open face, paddle out in front.", "Absorb the pace so the ball dies into the kitchen."],
    drills: [["Drive and reset", "Partner drives from mid-court; you reset into the kitchen. 30 reps."], ["Catch the ball", "Let a hard feed hit your paddle and stop near you. Feel the absorb."]],
    mistakes: [["Swinging back", "Adds pace: the ball pops up."], ["Tight grip", "The ball rebounds hard off the face."], ["Face too open", "Floats high and gets put away."]],
    quiz: [["What do you do with your grip on a reset?", ["Squeeze hard", "Loosen it", "Change grips"], 1], ["How big is the backswing?", ["Big", "Short or none"], 1]],
    scenes: [
      { dur: 4.5, cam: SIDE, kitchen: "both", cap: "They *drive* the ball hard at you.", players: [{ x: -10, from: "ready", to: "block" }, { x: 8, dir: -1, from: "attackBack", to: "attackThru", dim: true, t0: 0, t1: 0.2 }], ball: { from: [7.4, 3.6], to: [-9, 2.4], apex: 4, apexAt: 0.3, t0: 0.15, t1: 0.7 } },
      { dur: 4.5, cam: CLOSE, cap: "Loosen your grip and *block.* No backswing.", players: [{ x: -9.5, from: "block" }], callout: { kind: "grip", value: 2, at: "wrist", label: "ABSORB", pos: [0.74, 0.28] } },
      { dur: 5, cam: SIDE, kitchen: "right", cap: "The pace *dies* on your paddle, and the ball drops into their kitchen.", players: [{ x: -10, from: "block" }, opp("ready", 8)], ball: { from: [-9.2, 2.4], to: [4.2, 0], apex: 3.7, apexAt: 0.45, t0: 0.1, t1: 0.9, showApex: true, bounce: true } },
      { dur: 4, cam: SIDE, kitchen: "both", cap: "That's *soft* *hands.* Sweet game.", players: [{ x: -8, from: "ready" }, opp("ready", 7.6)] },
    ],
  },
  {
    id: "speedup", title: "Speed-Ups: When to Attack", level: "Advanced", mins: 2,
    summary: "Attack balls above the net, not below. Target the right spot and recover to ready.",
    keys: ["Attack balls you can contact above net height.", "A ball below the net must go up: dink or reset it.", "Aim at the opponent's dominant hip or shoulder.", "Recover to paddle-up immediately."],
    drills: [["Above or below", "Partner feeds dinks at random heights. Attack only the high ones; dink the rest."], ["Counter battle", "From the kitchen line, speed-up and counter for 20 exchanges, resetting to ready each time."]],
    mistakes: [["Attacking low balls", "You hit up into their paddles: easy counter."], ["Big swing", "Slow recovery; you lose the counter battle."]],
    quiz: [["When should you speed up a dink?", ["When it's above net height", "Any time", "When it's at your feet"], 0], ["Where do you aim?", ["Their dominant hip or shoulder", "The middle of the net"], 0]],
    scenes: [
      { dur: 4.5, cam: SIDE, kitchen: "both", cap: "Their dink sits *up,* above net height.", players: [{ x: -7.6, from: "ready" }, { x: 7.6, dir: -1, from: "dinkBack", to: "dinkThru", dim: true, t0: 0, t1: 0.3 }], ball: { from: [6.8, 1], to: [-6.4, 3.4], apex: 4.8, apexAt: 0.55, t0: 0.15, t1: 0.95 } },
      { dur: 4.5, cam: SIDE, kitchen: "both", cap: "That's your ball. *Attack* down at their hip.", players: [{ x: -7.6, from: "attackBack", to: "attackThru", t0: 0, t1: 0.25 }, opp("block", 7.6)], ball: { from: [-6.6, 3.6], to: [7.2, 2.2], apex: 3.7, apexAt: 0.1, t0: 0.15, t1: 0.6 } },
      { dur: 4.5, cam: SIDE, kitchen: "both", cap: "If it's *below* the net, don't attack. Dink or reset it.", players: [{ x: -7.6, from: "dinkBack", to: "dinkThru", t0: 0, t1: 0.3 }, opp("ready", 7.6)], ball: { from: [-6.7, 1.3], to: [4.6, 0], apex: 3.9, apexAt: 0.4, t0: 0.2, t1: 0.95, bounce: true } },
      { dur: 4, cam: SIDE, kitchen: "both", cap: "Then paddle *up.* The counter is coming.", players: [{ x: -7.6, from: "attackThru", to: "ready" }, opp("ready", 7.6)] },
    ],
  },
];

// Shots that involve the baseline use the wide camera automatically
LESSONS.forEach(l => l.scenes.forEach(sc => { if (sc.cam === SIDE && (sc.players || []).some(p => Math.abs(p.x) > 12)) sc.cam = WIDE; }));

const PREVIEW_SCENES = 4; // free preview of the first lesson

const meta = l => ({ id: l.id, title: l.title, level: l.level, mins: l.mins, summary: l.summary, scenes: l.scenes.length });
module.exports = { LESSONS, PREVIEW_SCENES, meta };
