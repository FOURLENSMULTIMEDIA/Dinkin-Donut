// Arabic / English switch. Translates visible text in place (including live updates), flips the layout to RTL
// and swaps in Arabic fonts. Names, the club name and codes stay as they are. The choice is remembered per device.
(function () {
  var KEY = "dd-lang";
  var AR = {
    // ---------- navigation & shared ----------
    "First Serve": "الإرسال الأول", "Live courts": "الملاعب الآن", "Club Card": "بطاقة النادي", "Invitational": "البطولة", "Shop": "المتجر", "DUPR": "DUPR",
    "Menu": "القائمة", "Close": "إغلاق", "Join the queue": "انضم إلى الطابور", "The First Serve": "الإرسال الأول", "How a night runs": "كيف تسير الأمسية",
    "Kitchen rules": "قواعد المطبخ", "The Honours Board": "لوحة الشرف", "The Invitational": "البطولة", "DUPR games": "مباريات DUPR", "Contact": "تواصل معنا",
    "Live": "مباشر", "Live now": "مباشر الآن", "Tap to join.": "اضغط للانضمام.", "Say hi": "قل مرحبًا", "Crew only": "للفريق فقط", "Host console": "لوحة المضيف",
    "PIN required": "يتطلب رمزًا", "TV board": "شاشة الملعب", "For the court screen": "لشاشة الملعب", "Appearance": "المظهر", "Doha, Qatar": "الدوحة، قطر",
    "Dink Different · Doha": "Dink Different · الدوحة", "Dink Different Pickleball Club · Doha": "نادي Dink Different للبيكل بول · الدوحة",
    "Run your own club on Courtcall": "أدِر ناديك على Courtcall", "Get the app": "حمّل التطبيق", "Install Dink Different": "ثبّت Dink Different",
    "iPhone, Android, Mac & Windows · works offline": "آيفون وأندرويد وماك وويندوز · يعمل دون إنترنت",
    "Designed & Developed by": "تصميم وتطوير", "Designed & Developed by Drew Nolasco & Angel Flores": "تصميم وتطوير Drew Nolasco و Angel Flores",
    "· Designed & Developed by Drew Nolasco & Angel Flores": "· تصميم وتطوير Drew Nolasco و Angel Flores",
    "Open Play · Thursdays 8 PM": "اللعب المفتوح · كل خميس 8 مساءً", "All levels welcome": "جميع المستويات مرحّب بها", "Book on Reclub · code AX3ND": "احجز على Reclub · الرمز AX3ND",
    "Soft hands, good company": "أيدٍ ناعمة وصحبة طيبة", "The Clubhouse Collection · Drop 02": "مجموعة النادي · الإصدار 02",
    "Beginner": "مبتدئ", "Intermediate": "متوسط", "Advanced": "متقدم", "Open": "متاح", "Up next": "التالي", "VS": "ضد", "Even match": "مباراة متكافئة", "Close match": "مباراة متقاربة",
    "Play well. Dink different.": "العب جيدًا. \u2066Dink Different\u2069.", "Club": "النادي", "Merch": "المنتجات", "Crew": "الفريق", "Play": "العب", "Instagram": "إنستغرام", "WhatsApp": "واتساب",
    "Est. MMXXVI": "تأسس 2026", "A pickleball club, the old-fashioned way.": "نادي بيكل بول على الطريقة الكلاسيكية.", "Dink Different Pickleball Club · Dink different.": "نادي Dink Different للبيكل بول.",
    // ---------- homepage ----------
    "For players · Soft Hands Academy": "للاعبين · أكاديمية الأيدي الناعمة", "Play smarter in 7 days.": "العب بذكاء أكبر خلال 7 أيام.",
    "20 animated lessons, a Pro Track to raise your DUPR, and drills you can do at home with a paddle and a wall.": "20 درسًا متحركًا، ومسار احترافي لرفع تصنيف DUPR، وتمارين يمكنك أداؤها في المنزل بمضرب وجدار.",
    "Slow-motion breakdowns": "تحليل بالحركة البطيئة", "Home Court sessions": "جلسات في المنزل", "Works offline": "يعمل دون إنترنت", "Start your free week": "ابدأ أسبوعك المجاني",
    "Founding members · 25% off for life": "الأعضاء المؤسسون · خصم 25% مدى الحياة", "For clubs · Courtcall": "للأندية · Courtcall", "Run open play like a pro.": "أدِر اللعب المفتوح باحتراف.",
    "The queue, host console and TV board that run our nights, ready for your club with your name and colours.": "الطابور ولوحة المضيف وشاشة الملعب التي تدير أمسياتنا، جاهزة لناديك باسمه وألوانه.",
    "Smart matching · mixed · fixed partners": "توزيع ذكي · مختلط · شركاء ثابتون", "Tournaments with a 15-point final": "بطولات بنهائي من 15 نقطة", "Pay by card, worldwide": "الدفع بالبطاقة من أي مكان",
    "See plans": "اطّلع على الباقات", "Set up in 5 minutes · cancel anytime": "الإعداد في 5 دقائق · ألغِ في أي وقت",
    "Pickleball club ·": "نادي بيكل بول ·", "Doha": "الدوحة", "Play well.": "العب جيدًا.", "Dink different.": "\u2066Dink different.\u2069",
    "Open-play pickleball for every level. Scan the code at the court, get your spot in the queue, and we’ll call you up when it’s your turn.": "بيكل بول مفتوح لكل المستويات. امسح الرمز في الملعب، واحجز مكانك في الطابور، وسننادي عليك عندما يحين دورك.",
    "See who’s on court": "شاهد من في الملعب", "How a night works": "كيف تسير الأمسية", "Dinkers tonight": "اللاعبون الليلة", "Opening soon": "الافتتاح قريبًا",
    "Something different is coming.": "شيء مختلف قادم.", "Pre-registration is open": "التسجيل المسبق مفتوح", "The First Serve. 48 numbered spots, each with a 1-of-1 sticker.": "الإرسال الأول. 48 مكانًا مرقّمًا، لكلٍّ منها ملصق فريد.",
    "Open play for": "لعب مفتوح", "every level.": "لكل المستويات.", "Doha nights,": "أمسيات الدوحة،", "8 PM till late.": "من 8 مساءً حتى وقت متأخر.", "Scan in.": "امسح الرمز.", "We call your court.": "وننادي ملعبك.",
    "See how nights run": "شاهد كيف تسير الأمسيات", "Live from the courts": "مباشر من الملاعب", "1 court in play": "ملعب واحد قيد اللعب",
    "Updates every few seconds. Winners stay for a maximum of 2 games, then everyone rotates.": "تتحدث كل بضع ثوانٍ. يبقى الفائزون مباراتين كحد أقصى، ثم يتناوب الجميع.",
    "Waiting for players. Join the queue to get on.": "بانتظار اللاعبين. انضم إلى الطابور لتلعب.", "Open the full queue": "افتح الطابور كاملًا", "TV mode": "وضع الشاشة",
    "Pickleball club · Doha": "نادي بيكل بول · الدوحة", "Every week": "كل أسبوع", "Doha. Under the lights.": "الدوحة. تحت الأضواء.", "Dink Different Pickleball Club": "نادي Dink Different للبيكل بول",
    "Pay at the table.": "ادفع عند الطاولة.", "Your PIN lands on WhatsApp.": "يصلك رمزك على واتساب.", "Dink Different · Live queue": "Dink Different · الطابور المباشر", "Enter your PIN.": "أدخل رمزك.",
    "● Autopilot": "● التشغيل التلقائي", "“Court two, please.”": "«الملعب الثاني، من فضلكم.»", "Games each": "المباريات لكل لاعب", "Autopilot runs the courts.": "التشغيل التلقائي يدير الملاعب.",
    "Smart match. Fair turns. Everyone plays.": "توزيع ذكي. أدوار عادلة. الجميع يلعب.", "Fair games.": "مباريات عادلة.", "Every game.": "في كل مباراة.", "Win?": "فزت؟", "Join the club.": "انضم إلى النادي.",
    "FREE": "مجانًا", "Sign up free · link below": "سجّل مجانًا · الرابط أدناه", "Play six.": "العب ستًّا.", "The seventh is on the club.": "والسابعة على حساب النادي.", "Wear the colours.": "ارتدِ ألوان النادي.",
    "Dry-fit club tees, made.": "قمصان النادي المقاومة للعرق، جاهزة.", "Your name makes the pattern.": "اسمك يصنع النقش.", "1 of 1. No two alike.": "قطعة فريدة. لا تتشابه اثنتان.", "Coming soon to Doha.": "قريبًا في الدوحة.",
    "Open play · DUPR games · Doha": "لعب مفتوح · مباريات DUPR · الدوحة", "Join the next session": "انضم إلى الجلسة القادمة", "Get the Club Card": "احصل على بطاقة النادي", "Play with sound": "شغّل مع الصوت", "Tap for sound": "اضغط للصوت",
    "Coming soon · Doha": "قريبًا · الدوحة", "Our first Dink Different tournament. Doubles brackets for every level, a gold trophy on the line, and the Club Jersey as the official kit.": "أول بطولة لـ Dink Different. منافسات زوجية لكل المستويات، وكأس ذهبية، وقميص النادي زيًّا رسميًا.",
    "Beginner doubles": "زوجي المبتدئين", "Intermediate doubles": "زوجي المتوسطين", "Advanced doubles": "زوجي المتقدمين", "Date drops soon": "يُعلن الموعد قريبًا", "Be first to know when registration opens.": "كن أول من يعرف عند فتح التسجيل.",
    "Notify me on WhatsApp": "أخبرني على واتساب", "Bracket & registration": "الجدول والتسجيل", "Get the official kit": "احصل على الزي الرسمي", "Free to join": "الانضمام مجاني",
    "Sign up for the Club Card in one minute. Collect your card at any session, get a stamp every paid game, open play or DUPR, and your seventh session is free.": "سجّل في بطاقة النادي خلال دقيقة. استلم بطاقتك في أي جلسة، واحصل على ختم مع كل مباراة مدفوعة، لعبًا مفتوحًا أو DUPR، وجلستك السابعة مجانية.",
    "Sign up free": "سجّل مجانًا", "How it works": "كيف تعمل", "Silver": "فضية", "Gold": "ذهبية", "Bronze": "برونزية", "Open play nights": "أمسيات اللعب المفتوح", "Venue: TBA — stay tuned": "المكان: يُعلن لاحقًا — ترقّبوا",
    ". Doha evenings are warm, so bring water and come early for the warm-up.": ". أمسيات الدوحة دافئة، فاحضر الماء وتعال مبكرًا للإحماء.", "Check-in": "التسجيل", "Nets up. Pay at the table and get your Club Pass PIN on WhatsApp.": "الشباك منصوبة. ادفع عند الطاولة واستلم رمز النادي على واتساب.",
    "Warm-up": "الإحماء", "Dinking lines, drops and light rallies with the coach.": "تمارين الدينك والإسقاطات وتبادل خفيف مع المدرب.", "Welcome": "الترحيب",
    "One-minute rules. Scan in, and the first courts fill automatically.": "القواعد في دقيقة. امسح الرمز وتمتلئ الملاعب الأولى تلقائيًا.", "Open play": "اللعب المفتوح",
    "Smart match builds fair, level-balanced games. Your phone and the TV call your court.": "التوزيع الذكي يبني مباريات عادلة ومتوازنة. هاتفك والشاشة يناديان ملعبك.", "Last call": "النداء الأخير",
    "Final games, the Honours Board is crowned, pack down.": "المباريات الأخيرة، تتويج لوحة الشرف، ثم الترتيب.", "Rated play": "لعب مصنّف", "DUPR games are on Reclub.": "مباريات DUPR على Reclub.",
    "Want your results to count? Book a rated session.": "تريد أن تُحتسب نتائجك؟ احجز جلسة مصنّفة.", "Book a DUPR game →": "احجز مباراة DUPR ←", "Read out at 8:00 PM": "تُقرأ في الساعة 8:00 مساءً",
    "Scan in with your PIN. We call your court.": "سجّل برمزك. وننادي ملعبك.", "Winners stay a maximum of 2 games.": "يبقى الفائزون مباراتين كحد أقصى.", "Call your own lines, kindly.": "احكم على خطوطك بلطف.",
    "Mix levels. Everyone plays.": "امزج المستويات. الجميع يلعب.", "Courts are lit.": "الملاعب مضاءة.", "Have fun. Dink different.": "استمتع. \u2066Dink different.\u2069", "No app, no sign-up": "بلا تطبيق، بلا تسجيل", "Scan it.": "امسحه.", "Dink it.": "والعب.",
    "Scan the QR code at the check-in table, or tap the button.": "امسح رمز QR عند طاولة التسجيل، أو اضغط الزر.", "Type your name. You’re in the queue.": "اكتب اسمك. أنت في الطابور.",
    "Keep the page open. It tells you when you’re next and which court to go to.": "أبقِ الصفحة مفتوحة. ستخبرك عندما يحين دورك وإلى أي ملعب تذهب.", "Who we are": "من نحن", "Crossed paddles, one ball, two letters.": "مضربان متقاطعان، كرة واحدة، حرفان.",
    "Old-school manners, modern pickleball. Dink Different is open play for every level, run like a members’ club: whites welcome, kind words at the kitchen line, and a proper handshake at the net. Our members are": "أخلاق كلاسيكية وبيكل بول عصري. Dink Different لعب مفتوح لكل المستويات، يُدار كنادٍ للأعضاء: الأبيض مرحّب به، والكلمة الطيبة عند خط المطبخ، ومصافحة حقيقية عند الشبكة. أعضاؤنا هم",
    "Dinkers": "Dinkers", "Warm": "ودودون", "Everyone is welcome, beginners especially.": "الجميع مرحّب بهم، وخصوصًا المبتدئون.", "Playful": "مرحون", "Club etiquette and pickleball jokes. Never mean.": "آداب النادي ونكات البيكل بول. بلا إساءة أبدًا.",
    "Reliable": "موثوقون", "We start on time and we run good games.": "نبدأ في الموعد وندير مباريات جيدة.", "Tonight’s leaderboard": "ترتيب الليلة", "Top Dinkers": "أفضل اللاعبين",
    "The board fills up after the first game tonight.": "تمتلئ اللوحة بعد أول مباراة الليلة.", "Full standings": "الترتيب الكامل", "Drop 01 · Pre-order": "الإصدار 01 · طلب مسبق", "The Club Jersey is here.": "قميص النادي وصل.",
    "Your name and number on the back. Dry-fit, seven colourways, plus the Court Set and the Clubhouse Collection.": "اسمك ورقمك على الظهر. قماش مقاوم للعرق، سبعة ألوان، إضافة إلى طقم الملعب ومجموعة النادي.",
    "Build yours →": "صمّم قميصك ←", "Soft Hands Academy · Coaching": "أكاديمية الأيدي الناعمة · تدريب", "See what your": "شاهد ما يفعله", "wrist": "معصمك", "is really doing.": "حقًا.",
    "X-ray technique lessons for the dink, drop, reset and more, with slow motion, drills and quick checks. The first lesson is free.": "دروس تقنية مفصّلة للدينك والإسقاط والإعادة وغيرها، بالحركة البطيئة والتمارين والاختبارات السريعة. الدرس الأول مجاني.",
    "Watch the free lesson": "شاهد الدرس المجاني", "Courtcall · For clubs worldwide": "Courtcall · للأندية حول العالم", "Run a club?": "تدير ناديًا؟", "Run it like ours.": "أدِره مثل نادينا.",
    "The queue, matchmaking, live scores and TV board you see at Dink Different, now in your club’s name and colours. Live in 2 minutes. No app to install.": "الطابور والتوزيع والنتائج المباشرة وشاشة الملعب التي تراها في Dink Different، الآن باسم ناديك وألوانه. جاهز خلال دقيقتين. بلا تطبيق.",
    "QR check-in": "تسجيل برمز QR", "Fair games": "مباريات عادلة", "Court announcer": "مذيع الملعب", "Your branding": "هويتك", "Discover Courtcall": "اكتشف Courtcall", "Watch the 36s film": "شاهد فيلم الـ36 ثانية",
    "Get in touch": "تواصل معنا", "Slide into our DMs": "راسلنا", "Questions about nights, the venue, DUPR games or merch? Message the crew. We reply fastest on WhatsApp.": "أسئلة عن الأمسيات أو المكان أو مباريات DUPR أو المنتجات؟ راسل الفريق. نرد أسرع على واتساب.",
    "Questions": "الأسئلة", "Before your first night": "قبل أمسيتك الأولى", "I’ve never played. Can I come?": "لم ألعب من قبل. هل يمكنني الحضور؟",
    "Yes, please. Come for the 7:45 warm-up and the coach will walk you through the basics. Court captains mix levels so everyone gets games.": "نعم، تفضّل. تعال لإحماء الساعة 7:45 وسيشرح لك المدرب الأساسيات. قادة الملاعب يمزجون المستويات ليلعب الجميع.",
    "How does the queue work?": "كيف يعمل الطابور؟",
    "You join the line when you check in and tell us your level. Our smart match always puts the longest-waiting player on next, fills the court with players close to their level, and splits the teams so games are even. Nobody gets skipped more than twice. Winners stay for up to 2 games, but only when there’s a fair opponent waiting.": "تنضم إلى الطابور عند التسجيل وتخبرنا بمستواك. التوزيع الذكي يقدّم دائمًا من انتظر أطول، ويملأ الملعب بلاعبين قريبين من مستواه، ويقسم الفرق لتكون المباريات متكافئة. لا يُتخطّى أحد أكثر من مرتين. يبقى الفائزون حتى مباراتين، فقط عند وجود منافس متكافئ.",
    "What should I bring?": "ماذا أحضر؟", "Court shoes, water and a paddle if you have one. Doha nights stay warm, so hydrate between games.": "حذاء ملاعب وماء ومضرب إن كان لديك. أمسيات الدوحة دافئة، فاشرب الماء بين المباريات.",
    "Do I need to sign up in advance?": "هل أحتاج إلى التسجيل مسبقًا؟", "No. Just turn up, scan the QR code and type your name.": "لا. احضر فقط، وامسح رمز QR واكتب اسمك.", "Is there a loyalty card?": "هل توجد بطاقة ولاء؟",
    "Yes, the": "نعم،", ". Play six paid sessions, open play or DUPR, and the seventh is free.": ". العب ست جلسات مدفوعة، لعبًا مفتوحًا أو DUPR، والسابعة مجانية.", "Do you have rated (DUPR) games?": "هل لديكم مباريات مصنّفة (DUPR)؟",
    "Yes. DUPR sessions are booked on Reclub. See": "نعم. تُحجز جلسات DUPR على Reclub. راجع", "for how it works.": "لمعرفة الطريقة.", "How do I contact the club?": "كيف أتواصل مع النادي؟", "Message us on WhatsApp at": "راسلنا على واتساب على",
    "or": "أو", ", or DM": "، أو راسل", "on Instagram.": "على إنستغرام.", "Where do you play?": "أين تلعبون؟", "8:00 PM – 12:00 AM": "8:00 مساءً – 12:00 منتصف الليل", "Tara, laro tayo!": "يلا نلعب!",
    "Free": "مجاني",
    // ---------- live queue (player page) ----------
    "Open Play Night": "أمسية اللعب المفتوح", "Paddles": "المضارب", "up.": "جاهزة.",
    "Type your name and the 3-digit PIN we sent to your WhatsApp. Keep this page open and it will tell you when you’re next.": "اكتب اسمك والرمز المكوّن من 3 أرقام الذي أرسلناه إلى واتساب. أبقِ هذه الصفحة مفتوحة وستخبرك عندما يحين دورك.",
    "Club Pass PIN": "رمز النادي", "Sent to your WhatsApp when you paid.": "أُرسل إلى واتساب عند الدفع.", "Your level": "مستواك", "(we use it to build fair games)": "(نستخدمه لبناء مباريات عادلة)",
    "Mixed doubles tonight": "زوجي مختلط الليلة", "(each team is one man + one woman)": "(كل فريق رجل وامرأة)", "Man": "رجل", "Woman": "امرأة", "Playing with a partner?": "تلعب مع شريك؟",
    "(optional, the host confirms)": "(اختياري، يؤكده المضيف)", "(optional, so the host can tell you when you’re up)": "(اختياري، ليخبرك المضيف عندما يحين دورك)", "Courts": "الملاعب", "Queue": "الطابور",
    "Next up goes here": "التالي يذهب هنا", "Nobody waiting. Join and you’re straight on.": "لا أحد ينتظر. انضم وستلعب فورًا.", "Live standings": "الترتيب المباشر", "Wins, then win %": "الانتصارات ثم نسبة الفوز",
    "Dinker": "اللاعب", "W": "ف", "L": "خ", "Win %": "نسبة الفوز", "Streak": "السلسلة", "Season ladder": "سلّم الموسم", "Pts": "نقاط", "W–L": "ف–خ", "Nights": "الأمسيات",
    "Not a Club Card member yet?": "لست عضوًا في بطاقة النادي بعد؟", "Sign up free. Six stamps and your seventh session is on the club.": "سجّل مجانًا. ستة أختام وجلستك السابعة على حساب النادي.", "Sign up": "سجّل",
    "Want rated games?": "تريد مباريات مصنّفة؟", "DUPR sessions are booked on Reclub.": "تُحجز جلسات DUPR على Reclub.", "DUPR games →": "مباريات DUPR ←", "Game log": "سجل المباريات",
    "The ladder starts after the first night closes.": "يبدأ السلّم بعد انتهاء أول أمسية.", "3 pts a win · 1 a game · 1 a night": "3 نقاط للفوز · 1 للمباراة · 1 للأمسية",
    "Get your paddle ready": "جهّز مضربك", "You’re in the queue": "أنت في الطابور", "You’re on the next open court.": "ستلعب في الملعب التالي المتاح.", "Take a break": "خذ استراحة",
    "Winners stay": "الفائزون يبقون", "Your next opponents are on their way.": "منافسوك القادمون في الطريق.", "Done for tonight": "انتهيت الليلة", "On a break": "في استراحة", "Back in the queue": "عودة إلى الطابور",
    "I’m on court ✓": "أنا في الملعب ✓", "Hurry: the host can give your spot to the next player": "أسرع: قد يمنح المضيف مكانك للاعب التالي", "🔔 Alert me when I’m up": "🔔 نبّهني عند دوري",
    "Any minute now": "خلال لحظات", "Your night": "أمسيتك", "Your season": "موسمك", "games": "مباريات", "game": "مباراة", "won": "فوز", "points": "نقاط", "at the club": "في النادي", "win rate": "نسبة الفوز", "night": "أمسية", "nights": "أمسيات",
    "Dink Different requests the pleasure of your company on": "يتشرف Dink Different بحضورك على", "Play well. Shake hands at the net.": "العب جيدًا. وصافح عند الشبكة.", "Defend it.": "حافظ عليه.", "Top of the ladder.": "في قمة السلّم.",
    "You’re up next": "دورك التالي", "Tonight:": "الليلة:", "With": "مع", "versus": "ضد", "solo": "منفردًا",
    // ---------- shop ----------
    "Club Jersey": "قميص النادي", "Court Set · Women": "طقم الملعب · للسيدات", "The Club Jersey": "قميص النادي", "Colourway": "اللون", "Edition": "الإصدار", "Standard": "قياسي", "Design": "التصميم",
    "Back print": "طباعة الظهر", "Name + number": "الاسم + الرقم", "Name only": "الاسم فقط", "Plain back": "ظهر سادة", "Name": "الاسم", "Jersey number": "رقم القميص", "Fit": "المقاس", "Size": "الحجم",
    "Men’s fit": "قصة رجالية", "Women’s fit": "قصة نسائية", "Add to bag": "أضف إلى الحقيبة", "Bag": "الحقيبة", "Front": "الأمام", "Back": "الخلف", "PRE-ORDER": "طلب مسبق", "Pre-order": "طلب مسبق",
    "Varsity": "فارسيتي", "Court blur": "ضبابية الملعب", "Heat wave": "موجة حر", "Paddle up": "ارفع المضرب", "Build yours": "صمّم قميصك", "Your bag is empty.": "حقيبتك فارغة.",
    "Name and number printed on the back for free. Up to 12 letters, numbers 0 to 99.": "الاسم والرقم يُطبعان على الظهر مجانًا. حتى 12 حرفًا، والأرقام من 0 إلى 99.",
    "Coming soon": "قريبًا", "Notify me": "أخبرني", "Size guide": "دليل المقاسات", "Checkout": "الدفع", "Total": "المجموع",
    // ---------- shop: film, panel, specs, collection, bag ----------
    "Doha · 8 PM": "الدوحة · 8 مساءً", "Courts are lit.": "الملاعب مضاءة.", "are lit.": "مضاءة.", "Introducing": "نقدّم", "Cut for the court.": "مُفصّل للملعب.", "Your name · your number": "اسمك · رقمك", "Made for you.": "صُنع لك.",
    "For her": "لها", "The Court Set.": "طقم الملعب.", "Four designs": "أربعة تصاميم", "One club.": "نادٍ واحد.", "New · Drop 02": "جديد · الإصدار 02", "The Clubhouse Collection.": "مجموعة النادي.",
    "Your shirt": "قميصك", "Your name. Your number.": "اسمك. رقمك.", "Fawran": "فوران", "Pay first": "ادفع أولًا", "Send to": "أرسل إلى", "Amount": "المبلغ", "Reference": "المرجع", "✓ Paid · order confirmed": "✓ تم الدفع · تم تأكيد الطلب",
    "Pay by Fawran. Pick up on court.": "ادفع عبر فوران. واستلم في الملعب.", "Dink Different · Pickleball Club": "Dink Different · نادي بيكل بول", "Pre-order ·": "طلب مسبق ·", "Sound off": "الصوت مغلق",
    "Club shop · Drop 01": "متجر النادي · الإصدار 01", "Make it yours.": "اجعله لك.",
    "Our dry-fit pickleball jersey, in four designs: Varsity (the main kit), Court blur, Heat wave or Paddle up. Moisture-wicking performance mesh, fully sublimated, with your number sprayed big on the back. Name and number free.": "قميص البيكل بول المقاوم للعرق بأربعة تصاميم: فارسيتي (الزي الرئيسي)، ضبابية الملعب، موجة حر، أو ارفع المضرب. شبك رياضي يطرد الرطوبة، مطبوع بالكامل، ورقمك كبير على الظهر. الاسم والرقم مجانًا.",
    "Clubhouse Navy": "كحلي النادي", "Navy · brass": "كحلي · نحاسي", "Oatmeal": "بيج الشوفان", "Oatmeal · navy": "بيج · كحلي", "Midnight Ivory": "منتصف الليل العاجي", "Midnight · ivory": "داكن · عاجي", "Pearl": "لؤلؤي", "Pearl · navy": "لؤلؤي · كحلي",
    "Camel": "جملي", "Camel · ivory": "جملي · عاجي", "Stone": "حجري", "Stone · oxblood": "حجري · عنابي", "Oxblood": "عنابي", "Oxblood · sand": "عنابي · رملي", "Ivory": "عاجي", "Bone": "عظمي", "Club Navy": "كحلي النادي", "Optic White": "أبيض ناصع",
    "The 20 · numbered · +60 QAR": "الـ20 · مرقّم · +60 ريال", "Order on WhatsApp": "اطلب عبر واتساب", "Your shirt code": "رمز قميصك", "Every shirt gets its own woven code on the hem, made from your name.": "لكل قميص رمز منسوج خاص على الحافة، مصنوع من اسمك.",
    "Made to order. Ready in about 3 weeks.": "يُصنع عند الطلب. جاهز خلال 3 أسابيع تقريبًا.", "Court cut": "قصة الملعب", "Slim athletic fit with a curved shirt-tail hem and side vents.": "قصة رياضية ضيقة بحافة منحنية وفتحات جانبية.",
    "The spray number": "الرقم المرشوش", "Your number sprayed big across the back, fading into grain. Sublimated, so it never cracks.": "رقمك كبير على الظهر بتدرّج حبيبي. مطبوع بالتسامي فلا يتشقق أبدًا.",
    "The club lockup": "شعار النادي", "A varsity chest graphic: Pickleball Club over the Dink Different script, a ball and crossed paddles.": "رسمة صدر جامعية: «Pickleball Club» فوق خط Dink Different، مع كرة ومضربين متقاطعين.",
    "Dry-fit performance mesh": "شبك رياضي مقاوم للعرق", "100% polyester bird-eye mesh, about 140 gsm. Moisture-wicking and quick-drying for Doha nights.": "شبك بوليستر 100% بنسيج عين الطائر، حوالي 140 غرامًا. يطرد الرطوبة ويجف سريعًا لأمسيات الدوحة.",
    "Full sublimation": "طباعة كاملة بالتسامي", "Colours are dyed into the fabric. They won't crack or peel.": "الألوان مصبوغة داخل القماش. لا تتشقق ولا تتقشر.", "Mesh side panels": "ألواح جانبية شبكية", "Airflow where you need it during long rallies.": "تهوية حيث تحتاجها في التبادلات الطويلة.",
    "Clean sleeves": "أكمام نظيفة", "Set-in sleeves cut for a full swing, no stripes, nothing to distract.": "أكمام مركّبة لحرية الضربة الكاملة، بلا خطوط ولا ما يشتت.",
    "Approximate chest width laid flat, in cm. Between sizes? Go one up for a relaxed fit.": "عرض الصدر التقريبي ممددًا، بالسنتيمتر. بين مقاسين؟ اختر الأكبر لقصة مريحة.", "Chest": "الصدر",
    "Drop 02 · The Clubhouse Collection · Series III": "الإصدار 02 · مجموعة النادي · السلسلة الثالثة", "Printed like the old clubs,": "مطبوعة كالأندية العريقة،", "played like the new.": "وتُلعب بروح جديدة.",
    "Eighteen graphic tees drawn in the club’s own hand: a painted court map, a real halftone ball, the House Rules, the 0–0–2 call, game to eleven and more. 240 gsm combed cotton, garment-dyed, screen-printed in water-based inks, with a woven neck label. Made in small runs.": "ثمانية عشر قميصًا مرسومًا بيد النادي: خريطة ملعب مرسومة، وكرة بنقاط حقيقية، وقواعد النادي، ونداء 0–0–2، والمباراة حتى 11 وغيرها. قطن ممشط 240 غرامًا، مصبوغ بعد الخياطة، ومطبوع بأحبار مائية، مع ملصق رقبة منسوج. يُصنع بكميات صغيرة.",
    "See the front": "شاهد الأمام", "See the back": "شاهد الخلف", "Court Map Tee": "قميص خريطة الملعب", "Courtside Social Tee": "قميص أمسيات الملعب", "Halftone Tee": "قميص النقاط", "Purpose Tee": "قميص الهدف", "Static Tee": "قميص التشويش",
    "House Rules Tee": "قميص قواعد النادي", "0 · 0 · 2 Tee": "قميص 0·0·2", "Eleven Tee": "قميص الحادي عشر", "Kit List Tee": "قميص قائمة العُدّة", "Club de Pickleball Tee": "قميص نادي البيكل بول", "Doha Script Tee": "قميص الدوحة",
    "Le Club Tee": "قميص لو كلوب", "Club Goods Tee": "قميص بضائع النادي", "Pickleball Clubs Doha Tee": "قميص أندية الدوحة", "Varsity Club Tee": "قميص النادي الجامعي", "Thursdays Tee": "قميص الخميس", "Kitchen Club Tee": "قميص نادي المطبخ", "Off Court Tee": "قميص خارج الملعب",
    "A painted pickleball court across the back, every zone annotated like a field guide. Distressed screen print, three inks.": "ملعب بيكل بول مرسوم على الظهر، كل منطقة موضّحة كدليل ميداني. طباعة بثلاثة أحبار بلمسة معتّقة.",
    "Three line-drawn balls stacked inside an arch of type, for the nights that run late. Two-ink back print.": "ثلاث كرات مرسومة بالخطوط داخل قوس من الكلمات، للأمسيات الطويلة. طباعة ظهر بحبرين.",
    "A real halftone pickleball, every dot sized by the light, with the club’s favourite line curving under it. One ink.": "كرة بيكل بول بنقاط حقيقية، كل نقطة بحجم الضوء، وتحتها عبارة النادي المفضّلة. حبر واحد.",
    "An airbrushed ball mid-flight across the shoulders and one line of copy. Simulated-process print, soft to the touch.": "كرة مرسومة بالبخاخ في منتصف الطيران عبر الكتفين وسطر واحد. طباعة ناعمة الملمس.",
    "A sprayed, out-of-focus word with the crisp italic set on top, and three small lines of club code underneath.": "كلمة مرشوشة ضبابية وفوقها خط مائل واضح، وتحتها ثلاثة أسطر صغيرة من آداب النادي.",
    "Six rules of the Kitchen, set like a clubhouse notice. Every new member gets the speech; now they get the shirt.": "ست قواعد للمطبخ كلوحة إعلانات النادي. كل عضو جديد يسمعها؛ والآن يرتديها.",
    "The first call of every game, set big, with a scorecard from a good night underneath. Only pickleball players get it.": "النداء الأول في كل مباراة بخط كبير، وتحته بطاقة نتائج من أمسية جميلة. لا يفهمها إلا لاعبو البيكل بول.",
    "Game to eleven, sprayed big across the back and fading into grain. Win by two.": "المباراة حتى 11، مرشوشة كبيرة على الظهر بتدرّج حبيبي. الفوز بفارق نقطتين.",
    "Nine small drawings of a Dink Different night: paddle, ball, cap, karak, floodlight and the rest. Two inks.": "تسع رسومات صغيرة لأمسية Dink Different: مضرب، كرة، قبعة، كرك، كشاف وغيرها. حبران.",
    "A retro club poster on the back: the court in two brass planes, a ball and its shadow. Three inks, 70s-print feel.": "ملصق نادٍ كلاسيكي على الظهر: الملعب بمستويين نحاسيين، وكرة وظلها. ثلاثة أحبار بروح السبعينيات.",
    "A small script across the chest with a pickleball for the o. All season long. Quiet, and very Dink Different.": "خط صغير على الصدر وكرة بيكل بول مكان حرف o. طوال الموسم. هادئ، وDink Different جدًا.",
    "A painted paddle and the club name brushed across it, with the opening hours stamped on the side. Three inks.": "مضرب مرسوم واسم النادي بالفرشاة عليه، ومواعيد الفتح مختومة على الجانب. ثلاثة أحبار.",
    "A stacked club lockup, three hatched balls and a stamped oval. Paddles and good company, for the soft-handed.": "شعار نادٍ متراكب، وثلاث كرات مظللة، وختم بيضاوي. مضارب وصحبة طيبة، لأصحاب الأيدي الناعمة.",
    "A vintage oval of the Doha skyline over a court at golden hour, stacked club type and a script underneath. One ink.": "إطار بيضاوي كلاسيكي لأفق الدوحة فوق ملعب في الساعة الذهبية، مع اسم النادي وخط يدوي تحته. حبر واحد.",
    "A big chest lockup in the spirit of old club whites: the script over a court box, crossed paddles underneath.": "شعار صدر كبير بروح أزياء الأندية البيضاء القديمة: الخط فوق مربع ملعب، ومضربان متقاطعان تحته.",
    "Thursdays are for Pickleball. Set in the club serif across the shoulders, for every regular.": "الخميس للبيكل بول. بخط النادي عبر الكتفين، لكل لاعب دائم.",
    "A paddle drawn as one long swoosh around the club name. Small, embroidered-look chest print, one ink.": "مضرب مرسوم بخط واحد طويل حول اسم النادي. طباعة صدر صغيرة بمظهر التطريز، حبر واحد.",
    "Off court with Dink Different: a word grid with the ball, the net and the kitchen line standing in for letters. One ink.": "خارج الملعب مع Dink Different: شبكة كلمات تحل فيها الكرة والشبكة وخط المطبخ محل الحروف. حبر واحد.",
    "Teams and tournaments": "الفرق والبطولات", "Kitting out a squad?": "تجهّز فريقًا؟", "Let’s talk.": "لنتحدث.",
    "Matching jerseys for your tournament team, with every player’s name and number. Message us with your team name and sizes and we’ll send a quote.": "قمصان متطابقة لفريق بطولتك، باسم ورقم كل لاعب. راسلنا باسم الفريق والمقاسات وسنرسل لك عرض سعر.",
    "Get a team quote": "اطلب عرض سعر للفريق", "On the way": "في الطريق", "Caps, towels, paddle covers and more are in the works. Tap “Notify me” and we’ll message you when they land.": "قبعات ومناشف وأغطية مضارب وغيرها قيد التحضير. اضغط «أخبرني» وسنراسلك عند وصولها.",
    "Night Session Hoodie": "هودي الأمسيات", "For January nights when the breeze picks up. Brushed fleece, puff-print logo.": "لليالي يناير حين يشتد النسيم. صوف ناعم وشعار بطباعة بارزة.",
    "The Club Cap": "قبعة النادي", "Six-panel club cap with the Different D embroidered in navy and a brass-stitched strap. One size.": "قبعة من ست قطع مطرّز عليها حرف D باللون الكحلي وحزام بخياطة نحاسية. مقاس واحد.",
    "The Clubhouse Paddle Cover": "غطاء مضرب النادي", "Padded navy sleeve with the Different D stitched in brass. Fits standard paddles.": "غطاء كحلي مبطّن بحرف D مخيط بالنحاسي. يناسب المضارب القياسية.",
    "Courtside Towel": "منشفة الملعب", "Quick-dry microfibre with a fine heritage stripe. Clips to your bag.": "ألياف دقيقة سريعة الجفاف بخط كلاسيكي رفيع. تُعلَّق بحقيبتك.",
    "Club Balls · 3 pack": "كرات النادي · 3 قطع", "Outdoor balls stamped with the Dink Different crest. Play well.": "كرات خارجية بختم شعار Dink Different. العب جيدًا.",
    "Dinker Sticker Pack": "حزمة ملصقات اللاعبين", "Six waterproof stickers for paddles, bottles and laptops.": "ستة ملصقات مقاومة للماء للمضارب والقوارير والحواسيب.",
    "Kitchen Line Bottle": "قارورة خط المطبخ", "Insulated steel, keeps water cold through four hours of open play.": "فولاذ معزول يحفظ الماء باردًا طوال أربع ساعات من اللعب.",
    "© Dink Different Pickleball Club · Dink different.": "© نادي Dink Different للبيكل بول", "Home": "الرئيسية", "Live queue": "الطابور المباشر",
    "Your bag": "حقيبتك", "Pay first, then we make your order": "ادفع أولًا، ثم نصنع طلبك", "Copy": "نسخ", "Send the Fawran payment. Add the reference as the note.": "أرسل الدفعة عبر فوران. أضف المرجع في الملاحظة.",
    "Tap the button below to send your order on WhatsApp.": "اضغط الزر أدناه لإرسال طلبك عبر واتساب.", "Attach your Fawran receipt screenshot in the chat.": "أرفق لقطة شاشة إيصال فوران في المحادثة.",
    "Your name (for pick-up)": "اسمك (للاستلام)", "I’ve sent the Fawran payment": "أرسلت الدفعة عبر فوران", "Send order and receipt on WhatsApp": "أرسل الطلب والإيصال عبر واتساب",
    "Goes to +974 3076 3431. No reply? Try": "يُرسل إلى ‎+974 3076 3431. لا رد؟ جرّب", "Copy your order and show it at the check-in table.": "انسخ طلبك واعرضه عند طاولة التسجيل.", "Copy order": "نسخ الطلب",
    // homepage leftovers
    "The Invitational.": "البطولة.", "✓ Joined": "✓ انضممت", "Team TBA": "الفريق يُعلن لاحقًا", "Night created. Paddles up!": "بدأت الأمسية. المضارب للأعلى!",
  };
  // Live text with numbers or names in it
  var PAT = [
    [/^(\d+) games?$/, function (m) { return m[1] + " مباراة"; }], [/^(\d+) waiting$/, function (m) { return m[1] + " في الانتظار"; }],
    [/^(\d+) ahead of you$/, function (m) { return m[1] + " قبلك"; }], [/^About (\d+) min$/, function (m) { return "حوالي " + m[1] + " دقيقة"; }],
    [/^Court (\d+)$/, function (m) { return "الملعب " + m[1]; }], [/^Stay on Court (\d+)$/, function (m) { return "ابقَ في الملعب " + m[1]; }],
    [/^(\d+) courts? in play$/, function (m) { return m[1] + " ملاعب قيد اللعب"; }], [/^(\d+) of (\d+) courts playing$/, function (m) { return m[1] + " من " + m[2] + " ملاعب قيد اللعب"; }],
    [/^Not (.+)\?$/, function (m) { return "لست " + m[1] + "؟"; }], [/^Hi (.+)$/, function (m) { return "مرحبًا " + m[1]; }], [/^Join as (.+)$/, function (m) { return "انضم باسم " + m[1]; }],
    [/^✓ You’re checked in on Court (\d+)$/, function (m) { return "✓ تم تسجيل حضورك في الملعب " + m[1]; }],
    [/^Tap within (\d+:\d+) or your spot goes to the next player$/, function (m) { return "اضغط خلال " + m[1] + " وإلا يذهب مكانك للاعب التالي"; }],
    [/^(\d+) points? to pass$/, function (m) { return m[1] + " نقاط لتتجاوز"; }], [/^Queue: (\d+)$/, function (m) { return "الطابور: " + m[1]; }], [/^Games played: (\d+)$/, function (m) { return "المباريات: " + m[1]; }],
    [/^(\d+) nights? since (.+) · 3 pts a win, 1 a game, 1 a night$/, function (m) { return m[1] + " أمسيات منذ " + m[2] + " · 3 نقاط للفوز، 1 للمباراة، 1 للأمسية"; }],
    [/^(\d+) of (\d+) left · Reserve$/, function (m) { return "متبقٍ " + m[1] + " من " + m[2] + " · احجز"; }],
    [/^(\d+) of (\d+) left$/, function (m) { return "متبقٍ " + m[1] + " من " + m[2]; }],
    [/^Payment received, (.+)\. Your queue PIN:$/, function (m) { return "تم استلام الدفعة يا " + m[1] + ". رمز الطابور:"; }],
    [/^(.+) takes the gold$/, function (m) { return m[1] + " يفوز بالذهبية"; }],
    // game log lines: "12:59 PM · ..." keep the time, translate the sentence
    [/^(\d{1,2}:\d{2}\s?[AP]M) · (.+) checked in$/, function (m) { return m[1] + " · سجّل " + m[2] + " حضوره"; }],
    [/^(\d{1,2}:\d{2}\s?[AP]M) · (.+) is on court (\d+)$/, function (m) { return m[1] + " · " + m[2] + " في الملعب " + m[3]; }],
    [/^(\d{1,2}:\d{2}\s?[AP]M) · (.+) is taking a break$/, function (m) { return m[1] + " · " + m[2] + " في استراحة"; }],
    [/^(\d{1,2}:\d{2}\s?[AP]M) · (.+) is back$/, function (m) { return m[1] + " · عاد " + m[2]; }],
    [/^(\d{1,2}:\d{2}\s?[AP]M) · Night created\. Paddles up!$/, function (m) { return m[1] + " · بدأت الأمسية. المضارب للأعلى!"; }],
    [/^(\d{1,2}:\d{2}\s?[AP]M) · Court (\d+): (.+) vs (.+?)(?: \((even|close|uneven) match\))?$/, function (m) { return m[1] + " · الملعب " + m[2] + ": " + m[3] + " ضد " + m[4] + (m[5] ? " (" + { even: "متكافئة", close: "متقاربة", uneven: "غير متكافئة" }[m[5]] + ")" : ""); }],
    [/^(\d{1,2}:\d{2}\s?[AP]M) · Court (\d+): (.+) didn’t show, so (.+) plays\. (.+) goes to the back of the queue$/, function (m) { return m[1] + " · الملعب " + m[2] + ": لم يحضر " + m[3] + " فيلعب " + m[4] + ". يعود " + m[5] + " إلى آخر الطابور"; }],
  ];
  var lang = "en"; try { lang = localStorage.getItem(KEY) || "en"; } catch (e) {}
  var orig = new WeakMap(), origAttr = new WeakMap();
  function tr(s) {
    var t = s.trim(); if (!t) return null;
    if (AR[t] !== undefined) return s.replace(t, AR[t]);
    for (var i = 0; i < PAT.length; i++) { var m = t.match(PAT[i][0]); if (m) return s.replace(t, PAT[i][1](m)); }
    return null;
  }
  function walk(root) {
    if (lang !== "ar" || !root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { var p = n.parentElement; return !p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.tagName) || p.closest("[data-no-tr],svg") ? 2 : 1; } }), n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (n) { var cur = n.nodeValue, base = orig.has(n) ? orig.get(n) : cur; if (orig.has(n) && cur !== orig.get(n).__ar) base = cur;
      var out = tr(base); if (out !== null && out !== cur) { orig.set(n, Object.assign(new String(base), { __ar: out })); n.nodeValue = out; } });
    (root.querySelectorAll ? root.querySelectorAll("[placeholder]") : []).forEach(function (el) { var ph = el.getAttribute("placeholder"); if (!origAttr.has(el)) origAttr.set(el, ph);
      var o = origAttr.get(el), m = { "Your name (e.g. Angel K.)": "اسمك (مثال: \u2066Angel K.\u2069)", "Partner’s name": "اسم الشريك", "e.g. 3076 3431": "مثال: 3076 3431", "e.g. ANGEL": "مثال: ANGEL" }[o]; if (m) el.setAttribute("placeholder", m); });
  }
  var css = document.createElement("style");
  css.textContent = 'html[lang=ar] body,html[lang=ar] button,html[lang=ar] input,html[lang=ar] select{font-family:"IBM Plex Sans Arabic","DM Sans",system-ui,sans-serif!important}' +
    'html[lang=ar] h1,html[lang=ar] h2,html[lang=ar] h3,html[lang=ar] h4,html[lang=ar] .f,html[lang=ar] .display{font-family:"Noto Naskh Arabic",Fraunces,serif!important}' +
    'html[lang=ar] *{letter-spacing:0!important}html[lang=ar] .eyebrow,html[lang=ar] [class*=eyebrow],html[lang=ar] small,html[lang=ar] .k{text-transform:none!important}' +
    '#dd-lang .ls{display:none}@media(max-width:480px){.nav #dd-lang .lf{display:none}.nav #dd-lang .ls{display:inline}.nav #dd-lang{padding:7px 11px!important;min-width:34px}}.nav #dd-lang{position:static;box-shadow:none;padding:7px 12px;font-size:13px;flex:none;margin-inline-start:auto}#dd-lang{position:fixed;left:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:89;border:0;border-radius:999px;padding:9px 14px;background:#1D2840;color:#F4EFE3;font:700 14px "IBM Plex Sans Arabic","DM Sans",system-ui,sans-serif;box-shadow:0 8px 22px rgba(0,0,0,.25);cursor:pointer}' +
    'html[dir=rtl],html[dir=rtl] body{overflow-x:clip}';
  document.head.appendChild(css);
  if (lang === "ar") { var f = document.createElement("link"); f.rel = "stylesheet"; f.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;700&family=Noto+Naskh+Arabic:wght@600;700&display=swap"; document.head.appendChild(f);
    document.documentElement.lang = "ar"; document.documentElement.dir = "rtl"; }
  function start() {
    var b = document.createElement("button"); b.id = "dd-lang"; b.type = "button"; b.setAttribute("data-no-tr", ""); b.innerHTML = lang === "ar" ? '<span class="lf">English</span><span class="ls">EN</span>' : '<span class="lf">العربية</span><span class="ls">ع</span>'; b.setAttribute("aria-label", lang === "ar" ? "Switch to English" : "التبديل إلى العربية");
    b.onclick = function () { try { localStorage.setItem(KEY, lang === "ar" ? "en" : "ar"); } catch (e) {} location.reload(); };
    var navWrap = document.querySelector(".nav .wrap"); if (navWrap) { var spot = navWrap.querySelector(".menubtn,.btn"); navWrap.insertBefore(b, spot || null); } else document.body.appendChild(b);
    if (lang !== "ar") return;
    walk(document.body);
    new MutationObserver(function (ms) { ms.forEach(function (m) { if (m.type === "characterData") walk(m.target.parentNode); else m.addedNodes.forEach(function (n) { walk(n.nodeType === 3 ? n.parentNode : n); }); }); })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  window.DDLang = { lang: lang, t: function (s) { return lang === "ar" ? (tr(s) || s) : s; } };
})();
