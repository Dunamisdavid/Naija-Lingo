import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/index.js";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const draftLessons = [
  // ---- Round out Family (Scene 3) ----
  { language: "yo", unitTitle: "Family", order: 3, sceneLabel: "Family · Scene 3", context: "Someone asks about your siblings.", phrase: "Mo ní arákùnrin mẹ́ta.", question: "What is he telling them?", options: ["I have three brothers", "I have three sisters", "I have no siblings", "I am the last child"], correctIndex: 0 },
  { language: "ig", unitTitle: "Family", order: 3, sceneLabel: "Family · Scene 3", context: "Someone asks about your siblings.", phrase: "Enwere m ụmụnne nwoke atọ.", question: "What is he telling them?", options: ["I have three brothers", "I have three sisters", "I have no siblings", "I am the last child"], correctIndex: 0 },
  { language: "ha", unitTitle: "Family", order: 3, sceneLabel: "Family · Scene 3", context: "Someone asks about your siblings.", phrase: "Ina da 'yan'uwa maza uku.", question: "What is he telling them?", options: ["I have three brothers", "I have three sisters", "I have no siblings", "I am the last child"], correctIndex: 0 },

  // ---- Round out Food (Scene 3) ----
  { language: "yo", unitTitle: "Food", order: 3, sceneLabel: "Food · Scene 3", context: "You're thirsty during the meal and ask —", phrase: "Ṣé mo lè ní omi?", question: "What is he asking for?", options: ["Can I have water?", "Can I have salt?", "Can I have a spoon?", "Can I have more?"], correctIndex: 0 },
  { language: "ig", unitTitle: "Food", order: 3, sceneLabel: "Food · Scene 3", context: "You're thirsty during the meal and ask —", phrase: "Enwere m ike ịnweta mmiri?", question: "What is he asking for?", options: ["Can I have water?", "Can I have salt?", "Can I have a spoon?", "Can I have more?"], correctIndex: 0 },
  { language: "ha", unitTitle: "Food", order: 3, sceneLabel: "Food · Scene 3", context: "You're thirsty during the meal and ask —", phrase: "Zan iya samun ruwa?", question: "What is he asking for?", options: ["Can I have water?", "Can I have salt?", "Can I have a spoon?", "Can I have more?"], correctIndex: 0 },

  // ---- Market ----
  { language: "yo", unitTitle: "Market", order: 1, sceneLabel: "Market · Scene 1", context: "You point at tomatoes on a stall and ask —", phrase: "Èló ni?", question: "What is she asking?", options: ["How much is it?", "Where are you going?", "What is your name?", "Is it fresh?"], correctIndex: 0 },
  { language: "yo", unitTitle: "Market", order: 2, sceneLabel: "Market · Scene 2", context: "The seller names a price. You respond —", phrase: "Ó wọ́n jù.", question: "What is he telling her?", options: ["It's too expensive", "It's very cheap", "I don't want it", "Give me two"], correctIndex: 0 },
  { language: "yo", unitTitle: "Market", order: 3, sceneLabel: "Market · Scene 3", context: "After some back and forth, you agree to the price.", phrase: "Mo máa rà á.", question: "What is she deciding?", options: ["I will buy it", "I don't want it", "Give me change", "It's broken"], correctIndex: 0 },

  { language: "ig", unitTitle: "Market", order: 1, sceneLabel: "Market · Scene 1", context: "You point at tomatoes on a stall and ask —", phrase: "Ego ole ka ọ bụ?", question: "What is she asking?", options: ["How much is it?", "Where are you going?", "What is your name?", "Is it fresh?"], correctIndex: 0 },
  { language: "ig", unitTitle: "Market", order: 2, sceneLabel: "Market · Scene 2", context: "The seller names a price. You respond —", phrase: "Ọ dị oke ọnụ.", question: "What is he telling her?", options: ["It's too expensive", "It's very cheap", "I don't want it", "Give me two"], correctIndex: 0 },
  { language: "ig", unitTitle: "Market", order: 3, sceneLabel: "Market · Scene 3", context: "After some back and forth, you agree to the price.", phrase: "Aga m azụta ya.", question: "What is she deciding?", options: ["I will buy it", "I don't want it", "Give me change", "It's broken"], correctIndex: 0 },

  { language: "ha", unitTitle: "Market", order: 1, sceneLabel: "Market · Scene 1", context: "You point at tomatoes on a stall and ask —", phrase: "Nawa ne?", question: "What is she asking?", options: ["How much is it?", "Where are you going?", "What is your name?", "Is it fresh?"], correctIndex: 0 },
  { language: "ha", unitTitle: "Market", order: 2, sceneLabel: "Market · Scene 2", context: "The seller names a price. You respond —", phrase: "Yana da tsada sosai.", question: "What is he telling her?", options: ["It's too expensive", "It's very cheap", "I don't want it", "Give me two"], correctIndex: 0 },
  { language: "ha", unitTitle: "Market", order: 3, sceneLabel: "Market · Scene 3", context: "After some back and forth, you agree to the price.", phrase: "Zan saya.", question: "What is she deciding?", options: ["I will buy it", "I don't want it", "Give me change", "It's broken"], correctIndex: 0 },

  // ---- Home ----
  { language: "yo", unitTitle: "Home", order: 1, sceneLabel: "Home · Scene 1", context: "You walk in after a long day and announce —", phrase: "Mo fẹ́ sinmi.", question: "What does he want to do?", options: ["I want to rest", "I want to cook", "I am leaving", "I am angry"], correctIndex: 0 },
  { language: "yo", unitTitle: "Home", order: 2, sceneLabel: "Home · Scene 2", context: "A guest asks where something in the house is.", phrase: "Ibo ni ilé ìdáná wà?", question: "What is she asking?", options: ["Where is the kitchen?", "Where is the bathroom?", "Where is the door?", "Where is my phone?"], correctIndex: 0 },
  { language: "yo", unitTitle: "Home", order: 3, sceneLabel: "Home · Scene 3", context: "A friend arrives at your door. You say —", phrase: "Káàbọ̀ sí ilé mi.", question: "What are you telling them?", options: ["Welcome to my home", "Goodbye", "Come back tomorrow", "Close the door"], correctIndex: 0 },

  { language: "ig", unitTitle: "Home", order: 1, sceneLabel: "Home · Scene 1", context: "You walk in after a long day and announce —", phrase: "Achọrọ m izu ike.", question: "What does he want to do?", options: ["I want to rest", "I want to cook", "I am leaving", "I am angry"], correctIndex: 0 },
  { language: "ig", unitTitle: "Home", order: 2, sceneLabel: "Home · Scene 2", context: "A guest asks where something in the house is.", phrase: "Ebee ka kichin dị?", question: "What is she asking?", options: ["Where is the kitchen?", "Where is the bathroom?", "Where is the door?", "Where is my phone?"], correctIndex: 0 },
  { language: "ig", unitTitle: "Home", order: 3, sceneLabel: "Home · Scene 3", context: "A friend arrives at your door. You say —", phrase: "Nnọọ n'ụlọ m.", question: "What are you telling them?", options: ["Welcome to my home", "Goodbye", "Come back tomorrow", "Close the door"], correctIndex: 0 },

  { language: "ha", unitTitle: "Home", order: 1, sceneLabel: "Home · Scene 1", context: "You walk in after a long day and announce —", phrase: "Ina son hutawa.", question: "What does he want to do?", options: ["I want to rest", "I want to cook", "I am leaving", "I am angry"], correctIndex: 0 },
  { language: "ha", unitTitle: "Home", order: 2, sceneLabel: "Home · Scene 2", context: "A guest asks where something in the house is.", phrase: "Ina kicin yake?", question: "What is she asking?", options: ["Where is the kitchen?", "Where is the bathroom?", "Where is the door?", "Where is my phone?"], correctIndex: 0 },
  { language: "ha", unitTitle: "Home", order: 3, sceneLabel: "Home · Scene 3", context: "A friend arrives at your door. You say —", phrase: "Barka da zuwa gidana.", question: "What are you telling them?", options: ["Welcome to my home", "Goodbye", "Come back tomorrow", "Close the door"], correctIndex: 0 },

  // ---- Work ----
  { language: "yo", unitTitle: "Work", order: 1, sceneLabel: "Work · Scene 1", context: "A new colleague asks what you do.", phrase: "Kín ni iṣẹ́ rẹ?", question: "What is she asking?", options: ["What is your job?", "Where do you work?", "When do you start?", "How much do you earn?"], correctIndex: 0 },
  { language: "yo", unitTitle: "Work", order: 2, sceneLabel: "Work · Scene 2", context: "You're heading out in the morning and say —", phrase: "Mo ń lọ sí iṣẹ́.", question: "What is he telling them?", options: ["I am going to work", "I am coming from work", "I am resting", "I am on leave"], correctIndex: 0 },
  { language: "yo", unitTitle: "Work", order: 3, sceneLabel: "Work · Scene 3", context: "At the end of a long day, you say —", phrase: "Àárẹ̀ mú mi.", question: "What is she telling them?", options: ["I am tired", "I am happy", "I am hungry", "I am late"], correctIndex: 0 },

  { language: "ig", unitTitle: "Work", order: 1, sceneLabel: "Work · Scene 1", context: "A new colleague asks what you do.", phrase: "Kedu ọrụ gị?", question: "What is she asking?", options: ["What is your job?", "Where do you work?", "When do you start?", "How much do you earn?"], correctIndex: 0 },
  { language: "ig", unitTitle: "Work", order: 2, sceneLabel: "Work · Scene 2", context: "You're heading out in the morning and say —", phrase: "Ana m aga ọrụ.", question: "What is he telling them?", options: ["I am going to work", "I am coming from work", "I am resting", "I am on leave"], correctIndex: 0 },
  { language: "ig", unitTitle: "Work", order: 3, sceneLabel: "Work · Scene 3", context: "At the end of a long day, you say —", phrase: "Ike gwụrụ m.", question: "What is she telling them?", options: ["I am tired", "I am happy", "I am hungry", "I am late"], correctIndex: 0 },

  { language: "ha", unitTitle: "Work", order: 1, sceneLabel: "Work · Scene 1", context: "A new colleague asks what you do.", phrase: "Mece ne aikinka?", question: "What is she asking?", options: ["What is your job?", "Where do you work?", "When do you start?", "How much do you earn?"], correctIndex: 0 },
  { language: "ha", unitTitle: "Work", order: 2, sceneLabel: "Work · Scene 2", context: "You're heading out in the morning and say —", phrase: "Ina zuwa aiki.", question: "What is he telling them?", options: ["I am going to work", "I am coming from work", "I am resting", "I am on leave"], correctIndex: 0 },
  { language: "ha", unitTitle: "Work", order: 3, sceneLabel: "Work · Scene 3", context: "At the end of a long day, you say —", phrase: "Na gaji.", question: "What is she telling them?", options: ["I am tired", "I am happy", "I am hungry", "I am late"], correctIndex: 0 },

  // ---- Travel ----
  { language: "yo", unitTitle: "Travel", order: 1, sceneLabel: "Travel · Scene 1", context: "You're lost and stop a stranger to ask —", phrase: "Ṣé o lè ràn mí lọ́wọ́?", question: "What is he asking?", options: ["Can you help me?", "Do you know me?", "Are you lost?", "What time is it?"], correctIndex: 0 },
  { language: "yo", unitTitle: "Travel", order: 2, sceneLabel: "Travel · Scene 2", context: "You tell a friend about your plans.", phrase: "Mo máa rìn ìrìn àjò lọ́la.", question: "What is she telling them?", options: ["I will travel tomorrow", "I traveled yesterday", "I am not going", "I am tired"], correctIndex: 0 },
  { language: "yo", unitTitle: "Travel", order: 3, sceneLabel: "Travel · Scene 3", context: "As you leave, your family says —", phrase: "Kí o rin ìrìn àjò dáadáa.", question: "What are they wishing you?", options: ["Safe travels", "Welcome back", "Good night", "See you soon"], correctIndex: 0 },

  { language: "ig", unitTitle: "Travel", order: 1, sceneLabel: "Travel · Scene 1", context: "You're lost and stop a stranger to ask —", phrase: "Ị nwere ike inyere m aka?", question: "What is he asking?", options: ["Can you help me?", "Do you know me?", "Are you lost?", "What time is it?"], correctIndex: 0 },
  { language: "ig", unitTitle: "Travel", order: 2, sceneLabel: "Travel · Scene 2", context: "You tell a friend about your plans.", phrase: "Aga m aga njem echi.", question: "What is she telling them?", options: ["I will travel tomorrow", "I traveled yesterday", "I am not going", "I am tired"], correctIndex: 0 },
  { language: "ig", unitTitle: "Travel", order: 3, sceneLabel: "Travel · Scene 3", context: "As you leave, your family says —", phrase: "Njem ọma.", question: "What are they wishing you?", options: ["Safe travels", "Welcome back", "Good night", "See you soon"], correctIndex: 0 },

  { language: "ha", unitTitle: "Travel", order: 1, sceneLabel: "Travel · Scene 1", context: "You're lost and stop a stranger to ask —", phrase: "Za ka iya taimaka mini?", question: "What is he asking?", options: ["Can you help me?", "Do you know me?", "Are you lost?", "What time is it?"], correctIndex: 0 },
  { language: "ha", unitTitle: "Travel", order: 2, sceneLabel: "Travel · Scene 2", context: "You tell a friend about your plans.", phrase: "Zan yi tafiya gobe.", question: "What is she telling them?", options: ["I will travel tomorrow", "I traveled yesterday", "I am not going", "I am tired"], correctIndex: 0 },
  { language: "ha", unitTitle: "Travel", order: 3, sceneLabel: "Travel · Scene 3", context: "As you leave, your family says —", phrase: "Tafiya lafiya.", question: "What are they wishing you?", options: ["Safe travels", "Welcome back", "Good night", "See you soon"], correctIndex: 0 },

  // ---- Relationships ----
  { language: "yo", unitTitle: "Relationships", order: 1, sceneLabel: "Relationships · Scene 1", context: "At a gathering, you introduce someone.", phrase: "Èyí ni ọkọ mi.", question: "Who is he introducing?", options: ["This is my husband", "This is my father", "This is my friend", "This is my brother"], correctIndex: 0 },
  { language: "yo", unitTitle: "Relationships", order: 2, sceneLabel: "Relationships · Scene 2", context: "A close friend calls to check in, and you say —", phrase: "Mo nífẹ̀ẹ́ rẹ.", question: "What is she telling them?", options: ["I love you", "I miss you", "I need you", "I trust you"], correctIndex: 0 },
  { language: "yo", unitTitle: "Relationships", order: 3, sceneLabel: "Relationships · Scene 3", context: "An elder relative asks about your family life.", phrase: "Ṣé o ti ṣègbéyàwó?", question: "What is she asking?", options: ["Are you married?", "Are you single?", "Do you have children?", "Are you happy?"], correctIndex: 0 },

  { language: "ig", unitTitle: "Relationships", order: 1, sceneLabel: "Relationships · Scene 1", context: "At a gathering, you introduce someone.", phrase: "Onye a bụ di m.", question: "Who is he introducing?", options: ["This is my husband", "This is my father", "This is my friend", "This is my brother"], correctIndex: 0 },
  { language: "ig", unitTitle: "Relationships", order: 2, sceneLabel: "Relationships · Scene 2", context: "A close friend calls to check in, and you say —", phrase: "Ahụrụ m gị n'anya.", question: "What is she telling them?", options: ["I love you", "I miss you", "I need you", "I trust you"], correctIndex: 0 },
  { language: "ig", unitTitle: "Relationships", order: 3, sceneLabel: "Relationships · Scene 3", context: "An elder relative asks about your family life.", phrase: "Ị lụọla di?", question: "What is she asking?", options: ["Are you married?", "Are you single?", "Do you have children?", "Are you happy?"], correctIndex: 0 },

  { language: "ha", unitTitle: "Relationships", order: 1, sceneLabel: "Relationships · Scene 1", context: "At a gathering, you introduce someone.", phrase: "Wannan mijina ne.", question: "Who is he introducing?", options: ["This is my husband", "This is my father", "This is my friend", "This is my brother"], correctIndex: 0 },
  { language: "ha", unitTitle: "Relationships", order: 2, sceneLabel: "Relationships · Scene 2", context: "A close friend calls to check in, and you say —", phrase: "Ina son ki.", question: "What is she telling them?", options: ["I love you", "I miss you", "I need you", "I trust you"], correctIndex: 0 },
  { language: "ha", unitTitle: "Relationships", order: 3, sceneLabel: "Relationships · Scene 3", context: "An elder relative asks about your family life.", phrase: "Kin yi aure?", question: "What is she asking?", options: ["Are you married?", "Are you single?", "Do you have children?", "Are you happy?"], correctIndex: 0 },

  // ---- Everyday Conversation ----
  { language: "yo", unitTitle: "Everyday Conversation", order: 1, sceneLabel: "Everyday Conversation · Scene 1", context: "A friend calls in the evening and asks —", phrase: "Báwo ni ọjọ́ rẹ ṣe rí?", question: "What is she asking?", options: ["How was your day?", "What did you eat?", "Where did you go?", "Who did you see?"], correctIndex: 0 },
  { language: "yo", unitTitle: "Everyday Conversation", order: 2, sceneLabel: "Everyday Conversation · Scene 2", context: "Someone shares their opinion, and you respond —", phrase: "Mo gbà.", question: "What is he telling them?", options: ["I agree", "I disagree", "I don't know", "I am busy"], correctIndex: 0 },
  { language: "yo", unitTitle: "Everyday Conversation", order: 3, sceneLabel: "Everyday Conversation · Scene 3", context: "As the conversation wraps up, she says —", phrase: "Ó dàbọ̀, a ó rí ra wa.", question: "What is she saying?", options: ["Goodbye, see you soon", "Good morning", "I am sorry", "Please wait"], correctIndex: 0 },

  { language: "ig", unitTitle: "Everyday Conversation", order: 1, sceneLabel: "Everyday Conversation · Scene 1", context: "A friend calls in the evening and asks —", phrase: "Kedu ka ụbọchị gị si dị?", question: "What is she asking?", options: ["How was your day?", "What did you eat?", "Where did you go?", "Who did you see?"], correctIndex: 0 },
  { language: "ig", unitTitle: "Everyday Conversation", order: 2, sceneLabel: "Everyday Conversation · Scene 2", context: "Someone shares their opinion, and you respond —", phrase: "Ekwenyere m.", question: "What is he telling them?", options: ["I agree", "I disagree", "I don't know", "I am busy"], correctIndex: 0 },
  { language: "ig", unitTitle: "Everyday Conversation", order: 3, sceneLabel: "Everyday Conversation · Scene 3", context: "As the conversation wraps up, she says —", phrase: "Ka ọ dị, ka anyị hụrịa.", question: "What is she saying?", options: ["Goodbye, see you soon", "Good morning", "I am sorry", "Please wait"], correctIndex: 0 },

  { language: "ha", unitTitle: "Everyday Conversation", order: 1, sceneLabel: "Everyday Conversation · Scene 1", context: "A friend calls in the evening and asks —", phrase: "Yaya ranarka ta kasance?", question: "What is she asking?", options: ["How was your day?", "What did you eat?", "Where did you go?", "Who did you see?"], correctIndex: 0 },
  { language: "ha", unitTitle: "Everyday Conversation", order: 2, sceneLabel: "Everyday Conversation · Scene 2", context: "Someone shares their opinion, and you respond —", phrase: "Na yarda.", question: "What is he telling them?", options: ["I agree", "I disagree", "I don't know", "I am busy"], correctIndex: 0 },
  { language: "ha", unitTitle: "Everyday Conversation", order: 3, sceneLabel: "Everyday Conversation · Scene 3", context: "As the conversation wraps up, she says —", phrase: "Sai an jima.", question: "What is she saying?", options: ["Goodbye, see you soon", "Good morning", "I am sorry", "Please wait"], correctIndex: 0 },
];

async function main() {
  let created = 0;
  let skippedNoUnit = 0;

  for (const item of draftLessons) {
    const unit = await prisma.unit.findFirst({
      where: { language: item.language, title: item.unitTitle },
    });

    if (!unit) {
      console.log(`No unit found for ${item.unitTitle} (${item.language}) — skipping "${item.sceneLabel}"`);
      skippedNoUnit++;
      continue;
    }

    await prisma.lesson.create({
      data: {
        language: item.language,
        sceneLabel: item.sceneLabel,
        context: item.context,
        phrase: item.phrase,
        question: item.question,
        options: item.options,
        correctIndex: item.correctIndex,
        order: item.order,
        unitId: unit.id,
        published: false, // draft — review in /admin before publishing
      },
    });
    created++;
  }

  console.log(`\nCreated ${created} draft lessons (unpublished).`);
  if (skippedNoUnit > 0) console.log(`Skipped ${skippedNoUnit} — no matching unit found.`);
  console.log("\n⚠️  Large batch — please review carefully before publishing, especially Relationships (culturally sensitive) and anywhere phrases involve gendered forms (Hausa 'you' varies by gender, e.g. Scene 2/3 in Relationships assumed a specific gender — verify and adjust as needed).");
}

main().finally(() => prisma.$disconnect());
