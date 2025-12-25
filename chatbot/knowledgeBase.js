// backend/knowledgeBase.js
// NaviSenpai Knowledge Base
// Target users: Foreign students in Gifu (Mizuho / Hozumi), especially Asahi University
// Language: English + simple polite Japanese
// IMPORTANT: module.exports = knowledgeBase

const knowledgeBase = [
  //
  // 1. RESIDENCE CARD + PART-TIME WORK RULES
  //
  {
    id: "part_time_work",
    keywords: [
      "residence card",
      "在留カード",
      "28 hours",
      "28h",
      "28時間",
      "part time",
      "part-time",
      "アルバイト",
      "baito",
      "資格外活動許可",
      "work permit",
      "student visa work",
      "働けますか",
      "留学生 アルバイト",
      "how many hours",
      "hours per week",
      "週何時間",
      "max hours",
      "hour limit"
    ],
    answer: {
      en: `🪪 Residence Card & Part-Time Work Rules (Student)

1. When you arrive in Japan as a mid/long-term student, Immigration gives you a Residence Card (在留カード) at the airport (major airports only).
2. You are NOT automatically allowed to work part-time. You need special permission called "資格外活動許可".
3. With this permission:
   • You can usually work up to 28 hours per week during the semester.
   • During long school vacations you may work up to 40 hours per week.
4. Working more than allowed hours, or without permission, can cause problems with visa renewal.
5. You must not work in bars, clubs, or adult/entertainment jobs. That is not allowed for students.
6. Keep your payslips. Immigration or city hall may ask.

Useful Japanese to tell a manager:
「私は留学生です。週28時間まで働くことができます。」
= "I am an international student. I am allowed to work up to 28 hours per week."`,

      jp: `🪪 在留カードとアルバイトのルール（留学生）

1. 中長期の留学生として日本に入国すると、空港で在留カードを受け取ることが多いです。
2. 留学生は自動的にアルバイトできるわけではありません。「資格外活動許可」が必要です。
3. 許可がある場合：
   ・学期中は1週間に28時間まで働けます。
   ・長期休暇中は1週間に40時間まで働ける場合があります。
4. 許可なしで働いたり、時間の上限をこえたりすると、ビザ更新に問題が出ることがあります。
5. 風俗店・バー・ナイトクラブなどの仕事は留学生はできません。
6. 給料明細は必ず保管してください。

店長に伝える日本語：
「私は留学生です。週28時間まで働くことができます。」`
    },
    // SHORT MODE: used when user asks "how many hours can I work?"
    mini: {
      en: `⌛ Work limit for students:
• During semester: max 28 hours/week.
• Long vacation: up to 40 hours/week (if permitted).
You MUST have 資格外活動許可.
Night/sex/club jobs = NOT allowed.`,
      jp: `⌛ 留学生のバイト時間：
・授業がある期間：週28時間まで
・長い休み：最大40時間のこともあります
「資格外活動許可」が必要です。
バー・風俗などはダメです。`
    }
  },

  //
  // 2. CITY HALL REGISTRATION / ADDRESS CHANGE / 住民票
  //
  {
    id: "city_hall_registration",
    keywords: [
      "city hall",
      "市役所",
      "瑞穂市役所",
      "address change",
      "住所変更",
      "転入届",
      "転居届",
      "住民票",
      "juminhyo",
      "registration",
      "14 days",
      "転出届",
      "forward mail",
      "郵便 転送",
      "mail forwarding"
    ],
    answer: {
      en: `🏢 City Hall: Address Registration & 住民票 (Certificate of Residence)

1. When you move to a new address in Japan, you must report it at city hall within 14 days.
   • From another city → file 転入届 (move-in).
   • New place in same city → file 転居届 (change of address).
   • Leaving the city → file 転出届 (moving-out).
2. Bring:
   • Residence Card (在留カード)
   • ID
   • 転出証明書 (moving-out certificate) if you came from a different city.
3. After you register, you can request a 住民票 (certificate of residence). You need 住民票 for:
   • bank account
   • SIM / phone
   • some part-time jobs
   • apartment contract
4. Also submit mail forwarding (転送届) at the post office so your mail comes to the new address.

Useful Japanese:
「転入届（または転居届）をしたいです。」
= "I would like to register my move-in / new address."`,

      jp: `🏢 市役所：住所登録と住民票

1. 新しい住所に引っ越したら、14日以内に市役所で住所の手続きをします。
   ・ほかの市から来た場合 → 「転入届」
   ・同じ市の中で引っ越した場合 → 「転居届」
   ・別の市に引っ越す場合 → 「転出届」
2. 持ち物：
   ・在留カード
   ・身分証明書
   ・別の市から来た場合は「転出証明書」
3. 手続き後、「住民票」を発行してもらえます。住民票は：
   ・銀行口座
   ・携帯/SIM契約
   ・アルバイト応募
   ・アパート契約
   などでよく必要です。
4. 郵便局で転送届を出すと、古い住所あての郵便も新しい住所に届きます。

窓口で使える日本語：
「転入届（または転居届）をしたいです。」`
    }
  },

  //
  // 3. NATIONAL HEALTH INSURANCE & PENSION
  //
  {
    id: "health_insurance",
    keywords: [
      "insurance",
      "health insurance",
      "国民健康保険",
      "pension",
      "年金",
      "保険証",
      "medical cost",
      "30 percent",
      "70 percent"
    ],
    answer: {
      en: `🏥 National Health Insurance & Pension

1. After address registration, you usually must join National Health Insurance (国民健康保険).
2. With this insurance, you normally pay ~30% of medical cost. Insurance covers ~70%.
3. You get a Health Insurance Card (保険証). Bring it when you go to a clinic/hospital.
4. The city will send you insurance bills. Pay on time.
5. Pension (年金):
   • If you are 20+ years old you must join.
   • Students can often apply for payment deferral (学生納付特例).

Emergency numbers in Japan:
• 119 = ambulance / fire
• 110 = police`,

      jp: `🏥 国民健康保険と年金

1. 住所登録のあと、多くの場合「国民健康保険」に加入します。
2. 国保に入っていると、病院・クリニックの医療費は自己負担が約30％、残り約70％は保険がカバーします。
3. 保険証（ほけんしょう）が発行されます。病院に行くときは必ず持って行きます。
4. 市役所から保険料の請求書が来ます。期限どおりに支払いましょう。
5. 年金（国民年金）：
   ・20歳以上の人は加入が必要です。
   ・学生は「学生納付特例」で支払いを遅らせることができる場合があります。

日本の緊急番号：
・119 = 救急・消防
・110 = 警察`
    }
  },

  //
  // 4. ASAHI UNIVERSITY HEALTH SUPPORT
  //
  {
    id: "asahi_health",
    keywords: [
      "asahi university clinic",
      "asahi university hospital",
      "free medicine",
      "学生 クリニック",
      "朝日大学 病院",
      "health center",
      "医務室",
      "体調不良"
    ],
    answer: {
      en: `🏥 Health Support at Asahi University

1. Asahi University provides on-campus health support for students.
2. Based on student experience, basic check and simple medicine can be provided with no extra charge for Asahi University students.
3. Good for fever, stomach pain, cold symptoms.
4. For serious problems you may be sent to an outside hospital. Bring your Health Insurance Card (保険証).
5. If you suddenly feel very sick, tell a classmate / teacher / staff right away.

Useful Japanese:
「少し体調が悪いので、医務室に行ってもいいですか？」
= "I don't feel well. May I go to the health clinic?"`,

      jp: `🏥 朝日大学の健康サポート

1. 朝日大学には学生向けの健康サポートがあります。
2. 学生の体験では、軽い不調ならチェックや簡単な薬を無料でもらえる場合があります。
3. 熱・おなかの痛み・かぜ症状などのとき便利です。
4. 重い症状のときは外部の病院を案内される場合があります。その場合は保険証が必要です。
5. 急に具合が悪いときは、すぐ先生やスタッフに伝えてください。

使える日本語：
「少し体調が悪いので、医務室に行ってもいいですか？」`
    }
  },

  //
  // 5. SCHOOL ATTENDANCE / VISA RESPONSIBILITY
  //
  {
    id: "attendance",
    keywords: [
      "attendance",
      "skip class",
      "absent",
      "授業 休む",
      "出席",
      "ビザ",
      "留学生 出席率"
    ],
    answer: {
      en: `🎓 Attendance and Your Student Visa

1. Low attendance can cause problems with your school and even with visa renewal.
2. Many programs expect 80%+ attendance.
3. If you are sick, inform the school politely.
4. Do not work so many part-time hours that you stop going to class.

Useful Japanese:
「すみません、体調が悪いので本日お休みさせていただきます。」
= "Excuse me, I am not feeling well, so I will be absent today."

「授業に遅れそうです。申し訳ありません。」
= "I might be late to class. I'm sorry."`,

      jp: `🎓 出席と留学生ビザ

1. 出席率が低いと、学校だけでなくビザ更新にも影響する場合があります。
2. 多くのコースでは80％以上の出席が求められます。
3. 体調が悪いときは、ていねいに学校へ連絡しましょう。
4. アルバイトが多すぎて授業に行けない状態は、とても危険です。

使える日本語：
「すみません、体調が悪いので本日お休みさせていただきます。」
「授業に遅れそうです。申し訳ありません。」`
    }
  },

  //
  // 6. VISA RENEWAL
  //
  {
    id: "visa_renewal",
    keywords: [
      "visa renew",
      "visa renewal",
      "在留期間更新",
      "ビザ更新",
      "留学ビザ 更新",
      "immigration office",
      "入管",
      "student visa extend"
    ],
    answer: {
      en: `🛂 Student Visa Renewal (在留期間更新)

1. Your Residence Card has an expiration date. Renew before it expires.
2. Renewal is done at Immigration (入管), not city hall.
3. You need documents from school:
   • Enrollment certificate
   • Attendance/grades
   • Tuition proof
   • Proof you can afford to live (bank balance, sponsor, etc.)
4. Immigration checks if you are really studying.
5. Start early.

Useful Japanese:
「在留期間の更新をしたいです。留学生です。」
= "I would like to renew my period of stay. I am an international student."`,

      jp: `🛂 留学生ビザの更新

1. 在留カードには有効期限があります。期限前に更新が必要です。
2. 手続きは市役所ではなく入管（出入国在留管理局）で行います。
3. 必要書類の例：
   ・在学証明書
   ・出席・成績
   ・授業料の支払い証明
   ・生活できる資金の証明（銀行残高など）
4. 入管は「本当に勉強しているか」を確認します。
5. 早めの準備が大切です。

入管で使える日本語：
「在留期間の更新をしたいです。留学生です。」`
    }
  },

  //
  // 7. HOUSING / APARTMENTS
  //
  {
    id: "housing",
    keywords: [
      "apartment",
      "housing",
      "アパート",
      "部屋探し",
      "礼金",
      "敷金",
      "保証人",
      "nissho",
      "ニッショー",
      "エイブル",
      "レオパレス",
      "mizuho housing",
      "朝日大学 住まい"
    ],
    answer: {
      en: `🏠 Renting Near Asahi University (Mizuho / Hozumi)

1. Ask Asahi University if they can introduce student-friendly housing.
2. Private agencies: ニッショー (Nissho), エイブル (Able), レオパレス, etc.
3. Upfront costs:
   • 敷金 (deposit, sometimes refundable)
   • 礼金 (key money, not refundable)
   • 仲介手数料 (agency fee)
   • Guarantor/guarantor company fee
4. Rules:
   • Quiet after ~22:00
   • Sort trash correctly
   • No large parties
5. After you move, update address at city hall within 14 days.

Useful Japanese:
「留学生でも契約できますか？保証人は必要ですか？」
= "Can an international student sign the contract? Do I need a guarantor?"`,

      jp: `🏠 朝日大学周辺（瑞穂市・穂積エリア）での部屋探し

1. 大学が留学生向けの物件を紹介してくれる場合があります。まず相談してみましょう。
2. 個人で探す場合は、ニッショー・エイブル・レオパレスなどの不動産会社があります。
3. 入居時にかかる費用：
   ・敷金（デポジット。戻ることがあります）
   ・礼金（お礼のお金。戻りません）
   ・仲介手数料（不動産会社の手数料）
   ・保証会社の費用（保証人がいない場合）
4. ルール：
   ・夜22時以降は静かにする
   ・ごみの分別を守る
   ・大きいパーティーはしない
5. 引っ越したら14日以内に市役所で住所変更が必要です。

使える日本語：
「留学生でも契約できますか？保証人は必要ですか？」`
    }
  },

  //
  // 8. PART-TIME JOB / CV / INTERVIEW
  //
  {
    id: "job_search",
    keywords: [
      "job",
      "part time job",
      "アルバイト探し",
      "履歴書",
      "rirekisho",
      "cv",
      "interview",
      "志望動機",
      "シフト",
      "店長"
    ],
    answer: {
      en: `💼 How to Get a Part-Time Job (アルバイト)

1. Get your work permission first (資格外活動許可).
2. Where to find jobs:
   • Posters: "スタッフ募集"
   • Job sites
   • University career support / senpai
3. You usually need a 履歴書 (Japanese-style CV) with:
   • Name / address / phone
   • Visa type (Student) + permission to work
   • Education / experience
   • When you can work
   • Motivation (志望動機)
4. Be polite and on time.
   Useful phrases:
   「本日は面接の機会をありがとうございます。」
   = "Thank you for the interview opportunity today."

   「学生ビザで、週28時間まで働くことができます。」
   = "I can work up to 28 hours per week on a student visa."
5. After hiring they usually ask:
   • Bank account (for salary)
   • My Number
   • Residence Card copy
6. Never accept illegal work (too many hours, dangerous bars).`,

      jp: `💼 アルバイトの見つけ方・面接マナー

1. まず「資格外活動許可」を取ります。
2. バイト探しの場所：
   ・「スタッフ募集」のポスター
   ・求人サイト
   ・大学のサポート・先輩の紹介
3. 日本では「履歴書（りれきしょ）」を出すことが多いです。履歴書には：
   ・名前・住所・電話番号
   ・在留資格（留学生）とアルバイト許可
   ・学歴・職歴
   ・働ける曜日と時間
   ・志望動機（なぜここで働きたいか）
4. 面接では、ていねいに・時間どおりに行きます。
   使える日本語：
   「本日は面接の機会をありがとうございます。」
   「学生ビザで、週28時間まで働くことができます。」

5. 採用されたら、店長から：
   ・銀行口座
   ・マイナンバー
   ・在留カードのコピー
   を求められることがあります。
6. 違法な働き方（深夜の危険な店など）は「はい」と言わないでください。`
    }
  },

  //
  // 9. TRANSPORT RULES
  //
  {
    id: "transport_rules",
    keywords: [
      "bicycle",
      "bike rules",
      "自転車",
      "cycling law",
      "train",
      "bus",
      "電車",
      "バス",
      "IC card",
      "TOICA",
      "manaca"
    ],
    answer: {
      en: `🚲 Transportation Rules (Bicycle / Train / Bus)

Bicycle:
1. Ride on the left.
2. Turn on your light at night.
3. No phone-in-hand or umbrella riding.
4. Do not ride after drinking alcohol (illegal).
5. Stop at red lights. Respect pedestrians.
6. Helmet is recommended.

Train / Bus:
1. Use IC card (TOICA / manaca) or ticket.
2. Line up. Let people get off first.
3. Keep phone on silent, don't talk loudly.
4. Offer priority seats.
5. Do not eat strong-smelling food.

Emergency numbers:
・119 = ambulance / fire
・110 = police`,

      jp: `🚲 交通ルール（自転車・電車・バス）

自転車：
1. 左側を走ります。
2. 夜はライトをつけます（義務です）。
3. スマホを見ながら / 傘をさしながら運転しないでください。
4. 飲酒後の自転車運転は禁止です。
5. 赤信号では止まります。歩行者を優先します。
6. ヘルメット着用がすすめられています。

電車・バス：
1. TOICAやmanacaなどのICカード、または切符を使います。
2. 列に並び、先に降りる人を待ってから乗ります。
3. 携帯はマナーモード。大声で話さない。
4. 優先席は必要な人にゆずります。
5. においの強い食べ物は避けてください。

緊急番号：
・119 = 救急・消防
・110 = 警察`
    }
  },

  //
  // 10. TAXES / CITY BILLS
  //
  {
    id: "taxes",
    keywords: [
      "tax",
      "住民税",
      "insurance bill",
      "保険料",
      "city bill",
      "請求書",
      "未払い",
      "年金",
      "国民健康保険料"
    ],
    answer: {
      en: `💸 Taxes, Insurance Bills, and City Invoices

1. Part-time jobs may take a little tax from your pay.
2. The city will send you bills for:
   • National Health Insurance
   • Sometimes Resident Tax (住民税), depending on last year's income
3. You must pay these. Ignoring them causes problems with visa renewal and city services.
4. If you don't understand, ask at city hall or ask a trusted senpai. Do not throw it away.
5. Before leaving Japan permanently, settle unpaid bills.

Useful Japanese:
「この請求書の説明をお願いできますか？」
= "Could you please explain this bill to me?"`,

      jp: `💸 税金・市役所からの請求書

1. アルバイトの給料から税金が引かれることがあります。
2. 市役所から届くことがある請求書：
   ・国民健康保険料
   ・住民税（前の年の収入による）
3. これらは支払う必要があります。無視するとビザ更新などで困ることがあります。
4. 分からない場合は、市役所や先輩などに相談してください。放置しないでください。
5. 日本を離れる前に、未払いがないか確認しましょう。

使える日本語：
「この請求書の説明をお願いできますか？」`
    }
  },

  //
  // 11. MY NUMBER
  //
  {
    id: "my_number",
    keywords: [
      "my number",
      "マイナンバー",
      "mynumber card",
      "マイナンバーカード",
      "12 digit",
      "tax id"
    ],
    answer: {
      en: `🆔 My Number (マイナンバー)

1. Everyone in Japan has a 12-digit "My Number". It's used for tax and official paperwork.
2. Your part-time job may ask for it. That is normal.
3. Keep it private. Do not give it to strangers.
4. If you lose your My Number Card, contact city hall quickly.

Useful Japanese:
「マイナンバーカードの再発行をお願いしたいです。」
= "I would like to request reissue of my My Number Card."`,

      jp: `🆔 マイナンバー

1. 日本に住んでいる人には12けたのマイナンバーがあります。税金などの手続きに使います。
2. アルバイト先からマイナンバーを聞かれることがあります。ふつうの手続きです。
3. 他人にむやみに教えないでください。とても大事な番号です。
4. マイナンバーカードをなくしたら、市役所にすぐ相談してください。

使える日本語：
「マイナンバーカードの再発行をお願いしたいです。」`
    }
  },

  //
  // 12. DRIVING LICENSE
  //
  {
    id: "driving_license",
    keywords: [
      "driving license",
      "運転免許",
      "免許 切り替え",
      "license convert",
      "scooter",
      "原付",
      "driving in japan"
    ],
    answer: {
      en: `🚗 Driving License in Japan

1. You need a valid Japanese license or approved conversion to drive.
2. Some countries can convert their home license at the police licensing center.
3. You will need:
   • Your foreign license
   • Official translation
   • Residence Card
   • Sometimes an eyesight/driving check
4. No license = do not drive, even scooters.
5. Drinking + driving is a serious crime.

Useful Japanese:
「外国の免許を日本の免許に切り替えたいです。」
= "I would like to convert my foreign driver's license to a Japanese license."`,

      jp: `🚗 日本での運転免許

1. 日本で運転するには、日本の運転免許証、または有効な切り替えが必要です。
2. 国によっては、外国の免許を日本の免許に切り替えることができます。
3. よく必要なもの：
   ・外国の免許証
   ・免許証の翻訳
   ・在留カード
   ・視力検査や簡単な運転チェックなど
4. 免許がないのに運転するのは違法です。原付バイクも同じです。
5. 飲酒運転はとても重い犯罪です。

使える日本語：
「外国の免許を日本の免許に切り替えたいです。」`
    }
  },

  //
  // 13. SIM CARD / PHONE
  //
  {
    id: "sim_card",
    keywords: [
      "sim card",
      "SIMカード",
      "phone plan",
      "携帯契約",
      "mobile data",
      "prepaid sim",
      "phone number",
      "日本の電話番号"
    ],
    answer: {
      en: `📱 Getting a SIM Card / Phone Number

1. After address registration, you can sign up for a SIM.
2. Bring:
   • Residence Card
   • Proof of address (住民票 or utility bill)
   • Payment (credit card or JP bank)
3. Options:
   • Big carriers (SoftBank / au / Docomo / Rakuten Mobile)
   • English-friendly student services (Sakura Mobile, Mobal, etc.)
4. You can choose prepaid (short-term) or monthly (cheaper long-term).
5. A Japanese phone number helps with:
   • part-time jobs
   • apartment contracts
   • bank account
6. Before leaving Japan, cancel the plan. Do not leave unpaid bills.

Useful Japanese:
「音声つきSIMカードを契約したいです。」
= "I would like to get a SIM card with voice (phone number)."`,

      jp: `📱 日本でSIMカード／電話番号を作る

1. 住所登録のあと、SIMカードを契約しやすくなります。
2. 必要なもの：
   ・在留カード
   ・住所がわかる書類（住民票や公共料金の明細など）
   ・支払い方法（クレジットカードや銀行口座など）
3. 選べるタイプ：
   ・大手キャリア（ソフトバンク・au・ドコモ・楽天モバイル）
   ・留学生向けの英語サポート付きサービス（Sakura Mobileなど）
4. プリペイド型（短期）と月額プラン（長期向け／安い場合あり）があります。
5. 日本の電話番号は、アルバイト応募・アパート契約・銀行口座などで役に立ちます。
6. 日本を離れる前には必ず解約してください。未払いはトラブルになります。

使える日本語：
「音声つきSIMカードを契約したいです。」`
    }
  },

  //
  // 14. DAILY RULES / CULTURE
  //
  {
    id: "japan_rules_manners",
    keywords: [
      "rules of japan",
      "manners",
      "マナー",
      "生活ルール",
      "quiet time",
      "公共マナー",
      "電車 マナー",
      "time manners",
      "遅刻"
    ],
    answer: {
      en: `🇯🇵 Everyday Rules and Manners

1. Be on time. Being late with no message is considered rude.
2. Be quiet in your apartment at night (~22:00 and later).
3. Sort garbage correctly. Ask your landlord for the rule sheet.
4. On trains/buses:
   • Phone on silent.
   • Do not talk loudly.
   • Offer seats to elderly, injured, pregnant.
5. Do not just ignore letters from city hall or the tax office. Ask for help.

Useful Japanese:
「すみません、もう少しゆっくり話していただけますか？」
= "Excuse me, could you please speak a little more slowly?"`,

      jp: `🇯🇵 日本での生活ルール・マナー

1. 約束の時間を守ることがとても大切です。連絡なしの遅刻は失礼と思われます。
2. アパートでは夜22時ごろからは静かにします。
3. ゴミは分別します。分からない場合は大家さんに確認してください。
4. 電車・バスでは：
   ・携帯はマナーモード
   ・大声で話さない
   ・必要な人に席をゆずる
5. 市役所や税金の手紙を無視しないでください。誰かに相談しましょう。

使える日本語：
「すみません、もう少しゆっくり話していただけますか？」`
    }
  },

  //
  // 15. TRIPS / ENJOY GIFU / NEARBY
  //
  {
    id: "trips_gifu",
    keywords: [
      "trip",
      "travel",
      "weekend",
      "観光",
      "岐阜 観光",
      "gifu castle",
      "高山",
      "takayama",
      "白川郷",
      "shirakawago",
      "郡上八幡",
      "gujo hachiman",
      "犬山",
      "inuyama"
    ],
    answer: {
      en: `🗺️ Places to Visit Near You (Gifu area)

1. Gifu City:
   • Gifu Castle on Mount Kinka (nice view)
   • Nagara River walk
   • Gifu City Tower 43 at night (city lights)

2. Gujo Hachiman:
   • Old streets, super clear river water, chill vibe
   • Good for photos and slow walking

3. Takayama:
   • Traditional old town, morning markets, Hida beef

4. Shirakawa-go:
   • World Heritage village with old-style thatched houses
   • Beautiful in winter snow

5. Inuyama:
   • One of Japan’s oldest castles
   • Food street / castle town area, great day trip

Useful Japanese:
「この場所まで電車でどうやって行けばいいですか？」
= "How do I get to this place by train?"`,

      jp: `🗺️ 岐阜・近くで楽しめる場所

1. 岐阜市：
   ・金華山の岐阜城（景色がきれい）
   ・長良川の散歩
   ・岐阜シティ・タワー43の夜景

2. 郡上八幡（ぐじょうはちまん）：
   ・昔の町並み
   ・きれいな川
   ・ゆっくり写真を撮るのに人気

3. 高山（たかやま）：
   ・古い町並み
   ・朝市
   ・飛騨牛グルメ

4. 白川郷（しらかわごう）：
   ・世界遺産の合掌造りの家
   ・雪の季節がとても有名

5. 犬山（いぬやま）：
   ・犬山城（とても古いお城）
   ・城下町で食べ歩きができる

使える日本語：
「この場所まで電車でどうやって行けばいいですか？」`
    }
  },

  //
  // 16. POLICE / SAFETY / HARASSMENT
  //
  {
    id: "police_safety",
    keywords: [
      "police",
      "110",
      "help me",
      "harassment",
      "trouble",
      "stalker",
      "ストーカー",
      "警察",
      "怖い",
      "危ない",
      "danger"
    ],
    answer: {
      en: `🚨 Safety / Police / Harassment

1. Police emergency number is 110.
2. Call 110 if:
   • You feel in danger
   • Someone is following you (stalker)
   • Someone is violent or threatening
3. Ambulance / Fire is 119.
4. Harassment or sexual comments at work is NOT "normal culture". You can say stop.
   「やめてください。これはいやです。」
   = "Stop. I don't like this."
5. You can also ask a trusted teacher or senpai to support you.

Useful Japanese for police:
「助けてください。危ないです。」
= "Please help me. This is dangerous."`,

      jp: `🚨 安全・警察・ハラスメント

1. 警察の緊急番号は110です。
2. 110は：
   ・危険を感じるとき
   ・ストーカー行為を受けているとき
   ・暴力・おどしがあるとき
   に使えます。留学生でもOKです。
3. 救急車・消防は119です。
4. アルバイト先などでのハラスメントやいやな性的な発言は「普通」ではありません。はっきり「やめてください」と言っていいです。
   「やめてください。これはいやです。」
5. 不安なら、朝日大学の先生や信頼できる先輩に相談してください。

警察に見せられる日本語：
「助けてください。危ないです。」`
    }
  },

  //
  // 17. GARBAGE / 粗大ごみ
  //
  {
    id: "garbage_rules",
    keywords: [
      "garbage",
      "trash",
      "ごみ",
      "燃えるごみ",
      "燃えないごみ",
      "分別",
      "粗大ごみ",
      "sodai gomi",
      "recycle",
      "資源ごみ"
    ],
    answer: {
      en: `🗑️ Garbage Rules and Big Trash (粗大ごみ)

1. You must sort garbage:
   • Burnable (燃えるごみ): food waste, tissues
   • Non-burnable (燃えないごみ): metal, some plastics
   • Recyclables (資源ごみ): cans, bottles, PET bottles
2. Cities have different pickup days for each type. Wrong day = not collected.
3. Many cities require official garbage bags from convenience stores.
4. Big trash (粗大ごみ) like furniture, bicycle, mattress:
   • You cannot just leave it outside.
   • You must contact the city for pickup (often costs money) or bring it to the recycle center.
5. Before moving out, plan how to throw away big items. If you leave them, landlord may charge you.

Useful Japanese:
「粗大ごみの出し方を教えてください。」
= "Could you tell me how to throw away large/bulky trash?"`,

      jp: `🗑️ ゴミの分別と粗大ごみ

1. ゴミは分別します：
   ・燃えるごみ：生ごみ、紙ティッシュなど
   ・燃えないごみ：金属など
   ・資源ごみ：びん・缶・ペットボトルなど
2. 市ごとに曜日が決まっています。ちがう日に出すと回収されません。
3. 指定のゴミ袋（市のごみ袋）が必要な場合があります。コンビニなどで買えます。
4. 粗大ごみ（家具・自転車・マットレスなど）は外に放置してはいけません。
   ・市に連絡して回収（日程や料金あり）
   ・リサイクルセンターに自分で持ち込み
5. 引っ越す前に粗大ごみの処理を計画しないと、退去時に大家さんから追加料金を請求されることがあります。

使える日本語：
「粗大ごみの出し方を教えてください。」`
    }
  },

  //
  // 18. BANK ACCOUNT
  //
  {
    id: "bank_account",
    keywords: [
      "bank account",
      "bank",
      "口座",
      "銀行口座",
      "通帳",
      "キャッシュカード",
      "給料振込",
      "salary account"
    ],
    answer: {
      en: `🏦 Opening a Bank Account

1. Most part-time jobs pay salary by bank transfer, not cash.
2. Bank will ask:
   • Residence Card
   • Proof of address (住民票 or official mail)
   • Japanese phone number
   • School info (student ID, enrollment proof)
3. They may ask if you send money overseas. Just answer honestly.
4. You receive:
   • 通帳 (paper or app passbook)
   • キャッシュカード (ATM card)
5. Keep your PIN secret. Do not give your cash card to friends/senpai.

Useful Japanese:
「新しく口座を作りたいです。留学生です。」
= "I would like to open a new bank account. I am an international student."

「給料の振り込み用の口座が必要です。」
= "I need an account for salary deposit."`,

      jp: `🏦 銀行口座の作り方

1. 多くのアルバイトは、給料を銀行振込で支払います。現金手渡しではない場合が多いです。
2. 銀行でよく聞かれるもの：
   ・在留カード
   ・住所がわかる書類（住民票など）
   ・日本の電話番号
   ・学校の在学証明や学生証
3. 海外送金をする予定があるか聞かれることがあります。正直に答えて大丈夫です。
4. 口座を作ると、通帳（紙またはアプリ）とキャッシュカード（ATMカード）をもらえます。
5. キャッシュカードと暗証番号は他人に教えないでください。先輩にもダメです。

使える日本語：
「新しく口座を作りたいです。留学生です。」
「給料の振り込み用の口座が必要です。」`
    }
  },

  //
  // 19. CALLING IN SICK TO YOUR PART-TIME JOB
  //
  {
    id: "call_in_sick",
    keywords: [
      "i am sick for work",
      "cant go work",
      "shift cancel",
      "休みたい バイト",
      "体調不良 アルバイト",
      "欠勤 連絡",
      "シフト 休む",
      "店長 電話"
    ],
    answer: {
      en: `🤒 Calling in Sick to Part-Time Job

1. Contact your manager early. Do NOT just disappear.
2. Be polite and short. You do not have to explain private health details.
3. Example:
「すみません、アルバイトの◯◯です。体調が悪いので、今日は出勤がむずかしいです。本当に申し訳ありません。」
= "Hello, this is ___ from the part-time shift. I'm not feeling well, so it's difficult to come in today. I'm very sorry."
4. When you return to work, say thank you again.
5. If you are often sick from stress/overwork, please talk to someone you trust.`,

      jp: `🤒 アルバイトを休みたいときの連絡

1. できるだけ早い時間に連絡します。無断欠勤はNGです。
2. ていねいに、短く、正直に伝えます。くわしい病名は言わなくても大丈夫です。
3. 例：
「すみません、アルバイトの◯◯です。体調が悪いので、今日は出勤がむずかしいです。本当に申し訳ありません。」
4. 復帰したときに「ご迷惑をおかけしました。ありがとうございました。」と言うと関係がよくなります。
5. 働きすぎ・ストレスでよく体調が悪くなるなら、信頼できる人に相談してください。`
    }
  },

  //
  // 20. TALKING TO TEACHERS / POLITE EMAIL
  //
  {
    id: "polite_to_teacher",
    keywords: [
      "email teacher",
      "teacher japanese",
      "professor email",
      "先生 メール",
      "遅刻 連絡",
      "欠席 連絡",
      "授業 失礼"
    ],
    answer: {
      en: `🎓 How to Email a Teacher Politely

Subject: 欠席のご連絡（○月○日 ○○クラス）
Body:
○○先生
お世話になっております。◯◯学部の◯◯です。
本日、体調不良のため授業を欠席いたします。
ご迷惑をおかけして申し訳ございません。
よろしくお願いいたします。

English:
"Teacher,
Thank you for your support. I am ___ from ___ department.
Today I will be absent due to poor health.
I am sorry for the inconvenience.
Thank you."

Tips:
1. Use です／ます.
2. Apologize briefly.
3. Send before class if possible.`,

      jp: `🎓 先生へのていねいなメール

件名：欠席のご連絡（○月○日 ○○クラス）
本文：
○○先生
お世話になっております。◯◯学部の◯◯です。
本日、体調不良のため授業を欠席いたします。
ご迷惑をおかけして申し訳ございません。
よろしくお願いいたします。

ポイント：
1. です／ます調で書きます。
2. かんたんにあやまる表現（申し訳ございません）を入れます。
3. 授業の前に送れると、いちばんていねいです。`
    }
  },

  //
  // 21. ID CHECKS / POLICE STOP
  //
  {
    id: "carry_residence_card",
    keywords: [
      "id card",
      "carry id",
      "在留カード 持ち歩く",
      "police check id",
      "職務質問",
      "身分証明"
    ],
    answer: {
      en: `🪪 Carrying Your Residence Card

1. Mid/long-term foreign residents must carry their Residence Card when outside.
2. Police can ask to see ID. This is called 職務質問.
3. Stay calm and show your card.
4. You do not need to yell or run. Just answer politely.
5. After they check, you can continue.

Useful Japanese:
「はい、在留カードです。」
= "Yes, this is my residence card."

「すみません、日本語があまり上手ではありません。」
= "Sorry, my Japanese is not very good."`,

      jp: `🪪 在留カードと警察の確認

1. 中長期の外国人は外出中、在留カードを持ち歩く義務があります。
2. 警察官から身分証の提示をお願いされることがあります。これは「職務質問」と呼ばれます。
3. 落ち着いて、在留カードを見せれば大丈夫です。
4. 逃げたり、大声で文句を言ったりする必要はありません。ていねいに答えるほうが早く終わります。
5. 確認が終われば、そのまま帰れます。

使える日本語：
「はい、在留カードです。」
「すみません、日本語があまり上手ではありません。」`
    }
  },

  //
  // 22. LEAVING JAPAN / END OF STUDY
  //
  {
    id: "leaving_japan",
    keywords: [
      "leaving japan",
      "go back home",
      "帰国",
      "日本を離れる",
      "解約",
      "銀行口座 解約",
      "sim 解約",
      "市役所 退去"
    ],
    answer: {
      en: `✈️ Before You Leave Japan (Graduation / Going Home)

Do these BEFORE you permanently leave Japan:

1. City hall:
   • Submit 転出届 (moving-out notice).
   • Tell them you are leaving Japan so National Health Insurance billing stops.
2. Health Insurance / Pension:
   • Ask if you have any unpaid amounts.
3. Bank account:
   • Close it or leave balance at 0 if you won't come back soon.
4. Phone / SIM:
   • Cancel your SIM/phone plan. If you don't cancel, the company keeps billing.
5. Apartment:
   • End the contract officially.
   • Clean the room.
   • Return keys.
   • Throw away all trash (including big items).
6. School:
   • Get your certificate / transcript before you fly.

Useful Japanese at city hall:
「もう日本を離れる予定なので、手続きのしかたを教えてください。」
= "I am planning to leave Japan. Could you please tell me the procedures?"`,

      jp: `✈️ 日本を離れる前のチェックリスト（卒業・帰国など）

出国の前に、次を確認してください：

1. 市役所：
   ・「転出届」を出します（市の外に出る手続き）。
   ・日本を離れることを伝えて、国民健康保険の請求を止めてもらいます。
2. 健康保険・年金：
   ・未払いがないか確認します。
3. 銀行口座：
   ・しばらく日本に戻らないなら、口座を解約するか残高を0円にします。
4. 携帯・SIM：
   ・必ず解約します。放置すると帰国後も料金がかかります。
5. アパート：
   ・正式に退去手続き。
   ・部屋を片付けて、鍵を返します。
   ・粗大ごみも残さないようにします。
6. 学校：
   ・卒業証明書・成績証明書などを必ず受け取ってください。

市役所で使える日本語：
「もう日本を離れる予定なので、手続きのしかたを教えてください。」`
    }
  },

  //
  // 23. ASAHI UNIVERSITY CONTACT INFO
  //
  {
    id: "asahi_university_info",
    keywords: [
      "asahi university",
      "朝日大学",
      "university address",
      "contact asahi",
      "電話番号",
      "university phone",
      "website",
      "アクセス",
      "場所",
      "location",
      "岐阜 朝日大学"
    ],
    answer: {
      en: `🏫 Asahi University — Basic Info

📍 Address:
1851 Hozumi, Mizuho City, Gifu Prefecture 501-0296, Japan
〒501-0296 岐阜県瑞穂市穂積1851番地

📞 Phone (Main Office):
058-329-1111
(+81-58-329-1111 from overseas)

🌐 Website:
https://www.asahi-u.ac.jp/

🚆 Access:
• About 15 minutes walk from JR Hozumi Station (穂積駅).
• Or bus to 朝日大学前 (Asahi Daigaku-mae).

Useful Japanese when calling:
「朝日大学の〇〇についてお聞きしたいです。」
= "I would like to ask about ___ at Asahi University."

Examples:
・「留学生サポートについてお聞きしたいです。」
・"I’d like to ask about international student support."`,

      jp: `🏫 朝日大学 — 基本情報

📍 住所：
〒501-0296 岐阜県瑞穂市穂積1851番地
1851 Hozumi, Mizuho City, Gifu Prefecture 501-0296 Japan

📞 電話（代表）：
058-329-1111
（海外から：+81-58-329-1111）

🌐 ウェブサイト：
https://www.asahi-u.ac.jp/

🚆 アクセス：
・JR東海道本線「穂積駅」から徒歩約15分
・または「朝日大学前」行きのバス

電話や窓口で使える日本語：
「朝日大学の〇〇についてお聞きしたいです。」
例：
・「留学生サポートについてお聞きしたいです。」`
    }
  },

  //
  // 24. NATURAL DISASTERS / 防災バッグ
  //
  {
    id: "disaster_preparedness",
    keywords: [
      "earthquake",
      "typhoon",
      "tsunami",
      "災害",
      "地震",
      "台風",
      "津波",
      "避難",
      "evacuation",
      "alert",
      "emergency",
      "防災バッグ",
      "emergency bag"
    ],
    answer: {
      en: `🌋 Natural Disasters in Japan (Earthquake / Typhoon / Tsunami)

1. Earthquake (地震):
   • Stay calm. Do not run outside during shaking.
   • Protect your head. Hide under a desk/table.
   • After shaking stops, open a door so you have an exit.
   • Follow city / university announcements.
   • In a big earthquake, move to a safe open area or evacuation center (避難所).

2. Tsunami (津波):
   • If you are near the sea and feel a strong or long quake, go to higher ground immediately.
   • Do NOT go to the beach to look.

3. Typhoon (台風):
   • Stay indoors when wind/rain is strong.
   • Stay away from rivers and big trees.
   • Keep water, snacks, flashlight, and your phone charged.

4. Prepare Your Emergency Bag (防災バッグ):
   Make 1 small backpack you can grab fast. Put:
   • Copy of passport & Residence Card
   • Cash (about ¥10,000 in small bills/coins)
   • Water + emergency food
   • Flashlight, batteries, phone charger
   • First aid kit & personal medicine
   • Masks, gloves, towel
   • Change of clothes / light blanket
   • Important phone numbers written on paper
   • Copy of insurance card & student ID
   Keep it near the door.

5. Emergency Numbers:
   • Police: 110
   • Ambulance / Fire: 119

Useful Japanese:
「避難所はどこですか？」
= "Where is the evacuation shelter?"

「地震の情報を教えてください。」
= "Please tell me the earthquake information."`,

      jp: `🌋 日本の自然災害（地震・台風・津波など）

1. 地震：
   ・揺れている間は外に走って出ないでください。
   ・頭を守り、机の下などに隠れます。
   ・揺れが止まったら、出口を確保します。
   ・市や大学のアナウンスに従います。
   ・大きな地震なら、避難所や広い場所へ移動します。

2. 津波：
   ・海の近くで強い揺れを感じたら、すぐ高い場所に避難します。
   ・海を見に行かないでください。

3. 台風：
   ・雨や風が強いときは外に出ないほうがいいです。
   ・川や木の近くは危ないので近づかないでください。
   ・飲み水・食べ物・懐中電灯・スマホの充電を準備します。

4. 防災バッグ：
   ・すぐ持ち出せるリュックを1つ準備しておきます。
   ・中に入れるもの：
     - パスポートと在留カードのコピー
     - 現金（1万円くらい・小銭も）
     - 水と非常食
     - 懐中電灯・電池・充電器
     - 救急セットと常備薬
     - マスク・手袋・タオル
     - 着替え・小さな毛布
     - 大事な電話番号を紙にメモ
     - 保険証のコピーと学生証
   ・玄関の近くに置いておきましょう。

5. 緊急番号：
   ・警察：110
   ・救急・消防：119

使える日本語：
「避難所はどこですか？」
「地震の情報を教えてください。」`
    }
  }
];

module.exports = knowledgeBase;
