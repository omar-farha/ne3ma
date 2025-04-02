import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import {
  motion,
  Variants,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import * as variants from "@/lib/motionVariants";

const reviews = [
  {
    name: "Sarah M.",
    username: "@sarahm",
    body: "Ne3ma has everything I need! From delicious food to high-quality tools and reliable medicine. The website is super easy to navigate!",
    img: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    name: "David R.",
    username: "@davidr",
    body: "I ordered fresh organic food from Ne3ma, and it arrived quickly! The quality is outstanding, and the taste is amazing.",
    img: "https://randomuser.me/api/portraits/women/66.jpg",
  },
  {
    name: "Emily T.",
    username: "@emilyt",
    body: "Finding essential medicines has never been easier. Ne3ma provides trusted brands with fast delivery. Highly recommended!",
    img: "https://randomuser.me/api/portraits/men/20.jpg",
  },
  {
    name: "Michael L.",
    username: "@michaelL",
    body: "If you need durable tools, Ne3ma is the place to go! The tools I bought are high-quality and work perfectly for my projects.",
    img: "https://randomuser.me/api/portraits/men/59.jpg",
  },
  {
    name: "Olivia K.",
    username: "@oliviak",
    body: "Ne3ma's website is beautifully designed! Shopping for food, tools, and medicine is smooth and hassle-free. Love it!",
    img: "https://randomuser.me/api/portraits/women/10.jpg",
  },
  {
    name: "Chris B.",
    username: "@chrisb",
    body: "The variety of food on Ne3ma is impressive! Everything is fresh, healthy, and tastes incredible. Will definitely order again!",
    img: "https://randomuser.me/api/portraits/women/47.jpg",
  },
  {
    name: "Sophia J.",
    username: "@sophiaj",
    body: "I was able to get all my household tools in one place. Ne3ma's tools are durable and well-priced. Couldn't be happier!",
    img: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    name: "Ethan W.",
    username: "@ethanw",
    body: "Ne3ma's medicine section is well-organized and offers trusted brands. I received my order on time with no issues!",
    img: "https://randomuser.me/api/portraits/men/37.jpg",
  },
  {
    name: "Liam C.",
    username: "@liamc",
    body: "I love how Ne3ma combines everything in one place. Food, tools, medicine—all high-quality and fairly priced!",
    img: "https://randomuser.me/api/portraits/men/66.jpg",
  },
  {
    name: "Emma V.",
    username: "@emmav",
    body: "Ne3ma’s service is top-notch! The food is fresh, the tools are strong, and the medicine is from trusted brands. Highly recommend!",
    img: "https://randomuser.me/api/portraits/men/86.jpg",
  },
];

export default reviews;

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body }) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function PeopleReact() {
  return (
    <motion.div
      className="relative flex w-full flex-col items-center justify-center overflow-hidden"
      variants={variants.fadeInUp}
      initial="start"
      whileInView="end"
      viewport={{ once: true }}
    >
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </motion.div>
  );
}
