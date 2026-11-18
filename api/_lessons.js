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


// ---- lessons 9-14 ----
const MAP = (paths, dots, label, pos) => ({ kind: "map", paths, dots, label, pos: pos || [0.5, 0.1], t0: 0 });
LESSONS.push(
  {
    id: "scoring", title: "Calling the Score", level: "Foundation", mins: 2,
    summary: "Doubles scoring made simple: three numbers, side-out scoring and where the server stands.",
    keys: ["Doubles score has three numbers: serving team, receiving team, server (1 or 2).", "Only the serving team can score.", "A game starts at 0-0-2.", "Serving team's score even: the first server serves from the right side. Odd: from the left.", "Games are usually to 11, win by 2."],
    drills: [["Call it out", "Play a practice game where the server must call the full score before every serve."], ["Where do I stand?", "Partner calls a random score; you walk to the correct serving side in 3 seconds."]],
    mistakes: [["Calling only two numbers", "In doubles, the server number matters."], ["Wrong side", "Serving from the wrong side is a fault if caught before the next serve."], ["Receiving team 'scoring'", "Rally won by the receivers = side out or second server, never a point."]],
    quiz: [["What does 4-2-1 mean?", ["Serving team 4, receiving 2, first server", "Serving 2, receiving 4", "4 games to 2"], 0], ["Can the receiving team win a point?", ["Yes, every rally", "No, only the serving team scores"], 1], ["What score does a game start at?", ["0-0-1", "0-0-2", "0-0"], 1]],
    scenes: [
      { dur: 4.5, cam: SIDE, tag: "rule", cap: "In doubles, the score has *three* numbers.", hud: [["SERVING TEAM", 4, ""], ["RECEIVING TEAM", 2, ""], ["SERVER", 1, ""]], players: [{ x: -21, from: "stand", label: "SERVER" }, opp("ready", 21)] },
      { dur: 4.5, cam: SIDE, tag: "rule", cap: "Only the *serving* team scores. Win a rally while receiving, and you earn the serve.", players: [{ x: -21, from: "ready" }, opp("ready", 21)], hud: [["SERVING TEAM", 5, ""], ["RECEIVING TEAM", 2, ""], ["SERVER", 1, ""]] },
      { dur: 4.5, cam: SIDE, tag: "why", cap: "The game starts at 0-0-*2.* The first serving team gets only one server.", hud: [["SERVING TEAM", 0, ""], ["RECEIVING TEAM", 0, ""], ["SERVER", 2, ""]], players: [{ x: -21, from: "stand" }, opp("ready", 21)] },
      { dur: 5, cam: SIDE, tag: "rule", cap: "Your score *even?* The first server serves from the right. Odd: from the left.", players: [{ x: -21, from: "stand" }], callout: MAP([{ pts: [[-21, 5], [12, -5]], col: "#FF4D86", label: "SERVE", t0: 0.3, t1: 0.9 }], [{ at: [-21, 5], col: "#D7F03C", label: "EVEN" }, { at: [-21, -5], col: "rgba(236,240,246,.5)", label: "ODD" }], "WHERE THE FIRST SERVER STANDS") },
      { dur: 4, cam: SIDE, tag: "tip", cap: "Call the *whole* score before every serve. Loud and clear.", players: [{ x: -21, from: "serveBack" }, opp("ready", 21)] },
    ],
  },
  {
    id: "shadow", title: "Moving as a Team", level: "Intermediate", mins: 2,
    summary: "Shadow your partner: move together side to side and front to back, and own the middle.",
    keys: ["Stay about 10 ft apart, like you're tied with a rope.", "Move together toward the side the ball goes to.", "Move up together, move back together.", "The middle: the forehand usually takes it; call 'mine' early."],
    drills: [["Rope drill", "Hold a 10 ft rope with your partner and move to a coach's pointing. Keep it taut, never slack."], ["Middle calls", "Coach feeds down the middle; the forehand player calls and hits. 20 reps."]],
    mistakes: [["Gap down the middle", "Both players stay wide: easy winner through the middle."], ["One up, one back", "Diagonal gap: the opponents hit to the open angle."]],
    quiz: [["The ball goes to your partner's sideline. What do you do?", ["Stay where you are", "Shift toward it with your partner"], 1], ["Who usually takes a ball down the middle?", ["The forehand", "Whoever is taller", "Nobody"], 0]],
    scenes: [
      { dur: 5, cam: SIDE, tag: "dont", cap: "Two players standing still leave a *gap* in the middle.", players: [{ x: -8, from: "ready" }, opp("ready", 8)], callout: MAP([{ pts: [[7, 2], [-12, 0]], col: "#FF4D86", label: "WINNER", ball: true, t0: 0.3, t1: 0.9 }], [{ at: [-8, 7], label: "YOU" }, { at: [-8, -7], label: "PARTNER" }], "THE GAP") },
      { dur: 5.5, cam: SIDE, tag: "do", cap: "Shadow each other. The ball goes *wide,* you both shift.", players: [{ x: -8, from: "ready" }, opp("dinkThru", 8)], callout: MAP([{ pts: [[-8, 7], [-8, 8.5]], col: "#D7F03C", label: "YOU", t0: 0.2, t1: 0.7 }, { pts: [[-8, -3], [-8, 1.5]], col: "#D7F03C", label: "PARTNER", t0: 0.2, t1: 0.7 }, { pts: [[7, 3], [-6, 9]], col: "#FF4D86", ball: true, t0: 0, t1: 0.5 }], [], "SHIFT TOGETHER") },
      { dur: 5, cam: SIDE, tag: "do", cap: "Move *up* together and back together. About 10 feet apart.", players: [{ x: -8, from: "ready" }], hud: [["PARTNER SPACING", 10, "FT"]], callout: MAP([{ pts: [[-18, 5], [-8, 5]], col: "#D7F03C", t0: 0, t1: 0.7 }, { pts: [[-18, -5], [-8, -5]], col: "#D7F03C", t0: 0, t1: 0.7 }], [], "UP AS ONE", [0.5, 0.26]) },
      { dur: 4.5, cam: SIDE, tag: "tip", cap: "Ball down the middle? The *forehand* takes it. Call 'mine' early.", players: [{ x: -8, from: "attackBack", to: "attackThru" }, opp("block", 8)] },
    ],
  },
  {
    id: "backhand", title: "The Backhand Dink", level: "Intermediate", mins: 2,
    summary: "A calm, repeatable backhand dink: shoulder turn, set face, push from the shoulder.",
    keys: ["Turn your shoulders so your paddle starts across your body.", "Paddle face slightly open and set before contact.", "Push from the shoulder; the elbow leads, the wrist stays quiet.", "Contact out in front of your body."],
    drills: [["Backhand-only dinks", "Cross-court dinks hitting only backhands. 50 in a row into the kitchen."], ["Mirror check", "Shadow the swing in a mirror: no wrist flick, face stays set."]],
    mistakes: [["Running around the backhand", "You leave the middle open."], ["Contact too late", "The ball beside your hip goes wide."], ["Wrist flick", "Same problem as the forehand: random height."]],
    quiz: [["Where should backhand contact be?", ["Out in front", "Beside your hip", "Behind you"], 0], ["What leads the backhand dink?", ["The wrist", "The shoulder and elbow"], 1]],
    scenes: [
      { dur: 4.5, cam: CLOSE, tag: "do", cap: "Turn your *shoulders.* The paddle starts across your body.", players: [{ x: -8.5, from: "ready", to: "bhBack" }], joints: ["shoulder", "elbow"], focus: "shoulder" },
      { dur: 4.5, cam: CLOSE, tag: "do", cap: "Set the paddle face, slightly *open,* before contact.", players: [{ x: -8.5, from: "bhBack" }], callout: { kind: "push", at: "paddle", label: "SET FACE", pos: [0.74, 0.3] } },
      { dur: 4.5, cam: CLOSE, tag: "do", cap: "*Push* from the shoulder. The elbow leads, the wrist stays quiet.", players: [{ x: -8.5, from: "bhBack", to: "bhThru", ghost: true }], joints: ["elbow", "wrist"], focus: "elbow" },
      { dur: 5, cam: SIDE, kitchen: "right", tag: "why", cap: "Contact *in front,* and the ball floats low into their kitchen.", players: [{ x: -7.6, from: "bhBack", to: "bhThru", t0: 0, t1: 0.3 }, opp("ready", 7.6)], ball: { from: [-6.6, 1.3], to: [4.4, 0], apex: 3.8, apexAt: 0.4, t0: 0.2, t1: 0.95, showApex: true, bounce: true } },
    ],
  },
  {
    id: "lob", title: "The Lob & the Overhead", level: "Advanced", mins: 2,
    summary: "When a lob works, how high and how deep, and how to put away a lob that comes back at you.",
    keys: ["Lob when opponents are leaning in at the kitchen line.", "Get it high enough to clear their reach and land deep.", "A short lob is a gift: they smash it.", "Overhead: turn sideways, point at the ball, hit down and through."],
    drills: [["Deep lob target", "Towel 3 ft inside the baseline. 20 lobs from the kitchen line; count hits."], ["Point and smash", "Partner feeds lobs; point with your free hand, smash at their feet."]],
    mistakes: [["Lobbing a player who's back", "They have time to set up."], ["Short lobs", "Easy overhead for them."], ["Backpedalling square to the net", "You fall over. Turn and shuffle."]],
    quiz: [["Best time to lob?", ["When they lean in at the kitchen", "When they are at the baseline"], 0], ["On an overhead, what does your free hand do?", ["Points at the ball", "Stays in your pocket"], 0]],
    scenes: [
      { dur: 5, cam: SIDE, kitchen: "both", tag: "why", cap: "They're leaning *in* at the kitchen line.", players: [{ x: -7.6, from: "ready" }, opp("ready", 7.2)] },
      { dur: 6, cam: WIDE, tag: "do", cap: "Lift it *high* over their reach, and land it deep.", players: [{ x: -7.6, from: "dropBack", to: "dropThru", t0: 0, t1: 0.25 }, { x: 7.2, dir: -1, from: "ready", to: "overBack", dim: true }], ball: { from: [-6.8, 1.8], to: [19, 0], apex: 16, apexAt: 0.5, t0: 0.15, t1: 0.95, showApex: true, bounce: true } },
      { dur: 4.5, cam: NEAR, tag: "do", cap: "Lob coming at *you?* Turn sideways and point at the ball.", players: [{ x: -8, from: "ready", to: "overBack" }], joints: ["shoulder"] },
      { dur: 4.5, cam: SIDE, kitchen: "right", tag: "do", cap: "Then hit *down* and through, at their feet.", players: [{ x: -8, from: "overBack", to: "overThru", t0: 0, t1: 0.3 }, opp("ready", 8)], ball: { from: [-7, 7.6], to: [8.5, 0], apex: 7.7, apexAt: 0.05, t0: 0.2, t1: 0.6, bounce: true } },
    ],
  },
  {
    id: "erne", title: "The Erne", level: "Advanced", mins: 2,
    summary: "The legal way to volley right beside the net: go around the kitchen, not through it.",
    keys: ["An Erne is a volley hit from outside the sideline, beside the kitchen.", "You must not touch the kitchen or its line before, during or after the volley.", "Best against dinks that go down your sideline.", "Jump over the kitchen corner or step around it; land outside the kitchen."],
    drills: [["Footwork only", "Shadow the path: from the line, step outside the sideline, then volley. No ball, 20 reps."], ["Fed Ernes", "Partner dinks down the line; you Erne it. Start slow."]],
    mistakes: [["Landing in the kitchen", "Fault, even if the volley wins."], ["Telegraphing", "Moving too early lets them hit cross-court."]],
    quiz: [["Can you touch the kitchen during an Erne?", ["Yes, if you jump", "No, never"], 1], ["Where do you hit an Erne from?", ["Outside the sideline, beside the kitchen", "Inside the kitchen"], 0]],
    scenes: [
      { dur: 5, cam: SIDE, kitchen: "both", tag: "why", cap: "They keep dinking down *your* sideline.", players: [{ x: -7.6, from: "ready" }, { x: 7.6, dir: -1, from: "dinkBack", to: "dinkThru", dim: true }], callout: MAP([{ pts: [[6, 9], [-4, 9.5]], col: "#FF4D86", ball: true, label: "DINK", t0: 0.2, t1: 0.8 }], [{ at: [-8, 7], label: "YOU" }], "DOWN THE LINE") },
      { dur: 5.5, cam: SIDE, tag: "do", cap: "Step *around* the kitchen, outside the sideline. Never through it.", players: [{ x: -7.6, from: "ready" }], callout: MAP([{ pts: [[-8, 7], [-8, 11], [-1, 11]], col: "#D7F03C", label: "ERNE PATH", t0: 0.1, t1: 0.8 }], [], "AROUND, NOT THROUGH", [0.5, 0.12]) },
      { dur: 4.5, cam: SIDE, tag: "rule", cap: "Volley it from *outside* the court, right beside the net. Legal.", players: [{ x: -1.2, from: "block", to: "attackThru" }, opp("dinkThru", 7.6)], ball: { from: [6.8, 1], to: [-0.8, 3], apex: 3.5, apexAt: 0.6, t0: 0, t1: 0.5 } },
      { dur: 4, cam: SIDE, tag: "dont", cap: "Touch the kitchen or its line at any point: *fault.*", players: [{ x: -4, from: "attackThru" }], kitchen: "left" },
    ],
  },
  {
    id: "atp", title: "Around the Post (ATP)", level: "Advanced", mins: 2,
    summary: "When the ball pulls you wide, you can hit it around the net post. It doesn't have to go over the net.",
    keys: ["A ball doesn't have to cross over the net; it can go around the post.", "It can travel below net height.", "Usually off a sharp, wide dink that bounces and pulls you outside the sideline.", "It must still land in the opponent's court."],
    drills: [["Wide feeds", "Partner feeds very wide dinks; hit around the post into the court. 10 reps each side."], ["Recognise it", "Partner mixes wide and normal dinks; call 'ATP' only on the wide ones."]],
    mistakes: [["Forcing it", "Only when the ball is well outside the sideline."], ["Aiming over the net", "If you're that wide, the post is your path."]],
    quiz: [["Does an ATP have to go over the net?", ["Yes", "No, it can go around the post"], 1], ["Can an ATP be lower than the net?", ["Yes", "No"], 0]],
    scenes: [
      { dur: 5, cam: SIDE, tag: "why", cap: "A sharp, wide dink pulls you *outside* the sideline.", players: [{ x: -7.6, from: "ready" }, { x: 7.6, dir: -1, from: "dinkBack", to: "dinkThru", dim: true }], callout: MAP([{ pts: [[6, 4], [-4, 10.5], [-9, 13]], col: "#FF4D86", ball: true, label: "WIDE DINK", t0: 0.1, t1: 0.9 }], [], "PULLED WIDE") },
      { dur: 5.5, cam: SIDE, tag: "rule", cap: "Hit it *around* the post. It doesn't have to go over the net.", players: [{ x: -7.6, from: "attackBack", to: "attackThru" }], callout: MAP([{ pts: [[-9, 13], [0, 12.4], [9, 5]], col: "#D7F03C", ball: true, label: "AROUND THE POST", t0: 0.15, t1: 0.9 }], [], "LEGAL", [0.5, 0.12]) },
      { dur: 4.5, cam: SIDE, tag: "tip", cap: "It can even stay *below* net height. It just has to land in.", players: [{ x: -7.6, from: "attackThru" }, opp("ready", 7.6)], hud: [["NET HEIGHT, POST", 36, "IN"], ["ATP HEIGHT LIMIT", 0, "NONE"]] },
    ],
  }
);

// Visual teaching cues for lessons 1-8: DO / DON'T steps and body-part tags
const CUES = {
  dink: [["dont"], ["dont", ["wrist"], "wrist"], ["dont"], ["do", ["paddle"]], ["do", ["shoulder", "wrist"], "shoulder"], ["rule"], ["do"], ["why"], ["why"], ["do"]],
  drop: [["why"], ["dont"], ["do", ["shoulder", "paddle"], "shoulder"], ["do"], ["tip"], ["why"]],
  ready: [["dont"], ["do", ["knee"], "knee"], ["do", ["paddle"]], ["tip"]],
  kitchen: [["rule"], ["rule"], ["rule"], ["do"], ["tip"]],
  serve: [["rule", ["shoulder"]], ["rule"], ["tip"]],
  twobounce: [["rule"], ["rule"], ["tip"]],
  reset: [["why"], ["do", ["wrist", "paddle"], "wrist"], ["do"], ["tip"]],
  speedup: [["do"], ["do"], ["dont"], ["tip"]],
};
LESSONS.forEach(l => (CUES[l.id] || []).forEach((c, i) => { const sc = l.scenes[i]; if (!sc) return; sc.tag = sc.tag || c[0]; if (c[1]) sc.joints = c[1]; if (c[2]) sc.focus = c[2]; }));

// Coach Notes: for you and your team only (how to teach each lesson)
const NOTES = {
  dink: { cues: ["'Lift, don't flick.'", "'Peak on our side.'", "Grip: 'hold it like a tube of toothpaste you don't want to squeeze.'"], plan: ["5 min shadow swings, wrist held by the off hand", "10 min cross-court dinks, apex towel drill", "5 min dink game to 5, kitchen only"] },
  drop: { cues: ["'Lift and follow.'", "'Peak on our side, drop into theirs.'"], plan: ["5 min drops from the transition zone", "10 min baseline drops with a step-in after each", "5 min 'drop and come in' points"] },
  ready: { cues: ["'Paddle up, knees soft.'", "'Hop when they hit.'"], plan: ["5 min freeze drill", "5 min split-step timing to a feeder", "5 min fast volley exchanges"] },
  kitchen: { cues: ["'Line is lava.'", "'Bounce, then you can go in.'"], plan: ["5 min volleys toes-behind-line, partner calls faults", "5 min dink, step in, recover"] },
  serve: { cues: ["'Low to high, below the belly button.'", "'Deep beats hard.'"], plan: ["10 min deep-serve target", "5 min serve + return games"] },
  twobounce: { cues: ["'Let it bounce, let it bounce.'", "'Return deep and run.'"], plan: ["10 min deep returns + run to the line"] },
  reset: { cues: ["'Catch the ball with the paddle.'", "'No backswing.'"], plan: ["5 min catch drill", "10 min drive-and-reset from mid-court"] },
  speedup: { cues: ["'Above the net: attack. Below: dink.'", "'Paddle up after.'"], plan: ["10 min above-or-below feeding", "5 min counter battles"] },
  scoring: { cues: ["'Three numbers, every serve.'", "'Even right, odd left' (first server)."], plan: ["Play a full practice game calling every score"] },
  shadow: { cues: ["'Rope between you.'", "'Forehand takes the middle.'"], plan: ["5 min rope drill", "10 min middle-ball feeds with calls"] },
  backhand: { cues: ["'Turn, set, push.'", "'Elbow leads.'"], plan: ["10 min backhand-only cross-court dinks"] },
  lob: { cues: ["'Lob the leaners.'", "'Point, then smash.'"], plan: ["5 min deep-lob targets", "10 min overhead feeds"] },
  erne: { cues: ["'Around, not through.'", "'Land outside.'"], plan: ["5 min footwork shadow", "10 min fed Ernes, slow then live"] },
  atp: { cues: ["'If you're past the post, go around it.'"], plan: ["10 min wide-feed ATPs each side"] },
};
LESSONS.forEach(l => { l.notes = NOTES[l.id] || null; });

// Shots that involve the baseline use the wide camera automatically
LESSONS.forEach(l => l.scenes.forEach(sc => { if (sc.cam === SIDE && (sc.players || []).some(p => Math.abs(p.x) > 12)) sc.cam = WIDE; }));


// ---- HOME COURT: drills with just a paddle, a ball, a wall and some tape ----
// timer: work seconds, rest seconds, rounds. levels: easier → harder versions.
const HOME = [
  { id: "wall-dink", title: "Wall Dinks", focus: "Dink touch", lesson: "dink", kit: "Paddle, ball, wall, tape", setup: "Tape a line on the wall at 34 in (net height). Stand about 6 ft away.", steps: ["Ready position, paddle up.", "Dink softly so the ball hits the wall just above the tape.", "Let it bounce once, then dink again. Push from the shoulder, no wrist."], goal: "30 in a row above the line", timer: [45, 15, 4], levels: ["One bounce between hits", "Alternate forehand and backhand", "No bounce: soft volleys above the line"] },
  { id: "bump-ups", title: "Bump-Ups", focus: "Paddle control", lesson: "dink", kit: "Paddle, ball", setup: "Anywhere with a little headroom.", steps: ["Bounce the ball straight up off the paddle face, about head height.", "Keep the face level and the wrist quiet.", "Count every clean touch."], goal: "50 in a row", timer: [40, 20, 3], levels: ["Forehand face only", "Alternate faces every touch", "Lower bumps, 15 cm, as fast as you can"] },
  { id: "dribble", title: "Paddle Dribble", focus: "Soft hands", lesson: "reset", kit: "Paddle, ball", setup: "Hard floor. Paddle at waist height.", steps: ["Dribble the ball down onto the floor with the paddle, like a basketball.", "Keep it below your knees.", "Absorb each bounce: the paddle 'catches' the ball."], goal: "60 seconds without a miss", timer: [45, 15, 3], levels: ["Standing", "In a low ready squat", "Walking forward and back"] },
  { id: "chair-net", title: "Chair-Net Drops", focus: "Arc & apex", lesson: "drop", kit: "Paddle, ball, chair or rope, towel", setup: "Rope between two chairs at about 34 in. Towel target 7 ft past it.", steps: ["Stand 10 ft back from the rope.", "Drop the ball and lift it over the rope with an open face.", "Peak on your side; land on the towel."], goal: "7 of 10 on the towel", timer: [60, 20, 3], levels: ["From 10 ft", "From 15 ft", "Alternate forehand and backhand"] },
  { id: "mirror", title: "Mirror Swings", focus: "Technique", lesson: "dink", kit: "Paddle, mirror", setup: "Stand side-on to a mirror.", steps: ["Shadow the dink: lift from the shoulder, face set.", "Watch the wrist: it should not hinge.", "Then shadow the backhand dink, elbow leading."], goal: "20 clean reps each side", timer: [40, 10, 4], levels: ["Slow motion", "Normal speed", "Eyes closed, then check"] },
  { id: "wall-volley", title: "Wall Volley Battle", focus: "Fast hands", lesson: "speedup", kit: "Paddle, ball, wall", setup: "Stand about 6 ft from the wall.", steps: ["Volley the ball against the wall without letting it bounce.", "Paddle up between every hit, short punches.", "Stay in a low ready position."], goal: "100 touches total", timer: [30, 15, 5], levels: ["Forehand only", "Backhand only", "Alternate, closer to the wall"] },
  { id: "shuffle", title: "Split-Step Shuffle", focus: "Footwork", lesson: "ready", kit: "Tape", setup: "Two tape lines 10 ft apart on the floor.", steps: ["Shuffle sideways between the lines, never crossing your feet.", "Split-step (small hop) each time you reach a line.", "Paddle up the whole time."], goal: "12 lines in 30 seconds", timer: [30, 20, 5], levels: ["Shuffle only", "Add a shadow dink at each line", "Add forward-back steps"] },
  { id: "kitchen-feet", title: "Kitchen-Line Feet", focus: "Kitchen discipline", lesson: "kitchen", kit: "Tape, paddle", setup: "Tape a line on the floor: your kitchen line.", steps: ["Toes just behind the line, ready position.", "Shadow volleys left, right and high.", "Lean, don't step: if a toe touches the tape, start over."], goal: "60 seconds clean", timer: [45, 15, 3], levels: ["Shadow volleys", "With wall volleys", "Add a reach-and-recover lunge"] },
  { id: "reaction", title: "Reaction Catch", focus: "Reflexes", lesson: "reset", kit: "Paddle, ball, a helper", setup: "A helper holds the ball at shoulder height, an arm's length away.", steps: ["Helper drops the ball without warning.", "Catch it softly on the paddle after one bounce.", "Absorb: the ball should stay on the paddle."], goal: "8 of 10 caught", timer: [45, 15, 3], levels: ["One bounce", "No bounce", "Helper tosses left or right"] },
  { id: "grip-ladder", title: "Grip-Pressure Ladder", focus: "Touch", lesson: "dink", kit: "Paddle, ball, wall", setup: "Same setup as Wall Dinks.", steps: ["10 wall dinks at grip 8/10 (tight).", "10 at 5/10.", "10 at 2–3/10. Feel how the ball softens."], goal: "Feel the difference; finish at 3/10", timer: [45, 15, 3], levels: ["Forehand", "Backhand", "Alternate"] },
  { id: "serve-target", title: "Driveway Serves", focus: "Deep serves", lesson: "serve", kit: "Paddle, balls, towel, outdoor space", setup: "Towel about 3 ft from the far line of a driveway or court-length space.", steps: ["Underhand, contact below the waist.", "Same motion every time.", "Aim for depth, not power."], goal: "6 of 10 deep", timer: [60, 30, 3], levels: ["Towel target", "Smaller target", "Alternate left and right corners"] },
  { id: "overhead-shadow", title: "Point-and-Smash Shadow", focus: "Overheads", lesson: "lob", kit: "Paddle", setup: "Any open space.", steps: ["Turn sideways and point at an imaginary lob with your free hand.", "Shuffle back three steps.", "Swing down and through; recover to ready."], goal: "15 clean reps", timer: [30, 15, 4], levels: ["Slow", "Full speed", "With a partner calling 'lob!' at random"] },
];

// Animated demos for each Home Court drill (looping X-ray clips)
const HC = { x: 0, y: 3.2, z: 1.5 }, HCW = { x: 0, y: 3.3, z: 1.2 };
const seq = (pts, t0, t1, apexes, opts) => pts.slice(0, -1).map((p, i) => Object.assign({ from: p, to: pts[i + 1], apex: apexes[i], apexAt: (opts && opts.at && opts.at[i]) != null ? opts.at[i] : 0.5, t0: t0 + (t1 - t0) * i / (pts.length - 1), t1: t0 + (t1 - t0) * (i + 1) / (pts.length - 1), noGhost: true }, i === pts.length - 2 && opts && opts.bounce ? { bounce: true } : {}));
const ANIM = {
  "wall-dink": [{ dur: 4.4, cam: HC, cap: "Push. *Wall.* Bounce. Push.", props: [{ type: "wall", x: 3.4, tape: true }], players: [{ x: -2.6, from: "dinkBack", to: "dinkThru", reps: 2 }], balls: seq([[-1.4, 1.5], [3.4, 3.4], [-0.6, 0], [-1.4, 1.5], [3.4, 3.4], [-0.6, 0]], 0.02, 0.98, [3.9, 3.4, 1.6, 3.9, 3.4]) }],
  "bump-ups": [{ dur: 3.6, cam: HC, cap: "Face *level.* Wrist quiet. Count every touch.", props: [], players: [{ x: -0.6, from: "bump", to: "bumpUp", reps: 3 }], balls: seq([[0.9, 3.2], [0.9, 3.2], [0.9, 3.2], [0.9, 3.2]], 0, 1, [6, 6, 6], { at: [0.5, 0.5, 0.5] }) }],
  "dribble": [{ dur: 3.6, cam: HC, cap: "Catch the bounce. *Soft* hands.", props: [], players: [{ x: -0.8, from: "dribble", to: "dribbleDn", reps: 4 }], balls: seq([[0.9, 2.1], [0.9, 0], [0.9, 2.1], [0.9, 0], [0.9, 2.1], [0.9, 0], [0.9, 2.1], [0.9, 0], [0.9, 2.1]], 0, 1, [2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1], { at: [0.02, 0.98, 0.02, 0.98, 0.02, 0.98, 0.02, 0.98] }) }],
  "chair-net": [{ dur: 4.6, cam: HCW, cap: "Lift. Peak on *your* side. Land on the towel.", props: [{ type: "rope", x: 0 }, { type: "towel", x: 7 }], players: [{ x: -9, from: "dropBack", to: "dropThru", t0: 0, t1: 0.25 }], ball: { from: [-8, 1.4], to: [7, 0], apex: 5.2, apexAt: 0.42, t0: 0.15, t1: 0.92, showApex: true, bounce: true } }],
  "mirror": [{ dur: 4, cam: { x: 0.4, y: 3.2, z: 1.3 }, cap: "Watch the *wrist.* It should not hinge.", props: [{ type: "mirror", x: 1.8 }], players: [{ x: -1.6, from: "dinkBack", to: "dinkThru", reps: 2 }, { x: 5.2, dir: -1, from: "dinkBack", to: "dinkThru", reps: 2, dim: true, label: "REFLECTION", path: false }], joints: ["wrist"], focus: "wrist" }],
  "wall-volley": [{ dur: 3.4, cam: HC, cap: "Short *punches.* Paddle up. No bounce.", props: [{ type: "wall", x: 3.2 }], players: [{ x: -2.4, from: "block", to: "attackThru", reps: 4 }], balls: seq([[-0.8, 4], [3.2, 4.4], [-0.8, 4], [3.2, 4.4], [-0.8, 4], [3.2, 4.4], [-0.8, 4], [3.2, 4.4], [-0.8, 4]], 0, 1, [4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5]) }],
  "shuffle": [{ dur: 4, cam: HCW, cap: "Shuffle. *Hop* at the line. Paddle up.", props: [{ type: "tape", xs: [-5, 5], label: "TAPE · 10 FT APART" }], players: [{ x: -4.6, x2: 4.6, from: "ready", to: "stand", reps: 6, moveReps: 1, path: false }] }],
  "kitchen-feet": [{ dur: 4, cam: HC, cap: "Toes *behind* the line. Lean, don't step.", props: [{ type: "tape", x: 0.2, label: "YOUR KITCHEN LINE" }], players: [{ x: -1.3, from: "block", to: "attackThru", reps: 3 }], joints: ["knee"] }],
  "reaction": [{ dur: 3.6, cam: HC, cap: "They *drop* it. You catch it on the paddle.", props: [], players: [{ x: -1.6, from: "ready", to: "block", t0: 0.35, t1: 0.6 }, { x: 2.6, dir: -1, from: "stand", dim: true, label: "HELPER", path: false }], balls: seq([[1.1, 4.6], [1.1, 0], [0.4, 2.6]], 0.1, 0.75, [4.6, 1.8], { at: [0.02, 0.6] }) }],
  "grip-ladder": [{ dur: 4.4, cam: HC, cap: "8 out of 10, then 5, then *3.* Feel it soften.", props: [{ type: "wall", x: 3.4, tape: true }], players: [{ x: -2.6, from: "dinkBack", to: "dinkThru", reps: 2 }], callout: { kind: "grip", value: 3, at: "wrist", label: "GRIP", pos: [0.22, 0.24] }, balls: seq([[-1.4, 1.5], [3.4, 3.4], [-0.6, 0], [-1.4, 1.5]], 0.02, 0.98, [3.9, 3.4, 1.6]) }],
  "serve-target": [{ dur: 4.4, cam: HCW, cap: "Low to high. Same motion. *Deep.*", props: [{ type: "towel", x: 9 }], players: [{ x: -10, from: "serveBack", to: "serveThru", t0: 0, t1: 0.3 }], ball: { from: [-9.2, 1.9], to: [9, 0], apex: 6.5, apexAt: 0.48, t0: 0.18, t1: 0.92, bounce: true } }],
  "overhead-shadow": [{ dur: 3.8, cam: HCW, cap: "Turn. *Point.* Swing down. Recover.", props: [], players: [{ x: -1, x2: -3.4, from: "overBack", to: "overThru", reps: 2, moveReps: 1 }], joints: ["shoulder"] }],
};
HOME.forEach(d => { if (ANIM[d.id]) d.anim = { loop: true, noChip: true, scenes: ANIM[d.id] }; });

// Ready-made home sessions (drill ids in order)
const SESSIONS = [
  { id: "touch15", title: "15-min Touch Session", for: "Dinks and soft hands", drills: ["bump-ups", "wall-dink", "grip-ladder", "dribble"] },
  { id: "hands15", title: "15-min Fast Hands", for: "Volleys and reflexes", drills: ["wall-volley", "reaction", "kitchen-feet"] },
  { id: "feet10", title: "10-min Footwork", for: "Ready and movement", drills: ["shuffle", "kitchen-feet", "overhead-shadow"] },
];
// ---- TIPS & TRICKS ----
const TIPS = [
  ["Dinking", "Aim dinks at the opponent's feet or the middle, not their paddle side."], ["Dinking", "Mix cross-court and straight dinks; cross-court is safer (lower net, longer court)."], ["Dinking", "Patience wins the dink rally. Wait for a ball above the net to attack."], ["Dinking", "Dink to their backhand to draw a weaker reply."],
  ["Third shot", "If you can't drop, drive, then drop the next ball (drive-drop combo)."], ["Third shot", "Drop cross-court when unsure: more court and lower net."], ["Third shot", "Never stop moving in after a good drop; split-step as they hit."],
  ["Volleys & hands", "Keep the paddle in front and up; short punches beat big swings."], ["Volleys & hands", "Backhand volleys cover more body area. Use them for balls at your chest."], ["Volleys & hands", "In a hands battle, aim at the shoulder of their paddle arm."],
  ["Footwork", "Split-step as your opponent makes contact, every time."], ["Footwork", "Shuffle sideways; avoid crossing your feet at the kitchen."], ["Footwork", "Stay low: bent knees are faster than long legs."],
  ["Serve & return", "Serve deep and to the backhand; consistency beats aces."], ["Serve & return", "Return deep and high enough to give yourself time to reach the kitchen."], ["Serve & return", "Vary serve depth and pace sometimes, but never at the cost of misses."],
  ["Strategy", "Hit to the weaker player, but don't forget to move the stronger one."], ["Strategy", "When both opponents are at the kitchen, the middle is your friend."], ["Strategy", "Reset a hard ball instead of counter-attacking from below the net."], ["Strategy", "Attack balls above the net; below the net, play soft."],
  ["Doubles teamwork", "Talk: 'mine', 'yours', 'bounce', 'out'. Early calls prevent clashes."], ["Doubles teamwork", "Move as one, about 10 ft apart, like a rope between you."], ["Doubles teamwork", "Encourage your partner after every error. Confidence wins points."],
  ["Mental game", "Have a breath routine between points: exhale, reset, ready."], ["Mental game", "Play the ball, not the score."], ["Mental game", "After an error, name the fix in two words ('lift, push') and move on."],
  ["Gear & body", "Warm up wrists, shoulders and calves for 5 minutes before you play."], ["Gear & body", "Court shoes, not running shoes: you move sideways a lot."], ["Gear & body", "Grip size matters: a too-small grip makes you squeeze."], ["Gear & body", "Hydrate before you're thirsty, especially on Doha nights."],
];

const PREVIEW_SCENES = 4; // free preview of the first lesson

const FREE = ["dink", "ready"];   // two full lessons free: the hook
const TEASER = 2;                  // every other lesson shows its first scenes
const meta = l => ({ id: l.id, title: l.title, level: l.level, mins: l.mins, summary: l.summary, scenes: l.scenes.length, free: FREE.includes(l.id) });
module.exports = { LESSONS, PREVIEW_SCENES, FREE, TEASER, meta, HOME, SESSIONS, TIPS };
