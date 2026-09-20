import {
  Gift,
  PhoneCall,
  BadgeAlert,
  MailWarning,
  HeartHandshake,
  Wrench,
  PackageCheck,
  Landmark,
  Megaphone,
} from "lucide-react";

interface Tactic {
  icon: typeof Gift;
  title: string;
  body: string;
  signs: string[];
}

const TACTICS: Tactic[] = [
  {
    icon: Gift,
    title: "Gift Card Scams",
    body: "A caller says you need to pay with Apple, Amazon, or Google gift cards. No real business or government office will ever ask for gift cards. If someone does, it is a scam — every time.",
    signs: ["'Buy gift cards and read us the codes'", "'Pay your taxes with Apple gift cards'"],
  },
  {
    icon: PhoneCall,
    title: "The Grandparent Scam",
    body: "Someone calls pretending to be your grandchild in trouble — a crash, jail, or hospital. They beg for money and say 'don't tell mom.' Always hang up and call your family member on a number you already know.",
    signs: ["'It's me, Grandma — I'm in jail'", "'Don't call my parents'"],
  },
  {
    icon: BadgeAlert,
    title: "Government Impersonators",
    body: "Someone claims to be from the IRS, Social Security, or Medicare and threatens arrest or losing your benefits. Real agencies never call to demand money or gift cards over the phone.",
    signs: ["'Your Social Security number is suspended'", "'Warrants for your arrest'"],
  },
  {
    icon: MailWarning,
    title: "Phishing Emails & Texts",
    body: "A message looks like it's from Netflix, Amazon, or your bank. It says your account will close unless you 'click here' and log in. The link goes to a fake site that steals your password.",
    signs: ["'Your account will be deleted in 2 hours'", "'Click here to verify your card'"],
  },
  {
    icon: HeartHandshake,
    title: "Romance Scams",
    body: "Someone you meet online falls for you fast, but they always have a reason they can't meet in person. Soon they ask for money for a plane ticket, a medical bill, or an emergency. It is not real love.",
    signs: ["'I need money to come visit you'", "'I'm stranded overseas'"],
  },
  {
    icon: Wrench,
    title: "Tech Support Scams",
    body: "A pop-up or call says your computer is infected and offers to 'fix' it. They ask you to install software that lets them control your device, then demand payment or steal your bank login.",
    signs: ["'Your PC is infected'", "'Install TeamViewer so I can fix it'"],
  },
  {
    icon: PackageCheck,
    title: "Delivery & Package Scams",
    body: "A text says a package is on hold and you must pay a small 'shipping fee' or confirm your address. The link steals your card details or your personal information.",
    signs: ["'USPS: package on hold'", "'Pay $1.99 redelivery fee'"],
  },
  {
    icon: Landmark,
    title: "Investment & Crypto Scams",
    body: "A stranger promises guaranteed returns from crypto or forex and pressures you to invest quickly. Real investments always carry risk, and no one can guarantee profits.",
    signs: ["'Double your money in a week'", "'Guaranteed passive income'"],
  },
  {
    icon: Megaphone,
    title: "Prize & Lottery Scams",
    body: "You 'won' a sweepstakes you never entered, but you must pay a 'processing fee' or taxes before you can collect. Real prizes never require you to pay money to get them.",
    signs: ["'You've won $50,000'", "'Pay the clearance fee to claim your prize'"],
  },
];

export default function LearnPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-navy">Learn About Common Scams</h2>
        <p className="mt-4 text-2xl text-navy/70 leading-relaxed max-w-3xl mx-auto">
          Scammers use the same tricks over and over. Once you know them, you can spot a scam before
          it catches you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TACTICS.map((tactic) => {
          const Icon = tactic.icon;
          return (
            <article
              key={tactic.title}
              className="bg-white border-4 border-navy/10 rounded-2xl p-7 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center bg-gold/15 rounded-2xl p-4 shrink-0">
                  <Icon className="w-10 h-10 text-gold-dark" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-extrabold text-navy leading-tight">
                  {tactic.title}
                </h3>
              </div>
              <p className="text-xl text-navy/80 leading-relaxed">{tactic.body}</p>
              <div className="mt-5 flex flex-col gap-2">
                {tactic.signs.map((sign) => (
                  <div
                    key={sign}
                    className="flex items-start gap-2.5 bg-red-50 border-2 border-red-200 rounded-xl p-3"
                  >
                    <span className="text-red-600 font-bold text-xl shrink-0">!</span>
                    <span className="text-lg text-red-800 font-medium italic">{sign}</span>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-10 bg-navy border-4 border-gold/40 rounded-2xl p-8 text-center">
        <h3 className="text-3xl font-extrabold text-gold mb-4">The Golden Rule</h3>
        <p className="text-2xl text-warmgray leading-relaxed max-w-3xl mx-auto">
          If a message makes you feel rushed, scared, or asked to pay with gift cards — stop and ask
          someone you trust. A real company or loved one will never mind you taking a moment to
          check.
        </p>
      </div>
    </div>
  );
}
