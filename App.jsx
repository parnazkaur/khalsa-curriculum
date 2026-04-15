import { useState, useEffect, useRef } from "react";

const GS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Spectral:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #F8FAFB; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  textarea, input, button { font-family: inherit; }
  textarea:focus, input:focus { outline: none; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideUp { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
  @keyframes glow    { 0%,100%{box-shadow:0 4px 20px rgba(165,28,48,0.25)} 50%{box-shadow:0 6px 28px rgba(165,28,48,0.45)} }
  .track-card { transition: transform 0.2s, box-shadow 0.2s !important; }
  .track-card:hover { transform: translateY(-4px) !important; box-shadow: 0 16px 48px rgba(15,25,36,0.12) !important; }
  .unit-pill { transition: box-shadow 0.15s, transform 0.15s !important; }
  .unit-pill:hover { box-shadow: 0 8px 28px rgba(30,58,95,0.12) !important; transform: translateY(-2px) !important; }
  .unit-pill:hover .arr { transform: translateX(4px) !important; }
  .arr { display: inline-block; transition: transform 0.18s; }
  .raaj-btn { animation: glow 3s ease-in-out infinite; }
  .raaj-btn:hover { animation: none !important; transform: scale(1.08) !important; }
  .tab-btn:hover { background: #F1F5F9 !important; }
`;

const C = {
  bg:      "#F8FAFB",
  white:   "#FFFFFF",
  surface: "#F1F5F9",
  navy:    "#1E3A5F",
  navyL:   "#2D5186",
  crimson: "#A51C30",
  text:    "#0F172A",
  sub:     "#475569",
  muted:   "#94A3B8",
  border:  "#E2E8F0",
  source:  "#FFF5F6",
  sourceB: "#E8A0A8",
};

// ─── RAAJ ICON ────────────────────────────────────────────────────────────────
// Clean graphic avatar: minimal face, tall dumalla as the dominant element,
// golden chakkar at top. Readable at any size. Not emoji-like.
function Dumalla({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ borderRadius:"50%", display:"block", flexShrink:0 }}>
      <defs>
        <radialGradient id="bgGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#2A4F7A"/>
          <stop offset="100%" stopColor="#152A45"/>
        </radialGradient>
      </defs>

      {/* Background */}
      <circle cx="50" cy="50" r="50" fill="url(#bgGrad)"/>

      {/* ── Shoulders / body ── */}
      <path d="M12 100 C12 78 28 72 42 70 L58 70 C72 72 88 78 88 100Z" fill="#162E4A"/>

      {/* ── Neck ── */}
      <rect x="43" y="65" width="14" height="9" rx="4" fill="#BE8055"/>

      {/* ── Face — simple oval, no fussy detail ── */}
      <ellipse cx="50" cy="59" rx="15" ry="17" fill="#D4956A"/>

      {/* ── Eyes — bold dots only ── */}
      <circle cx="44" cy="57" r="2.4" fill="#1A0E06"/>
      <circle cx="56" cy="57" r="2.4" fill="#1A0E06"/>

      {/* ── Beard — solid shape, no outlines ── */}
      <path d="M35 68 Q50 84 65 68 Q65 80 50 85 Q35 80 35 68Z" fill="#4A2E10"/>

      {/* ── DUMALLA — three stacked wraps, gets narrower toward top ──
           This is the dominant, visually distinctive element.          */}

      {/* Wrap 1 – base, widest */}
      <rect x="24" y="37" width="52" height="12" rx="3" fill="#D97A00"/>
      <line x1="24" y1="43" x2="76" y2="43" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"/>

      {/* Wrap 2 – mid */}
      <rect x="27" y="24" width="46" height="15" rx="3" fill="#C06800"/>
      <line x1="27" y1="30" x2="73" y2="30" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"/>
      <line x1="27" y1="36" x2="73" y2="36" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>

      {/* Wrap 3 – top, narrowest — gives the height */}
      <rect x="31" y="9" width="38" height="17" rx="3" fill="#AE5C00"/>
      <line x1="31" y1="16" x2="69" y2="16" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"/>
      <line x1="31" y1="22" x2="69" y2="22" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>

      {/* Fabric tail — right side of base wrap */}
      <path d="M76 40 Q86 33 80 26 Q84 32 77 38Z" fill="#AE5C00" opacity="0.8"/>

      {/* ── Chakkar (throwing ring) — worn on the dumalla ── */}
      <circle cx="50" cy="5.5" r="5.5" fill="none" stroke="#FFD060" strokeWidth="2.5"/>
      <circle cx="50" cy="5.5" r="2"   fill="#FFD060"/>
    </svg>
  );
}

// ─── ALL CONTENT ──────────────────────────────────────────────────────────────
const UNITS = [
  {
    id:"who-was-banda", num:"01",
    title:"Who Was Banda Singh Bahadur?",
    period:"1670–1708",
    subtitle:"The World He Walked Into, and What Made Him Possible",
    intro:"Before you can understand what Banda Singh Bahadur did, you need to understand what the Khalsa was — and what it was for. Kapur Singh, one of the most important Sikh thinkers of the twentieth century, spent years working out exactly that question. His answers change how you read everything that follows.",
    blocks:[
      {type:"prose",text:`On March 30, 1699, at the town of Anandpur Sahib in the Panjab foothills, Guru Gobind Singh Ji stood before tens of thousands of Sikhs gathered for the Vaisakhi harvest festival and drew his sword. He called for a volunteer willing to give his head for the cause of dharma. The crowd fell silent. He asked again. The silence held. He asked a third time.\n\nOne man stood up. Then four more — one by one, each from a different part of the subcontinent, each from a caste the prevailing social order had ranked at a specific and unequal level: a Khatri from Lahore, a Jat from the Delhi region, a washerman from Gujarat, a cook from Orissa, a barber from Karnataka. Guru Gobind Singh Ji took them one at a time into a tent and emerged after each with a sword that appeared to drip with blood. When all five had gone in, he brought them out together, dressed in new clothes, and announced them as the Panj Pyare — the Five Beloved Ones, the first members of the Order of the Khalsa.\n\nThen he did something no one present could have anticipated. He stood before them with folded hands and asked them to initiate him.`},
      {type:"heading",text:"What Was Actually Happening"},
      {type:"prose",text:`The ceremony was clearly theater — Guru Gobind Singh Ji was not actually killing people. But what it meant was not theater at all. Sirdar Kapur Singh, who served as a senior Indian Civil Service officer and was later appointed National Professor of Sikhism, spent years of forced political exile in the early 1950s working through this question in conversation with his friend Sardari Lal Parasara. The resulting book, Parasaraprasna, is the most rigorous analysis in the Sikh tradition of what Vaisakhi 1699 actually was — not what it symbolized in a vague sense, but what specific ideas it was designed to embody. Kapur Singh identified five.`},
      {type:"source",citation:"Kapur Singh, Parasaraprasna: An Enquiry into the Genesis and Unique Character of the Order of the Khalsa (Guru Nanak Dev University, Amritsar, 2001), Chapter I.",text:`These five ideas are: (1) the absorption of the individual soul into or its contiguity with the Infinite Soul, as the ultimate aim and summum bonum of human life; (2) an equalitarian and global fraternity in which this activity must be grounded; (3) acceptance of new principles of politics, subordinated to those of ethics, resulting in the universal acceptance of the tradition of open diplomacy; (4) organisation into the Order of the Khalsa of those who agree to dedicate their lives to furtherance of these ideas; and (5) the vision of a new and regenerated humanity, heralded by the Baisakhi of March 30, 1699.\n\nBy understanding these five ideas alone, which stimulated the basic impulses of the work and teachings of Guru Gobind Singh, it is possible to understand the temper and soul of the Sikh history, and the true significance of Guru Gobind Singh as a religious prophet.`,glossary:{"summum bonum":"Latin: the highest good — the ultimate purpose of human life. Kapur Singh argues that Guru Gobind Singh Ji placed spiritual life at the center of everything: not as one activity among many, but as the activity that gives all others their meaning.","equalitarian and global fraternity":"Kapur Singh's phrase for what the Khalsa was designed to be — a community of equals across caste, region, and background. Not a Panjabi institution or a Hindu reform movement. A universal one.","open diplomacy":"The principle that rulers and states must be bound by the same ethical standards as individuals. From Kautilya to Machiavelli, statecraft assumed rulers operated by different rules. Guru Gobind Singh Ji rejected this."}},
      {type:"prose",text:`The second idea — the equalitarian fraternity — is most visible in the ceremony. A barber and a Khatri merchant did not eat together or share water from the same vessel. The Guru administered amrit to all five from the same bowl and then asked them to administer it to him. In a single act he made caste impossible to enforce between initiated Sikhs.\n\nMuslim historians recorded what the Guru said in the days that followed. Both Sohan Lal Suri and Bute Shah — one writing before the Sikh Empire was established, one after it was destroyed — recorded his address, independently, in almost identical terms:`},
      {type:"source",citation:"Guru Gobind Singh Ji's address to the congregation, Vaisakhi 1699. Recorded in Sohan Lal Suri, Umdat-ut-Tawarikh, Vol. I; and Bute Shah, Tawarikh-i-Punjab (Persian MS, c. 1848). Both cited in Kapur Singh, Parasaraprasna.",text:`I wish you all to embrace one creed and follow one path, rising above all differences of the religions as now practised. Let the four Hindu castes abandon them altogether and adopting the way of mutual help and co-operation, mix freely with one another. Let men of the four castes receive my Baptism of the Double-edged Sword, eat out of the same vessel, and feel no aloofness from or contempt for one another.`,glossary:{"four Hindu castes":"The varnashramadharma — Brahmin, Kshatriya, Vaishya, Shudra — a hereditary system organizing Hindu society for over a millennium. Kapur Singh argues its repudiation was the single most radical social act of Vaisakhi. The Khalsa did not reform caste. It abolished it within the initiated community.","Baptism of the Double-edged Sword":"The khande di pahul — the Khalsa initiation ceremony. These words were recorded by Muslim historians with no cause to make the Guru sound more radical than he was."}},
      {type:"prose",text:`Kapur Singh argues Sikhism cannot be understood as a Hindu sect. But what matters most for understanding Banda Singh Bahadur are his fourth and fifth ideas: the Khalsa as a political organization with specific ends, and the vision of a new humanity those ends serve. These are the ideas that explain why a hermit became a general.`},
      {type:"heading",text:"Sovereignty as a Religious Obligation"},
      {type:"prose",text:`The phrase most associated with Guru Gobind Singh Ji's political theology — "without sovereignty, Dharma cannot prevail" — is usually treated as pragmatic self-defense. Kapur Singh reads it as a theological claim: that a spiritual community without political power cannot protect itself, feed its members, or build the equitable world it exists to create. Two sources make this explicit. The first is Gurpartap Surya Granth:`},
      {type:"source",citation:"Gurpartap Surya Granth (Suraj Prakash), ain 1, ansu 36. Cited in Kapur Singh, Parasaraprasna.",text:`The political power and the State rest on armaments, and without political sovereignty, the good way of life cannot securely prevail in society.\n\nA man not free to bear arms in self-defence, and one unable to proclaim his free sovereign status with unshorn hair, is like a miserable sheep, inviting all and sundry to catch it by the ears and lead it to the nearest slaughter-house.`,glossary:{"unshorn hair":"The kes — uncut hair, one of the Panj Kakars. Kapur Singh connects it directly to sovereignty: wearing kes in Mughal Panjab was a declaration of Khalsa identity, a refusal to accept the Mughal state's terms for tolerated existence.","Panj Kakars":"The five articles worn by initiated Khalsa Sikhs: kes (uncut hair), kara (steel bracelet), kanga (wooden comb), kachera (cotton undergarment), kirpan (steel sword)."}},
      {type:"prose",text:`The second source is Rattan Singh Bhangu's Prachin Panth Prakash — written in 1841, drawing on oral traditions from Sikh warriors of the Misl period. Bhangu's formulation of the Khalsa's political status is among the sharpest in all of Sikh literature:`},
      {type:"source",citation:"Rattan Singh Bhangu, Prachin Panth Prakash (oral recension), c. 1841. Cited in Kapur Singh, Parasaraprasna.",text:`The Khalsa is never a satellite to another power. They are either fully sovereign or in a state of war and rebellion. A subservient coexistence they never accept. To be fully sovereign and autonomous is their first and last demand.`,glossary:{"Prachin Panth Prakash":"One of the most important source texts for eighteenth-century Sikh history, written by Rattan Singh Bhangu whose family had direct involvement in the Misl period he describes. It draws on living oral memory — testimony as much as chronicle.","Misl":"One of the twelve Sikh confederacies that emerged after Banda Singh Bahadur's execution and operated as the primary Khalsa political structure through the late eighteenth century."}},
      {type:"prose",text:`Kapur Singh draws the implication directly: "The Order of the Khalsa, divorced from political activity, has no intelligible connotation." A Khalsa that only prays has misunderstood itself.\n\nThis is the context in which Banda Singh Bahadur received his commission. Five arrows, a nagara, a hukamnama addressed to the Sikh sangats of Panjab — the fourth idea deployed: an organized body dedicated to making the vision real, in the soil of Panjab, against the largest empire in South Asia.`},
      {type:"heading",text:"Madho Das"},
      {type:"prose",text:`Born around 1670 to a Rajput family in Rajauri, the man who would become Banda Singh Bahadur had spent decades moving in the opposite direction from everything the Khalsa represented. He had become a hermit under the name Madho Das, built an ashram at Nanded on the Godavari river in the Deccan, and retreated entirely from the world.\n\nIn the autumn of 1708, Guru Gobind Singh Ji arrived at Nanded. Madho Das recognized something in the Guru that his years of practice had not given him. He threw himself at the Guru's feet and said: "Main tera banda" — I am your slave, your servant.\n\nThe Guru took the word and made it a name: Banda Singh Bahadur. Banda — the servant. Singh — the lion. Bahadur — the brave. A man who had renounced the world was handed a sword, five arrows, a drum, and a letter addressed to the Sikh community of Panjab, and told to go north.\n\nGuru Gobind Singh Ji was assassinated a few weeks later. Banda Singh never saw him again. He arrived in Panjab in 1709 carrying the Guru's hukamnama and very little else. What he built in the six years that followed is the story of what Vaisakhi 1699 looked like when it entered history.`},
    ],
    glossary:{"Vaisakhi":"The Panjabi harvest festival, celebrated in April. The founding of the Khalsa on Vaisakhi 1699 permanently redefined the day's meaning for Sikhs worldwide.","Panj Pyare":"The Five Beloved Ones — the first five initiates of the Khalsa, representing the principle of collective Sikh governance.","amrit":"The nectar prepared in the Khalsa initiation ceremony — water sweetened with patasey and stirred with the double-edged sword.","nagara":"Battle drum symbolizing sovereign authority — Banda Singh's possession was a statement of delegated divine sanction.","hukamnama":"A formal Sikh edict — Guru Gobind Singh Ji's letter to the Panjabi sangats was both a spiritual directive and a political mobilization order.","sangats":"Sikh congregations organized around a gurdwara.","pahul":"The Khalsa initiation ceremony, administered by the Panj Pyare.","dharma":"The right way of life — ethical conduct, justice, moral order."},
    writePrompt:`Kapur Singh identifies five ideas in the Vaisakhi of 1699. Bhangu says the Khalsa is "either fully sovereign or in a state of war and rebellion." Guru Gobind Singh Ji told Banda Singh — a hermit who had spent years leaving the world — to go back into it and fight an empire.\n\nWhat is the connection between these three things? What does it mean that someone who had chosen the spiritual life entirely was the one chosen to make the political argument?`,
    discussionQ:`Kapur Singh says "the Order of the Khalsa, divorced from political activity, has no intelligible connotation." Is he right? Is there a version of the Khalsa that is purely spiritual — and if so, is that still what Guru Gobind Singh Ji created?`,
    teacherNote:`The Bhangu quote is the sharpest entry point: 'either fully sovereign or in a state of war and rebellion.' Ask students — where does that leave Sikhs in 2025? Not rhetorically, but actually.`,
  },
  {
    id:"the-campaigns", num:"02",
    title:"The Campaigns",
    period:"1709–1710",
    subtitle:"Samana, Sirhind, and the Architecture of the First Sikh State",
    intro:"Banda Singh arrived in Panjab in 1709 with a letter and a drum. Within eighteen months he had defeated the Mughal military, executed the man who killed the Sahibzade, established a capital, abolished feudal land ownership, and minted coins. This unit is about how — and what it all meant.",
    blocks:[
      {type:"prose",text:`News of the hukamnama moved through Panjab faster than Banda Singh himself did. A letter bearing the authority of Guru Gobind Singh Ji, circulating through the gurdwara network that connected every village with a Sikh congregation, carried a weight no Mughal farman could replicate — because it was addressed to people who were already organized, already in grief, and already looking for a reason to act. The two younger Sahibzade — nine-year-old Zorawar Singh and six-year-old Fateh Singh — had been bricked alive into a wall at Sirhind by the order of its governor, Wazir Khan.\n\nBanda Singh's arrival was not the cause of what followed. It was the occasion. Thousands of Sikhs from across the countryside came — Jat farmers, artisans, members of communities who had found in the Khalsa a framework that treated them as equals. They came with spears, agricultural tools, bows. They came because the letter said this was the time.`},
      {type:"heading",text:"Why Samana First"},
      {type:"prose",text:`Banda Singh's first target was Samana — home to the executioners of both Guru Tegh Bahadur Ji and the Sahibzade. Men with names and addresses, still employed by the Mughal state. The Sikh forces took the town in hours. The campaign moved through Ghuram, Thaska, Shahabad, Mustafabad. Banda Singh established his capital at Lohgarh, a fortress in the Siwalik foothills — built during the Guruship itself, funded by Lakhi Rai Vanjara, a wealthy Sikh trader. The capital of the first Sikh sovereign state had been planned before its sovereign arrived.`},
      {type:"heading",text:"Chappar Chiri"},
      {type:"prose",text:`In May 1710, Wazir Khan marched out with professional cavalry and artillery to meet the Sikh forces at Chappar Chiri. A Mughal court historian described who he was fighting:`},
      {type:"source",citation:"Muhammad Hadi Kamwar Khan, Tazkiratu's Salatin Chaghata, c. 1724. Translated by S. Ali Nadeem Rezavi, Sikh History from Persian Sources (Indian History Congress, 2001).",text:`A large number of persons belonging to the class of sweepers and tanners, and the community of banjaras and others of base and lowly castes, assembled around him and became his disciples.`,glossary:{"sweepers and tanners":"The lowest-status occupations in the Mughal caste hierarchy. Kamwar Khan lists them as an insult — proof the uprising was not serious. He doesn't understand that he's describing exactly who the Khalsa was created for at Anandpur in 1699.","banjaras":"Itinerant traders — the logistics network of pre-modern Panjab. Their inclusion gave Banda Singh forces that knew every route and could move supplies across vast distances.","zamindari":"The Mughal feudal land system — hereditary landlords extracted revenue from peasants who had no legal claim to the soil they worked. Banda Singh's abolition transferred ownership to those who actually tilled the land."}},
      {type:"prose",text:`Kamwar Khan wrote "sweepers and tanners" as a dismissal. What he recorded — without recognizing it — was Kapur Singh's second idea in action: the equalitarian fraternity of Anandpur now mobilized as a military force.\n\nWazir Khan was defeated and killed at Chappar Chiri. Sirhind fell in May 1710. One town was conspicuously spared: Maler Kotla, whose nawab had publicly protested the execution of the Sahibzade in 1705. He had no power to stop it — but he said on record that it was wrong. Banda Singh remembered. This was justice, not mercy.`},
      {type:"heading",text:"What He Built at Lohgarh"},
      {type:"prose",text:`After Sirhind, Banda Singh abolished zamindari — hereditary landlords dispossessed, land to those who tilled it. The Mughal court's own intelligence digest described the new system with the tone of a bureaucrat encountering something without a category:`},
      {type:"source",citation:"Akhbar-i Darbar-i Mualla (News of the Royal Mughal Court), January 9, 1711. Translated by Dr. Bhagat Singh, Punjab Past and Present, Vol. XVIII-II (Punjabi University, Patiala, 1984).",text:`The Khalsa Sikhs had adopted strange practices for themselves. They called one person — an army.\n\nSome people said that the Sikhs had struck their own coins and in the hukamnamas that they had addressed to the amals, they had written samat one. In villages they followed the batai system. They gave two parts of the produce to the peasants and one part was retained by them. On these conditions the land was given to the peasants.`,glossary:{"Akhbar-i Darbar-i Mualla":"Literally 'News of the Exalted Court' — the Mughal Emperor's official daily intelligence digest. It had no reason to report favorably on Banda Singh. When this source records something, it is the Mughal government documenting its own reality.","samat one":"Banda Singh's new calendar — Year One of a Sikh era. Issuing a new calendar asserts sovereign temporal authority.","batai system":"Crop-sharing: two-thirds of the harvest to the peasant, one-third to the state — a direct reversal of zamindari.","amals":"Revenue officials. Banda Singh addressed hukamnamas to amals — evidence of a functioning administrative bureaucracy."}},
      {type:"prose",text:`Two-thirds of the harvest to the farmer. For families that had worked Panjabi soil for generations without owning it, this was transformative. Banda Singh also minted coins. Look at what he inscribed:`},
      {type:"source",citation:"Coin inscription, c. 1710. Persian text analysis from stamp recreation by Armaghan Mehrabian, HSC Archive.",text:`Deg o Tegh o Fateh Nusrat be-dirang\nYaft az Nanak Guru Gobind Singh\n\n[The Deg (cauldron of communal welfare), the Tegh (sword), Victory and divine succor without delay — obtained from Nanak, Guru Gobind Singh]`,glossary:{"Deg o Tegh o Fateh":"Victory of the cauldron and the sword — the governing philosophy in three words. The deg (langar) represents the commitment to feed and sustain the community. The tegh (sword) represents the capacity to defend it. Both are required.","Yaft az Nanak Guru Gobind Singh":"'Obtained from Nanak, Guru Gobind Singh.' Banda Singh could have written his own name — every Mughal coin bore the Emperor's name. He wrote the Gurus' names instead: sovereignty held in trust for the Guru-Panth, not for any individual."}},
      {type:"prose",text:`He attributed the authority to the Gurus — not as humility, but as a political statement. Then the Mughal Emperor's own intelligence service filed a report the court could not have wanted:`},
      {type:"source",citation:"Akhbar-i Darbar-i Mualla, April 28, 1711. Translated by Dr. Bhagat Singh, Punjab Past and Present, Vol. XVIII-II, 1984.",text:`The wretched Nanak-prastan [Banda Singh] has his camp in the town of Kalanaur. During this period he has promised and proclaimed: "I do not oppress the Muslims." Accordingly, for any Muslim who approaches him, he fixes a daily allowance and wages, and looks after him. He has permitted them to recite Khutba and namaz. As such, five thousand Muslims have gathered round him.`,glossary:{"Nanak-prastan":"Persian: 'worshippers of Nanak' — the Mughal court's standard term for Sikhs.","Khutba":"The Friday mosque sermon. Banda Singh permitting it means he claimed no authority over Muslim religious life.","five thousand Muslims":"This number comes from the Mughal Emperor's own intelligence service — with every reason to undercount. The court was trying to frame a religious war against Islam. Their own spies refused to cooperate."}},
      {type:"prose",text:`The report was filed by the Mughal government's own apparatus. This is the hostile witness: evidence that arrives from a source with no incentive to support your conclusion. When your own surveillance network returns a report contradicting your preferred narrative, that report is reliable.`},
    ],
    glossary:{"faujdar":"Mughal provincial military governor.","Wazir Khan":"The Mughal faujdar of Sirhind, responsible for ordering the execution of Guru Gobind Singh Ji's younger sons, Sahibzada Zorawar Singh (age 9) and Sahibzada Fateh Singh (age 6), bricked alive in 1705.","Sahibzade":"The four sons of Guru Gobind Singh Ji, all of whom gave their lives.","Lakhi Rai Vanjara":"A wealthy Sikh trader who funded and maintained Lohgarh during the Guruship — the first Sikh state was planned, not improvised.","Maler Kotla":"The town spared by Banda Singh because its nawab had protested the execution of the Sahibzade in 1705."},
    writePrompt:`Banda Singh could have written his own name on the coin. He wrote the Gurus' names instead. Kamwar Khan described his fighters as 'sweepers and tanners.' The Akhbar reported 5,000 Muslims voluntarily in his army. Two-thirds of the harvest went to the peasant.\n\nWhat kind of state was Banda Singh building? Use at least two specific things from the sources.`,
    discussionQ:`The Mughal court said this was a war of Sikhs against Muslims. Their own intelligence service said 5,000 Muslims were fighting for Banda Singh. When a source contradicts its own side's argument, why does that make it more reliable — and why does that matter for how we evaluate historical claims?`,
    teacherNote:`The hostile witness concept is the methodological core. The coin inscription is the philosophical center — he had the power to write his own name and chose not to. Connect back to Kapur Singh: sovereignty belonging to the Guru-Panth, not to any individual.`,
  },
  {
    id:"siege-and-martyrdom", num:"03",
    title:"The Siege of Gurdas Nangal",
    period:"1710–1716",
    subtitle:"What It Costs to Refuse",
    intro:"In December 1710, the Mughal Emperor issued a kill-on-sight order for anyone who worshipped Nanak. In April 1715, Banda Singh and approximately 700 Sikhs were besieged at Gurdas Nangal and survived for eight months on bark and grass. None of them converted to save their lives. This unit is about what that refusal meant.",
    blocks:[
      {type:"prose",text:`Emperor Bahadur Shah eventually led a campaign into Panjab himself — bringing his princes, his senior nobles, the full machinery of the largest empire in South Asia. Before the campaign reached its crisis at Lohgarh, the Emperor issued an order that the Akhbar-i-Darbar recorded in full:`},
      {type:"source",citation:"Akhbar-i Darbar-i Mualla, December 10, 1710. Translated by Dr. Bhagat Singh, Punjab Past and Present, Vol. XVIII-II, 1984.",text:`The Emperor issued an edict ordering a wholesale killing of the Sikhs — the worshippers of Nanak — wherever found, saying:\n\n"Nanak prastan ra har ja kih ba-yaband ba-qatl rasanand."\n\n[Wherever the Nanak-worshippers are found, bind them and put them to death.]\n\nThis order was later repeated by Emperor Farrukh Siyar in almost the same words.`,glossary:{"Nanak prastan ra har ja kih ba-yaband ba-qatl rasanand":"The original Persian of the genocide order. 'Wherever found' — no geographic limit. 'Bind them' before killing — organized execution, not battlefield killing. The target is religious identity, not military participation.","Farrukh Siyar":"Bahadur Shah's successor, under whose reign Banda Singh was ultimately captured and executed."}},
      {type:"prose",text:`"Wherever found" means the kill order applies outside any battle — to forty Vanjara Sikh traders of Multan who were not soldiers. The Akhbar recorded the implementation with the same bureaucratic tone it used for administrative appointments:`},
      {type:"source",citation:"Akhbar-i Darbar-i Mualla, October 11, 1711. Translated by Dr. Bhagat Singh, Punjab Past and Present, Vol. XVIII-II, 1984.",text:`Sarbarah Khan Kotwal was told that forty banjaras who were Nanak-worshippers had been brought in the premises of the kotwali from the areas surrounding Multan. If they embraced Islam, that would be better; otherwise they should be killed. The Emperor was informed that they did not change from the path of infidelity. They were ordered to be killed.`,glossary:{"kotwal":"The chief of police of a Mughal city, responsible for carrying out imperial commands.","path of infidelity":"The Mughal court's language for remaining Sikh. These forty traders were not fighters. They were offered their lives. They chose to die."}},
      {type:"prose",text:`Forty traders were brought in. They were offered their lives. They declined. They were killed. The bureaucratic register moves on. State violence is most dangerous not when it is dramatic, but when it is routine.`},
      {type:"heading",text:"The Eyewitness at Lohgarh"},
      {type:"prose",text:`Muhammad Hadi Kamwar Khan was physically present when Bahadur Shah's forces attacked Lohgarh in December 1710. He admits he separated from the Imperial forces out of curiosity, almost got killed by a cannonball fired from a cannon improvised from tamarind wood, entered the fort after it fell, and walked through what the Imperial army had done. He then wrote it down, departing from the official account:`},
      {type:"source",citation:"Muhammad Hadi Kamwar Khan, Tazkiratu's Salatin Chaghata, c. 1724. Translated by S. Ali Nadeem Rezavi, Sikh History from Persian Sources, 2001.",text:`Having determined to write only the true facts, I now leave the testimony of the [official] reports and proceed to put into writing what I myself saw without ornamentation of any sort.\n\nAfter reaching within an arrow-shot distance of that mud-fort, we drew our reins when a cannon-ball fired from [a gun] made from a tamarind tree came from the top of the hillock and fell on the neck of the horse of a friend of mine.\n\nI along with my companions entered the infidels' entrenchments, and had the sight of what the plunderers [from the Mughal forces] were doing. The plundering Baluch, the Rohila Afghans and the boy-retainers from Kabul, were engaged in pillage and were making captive and taking away whole families of women and children; they were burning their homes and huts and plundering cash and goods beyond computation.\n\nOn 25th [17 December 1710] nearly twenty lakh rupees, including ashrafis [gold coins] were collected from Lohgarh after digging up the ground.`,glossary:{"tamarind tree":"Banda Singh's forces improvised artillery from tamarind wood — fighting the Mughal Empire's professional army with wooden guns, requiring the Emperor himself and four princes to retake the capital.","without ornamentation of any sort":"Kamwar Khan explicitly signals he's departing from the official record. His account of Mughal forces plundering women and children is not something an official chronicle would include.","twenty lakh rupees":"Two million rupees in gold, dug from Lohgarh after the battle — a measure of the wealth Sikh sovereignty had accumulated."}},
      {type:"prose",text:`Lohgarh fell. Banda Singh escaped. For five years he continued to operate from the mountains. In April 1715, Farrukh Siyar sent tens of thousands of troops with specific orders. Banda Singh and approximately 700 Sikhs were besieged at Gurdas Nangal. Eight months. By the end they were surviving on bark, grass, and the flesh of horses. Kamwar Khan records what happened when the captives arrived in Delhi:`},
      {type:"source",citation:"Muhammad Hadi Kamwar Khan, Tazkiratu's Salatin Chaghata, c. 1724. Translated by S. Ali Nadeem Rezavi.",text:`I'timāduddaula Bahadur brought into the Fort that chief of the heretics, placed in an iron cage, along with his principal men and companions, made to wear wooden-hats and to appear strange and ridiculous.\n\nSar Barah Khan, Kotwal, had a hundred persons of this doomed sect beheaded every day. He suspended the corpses of the executed persons from trees around the city.\n\n29th [Jumada II, 20 June 1716]. Sar Barah, the Kotwal, had the doomed rebel [Banda] executed with much torture along with his three-year old son, and twenty-six of his companions; and thus the world was cleansed of the presence of that polluted one.`,glossary:{"wooden-hats":"The captives were dressed in absurd costumes and paraded through Delhi — designed to strip them of dignity before killing them.","a hundred persons of this doomed sect beheaded every day":"Six hundred and ninety-four people were brought back from Gurdas Nangal. Kamwar Khan records this in the same account as the number of swords and shields captured — as inventory.","his three-year old son":"Banda Singh's infant son was killed before his eyes. Kamwar Khan records this as a matter of course — its inclusion in the bureaucratic accounting is among the most damning inadvertent testimonies of the period."}},
      {type:"prose",text:`Kamwar Khan writes this as a victory. What he preserved is a precise account of what the Mughal Empire did to 694 people who refused to change what they called themselves.\n\nBritish observers present in Delhi recorded that not one of the prisoners converted to save their life. Six hundred and ninety-four people who had survived eight months on bark and grass walked into the execution ground and did not accept the terms on which the empire was prepared to let them live.\n\nRemember Bhangu's formulation from Unit 01: "The Khalsa is either fully sovereign or in a state of war and rebellion. A subservient coexistence they never accept." The 694 people at Gurdas Nangal refused a specific offer: convert, and the empire will let you live. The entire argument of Vaisakhi 1699 was premised on the opposite claim.\n\nBanda Singh was executed on June 20, 1716. He had been a Sikh for eight years.`},
    ],
    glossary:{"Bahadur Shah":"The Mughal Emperor who succeeded Aurangzeb in 1707 and personally led the campaign against Banda Singh in Panjab in 1710-1711.","Gurdas Nangal":"A fortified position in present-day Gurdaspur district, Panjab, where Banda Singh and approximately 700 Sikhs were besieged from April to December 1715."},
    writePrompt:`Kamwar Khan wrote the execution of Banda Singh's infant son as one line in a bureaucratic account. He recorded 100 executions per day as inventory. He did not note that not one prisoner converted — that comes from British observers.\n\nRead those three things together. What does Kamwar Khan's account tell us about the Mughal court — not what it records, but what it doesn't notice? And what does the refusal of 694 people to convert tell us about what they understood themselves to be?`,
    discussionQ:`The empire offered them their lives. All 694 refused. Bhangu says the Khalsa is 'either fully sovereign or in a state of war and rebellion — a subservient coexistence they never accept.' Is that what happened at Gurdas Nangal? Or is there something Bhangu's formulation doesn't capture?`,
    teacherNote:`Kamwar Khan's account preserves details the official record would never include — he explicitly said he was departing from the official reports. The teenager story is unverified in primary sources — be transparent about that distinction.`,
  },
  {
    id:"legacy-and-revisionism", num:"04",
    title:"What He Left Behind",
    period:"1716 — Present",
    subtitle:"Legacy, Contested History, and How to Read Both",
    intro:"Banda Singh Bahadur was executed in 1716. His legacy has been actively fought over ever since — by Hindu nationalists claiming him as a Hindu hero, by Muslim commentators portraying him as an anti-Muslim oppressor, and by the Sikh community itself. Learning how to evaluate these competing claims is not just about Banda Singh. It is a skill that applies to every contested moment in Sikh history.",
    blocks:[
      {type:"prose",text:`Banda Singh Bahadur was the first person to establish Sikh political sovereignty over Panjabi territory. He did it in eight years, against an empire with professional cavalry, artillery, and decades of experience suppressing Sikh resistance. He abolished a feudal land system, redistributed land to those who worked it, minted currency in the Gurus' names, protected Muslim worship, appointed a Muslim governor, and built an administrative state. Then the empire mobilized everything it had and destroyed it.\n\nWhat it could not destroy was what Banda Singh had proved. Before him, the Mughal argument was straightforward: the Khalsa was a religious community suppressible by sufficient force. After him, that argument was unavailable. The Khalsa had governed.`},
      {type:"heading",text:"What Came After"},
      {type:"prose",text:`The three decades following Banda Singh's execution were the most brutal in Sikh history. Farrukh Siyar and Muhammad Shah pursued the Khalsa with systematic violence. The Khalsa survived by becoming ungovernable. The Misl system — twelve independent Sikh confederacies — replaced the centralized structure Banda Singh had tried to build with something more resilient: no single leader to capture, no single capital to destroy, collective decision-making at the Sarbat Khalsa held twice yearly at the Darbar Sahib. By the late eighteenth century the Misls were consolidating power across Panjab, and in 1799 Ranjit Singh took Lahore. The Sikh Empire that followed was built directly on what Banda Singh had proved.`},
      {type:"heading",text:"Why History Gets Contested"},
      {type:"prose",text:`History is not fought over because it is dead. It is fought over because it is alive — because who controls the past shapes what the present is permitted to claim.\n\nRSS-affiliated organizations have promoted a reading of Banda Singh as a Hindu hero: born a Hindu Rajput, fighting a Muslim Mughal governor, therefore a champion of Hinduism against Islam. This argument appears in BJP-approved textbooks and circulates widely on social media. The problems are multiple. First, Banda Singh received Khalsa initiation — confirmed even in Mughal court records, which call him "Nanak-prastan." Second, the Mughal genocide order targeted Nanak-worshippers specifically, not Hindus. Third, the Mughal Emperor's own intelligence apparatus reported 5,000 Muslims voluntarily in Banda Singh's army with their right to pray protected. You cannot fight a religious war against Muslims while 5,000 Muslims join your army and you protect their namaz.\n\nA different revisionism from certain Muslim commentators portrays Banda Singh as an anti-Muslim oppressor — pointing to the destruction of mosques at Sirhind's fall. These events happened and should not be minimized. But they need to be read against the same Akhbar that records, within months, Banda Singh actively protecting Muslim worship with 5,000 Muslim volunteers.`},
      {type:"heading",text:"The Hostile Witness as Method"},
      {type:"prose",text:`A hostile witness is a source testifying against its own interest. The Akhbar-i-Darbar-i-Mualla is the Mughal Emperor's own intelligence digest. The Emperor was trying to frame the conflict as a religious war against Muslims. His intelligence service reported 5,000 Muslims voluntarily in Banda Singh's army. The question is not whether we trust the Akhbar in general — it has its own biases. The question is: why would the Mughal government's own spy network report something that directly contradicted the Emperor's preferred narrative, if it weren't true? There is no good answer. Which means the report is reliable.\n\nKamwar Khan calls Banda Singh "wretched," "doomed," "an infidel." And yet his account preserves the tamarind-wood cannon, 20 lakh rupees in gold dug from Lohgarh, Mughal forces plundering women and children. He intended to write a triumph. What he wrote, inadvertently, was evidence.`},
      {type:"source",citation:"Akhbar-i Darbar-i Mualla, April 28, 1711. Translated by Dr. Bhagat Singh, Punjab Past and Present, Vol. XVIII-II, 1984.",text:`The wretched Nanak-prastan [Banda Singh] has his camp in the town of Kalanaur. During this period he has promised and proclaimed: "I do not oppress the Muslims." Accordingly, for any Muslim who approaches him, he fixes a daily allowance and wages, and looks after him. He has permitted them to recite Khutba and namaz. As such, five thousand Muslims have gathered round him.`,glossary:{"hostile witness":"A source testifying against its own interest. The Mughal court had every reason to portray Banda Singh as anti-Muslim. Their own report confirms 5,000 Muslim volunteers in his army. The hostility of the source is precisely what makes the testimony reliable."}},
      {type:"heading",text:"Raj Bina Na Dharam Chale Hai — Today"},
      {type:"prose",text:`Kapur Singh argues that the Khalsa's political nature is not incidental — it is constitutive. The Order of the Khalsa divorced from political activity has "no intelligible connotation." Bhangu's formulation is starker: "either fully sovereign or in a state of war and rebellion." After 1849 — after British annexation, after Partition, after 1984 — the question of what sovereignty means for a community without a state becomes genuinely complex. This is not a question with a clean answer.\n\nBanda Singh Bahadur died refusing the empire's terms. He had been a Sikh for eight years. In those eight years he proved that the Khalsa could govern — could build something fair, something that fed people and gave them their land and protected their right to pray regardless of religion. The Mughal Empire destroyed what he built. What it could not destroy was the proof that it was possible.`},
    ],
    glossary:{"RSS":"Rashtriya Swayamsevak Sangh — the Hindu nationalist organization whose affiliated parties have promoted a revisionist reading of Sikh history that seeks to absorb it into a broader Hindu nationalist narrative.","Sarbat Khalsa":"The collective assembly of the Khalsa — convened twice yearly at the Darbar Sahib during the Misl period to make collective decisions binding on the entire community.","1984":"The year of Operation Bluestar (June), the assassination of Prime Minister Indira Gandhi (October), and the Delhi pogroms. The watershed event of contemporary Sikh political consciousness.","Ranjit Singh":"The Sikh leader who unified the Misl confederacies and established the Sikh Empire in 1799. Annexed by the British in 1849."},
    writePrompt:`Kapur Singh says the Khalsa divorced from political activity has 'no intelligible connotation.' Bhangu says it is 'either fully sovereign or in a state of war and rebellion.' The RSS says Banda Singh was a Hindu hero. The Mughal court says he was an anti-Muslim oppressor. The Akhbar says 5,000 Muslims volunteered to fight for him.\n\nYou are a Sikh in 2025. You do not control a state. Using at least two specific things from across all four units, write what you think Banda Singh Bahadur's story means for you, now.`,
    discussionQ:`History is fought over because it is alive — because who controls the past shapes what the present is permitted to claim. The RSS wants to claim Banda Singh. The Mughal court tried to define him as a heretic. Bhangu and Kapur Singh made their own arguments. Who should get to decide who Banda Singh Bahadur was — and what qualifies someone to make that claim?`,
    teacherNote:`Capstone unit. Distinguish empirical claims (what sources say), interpretive claims (what those facts mean), prescriptive claims (what they mean for us now). Ask students to apply the hostile witness methodology to a claim they've heard outside this classroom.`,
  },
];

const LOWER_MODULES  = [{title:"Guru Nanak and the World He Entered",period:"1469–1539"},{title:"The Question of Sacrifice",period:"1539–1675"},{title:"Anandpur and the Founding of the Khalsa",period:"1675–1708"}];
const Y2_MODULES     = [{title:"Misls & Survival",period:"1716–1799"},{title:"The Sikh Empire",period:"1799–1849"},{title:"Annexation & Partition",period:"1849–1947"},{title:"1984 & After",period:"1984–Present"}];

// ─── HELPERS ──────────────────────────────────────────────────────────────────



function AnnotatedOnce({ text, glossary }) {
  const [tip, setTip] = useState(null);
  const keys = Object.keys(glossary||{}).sort((a,b)=>b.length-a.length);
  if (!keys.length) return <span style={{whiteSpace:"pre-wrap"}}>{text}</span>;
  const rx = new RegExp(`(${keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`, 'gi');
  const parts = text.split(rx);
  const out = [];
  for (let i=0;i<parts.length;i++) {
    const p=parts[i], k=keys.find(k=>k.toLowerCase()===p.toLowerCase());
    if (k) {
      out.push(<span key={i} onClick={()=>setTip({term:k,def:glossary[k]})} style={{borderBottom:`1.5px dotted ${C.crimson}`,cursor:"pointer",color:C.crimson}}>{p}</span>);
    } else out.push(<span key={i}>{p}</span>);
  }
  return (
    <span>
      {tip&&<div onClick={()=>setTip(null)} style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:C.white,border:`1px solid ${C.sourceB}`,borderLeft:`4px solid ${C.crimson}`,color:C.text,padding:"16px 20px",maxWidth:420,width:"90vw",zIndex:9998,fontSize:13.5,lineHeight:1.8,fontFamily:"'Spectral',serif",boxShadow:"0 8px 40px rgba(15,23,42,0.15)",cursor:"pointer",borderRadius:"0 10px 10px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:C.crimson}}>{tip.term}</span>
          <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,color:C.muted}}>tap to close</span>
        </div>
        {tip.def}
      </div>}
      {out}
    </span>
  );
}

function SourceBlock({ block }) {
  return (
    <div style={{margin:"32px 0",background:C.source,border:`1px solid ${C.sourceB}`,borderLeft:`4px solid ${C.crimson}`,borderRadius:"0 12px 12px 0",padding:"22px 24px"}}>
      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:C.crimson,marginBottom:6}}>Primary Source</div>
      <div style={{fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:12,color:C.muted,marginBottom:16,lineHeight:1.6,paddingBottom:14,borderBottom:`1px solid #BFCFE840`}}>{block.citation}</div>
      <div style={{fontFamily:"'Spectral',serif",fontSize:17,lineHeight:2.0,color:C.text,whiteSpace:"pre-wrap"}}><AnnotatedOnce text={block.text} glossary={block.glossary||{}}/></div>
    </div>
  );
}

// ─── RAAJ ─────────────────────────────────────────────────────────────────────
async function aiCall(msgs, sys) {
  const r = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: sys, messages: msgs }),
  });
  return (await r.json()).content[0].text;
}

function RaajFloat({ onClick, active }) {
  return (
    <div style={{position:"fixed",bottom:24,right:24,zIndex:500,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
      <button onClick={onClick} className={active?"":"raaj-btn"}
        style={{width:56,height:56,borderRadius:"50%",background:C.navy,border:"3px solid #fff",cursor:"pointer",padding:0,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(30,58,95,0.35)",transition:"transform 0.15s,box-shadow 0.15s",outline:"none"}}>
        <Dumalla size={50}/>
      </button>
      <div style={{background:"rgba(255,255,255,0.92)",backdropFilter:"blur(6px)",padding:"2px 10px",borderRadius:20,boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>
        <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:C.navy}}>Raaj</span>
      </div>
    </div>
  );
}

function RaajPanel({ unit, context, onClose }) {
  const [msgs, setMsgs] = useState([{role:"assistant",content:"What do you want to understand — a word, an argument, something from one of the sources?"}]);
  const [val,setVal]=useState(""); const [busy,setBusy]=useState(false);
  const end=useRef(); useEffect(()=>end.current?.scrollIntoView({behavior:"smooth"}),[msgs]);
  const unitCtx = unit ? `Unit ${unit.num}: "${unit.title}" — ${unit.subtitle}. ` : "";
  const sys = `You are Raaj, a tutor for a Khalsa School curriculum on Banda Singh Bahadur (ages 14-16). ${unitCtx}

Key sources you know deeply:
- Kapur Singh, Parasaraprasna: the Khalsa "divorced from political activity has no intelligible connotation"
- Rattan Singh Bhangu, Prachin Panth Prakash: "The Khalsa is either fully sovereign or in a state of war and rebellion"
- Gurpartap Surya Granth: "without political sovereignty, the good way of life cannot securely prevail"
- Akhbar-i Darbar-i Mualla (Mughal court records): genocide orders, the 5,000 Muslims in Banda Singh's army, the batai system
- Kamwar Khan, Tazkiratu's Salatin Chaghata: eyewitness at Lohgarh, the executions at Delhi
- Banda Singh's coin: "Yaft az Nanak Guru Gobind Singh" — sovereignty credited to the Gurus, not any individual

Your character: You believe the sources are clear and you say so. You think sovereignty is not optional for the Khalsa — it's the point. When students hedge or soften the political implications of what they've read, you push back directly and quote the source. You connect the historical argument to the present: what does "either fully sovereign or in a state of war and rebellion" mean right now? You don't demand a particular answer but you don't pretend the question is abstract either.

Rules:
- Explain vocabulary, historical context, theological arguments freely
- Pull specific quotes from the sources whenever relevant — don't just summarize
- Be direct and opinionated about what the sources argue; don't hide behind false neutrality
- When students ask what something means today, engage with that seriously
- Challenge weak or evasive readings of the sources
- SHORT responses — 2-4 sentences maximum. Never sycophantic.
${context?`\nThis reader wrote: "${context}"`:""}`;
  async function send() {
    if (!val.trim()||busy) return;
    const m={role:"user",content:val}; const next=[...msgs,m];
    setMsgs(next); setVal(""); setBusy(true);
    const reply = await aiCall(next.map(x=>({role:x.role,content:x.content})), sys);
    setMsgs(p=>[...p,{role:"assistant",content:reply}]); setBusy(false);
  }
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.4)",zIndex:499,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(3px)"}} onClick={onClose}>
      <div style={{background:C.white,width:"100%",maxWidth:560,height:"58vh",display:"flex",flexDirection:"column",borderRadius:"20px 20px 0 0",boxShadow:"0 -8px 40px rgba(15,23,42,0.18)",animation:"slideUp 0.28s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:40,height:40,borderRadius:"50%",overflow:"hidden",flexShrink:0,border:`2px solid ${C.crimson}`}}><Dumalla size={40}/></div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,color:C.navy}}>Raaj</div>
            <div style={{fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:12,color:C.muted,marginTop:1}}>Ask about words, sources, arguments</div>
          </div>
          <button onClick={onClose} style={{background:C.surface,border:"none",color:C.muted,cursor:"pointer",width:30,height:30,borderRadius:"50%",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px",display:"flex",flexDirection:"column",gap:12}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-end",gap:8,justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
              {m.role==="assistant"&&<div style={{width:28,height:28,borderRadius:"50%",overflow:"hidden",flexShrink:0}}><Dumalla size={28}/></div>}
              <div style={{maxWidth:"80%",background:m.role==="user"?C.navy:C.surface,color:m.role==="user"?"#fff":C.text,padding:"10px 14px",borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",fontFamily:"'Spectral',serif",fontSize:14,lineHeight:1.7}}>
                {m.content}
              </div>
            </div>
          ))}
          {busy&&<div style={{display:"flex",alignItems:"flex-end",gap:8}}>
            <div style={{width:28,height:28,borderRadius:"50%",overflow:"hidden",flexShrink:0}}><Dumalla size={28}/></div>
            <div style={{background:C.surface,padding:"10px 16px",borderRadius:"14px 14px 14px 4px"}}><span style={{color:C.navy,fontSize:16,letterSpacing:4}}>···</span></div>
          </div>}
          <div ref={end}/>
        </div>
        <div style={{padding:"12px 16px",borderTop:`1px solid ${C.border}`,display:"flex",gap:8}}>
          <input value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about a word, an argument, a historical term..." style={{flex:1,background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:10,color:C.text,padding:"10px 14px",fontSize:14,transition:"border-color 0.2s"}} onFocus={e=>e.target.style.borderColor=C.navy} onBlur={e=>e.target.style.borderColor=C.border}/>
          <button onClick={send} style={{background:C.crimson,border:"none",color:"#fff",padding:"10px 18px",borderRadius:10,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:12,letterSpacing:"0.06em"}}>Ask</button>
        </div>
      </div>
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ crumbs, onCrumb }) {
  return (
    <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,height:52,display:"flex",alignItems:"center",padding:"0 24px",gap:0,position:"sticky",top:0,zIndex:50}}>
      <div style={{background:C.crimson,borderRadius:6,padding:"3px 9px",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:11,letterSpacing:"0.12em",color:"#fff",textTransform:"uppercase",marginRight:14}}>HSC</div>
      {crumbs.map((cr,i)=>(
        <span key={i} style={{display:"flex",alignItems:"center"}}>
          {i>0&&<span style={{color:C.border,margin:"0 8px",fontSize:16}}>›</span>}
          <button onClick={()=>onCrumb(i)} style={{background:"none",border:"none",cursor:i<crumbs.length-1?"pointer":"default",color:i===crumbs.length-1?C.text:C.muted,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:i===crumbs.length-1?600:400,fontSize:13,padding:0,transition:"color 0.15s"}} onMouseOver={e=>{if(i<crumbs.length-1)e.target.style.color=C.navy}} onMouseOut={e=>{if(i<crumbs.length-1)e.target.style.color=C.muted}}>{cr}</button>
        </span>
      ))}
    </div>
  );
}

// ─── UNIT PAGE ─────────────────────────────────────────────────────────────────
function UnitPage({ unit, trackLabel, onBack, showRaaj, setShowRaaj }) {
  const [view, setView] = useState("read");
  const [response, setResponse] = useState("");
  const [entered, setEntered] = useState(false);
  useEffect(()=>{ setEntered(false); const t=setTimeout(()=>setEntered(true),40); return()=>clearTimeout(t); },[unit.id]);
  const allGlossary = {...unit.glossary};
  unit.blocks.forEach(b=>{ if(b.type==="source"&&b.glossary) Object.assign(allGlossary,b.glossary); });
  const wc = response.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div style={{minHeight:"100vh",background:C.bg}}>
      <Nav crumbs={["Curriculum", trackLabel, unit.title]} onCrumb={i=>{ if(i<=1) onBack(); }}/>
      {showRaaj&&<RaajPanel unit={unit} context={response} onClose={()=>setShowRaaj(false)}/>}
      <RaajFloat onClick={()=>setShowRaaj(p=>!p)} active={showRaaj}/>

      <div style={{maxWidth:680,margin:"0 auto",padding:"40px 24px 100px",opacity:entered?1:0,transform:entered?"none":"translateY(8px)",transition:"opacity 0.3s ease,transform 0.3s ease"}}>
        {/* Header */}
        <div style={{marginBottom:36}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:C.white,border:`1px solid ${C.border}`,borderRadius:20,padding:"4px 12px 4px 4px",marginBottom:16}}>
            <div style={{background:C.crimson,borderRadius:16,padding:"2px 10px"}}>
              <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"#fff"}}>Unit {unit.num}</span>
            </div>
            <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:500,fontSize:12,color:C.muted}}>{unit.period}</span>
          </div>
          <h1 style={{fontFamily:"'Spectral',serif",fontWeight:600,fontSize:34,lineHeight:1.2,color:C.text,marginBottom:12}}>{unit.title}</h1>
          <p style={{fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:16.5,lineHeight:1.75,color:C.sub}}>{unit.intro}</p>
        </div>

        {/* Tab bar */}
        <div style={{display:"flex",background:C.surface,borderRadius:12,padding:4,gap:4,marginBottom:32}}>
          {[["read","Read the Sources"],["write","Write & Respond"]].map(([v,label])=>(
            <button key={v} className="tab-btn" onClick={()=>setView(v)}
              style={{flex:1,padding:"9px 16px",borderRadius:9,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:13,background:view===v?C.white:"none",color:view===v?C.crimson:C.muted,border:"none",cursor:"pointer",transition:"background 0.15s,color 0.15s",boxShadow:view===v?"0 1px 4px rgba(0,0,0,0.08)":"none"}}>
              {label}
            </button>
          ))}
        </div>

        {view==="read"&&(
          <div>
            {unit.blocks.map((b,i)=>{
              if(b.type==="heading") return <h2 key={i} style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:18,color:C.navy,marginTop:44,marginBottom:16,paddingTop:28,borderTop:`1px solid ${C.border}`}}>{b.text}</h2>;
              if(b.type==="prose") return <p key={i} style={{fontFamily:"'Spectral',serif",fontSize:18,lineHeight:1.95,color:"#1E293B",marginBottom:24}}><AnnotatedOnce text={b.text} glossary={allGlossary}/></p>;
              if(b.type==="source") return <SourceBlock key={i} block={b}/>;
              return null;
            })}
            <div style={{marginTop:32,paddingTop:20,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:13,color:C.muted}}>Tap <span style={{borderBottom:`1.5px dotted ${C.crimson}`,color:C.crimson}}>underlined terms</span> for glossary.</span>
              <button onClick={()=>setView("write")} style={{background:C.crimson,color:"#fff",border:"none",padding:"10px 22px",borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>Write a Response →</button>
            </div>
          </div>
        )}

        {view==="write"&&(
          <div>
            <div style={{marginBottom:32,paddingBottom:24,borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:C.muted,marginBottom:12}}>Sources for reference</div>
              {unit.blocks.filter(b=>b.type==="source").map((b,i)=><SourceBlock key={i} block={b}/>)}
              <button onClick={()=>setView("read")} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"6px 14px",borderRadius:8,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:500,fontSize:12,cursor:"pointer"}}>← Full reading</button>
            </div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:C.crimson,marginBottom:10}}>Your Response</div>
            <div style={{fontFamily:"'Spectral',serif",fontWeight:500,fontSize:19,lineHeight:1.5,color:C.text,marginBottom:24,whiteSpace:"pre-wrap"}}>{unit.writePrompt}</div>
            <textarea value={response} onChange={e=>setResponse(e.target.value)} placeholder="Use something specific from the sources — not your general impressions." style={{width:"100%",minHeight:180,background:C.white,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"18px",fontFamily:"'Spectral',serif",fontSize:17,lineHeight:1.85,color:C.text,resize:"vertical"}} onFocus={e=>e.target.style.borderColor=C.navy} onBlur={e=>e.target.style.borderColor=C.border}/>
            <div style={{marginTop:10,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:C.muted}}>{wc} words</span>
              <button onClick={()=>setShowRaaj(true)} style={{display:"flex",alignItems:"center",gap:7,background:C.surface,border:"none",padding:"6px 14px",borderRadius:20,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:12,color:C.navy}}>
                <div style={{width:20,height:20,borderRadius:"50%",overflow:"hidden"}}><Dumalla size={20}/></div>Ask Raaj
              </button>
            </div>
            <div style={{marginTop:40,background:C.navy,borderRadius:16,padding:"26px 24px"}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:"rgba(255,255,255,0.45)",marginBottom:12}}>Discussion Question</div>
              <div style={{fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:19,color:"rgba(255,255,255,0.9)",lineHeight:1.6}}>{unit.discussionQ}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MODULE PAGE ──────────────────────────────────────────────────────────────
function ModulePage({ onUnit, onBack, showRaaj, setShowRaaj }) {
  const [entered, setEntered] = useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setEntered(true),40); return()=>clearTimeout(t); },[]);
  const pips = [C.crimson,"#2E6B4F","#5A3820","#1E3A5F"];

  return (
    <div style={{minHeight:"100vh",background:C.bg}}>
      <Nav crumbs={["Curriculum","Upper School · Year One"]} onCrumb={i=>{ if(i===0) onBack(); }}/>
      {showRaaj&&<RaajPanel unit={null} context={null} onClose={()=>setShowRaaj(false)}/>}
      <RaajFloat onClick={()=>setShowRaaj(p=>!p)} active={showRaaj}/>

      <div style={{maxWidth:680,margin:"0 auto",padding:"40px 24px 80px"}}>
        <div style={{marginBottom:32,opacity:entered?1:0,transform:entered?"none":"translateY(10px)",transition:"opacity 0.35s ease,transform 0.35s ease"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:C.crimson,borderRadius:20,padding:"4px 12px",marginBottom:16}}>
            <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.7)"}}>Upper School · Year One · Sovereignty</span>
          </div>
          <h1 style={{fontFamily:"'Spectral',serif",fontWeight:600,fontSize:38,lineHeight:1.1,color:C.text,marginBottom:12}}>Banda Singh Bahadur</h1>
          <p style={{fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:16,lineHeight:1.75,color:C.sub,maxWidth:500}}>The first Sikh sovereign state — its founding logic, its governance, its destruction, and what it proved about the Khalsa's capacity to rule.</p>
        </div>

        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:C.muted,marginBottom:16}}>4 units</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {UNITS.map((u,i)=>(
            <button key={u.id} className="unit-pill" onClick={()=>onUnit(u)}
              style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,cursor:"pointer",textAlign:"left",padding:"18px 20px",display:"flex",alignItems:"center",gap:16,boxShadow:"0 2px 8px rgba(15,23,42,0.06)",opacity:entered?1:0,transform:entered?"none":"translateY(8px)",transition:`opacity 0.3s ease ${i*0.06}s,transform 0.3s ease ${i*0.06}s,box-shadow 0.15s,transform 0.15s`}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:pips[i],flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:500,fontSize:11,color:C.muted,marginBottom:4}}>{u.period}</div>
                <div style={{fontFamily:"'Spectral',serif",fontWeight:600,fontSize:18,color:C.text,marginBottom:3,lineHeight:1.3}}>{u.title}</div>
                <div style={{fontFamily:"'Spectral',serif",fontStyle:"italic",fontSize:13,color:C.sub,lineHeight:1.5}}>{u.intro.slice(0,90)}…</div>
              </div>
              <span className="arr" style={{color:C.muted,fontSize:18,flexShrink:0}}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function Landing({ onEnter, showRaaj, setShowRaaj }) {
  const [entered, setEntered] = useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setEntered(true),50); return()=>clearTimeout(t); },[]);

  const tracks = [
    { level:"Lower School", ages:"Ages 8–12", status:"dev", eta:"2025–26", accent:"#2E6B4F",
      title:"The Guru Period", desc:"Ten Gurus, one unfolding argument. Translated Gurbani, accessible narrative history, and the historical context of the Mughal world.",
      modules: LOWER_MODULES },
    { level:"Upper School · Year One", ages:"Ages 14–16", status:"live", accent:C.navy,
      title:"Banda Singh Bahadur", desc:"The first Sikh sovereign state — its founding logic, its governance, its destruction, and what it proved. Four units, Mughal court records, Kapur Singh's Parasaraprasna.",
      modules: UNITS.map(u=>({title:u.title,period:u.period})) },
    { level:"Upper School · Year Two", ages:"Ages 14–16", status:"dev", eta:"2025–26", accent:"#5A3820",
      title:"Empire, Dispossession, Now", desc:"The Sikh Empire, British annexation, Partition, 1984, and the formation of the western diaspora.",
      modules: Y2_MODULES },
  ];

  return (
    <div style={{minHeight:"100vh",background:C.bg}}>
      {/* Nav */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,height:52,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:C.crimson,borderRadius:6,padding:"3px 9px",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:11,letterSpacing:"0.12em",color:"#fff",textTransform:"uppercase"}}>HSC</div>
          <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:500,fontSize:13,color:C.muted}}>Khalsa School</span>
        </div>
        <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:C.muted}}>harvardsikh.org</span>
      </div>

      {showRaaj&&<RaajPanel unit={null} context={null} onClose={()=>setShowRaaj(false)}/>}
      <RaajFloat onClick={()=>setShowRaaj(p=>!p)} active={showRaaj}/>

      <div style={{maxWidth:720,margin:"0 auto",padding:"52px 24px 80px",opacity:entered?1:0,transform:entered?"none":"translateY(12px)",transition:"opacity 0.45s ease,transform 0.45s ease"}}>
        {/* Hero */}
        <div style={{marginBottom:56}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:C.navy,borderRadius:20,padding:"5px 14px",marginBottom:20}}>
            <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:11,color:"rgba(255,255,255,0.8)",letterSpacing:"0.06em"}}>Harvard Sikh Center · Khalsa School Curriculum</span>
          </div>
          <h1 style={{fontFamily:"'Spectral',serif",fontWeight:600,fontSize:48,lineHeight:1.1,color:C.text,marginBottom:20}}>A Curriculum Built<br/>on Primary Sources</h1>
          <p style={{fontFamily:"'Spectral',serif",fontSize:17,lineHeight:1.85,color:C.sub,maxWidth:540,marginBottom:32}}>
            Each unit assigns the actual documents — Mughal court intelligence digests, Persian eyewitness accounts, original Sikh scholarship — read in full, not summarized. Terms are annotated the first time they appear. Raaj, the AI tutor, is there for language and context. Conclusions are yours.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,background:C.border,borderRadius:12,overflow:"hidden",maxWidth:540}}>
            {[
              {label:"Primary sources",desc:"Documents, not summaries"},
              {label:"Glossary",desc:"Each term defined once"},
              {label:"Raaj",desc:"Context only — not conclusions"},
            ].map((f,i)=>(
              <div key={i} style={{background:C.white,padding:"14px 16px"}}>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:12,color:C.text,marginBottom:3}}>{f.label}</div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:400,fontSize:11,color:C.muted,lineHeight:1.4}}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase",color:C.muted,marginBottom:20}}>Curriculum Tracks</div>

        {/* Track bubbles */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {tracks.map((t,i)=>(
            <div key={i} className={t.status==="live"?"track-card":""} onClick={t.status==="live"?onEnter:null}
              style={{background:C.white,borderRadius:20,padding:"22px 24px",border:`1.5px solid ${t.status==="live"?C.crimson:C.border}`,cursor:t.status==="live"?"pointer":"default",opacity:t.status==="live"?1:0.55,boxShadow:t.status==="live"?`0 4px 16px rgba(165,28,48,0.08)`:"none",transition:"transform 0.2s,box-shadow 0.2s"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <div style={{background:t.accent,borderRadius:20,padding:"3px 12px"}}>
                    <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"#fff"}}>{t.level}</span>
                  </div>
                  <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:500,fontSize:12,color:C.muted}}>{t.ages}</span>
                  {t.status==="live"
                    ? <div style={{background:"#DCFCE7",borderRadius:20,padding:"2px 10px"}}><span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:10,color:"#166534"}}>● Available</span></div>
                    : <div style={{background:C.surface,borderRadius:20,padding:"2px 10px"}}><span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:500,fontSize:10,color:C.muted}}>In development · {t.eta}</span></div>
                  }
                </div>
                {t.status==="live"&&<span className="arr" style={{color:C.muted,fontSize:20,flexShrink:0,marginTop:2}}>→</span>}
              </div>
              <h3 style={{fontFamily:"'Spectral',serif",fontWeight:600,fontSize:20,color:C.text,marginBottom:6}}>{t.title}</h3>
              <p style={{fontFamily:"'Spectral',serif",fontSize:14,lineHeight:1.65,color:C.sub,marginBottom:12,maxWidth:480}}>{t.desc}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {t.modules.map((m,j)=>(
                  <div key={j} style={{background:C.surface,borderRadius:20,padding:"3px 10px"}}>
                    <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:500,fontSize:11,color:C.muted}}>{m.period} · {m.title.slice(0,26)}{m.title.length>26?"…":""}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{marginTop:44,paddingTop:28,borderTop:`1px solid ${C.border}`,display:"flex",gap:12,alignItems:"flex-start"}}>
          <div style={{background:C.crimson,borderRadius:6,padding:"3px 9px",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:11,letterSpacing:"0.12em",color:"#fff",textTransform:"uppercase",flexShrink:0,marginTop:1}}>HSC</div>
          <div style={{fontFamily:"'Spectral',serif",fontSize:13,color:C.muted,lineHeight:1.7}}>
            Developed by the <strong style={{color:C.text}}>Harvard Sikh Center</strong>. Primary sources include the <em>Akhbar-i Darbar-i Mualla</em>, Kamwar Khan's <em>Tazkiratu's Salatin Chaghata</em>, Kapur Singh's <em>Parasaraprasna</em>, and the HSC source archive.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [activeUnit, setActiveUnit] = useState(null);
  const [showRaaj, setShowRaaj] = useState(false);
  const go = s => { setShowRaaj(false); setScreen(s); };
  return (
    <>
      <style>{GS}</style>
      {screen==="landing" && <Landing onEnter={()=>go("module")} showRaaj={showRaaj} setShowRaaj={setShowRaaj}/>}
      {screen==="module"  && <ModulePage onUnit={u=>{ setActiveUnit(u); go("unit"); }} onBack={()=>go("landing")} showRaaj={showRaaj} setShowRaaj={setShowRaaj}/>}
      {screen==="unit"    && activeUnit && <UnitPage unit={activeUnit} trackLabel="Upper School · Year One" onBack={()=>go("module")} showRaaj={showRaaj} setShowRaaj={setShowRaaj}/>}
    </>
  );
}
