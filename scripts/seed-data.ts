// Demo dataset: 9 people, 12 ideas, threaded replies and upvotes, with ages
// spread over 9 days so the Hot, New and Top feeds each order differently.
// All seeded users have Clerk-style ids starting "seed_" (plus the demo
// visitor), and reseeding only ever deletes those users' data.
import Idea from "../lib/models/idea.model";
import User from "../lib/models/user.model";
import Vote from "../lib/models/vote.model";
import { DEMO_USER_ID } from "../lib/demo";
import { connectToDB } from "../lib/mongoose";
import { deleteUserData } from "../lib/user-cleanup";

interface Person {
  id: string;
  username: string;
  name: string;
  bio: string;
}

interface Reply {
  by: string;
  text: string;
  minutesAfter: number;
  replies?: Reply[];
}

interface SeedIdea {
  by: string;
  text: string;
  hoursAgo: number;
  upvotes: number;
  visitorVoted?: boolean;
  replies?: Reply[];
}

const PEOPLE: Person[] = [
  {
    id: DEMO_USER_ID,
    username: "visitor",
    name: "Demo Visitor",
    bio: "This is you while exploring the demo. Post, reply and upvote freely; reseeding resets everything.",
  },
  {
    id: "seed_aanya",
    username: "aanya",
    name: "Aanya Rao",
    bio: "Product designer. Collects small UI ideas that make apps feel kinder.",
  },
  {
    id: "seed_marcus",
    username: "marcus",
    name: "Marcus Lee",
    bio: "Backend engineer. Mostly thinks about queues, traces and why things are slow.",
  },
  {
    id: "seed_priya",
    username: "priya",
    name: "Priya Nair",
    bio: "Data scientist. Wants every chart to be reproducible a year later.",
  },
  {
    id: "seed_diego",
    username: "diego",
    name: "Diego Alvarez",
    bio: "Indie hacker shipping one small SaaS a quarter.",
  },
  {
    id: "seed_mei",
    username: "mei",
    name: "Mei Tanaka",
    bio: "Teaches programming to high schoolers and steals good tools for the classroom.",
  },
  {
    id: "seed_omar",
    username: "omar",
    name: "Omar Haddad",
    bio: "SRE. On call more often than he would like.",
  },
  {
    id: "seed_lena",
    username: "lena",
    name: "Lena Fischer",
    bio: "Product manager. Turns piles of feedback into a roadmap.",
  },
  {
    id: "seed_kofi",
    username: "kofi",
    name: "Kofi Mensah",
    bio: "CS student, part-time builder of study tools.",
  },
];

const IDEAS: SeedIdea[] = [
  {
    by: "marcus",
    hoursAgo: 20,
    upvotes: 7,
    visitorVoted: true,
    text: "A 'why is this slow' button on every internal dashboard. It grabs the trace id, the query plan and the last deploy, and opens a ticket with all three attached.",
    replies: [
      {
        by: "omar",
        minutesAfter: 25,
        text: "Half of my on-call pages would close themselves if the ticket had the trace id from the start.",
      },
      {
        by: "kofi",
        minutesAfter: 70,
        text: "How would you stop it from capturing user data inside the trace?",
        replies: [
          {
            by: "marcus",
            minutesAfter: 15,
            text: "Redact at the collector. Only span names and timings go into the ticket.",
          },
        ],
      },
      {
        by: "lena",
        minutesAfter: 180,
        text: "Adding this to the platform roadmap draft for next quarter.",
      },
    ],
  },
  {
    by: "priya",
    hoursAgo: 50,
    upvotes: 8,
    visitorVoted: true,
    text: "A weekly dataset changelog: which tables changed shape, which columns suddenly went mostly null, and which dashboards read them. Schema drift should never be a Monday surprise.",
    replies: [
      {
        by: "marcus",
        minutesAfter: 40,
        text: "A diff of information_schema plus a null-rate check per column gets you most of the way.",
      },
      {
        by: "diego",
        minutesAfter: 300,
        text: "Honestly I would pay for this as a hosted tool.",
      },
    ],
  },
  {
    by: "aanya",
    hoursAgo: 3,
    upvotes: 4,
    text: "Dark mode that follows the time of day instead of only the OS setting: warmer tones after sunset, full contrast in the morning.",
    replies: [
      {
        by: "marcus",
        minutesAfter: 12,
        text: "That is a CSS custom property swap driven by a tiny scheduler. Happy to prototype it.",
      },
      {
        by: "mei",
        minutesAfter: 45,
        text: "Yes please. My students read on tablets at night and complain about the glare.",
      },
    ],
  },
  {
    by: "visitor",
    hoursAgo: 12,
    upvotes: 4,
    text: "A browser extension that turns a long article into five bullet points plus the one quote worth saving.",
    replies: [
      {
        by: "priya",
        minutesAfter: 30,
        text: "Keep the quote verbatim and linked. People trust a summary more when they can check the source.",
      },
      {
        by: "omar",
        minutesAfter: 95,
        text: "Offline first would be great. I do not want my reading list sent to a server.",
      },
    ],
  },
  {
    by: "mei",
    hoursAgo: 30,
    upvotes: 6,
    text: "Classroom mode for code editors: the teacher's cursor and highlights mirror onto every student screen, while each student keeps their own copy to edit.",
    replies: [
      {
        by: "aanya",
        minutesAfter: 20,
        text: "The hard part is making the mirrored cursor easy to follow without being distracting.",
      },
      {
        by: "kofi",
        minutesAfter: 110,
        text: "Our lab would use this every single day.",
      },
    ],
  },
  {
    by: "diego",
    hoursAgo: 5,
    upvotes: 3,
    text: "A pay-what-you-want tier that only unlocks after 30 days on the free plan. People pay more once they know the product fits.",
    replies: [
      {
        by: "lena",
        minutesAfter: 35,
        text: "Worth an A/B test against a plain 14 day trial.",
      },
    ],
  },
  {
    by: "omar",
    hoursAgo: 96,
    upvotes: 5,
    text: "Every alert should carry a 'last time this fired' link showing what the responder did. Runbooks go stale; history does not.",
    replies: [
      {
        by: "priya",
        minutesAfter: 60,
        text: "Make the incident notes searchable and this becomes the best runbook you have.",
      },
    ],
  },
  {
    by: "lena",
    hoursAgo: 8,
    upvotes: 2,
    text: "Roadmap voting where everyone gets 10 points a quarter to spread across ideas, instead of unlimited upvotes. Scarcity forces real priorities.",
    replies: [
      {
        by: "diego",
        minutesAfter: 15,
        text: "Quadratic voting would be the nerdy version of this.",
      },
    ],
  },
  {
    by: "kofi",
    hoursAgo: 1,
    upvotes: 1,
    text: "Study group matcher: enter your course code and free hours, get paired with two classmates whose free hours overlap yours.",
  },
  {
    by: "aanya",
    hoursAgo: 144,
    upvotes: 6,
    text: "Design tokens that ship with their own accessibility tests. Every color pair declares the contrast it needs, and the build fails when a theme breaks it.",
    replies: [
      {
        by: "mei",
        minutesAfter: 240,
        text: "Teachers making slides need this as much as app teams do.",
      },
    ],
  },
  {
    by: "marcus",
    hoursAgo: 0.8,
    upvotes: 0,
    text: "Feature flags with an expiry date. Past that date the flag fails CI until someone deletes it or extends it.",
  },
  {
    by: "priya",
    hoursAgo: 216,
    upvotes: 7,
    text: "Notebook cells that remember which data snapshot they ran against, so any chart in a report can be rebuilt exactly.",
  },
];

const HOUR = 3_600_000;
const MINUTE = 60_000;

export interface SeedSummary {
  users: number;
  ideas: number;
  replies: number;
  votes: number;
}

/** Reset and insert the demo dataset. Expects process.env.MONGODB_URL to be set. */
export async function seedDemoData(now = new Date()): Promise<SeedSummary> {
  await connectToDB();
  await Promise.all([User.init(), Idea.init(), Vote.init()]);

  // Idempotent: clear only what a previous seed (or demo session) left behind
  for (const person of PEOPLE) await deleteUserData(person.id);

  const users = await User.insertMany(
    PEOPLE.map((person) => ({
      ...person,
      image: `/demo/avatars/${person.username}.svg`,
      onboarded: true,
    })),
  );
  const userByName = new Map(users.map((user) => [user.username, user]));
  const visitor = userByName.get("visitor")!;

  let ideaCount = 0;
  let replyCount = 0;
  const votes: { idea: unknown; user: unknown; createdAt: Date }[] = [];

  async function insertReplies(
    parent: any,
    replies: Reply[],
    parentTime: number,
  ) {
    for (const reply of replies) {
      const createdAt = parentTime + reply.minutesAfter * MINUTE;
      const author = userByName.get(reply.by)!;
      const doc = await Idea.create({
        text: reply.text,
        author: author._id,
        parentID: String(parent._id),
        createdAt: new Date(createdAt),
      });
      replyCount += 1;
      await Idea.updateOne(
        { _id: parent._id },
        { $push: { children: doc._id } },
      );
      await User.updateOne({ _id: author._id }, { $push: { ideas: doc._id } });
      if (reply.replies) await insertReplies(doc, reply.replies, createdAt);
    }
  }

  for (const [index, seed] of IDEAS.entries()) {
    const author = userByName.get(seed.by)!;
    const createdAt = now.getTime() - seed.hoursAgo * HOUR;
    const idea = await Idea.create({
      text: seed.text,
      author: author._id,
      createdAt: new Date(createdAt),
      upvotes: seed.upvotes,
    });
    ideaCount += 1;
    await User.updateOne({ _id: author._id }, { $push: { ideas: idea._id } });

    // Voters: the visitor when flagged, then other people in a rotating
    // order so the same few names do not vote on everything
    const others = users.filter(
      (user) => !user._id.equals(author._id) && !user._id.equals(visitor._id),
    );
    const rotated = [
      ...others.slice(index % others.length),
      ...others.slice(0, index % others.length),
    ];
    const voters = [...(seed.visitorVoted ? [visitor] : []), ...rotated].slice(
      0,
      seed.upvotes,
    );
    if (voters.length !== seed.upvotes) {
      throw new Error(
        `Not enough people to cast ${seed.upvotes} votes on "${seed.text}"`,
      );
    }
    voters.forEach((voter, n) =>
      votes.push({
        idea: idea._id,
        user: voter._id,
        createdAt: new Date(
          Math.min(now.getTime(), createdAt + (n + 1) * 7 * MINUTE),
        ),
      }),
    );

    if (seed.replies) await insertReplies(idea, seed.replies, createdAt);
  }

  await Vote.insertMany(votes);

  return {
    users: users.length,
    ideas: ideaCount,
    replies: replyCount,
    votes: votes.length,
  };
}
