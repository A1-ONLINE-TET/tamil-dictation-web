// ═══════════════════════════════════════════════════════════
// தமிழ் பயிற்சி — ElevenLabs Audio Generator
// 240 Tamil சொற்களுக்கு mp3 files generate செய்யும்
//
// பயன்படுத்த:
//   node generate_audio.mjs YOUR_API_KEY
//
// உதாரணம்:
//   node generate_audio.mjs sk_abc123xyz
// ═══════════════════════════════════════════════════════════

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { writeFile, mkdir, access } from 'fs/promises';
import { join } from 'path';

// ── CONFIG ──────────────────────────────────────────────────
const API_KEY   = process.argv[2];          // CMD argument
const VOICE_ID  = 'EXAVITQu4vr4xnSDxMaL'; // ElevenLabs voice
const MODEL_ID  = 'eleven_multilingual_v2'; // Tamil support
const OUT_DIR   = './audio';                // output folder
const DELAY_MS  = 500;                     // delay between calls (rate limit)

// ── WORD LIST (240 words) ────────────────────────────────────
const ALL_WORDS = [
  { id: 'g1_l1_1', word: "அம்மா" },
  { id: 'g1_l1_2', word: "அப்பா" },
  { id: 'g1_l1_3', word: "ஆடு" },
  { id: 'g1_l1_4', word: "இலை" },
  { id: 'g1_l1_5', word: "ஈ" },
  { id: 'g1_l1_6', word: "உடை" },
  { id: 'g1_l1_7', word: "ஊசி" },
  { id: 'g1_l1_8', word: "எலி" },
  { id: 'g1_l1_9', word: "ஏணி" },
  { id: 'g1_l1_10', word: "ஐந்து" },
  { id: 'g1_l2_1', word: "பூ" },
  { id: 'g1_l2_2', word: "மரம்" },
  { id: 'g1_l2_3', word: "தண்ணீர்" },
  { id: 'g1_l2_4', word: "பால்" },
  { id: 'g1_l2_5', word: "சோறு" },
  { id: 'g1_l2_6', word: "வீடு" },
  { id: 'g1_l2_7', word: "நாய்" },
  { id: 'g1_l2_8', word: "பூனை" },
  { id: 'g1_l2_9', word: "மீன்" },
  { id: 'g1_l2_10', word: "பறவை" },
  { id: 'g1_l3_1', word: "கண்" },
  { id: 'g1_l3_2', word: "காது" },
  { id: 'g1_l3_3', word: "மூக்கு" },
  { id: 'g1_l3_4', word: "வாய்" },
  { id: 'g1_l3_5', word: "கை" },
  { id: 'g1_l3_6', word: "கால்" },
  { id: 'g1_l3_7', word: "தலை" },
  { id: 'g1_l3_8', word: "பல்" },
  { id: 'g1_l3_9', word: "நாக்கு" },
  { id: 'g1_l3_10', word: "விரல்" },
  { id: 'g2_l1_1', word: "தாத்தா" },
  { id: 'g2_l1_2', word: "பாட்டி" },
  { id: 'g2_l1_3', word: "அண்ணன்" },
  { id: 'g2_l1_4', word: "அக்கா" },
  { id: 'g2_l1_5', word: "தம்பி" },
  { id: 'g2_l1_6', word: "தங்கை" },
  { id: 'g2_l1_7', word: "மாமா" },
  { id: 'g2_l1_8', word: "அத்தை" },
  { id: 'g2_l1_9', word: "குழந்தை" },
  { id: 'g2_l1_10', word: "குடும்பம்" },
  { id: 'g2_l2_1', word: "மாம்பழம்" },
  { id: 'g2_l2_2', word: "வாழைப்பழம்" },
  { id: 'g2_l2_3', word: "ஆப்பிள்" },
  { id: 'g2_l2_4', word: "திராட்சை" },
  { id: 'g2_l2_5', word: "ஆரஞ்சு" },
  { id: 'g2_l2_6', word: "மாதுளை" },
  { id: 'g2_l2_7', word: "பலாப்பழம்" },
  { id: 'g2_l2_8', word: "கொய்யா" },
  { id: 'g2_l2_9', word: "பப்பாளி" },
  { id: 'g2_l2_10', word: "தர்பூசணி" },
  { id: 'g2_l3_1', word: "சிவப்பு" },
  { id: 'g2_l3_2', word: "நீலம்" },
  { id: 'g2_l3_3', word: "பச்சை" },
  { id: 'g2_l3_4', word: "மஞ்சள்" },
  { id: 'g2_l3_5', word: "வெள்ளை" },
  { id: 'g2_l3_6', word: "கருப்பு" },
  { id: 'g2_l3_7', word: "ஊதா" },
  { id: 'g2_l3_8', word: "இளஞ்சிவப்பு" },
  { id: 'g2_l3_9', word: "பழுப்பு" },
  { id: 'g2_l3_10', word: "வானவில்" },
  { id: 'g3_l1_1', word: "யானை" },
  { id: 'g3_l1_2', word: "சிங்கம்" },
  { id: 'g3_l1_3', word: "புலி" },
  { id: 'g3_l1_4', word: "குரங்கு" },
  { id: 'g3_l1_5', word: "முயல்" },
  { id: 'g3_l1_6', word: "ஆமை" },
  { id: 'g3_l1_7', word: "மான்" },
  { id: 'g3_l1_8', word: "கரடி" },
  { id: 'g3_l1_9', word: "நரி" },
  { id: 'g3_l1_10', word: "ஒட்டகம்" },
  { id: 'g3_l2_1', word: "நான் படிக்கிறேன்" },
  { id: 'g3_l2_2', word: "அவள் பாடுகிறாள்" },
  { id: 'g3_l2_3', word: "மழை பெய்கிறது" },
  { id: 'g3_l2_4', word: "பூ மலர்கிறது" },
  { id: 'g3_l2_5', word: "குழந்தை சிரிக்கிறது" },
  { id: 'g3_l2_6', word: "பறவை பறக்கிறது" },
  { id: 'g3_l2_7', word: "சூரியன் உதிக்கிறது" },
  { id: 'g3_l2_8', word: "நிலா ஒளிர்கிறது" },
  { id: 'g3_l2_9', word: "மீன் நீந்துகிறது" },
  { id: 'g3_l2_10', word: "காற்று வீசுகிறது" },
  { id: 'g3_l3_1', word: "தக்காளி" },
  { id: 'g3_l3_2', word: "வெங்காயம்" },
  { id: 'g3_l3_3', word: "கத்திரிக்காய்" },
  { id: 'g3_l3_4', word: "பீர்க்கங்காய்" },
  { id: 'g3_l3_5', word: "சுரைக்காய்" },
  { id: 'g3_l3_6', word: "முள்ளங்கி" },
  { id: 'g3_l3_7', word: "கேரட்" },
  { id: 'g3_l3_8', word: "பட்டாணி" },
  { id: 'g3_l3_9', word: "உருளைக்கிழங்கு" },
  { id: 'g3_l3_10', word: "பாவக்காய்" },
  { id: 'g4_l1_1', word: "ஆசிரியர்" },
  { id: 'g4_l1_2', word: "மருத்துவர்" },
  { id: 'g4_l1_3', word: "பொறியாளர்" },
  { id: 'g4_l1_4', word: "விவசாயி" },
  { id: 'g4_l1_5', word: "காவலர்" },
  { id: 'g4_l1_6', word: "தீயணைப்பாளர்" },
  { id: 'g4_l1_7', word: "வழக்கறிஞர்" },
  { id: 'g4_l1_8', word: "விமானி" },
  { id: 'g4_l1_9', word: "செவிலியர்" },
  { id: 'g4_l1_10', word: "அஞ்சல்காரர்" },
  { id: 'g4_l2_1', word: "சூரியன்" },
  { id: 'g4_l2_2', word: "சந்திரன்" },
  { id: 'g4_l2_3', word: "நட்சத்திரம்" },
  { id: 'g4_l2_4', word: "மலை" },
  { id: 'g4_l2_5', word: "கடல்" },
  { id: 'g4_l2_6', word: "ஆறு" },
  { id: 'g4_l2_7', word: "வானம்" },
  { id: 'g4_l2_8', word: "மேகம்" },
  { id: 'g4_l2_9', word: "இடி" },
  { id: 'g4_l2_10', word: "மின்னல்" },
  { id: 'g4_l3_1', word: "நாற்காலி" },
  { id: 'g4_l3_2', word: "மேசை" },
  { id: 'g4_l3_3', word: "கட்டில்" },
  { id: 'g4_l3_4', word: "கண்ணாடி" },
  { id: 'g4_l3_5', word: "விசிறி" },
  { id: 'g4_l3_6', word: "விளக்கு" },
  { id: 'g4_l3_7', word: "தொலைக்காட்சி" },
  { id: 'g4_l3_8', word: "குளிர்பதனப்பெட்டி" },
  { id: 'g4_l3_9', word: "அடுப்பு" },
  { id: 'g4_l3_10', word: "தொலைபேசி" },
  { id: 'g5_l1_1', word: "தலைநகரம்" },
  { id: 'g5_l1_2', word: "தமிழ்நாடு" },
  { id: 'g5_l1_3', word: "சென்னை" },
  { id: 'g5_l1_4', word: "மதுரை" },
  { id: 'g5_l1_5', word: "திருச்சிராப்பள்ளி" },
  { id: 'g5_l1_6', word: "கோயம்புத்தூர்" },
  { id: 'g5_l1_7', word: "குமரி" },
  { id: 'g5_l1_8', word: "பாரதம்" },
  { id: 'g5_l1_9', word: "குடியரசு" },
  { id: 'g5_l1_10', word: "ஜனநாயகம்" },
  { id: 'g5_l2_1', word: "பொங்கல்" },
  { id: 'g5_l2_2', word: "தீபாவளி" },
  { id: 'g5_l2_3', word: "கிறிஸ்துமஸ்" },
  { id: 'g5_l2_4', word: "ரம்ஜான்" },
  { id: 'g5_l2_5', word: "நவராத்திரி" },
  { id: 'g5_l2_6', word: "விநாயகர் சதுர்த்தி" },
  { id: 'g5_l2_7', word: "குடியரசு தினம்" },
  { id: 'g5_l2_8', word: "சுதந்திர தினம்" },
  { id: 'g5_l2_9', word: "ஆசிரியர் தினம்" },
  { id: 'g5_l2_10', word: "குழந்தைகள் தினம்" },
  { id: 'g5_l3_1', word: "தொடர்வண்டி" },
  { id: 'g5_l3_2', word: "விமானம்" },
  { id: 'g5_l3_3', word: "கப்பல்" },
  { id: 'g5_l3_4', word: "பேருந்து" },
  { id: 'g5_l3_5', word: "மோட்டார் சைக்கிள்" },
  { id: 'g5_l3_6', word: "சைக்கிள்" },
  { id: 'g5_l3_7', word: "கார்" },
  { id: 'g5_l3_8', word: "ஆட்டோ" },
  { id: 'g5_l3_9', word: "படகு" },
  { id: 'g5_l3_10', word: "ஹெலிகாப்டர்" },
  { id: 'g6_l1_1', word: "பூமி" },
  { id: 'g6_l1_2', word: "ஈர்ப்பு விசை" },
  { id: 'g6_l1_3', word: "ஒளிச்சேர்க்கை" },
  { id: 'g6_l1_4', word: "காந்தம்" },
  { id: 'g6_l1_5', word: "ஆற்றல்" },
  { id: 'g6_l1_6', word: "மின்சாரம்" },
  { id: 'g6_l1_7', word: "வெப்பநிலை" },
  { id: 'g6_l1_8', word: "திசைவேகம்" },
  { id: 'g6_l1_9', word: "நுண்ணுயிர்" },
  { id: 'g6_l1_10', word: "சுற்றுச்சூழல்" },
  { id: 'g6_l2_1', word: "தமிழ் மிகப் பழமையான மொழி" },
  { id: 'g6_l2_2', word: "கல்வியே அறிவின் கண்" },
  { id: 'g6_l2_3', word: "நேரத்தின் அருமை உணர்" },
  { id: 'g6_l2_4', word: "அறிவை வளர்க்கும் கல்வி" },
  { id: 'g6_l2_5', word: "உழைப்பே உயர்வின் அடிப்படை" },
  { id: 'g6_l2_6', word: "நல்லதை நினைப்போம்" },
  { id: 'g6_l2_7', word: "இயற்கையைக் காப்போம்" },
  { id: 'g6_l2_8', word: "மரம் நடுவோம் வளம் பெறுவோம்" },
  { id: 'g6_l2_9', word: "பெற்றோரை மதிப்போம்" },
  { id: 'g6_l2_10', word: "நாட்டை நேசிப்போம்" },
  { id: 'g6_l3_1', word: "கூட்டல்" },
  { id: 'g6_l3_2', word: "கழித்தல்" },
  { id: 'g6_l3_3', word: "பெருக்கல்" },
  { id: 'g6_l3_4', word: "வகுத்தல்" },
  { id: 'g6_l3_5', word: "பின்னம்" },
  { id: 'g6_l3_6', word: "தசமம்" },
  { id: 'g6_l3_7', word: "சதவீதம்" },
  { id: 'g6_l3_8', word: "கோணம்" },
  { id: 'g6_l3_9', word: "பரப்பளவு" },
  { id: 'g6_l3_10', word: "சுற்றளவு" },
  { id: 'g7_l1_1', word: "வல்லினம்" },
  { id: 'g7_l1_2', word: "மெல்லினம்" },
  { id: 'g7_l1_3', word: "இடையினம்" },
  { id: 'g7_l1_4', word: "குற்றியலுகரம்" },
  { id: 'g7_l1_5', word: "அகரமுதலி" },
  { id: 'g7_l1_6', word: "வேற்றுமை" },
  { id: 'g7_l1_7', word: "திணை" },
  { id: 'g7_l1_8', word: "பால்" },
  { id: 'g7_l1_9', word: "எண்" },
  { id: 'g7_l1_10', word: "இடம்" },
  { id: 'g7_l2_1', word: "திருக்குறள்" },
  { id: 'g7_l2_2', word: "சங்க இலக்கியம்" },
  { id: 'g7_l2_3', word: "அகப்பொருள்" },
  { id: 'g7_l2_4', word: "புறப்பொருள்" },
  { id: 'g7_l2_5', word: "கவிதை" },
  { id: 'g7_l2_6', word: "செய்யுள்" },
  { id: 'g7_l2_7', word: "உரைநடை" },
  { id: 'g7_l2_8', word: "நாடகம்" },
  { id: 'g7_l2_9', word: "சிறுகதை" },
  { id: 'g7_l2_10', word: "புதினம்" },
  { id: 'g7_l3_1', word: "புவியியல்" },
  { id: 'g7_l3_2', word: "வரலாறு" },
  { id: 'g7_l3_3', word: "குடிமையியல்" },
  { id: 'g7_l3_4', word: "பொருளாதாரம்" },
  { id: 'g7_l3_5', word: "கலாச்சாரம்" },
  { id: 'g7_l3_6', word: "நாகரிகம்" },
  { id: 'g7_l3_7', word: "மக்கள்தொகை" },
  { id: 'g7_l3_8', word: "இடம்பெயர்வு" },
  { id: 'g7_l3_9', word: "வேளாண்மை" },
  { id: 'g7_l3_10', word: "தொழில்துறை" },
  { id: 'g8_l1_1', word: "சுயசரிதை" },
  { id: 'g8_l1_2', word: "ஒப்புக்கொள்ளுதல்" },
  { id: 'g8_l1_3', word: "பொறுப்பேற்றல்" },
  { id: 'g8_l1_4', word: "சுற்றுப்புறம்" },
  { id: 'g8_l1_5', word: "தொலைக்காட்சி" },
  { id: 'g8_l1_6', word: "கணினி" },
  { id: 'g8_l1_7', word: "விண்வெளி" },
  { id: 'g8_l1_8', word: "புவியியல்" },
  { id: 'g8_l1_9', word: "பொருளாதாரம்" },
  { id: 'g8_l1_10', word: "அரசியலமைப்பு" },
  { id: 'g8_l2_1', word: "ஆலும் வேலும் பல்லுக்குறுதி" },
  { id: 'g8_l2_2', word: "கற்றது கைமண் அளவு" },
  { id: 'g8_l2_3', word: "அறிவே ஆற்றல்" },
  { id: 'g8_l2_4', word: "உழைப்பே உயர்வு" },
  { id: 'g8_l2_5', word: "ஒழுக்கமே உயர்வு தரும்" },
  { id: 'g8_l2_6', word: "கல்லாதவரே கண்ணில்லாதவர்" },
  { id: 'g8_l2_7', word: "பொறுமையே பொன்னாகும்" },
  { id: 'g8_l2_8', word: "நேர்மையே சிறந்த அறம்" },
  { id: 'g8_l2_9', word: "வாழ்க்கையே ஒரு பாடம்" },
  { id: 'g8_l2_10', word: "முயற்சி திருவினையாக்கும்" },
  { id: 'g8_l3_1', word: "செயற்கை நுண்ணறிவு" },
  { id: 'g8_l3_2', word: "இணையதளம்" },
  { id: 'g8_l3_3', word: "மென்பொருள்" },
  { id: 'g8_l3_4', word: "வன்பொருள்" },
  { id: 'g8_l3_5', word: "நிரலாக்கம்" },
  { id: 'g8_l3_6', word: "தரவு" },
  { id: 'g8_l3_7', word: "கிளவுட்" },
  { id: 'g8_l3_8', word: "இணையம்" },
  { id: 'g8_l3_9', word: "குறியாக்கம்" },
  { id: 'g8_l3_10', word: "செயலி" },
];

// ── MAIN ────────────────────────────────────────────────────
async function main() {
  if (!API_KEY) {
    console.error('❌ API key இல்லை!');
    console.error('   பயன்படுத்த: node generate_audio.mjs YOUR_API_KEY');
    process.exit(1);
  }

  // Create audio folder
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`📁 audio/ folder தயார்`);
  console.log(`🎯 மொத்தம்: ${ALL_WORDS.length} சொற்கள்`);
  console.log('');

  const client = new ElevenLabsClient({ apiKey: API_KEY });

  let success = 0, skip = 0, fail = 0;

  for (let i = 0; i < ALL_WORDS.length; i++) {
    const { id, word } = ALL_WORDS[i];
    const outPath = join(OUT_DIR, `${id}.mp3`);

    // Skip if already exists
    try {
      await access(outPath);
      console.log(`⏭️  [${i+1}/${ALL_WORDS.length}] Skip (already exists): ${word}`);
      skip++;
      continue;
    } catch (_) {}

    // Generate audio
    try {
      process.stdout.write(`🔊 [${i+1}/${ALL_WORDS.length}] Generating: ${word} ... `);

      const audioStream = await client.textToSpeech.convert(VOICE_ID, {
        text: word,
        modelId: MODEL_ID,
        outputFormat: 'mp3_44100_128',
      });

      // Collect stream chunks
      const chunks = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      await writeFile(outPath, buffer);

      console.log(`✅ ${(buffer.length / 1024).toFixed(1)}KB`);
      success++;

      // Rate limit delay
      if (i < ALL_WORDS.length - 1) {
        await new Promise(r => setTimeout(r, DELAY_MS));
      }

    } catch (err) {
      console.log(`❌ தோல்வி: ${err.message}`);
      fail++;

      // Rate limit hit — wait longer
      if (err.message?.includes('429') || err.message?.includes('rate')) {
        console.log('   ⏳ Rate limit — 5 வினாடி காத்திருக்கிறோம்...');
        await new Promise(r => setTimeout(r, 5000));
      }
    }
  }

  console.log('');
  console.log('═══════════════════════════════');
  console.log(`✅ வெற்றி:   ${success} files`);
  console.log(`⏭️  Skip:    ${skip} files`);
  console.log(`❌ தோல்வி:  ${fail} files`);
  console.log('═══════════════════════════════');

  if (success > 0) {
    console.log('');
    console.log('📦 அடுத்து செய்ய:');
    console.log('   git add -A');
    console.log('   git commit -m "Add Tamil audio files"');
    console.log('   git push');
    console.log('');
    console.log('🌐 30 வினாடியில் Live!');
  }

  if (fail > 0) {
    console.log('');
    console.log('⚠️  தோல்வியான files மீண்டும் try செய்ய:');
    console.log('   node generate_audio.mjs YOUR_API_KEY');
    console.log('   (already generated files skip ஆகும்)');
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
