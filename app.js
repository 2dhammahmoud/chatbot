// ============================================
// Mental Health Chatbot - Complete System
// ============================================


const BASE_URL = "https://adhamelmalhy-chatbot.hf.space";
const GEMINI_ROUTE = `${BASE_URL}/ask_gemini`;
const PREDICT_ROUTE = `${BASE_URL}/predict_health`;
// const API_URL = 'https://adhamelmalhy-chatbot.hf.space/predict_health';
async function askGemini(message) {
    // ✅ تم التعديل للرابط الجديد الخاص بـ Adhamelmalhy
    const API_URL = "https://adhamelmalhy-chatbot.hf.space";
    
    showTypingIndicator(); 

    try {
        const response = await fetch(GEMINI_ROUTE, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            body: JSON.stringify({ message: message }),
        });

        // التأكد من أن الرد ليس صفحة HTML (بسبب الـ 404)
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Oops, we haven't got JSON!");
        }

        const result = await response.json();
        removeTypingIndicator();

        if (response.ok) {
            // إضافة رد جيميناي للشات
            addBotMessage(result.reply || "أنا سامعك، كمل حكيك.."); 
        } else {
            console.error('Server Error:', result);
            addBotMessage("معلش، السيرفر فيه مشكلة بسيطة.. قولي حاسس بإيه؟");
        }
    } catch (error) {
        removeTypingIndicator();
        console.error('Fetch Error:', error);
        // رسالة احتواء في حالة فشل الاتصال تماماً
        addBotMessage("أنا معاك وسامعك.. حابب تحكي في إيه؟");
    }
}

// ============================================
// 📊 البيانات المدمجة (Embedded Data)
// ============================================

const RESPONSES_DATA = {
    "greetings": {
        "صباح": ["صباح الخير! ☀️ إزيك النهارده؟", "صباح النور! 🌅 يارب يومك يكون جميل"],
        "مساء": ["مساء الخير! 🌙 عامل إيه؟", "مساء النور! ⭐ يومك كان عامل إزاي؟"],
        "عام": ["أهلاً وسهلاً! 👋 إزيك؟", "هلا! 😊 نورت", "أهلاً بيك! 🙌 كيف حالك؟"]
    },
    "greetings_keywords": {
        "صباح": ["صباح", "الصبح", "morning"],
        "مساء": ["مساء", "المساء", "evening"],
        "عام": ["هاي", "هلا", "السلام", "سلام", "مرحبا", "اهلا", "hello", "hi"]
    },
    "mood_keywords": {
        "ممتاز": ["ممتاز", "رائع", "جميل", "سعيد", "مبسوط", "فرحان", "great", "excellent"],
        "كويس": ["كويس", "تمام", "الحمد لله", "ماشي", "good", "fine", "ok", "بخير"],
        "تعبان": ["تعبان", "مرهق", "زهقان", "ملل", "tired", "bored"],
        "وحش": ["وحش", "سيء", "زفت", "مكتئب", "حزين", "زعلان", "bad", "sad"],
        "مبضون": ["مبضون", "مخنوق", "متضايق"]
    },
    "farewells": [
        "مع السلامة! 👋 إن شاء الله نتكلم تاني",
        "باي باي! 😊 خلي بالك من نفسك",
        "سلامو عليكو! 🌟 يارب يومك يكون حلو"
    ],
    "farewell_keywords": ["باي", "bye", "وداعا", "سلام", "مع السلامة", "تصبح على خير", "خروج"],
    "unclear_responses": ["معلش مش فاهم قصدك 🤔 ممكن توضح أكتر؟", "آسف، مش واصلني 😅 تقدر تعيد تاني؟"],
    "interview_intro": {
        "speech": "حاسس بيك. بص أنا هحلل مستوى تعبك وحزنك قد ايه وعلى اساسا ده هديك علاج حلو؟ محتاج أسألك كام سؤال بسيط عشان أفهمك أكتر. موافق؟",
        "confirmation_keywords": ["موافق", "تمام", "ماشي", "اوك", "yes", "ok", "اتفضل", "اسأل"]
    },
    "interview_end": "شكرًا جدًا لوقتك ولصراحتك. أنا كده فهمت الصورة أحسن بكتير. دلوقتي خلينا نشوف إيه الحلول اللي ممكن نبتدي بيها...",
    "interview_questions": [
        {
            "field": "Gender", "question": "Gender?",
            "answer_replies": {
                "Male": { "keywords": ["ذكر", "ولد", "رجل", "male"], "bot_reply": ["تمام. السؤال اللي بعده..."] },
                "Female": { "keywords": ["أنثى", "بنت", "ست", "female"], "bot_reply": ["تمام. السؤال اللي بعده..."] }
            }
        },
        {
            "field": "Country", "question": "وإنت مقيم في أنهي بلد حاليًا؟",
            "answer_replies": { "Other": { "keywords": [], "bot_reply": ["تمام، سجلت ده. خلينا نكمل..."] } }
        },
        {
            "field": "Occupation", "question": " (طالب / موظف / عمل حر / ربة منزل / بدون عمل)إيه طبيعة شغلك أو دراستك الحالية؟",
            "answer_replies": {
                "Student": { "keywords": ["طالب", "بدرس", "جامعة", "مدرسة", "student"], "bot_reply": ["أهه... ضغوطات المذاكرة والتراكمات دي فعلاً صعبة، ربنا يقويك."] },
                "Corporate": { "keywords": ["موظف", "شغال", "بشتغل", "corporate", "employee"], "bot_reply": ["ضغط الشغل ومواعيده فعلاً بياخد من الروح، حاسس بيك."] },
                "Business": { "keywords": ["عمل حر", "بزنس", "فريلانسر", "business"], "bot_reply": ["مسؤولية إنك تكون مدير نفسك دي لوحدها ضغط كبير، ربنا معاك."] },
                "Housewife": { "keywords": ["ربة منزل", "في البيت", "housewife"], "bot_reply": ["دي أكتر شغلانة مرهقة ومفيهاش أجازات، ربنا يقويكي."] },
                "Other": { "keywords": ["عاطل", "لا أعمل", "other"], "bot_reply": ["فاهمك جدًا، سواء بتدور على شغل أو واخد فترة راحة، الضغط موجود."] }
            }
        },
        {
            "field": "Growing_Stress", "question": "هل بتحس إن ضغوطك اليومية بتزيد مؤخرًا؟ (نعم / لا / يمكن)",
            "answer_replies": {
                "Yes": { "keywords": ["نعم", "اه", "جدا", "اكيد", "yes"], "bot_reply": ["ده إحساس مرهق جدًا. خلينا نشوف إيه سببه..."] },
                "No": { "keywords": ["لا", "خالص", "مش اوي", "no"], "bot_reply": ["دي حاجة كويسة جدًا ومطمنة!"] },
                "Maybe": { "keywords": ["يمكن", "مش عارف","ممكن", "maybe"], "bot_reply": ["مفهوم... أحيانًا بيكون صعب نحدد بالظبط."] }
            }
        },
        {
            "field": "Changes_Habits", "question": " هل لاحظت أي تغيير مفاجئ في عاداتك اليومية زي الأكل أو النوم؟ (نعم / لا / يمكن)",
            "answer_replies": {
                "Yes": { "keywords": ["نعم", "اه", "yes"], "bot_reply": ["آه، دي من أكتر العلامات اللي بتلخبط الواحد."] },
                "No": { "keywords": ["لا", "no", "عادي"], "bot_reply": ["كويس إن روتينك مستقر."] },
                "Maybe": { "keywords": ["يمكن", "مش اوي","ممكن","ممكن", "maybe"], "bot_reply": ["التغييرات البسيطة أحيانًا بتعدي من غير ما نلاحظها، مفهوم."] }
            }
        },
        {
            "field": "Days_Indoors", "question": " بتقضي وقت قد إيه غالبًا جوه البيت؟ (مثال: بخرج كل يوم / أغلب الوقت في البيت / نادرا جدا بخرج)",
            "answer_replies": {
                "EveryDay": { "keywords": ["بخرج كل يوم", "يومياً", "every day"], "bot_reply": ["ممتاز، الخروج وتغيير الجو مهم جدًا."] },
                "Moderate": { "keywords": ["أغلب الوقت","اغلب الوقت", "كام يوم", "moderate"], "bot_reply": ["ده معقول، بس ممكن نزوده شوية."] },
                "Isolated": { "keywords": ["نادرًا", "قاعد", "مبخرجش","نادرا", "isolated"], "bot_reply": ["العزلة دي ممكن تكون مرهقة جدًا."] }
            }
        },
        {
            "field": "Mood_Swings", "question": " حدة تقلبات مزاجك إيه؟ ( مثال : عالية / متوسطة / منخفضة )",
            "answer_replies": {
                "High": { "keywords": ["عالي", "جدا", "اوي", "high","عاليه", "سريع"], "bot_reply": ["دي حاجة مرهقة جدًا، كأنك في قطار ملاهي."] },
                "Medium": { "keywords": ["متوسط", "أحيانا", "متوسطه","medium"], "bot_reply": ["ده الطبيعي بتاعنا كلنا تقريبًا."] },
                "Low": { "keywords": ["منخفض", "قليل", "نادرا", "low"], "bot_reply": ["كويس جدًا إن مزاجك مستقر غالبًا."] }
            }
        },
        {
            "field": "Coping_Struggles", "question": " هل بتحس بصعوبة في التعامل أو مواجهة المشاكل دي لوحدك؟ (نعم / لا / يمكن)",
            "answer_replies": {
                "Yes": { "keywords": ["نعم", "اه", "صعب", "yes"], "bot_reply": ["ده مش معناه إنك ضعيف، ده معناه إن الحمل تقيل."] },
                "No": { "keywords": ["لا", "بقدر", "no"], "bot_reply": ["دي قوة كبيرة جدًا عندك ما شاء الله."] }
            }
        },
        {
            "field": "Work_Interest", "question": " هل لسه عندك شغف تجاه شغلك أو دراستك؟ (نعم / لا / يمكن)",
            "answer_replies": {
                "Yes": { "keywords": ["نعم", "لسه", "yes","اه"], "bot_reply": ["حلو جدًا إنك محافظ على الشغف ده."] },
                "No": { "keywords": ["لا", "فقدت", "no"], "bot_reply": ["إحساس فقدان الشغف ده صعب جدًا."] },
                "Maybe": { "keywords": ["يمكن", "مش أوي", "maybe","ممكن"], "bot_reply": ["طبيعي الشغف يقل ويزيد."] }
            }
        },
        {
            "field": "Social_Weakness", "question": "هل بقيت بتميل إنك تكون لوحدك أكتر؟ (نعم / لا / يمكن) ",
            "answer_replies": {
                "Yes": { "keywords": ["نعم", "اه", "yes", "لوحدي"], "bot_reply": ["أحيانًا بنحتاج نهرب من الدوشة، بس العزلة الزيادة ممكن تتعبنا."] },
                "No": { "keywords": ["لا", "عادي", "no"], "bot_reply": ["كويس إنك لسه محافظ على تواصلك الاجتماعي."] },
                "Maybe": { "keywords": ["يمكن", "أحيانًا", "maybe","ممكن"], "bot_reply": ["كلنا بنحتاج وقتنا الخاص، ده طبيعي."] }
            }
        },
        {
            "field": "Mental_Health_History", "question": " هل كان عندك تاريخ سابق مع تحديات نفسية؟ (نعم / لا / يمكن)",
            "answer_replies": {
                "Yes": { "keywords": ["نعم", "قبل كده", "yes","اه"], "bot_reply": ["ده بيدل إنك قوي وقدرت تعدي قبل كده."] },
                "No": { "keywords": ["لا", "أول مرة", "no"], "bot_reply": ["متقلقش، كونها أول مرة ممكن تكون مخيفة."] },
                "Maybe": { "keywords": ["مش متأكد", "يمكن", "maybe","ممكن"], "bot_reply": ["مفهوم، أحيانًا الأمور مبتكونش واضحة."] }
            }
        },
        {
            "field": "family_history", "question": " هل فيه أي حد في عيلتك المقربة عنده تاريخ مرضي نفسي معروف؟ (نعم / لا / يمكن)",
            "answer_replies": {
                "Yes": { "keywords": ["نعم", "اه", "yes"], "bot_reply": ["شكرًا على المعلومة دي، دي بتساعدنا نفهم الصورة كاملة."] },
                "No": { "keywords": ["لا", "no", "مفيش"], "bot_reply": ["تمام، شكرًا على التوضيح."] }
            }
        },
        {
            "field": "care_options", "question": " هل إنت عارف إيه خيارات الرعاية المتاحة ليك لو احتجت؟ (نعم / لا / يمكن)",
            "answer_replies": {
                "Yes": { "keywords": ["نعم", "اه", "yes", "عارف"], "bot_reply": ["ده ممتاز. ده وعي مهم جدًا."] },
                "No": { "keywords": ["لا", "no", "مش عارف"], "bot_reply": ["تمام، متقلقش، إحنا ممكن نتكلم عن ده في الحلول."] },
                "Maybe": { "keywords": ["يمكن", "مش متأكد", "maybe","ممكن"], "bot_reply": ["ده طبيعي، أغلبنا ميعرفش كل الخيارات."] }
            }
        },
        {
            "field": "mental_health_interview", "question": " أخيرًا، هل عندك استعداد تتكلم مع متخصص نفسي لو احتاج ده؟ (نعم / لا / يمكن)",
            "answer_replies": {
                "Yes": { "keywords": ["نعم", "اه", "yes"], "bot_reply": ["عظيم، ده قرار شجاع. دي خطوة إيجابية جدًا."] },
                "No": { "keywords": ["لا", "no", "صعب"], "bot_reply": ["متفهم جدًا. الفكرة ممكن تكون صعبة في الأول."] },
                "Maybe": { "keywords": ["يمكن", "مش متأكد", "maybe" ,"ممكن"], "bot_reply": ["تمام، خد وقتك في التفكير."] }
            }
        }
    ]
};

const SOLUTIONS_DATA = {
    "Growing_Stress": {
        "problem_name": "الضغط الزايد",
        "descriptions": [
            "الضغط هو رد فعل طبيعي جدًا من جسمك وعقلك لأي تحدي أو تغيير. هو ببساطة حالة من القلق أو التوتر العقلي بتحصل بسبب موقف صعب.",
            "فيه الضغط الحاد (Acute) اللي هو قصير المدى، والضغط المزمن (Chronic) اللي بيستمر لأسابيع أو شهور وده اللي بيستهلك جسمك ونفسيتك."
        ],
        "symptoms": [
            "أعراض الضغط ممكن تكون جسدية زي الصداع المستمر، آلام في العضلات والضهر، الإرهاق ومشاكل النوم والأرق.",
            "من الناحية النفسية بيسبب قلق مستمر، سرعة انفعال، حزن مفاجئ، أو نوبات هلع، وقدرتك على التركيز واتخاذ القرارات بتقل جدًا."
        ],
        "solutions": [
            "اتعلم تقول (لأ) للمسؤوليات الزيادة اللي فوق طاقتك، وحاول تبعد عن المواضيع أو الأشخاص اللي بيستفزوك بشكل مستمر.",
            "عبر عن مشاعرك بوضوح بدل ما تكتمها، واتعلم تكون حازم وتدافع عن احتياجاتك بهدوء واحترام.",
            "الحركة والرياضة بتطلع إندورفينز (هرمونات السعادة). مش لازم جيم، مجرد مشي 30 دقيقة يوميًا بيفرق جدًا.",
            "نومك هو سلاحك الأول. حاول تنام 7 ساعات أو أكتر وتثبت مواعيد نومك. الأكل الصحي بيفرق، قلل السكريات والكافيين.",
            "خصص وقت لنفسك كل يوم، حتى لو ربع ساعة. جرب أنشطة استرخاء زي التأمل، اليوجا، أو تمارين التنفس العميق."
        ],
        "video_intro": "دي شوية فيديوهات مقترحة ممكن تساعدك تاخد خطوات عملية:",
        "videos": ["https://youtu.be/8s3waZw1as0", "https://youtu.be/2Di8_QlO9vM"],
        "podcast_intro": "ودي حلقات بودكاست بتناقش الموضوع بعمق أكتر:",
        "podcasts": ["https://youtu.be/xJccNV1VFHM", "https://youtu.be/MLdXuNaDVdY"]
    },
    "Work_Interest": {
        "problem_name": "فقدان الشغف",
        "descriptions": [
            "اهتماماتك المهنية أو (الشغف) هي ببساطة الحاجات اللي إنت بتميل ليها وبتحب تعملها.",
            "فقدان الشغف غالبًا (عدم توافق). معناه إن بيئة شغلك الحالية أو مهامك اليومية مبقتش شبه اهتماماتك الحقيقية."
        ],
        "symptoms": [
            "أوضح عرض هو فقدان الدافع. بتحس إنك بتروح الشغل كـ روبوت من غير أي حماس. بتحس بملل مستمر.",
            "المهام اللي كانت عادية بقت تحس إنها تقيلة ومحتاجة مجهود ذهني جبار عشان تبدأ فيها (وده بيؤدي للتسويف)."
        ],
        "solutions": [
            "فيه نظرية مشهورة اسمها (RIASEC) بتقول إن الاهتمامات 6 أنواع. الحل إنك تلاقي التوافق بين نوعك وبين شغلك.",
            "ابدأ اعمل قايمة بكل الهوايات والأنشطة اللي بتستمتع بيها. واعمل قايمة تانية بالمهارات اللي إنت شاطر فيها.",
            "راجع كل شغلانة اشتغلتها قبل كده. اكتب بالظبط: إيه اللي حبيته فيها؟ وإيه اللي كرهته فيها؟ الإجابات دي هي كنز.",
            "بص على كل القوايم اللي عملتها وحاول تلاقي نمط متكرر. النمط ده غالبًا هيشاور على نوعك."
        ],
        "video_intro": "دي فيديوهات مقترحة عن إزاي تلاقي شغفك وتتغلب على الاحتراق الوظيفي:",
        "videos": ["https://youtu.be/J9MbTYJQ-ic", "https://youtu.be/J7QqWn4Y3oc"],
        "podcast_intro": "وده بودكاست بيناقش الموضوع ده بعمق أكتر:",
        "podcasts": ["https://youtu.be/jiCezbNBNQE"]
    },
    "Social_Weakness": {
        "problem_name": "العزلة الاجتماعية",
        "descriptions": [
            "العزلة المضرة هي حالة من الانقطاع شبه الكامل عن التواصل مع المجتمع. أهم خصائصها البقاء في البيت لفترات طويلة جدًا.",
            "الشخص ممكن يكون معزول اجتماعيًا بس مش حاسس إنه وحيد. وممكن العكس، يكون حواليه ناس كتير بس حاسس إنه وحيد."
        ],
        "symptoms": [
            "خطورة العزلة الاجتماعية على صحتك ممكن تكون زي خطورة تدخين السجاير بالظبط.",
            "العزلة المستمرة ممكن تسبب إحساس دايم بالوحدة، أو حتى خوف من الناس، ونظرة سلبية جدًا للذات.",
            "العزلة مرتبطة بمشاكل صحية واضحة، زي ارتفاع ضغط الدم، وضعف جهاز المناعة، ومشاكل في النوم."
        ],
        "solutions": [
            "أول خطوة عملية لكسر العزلة هي العمل التطوعي أو الانضمام لنشاط مجتمعي أو رياضي.",
            "الشغل (سواء مدفوع الأجر أو تطوعي) بيعتبر من أهم الدروع الواقية ضد الإحساس بالوحدة.",
            "الحيوانات الأليفة زي القطط أو الكلاب بتقلل جدًا الإحساس بالعزلة والوحدة، وبتدي إحساس بالهدف.",
            "متضغطش على نفسك إنك لازم تكون اجتماعي أوي. المهم هو جودة العلاقات مش عددها."
        ],
        "video_intro": "دي فيديوهات مقترحة عن إزاي نواجه الوحدة ونبني علاقات صحية:",
        "videos": ["https://youtu.be/aKrXC_QdfMA", "https://youtu.be/h7Gf2KggcG4"],
        "podcast_intro": "وده بودكاست بيناقش الموضوع ده بعمق أكتر:",
        "podcasts": ["https://youtu.be/G9GFDhUzYJ4"]
    },
    "Days_Indoors": {
        "problem_name": "قلة الخروج / حبسة البيت",
        "descriptions": [
            "فيه ظاهرة جديدة اسمها جيل الأماكن المغلقة، ودي بتوصف الناس اللي بتقضي أكتر من 90% من وقتها جوه الأماكن المقفولة.",
            "المشكلة إن حبسة البيت دي ممكن تتحول لـ منطقة راحة مزيفة. التكنولوجيا الحديثة بتخلينا متواصلين بشكل وهمي."
        ],
        "symptoms": [
            "أول حاجة بتحس بيها هي الضغط النفسي. بتحس بملل مستمر أو خنقة. ده ممكن يتطور لعلامات قلق واكتئاب موسمي.",
            "حبسة البيت بتبوظ الساعة البيولوجية. ضوء الشمس بينظم هرمونات السيروتونين والميلاتونين.",
            "عدم الخروج بيسبب نقص حاد في فيتامين د، وده بيؤدي لفقدان كثافة العظم وممكن يزود خطر هشاشة العظام."
        ],
        "solutions": [
            "الحل الأهم والأبسط هو اخرج! خلي هدفك إنك تخرج مرتين كل يوم. حتى لو هتتمشى 10 دقايق أول ما تصحى.",
            "مش لازم تكون خروجة كبيرة. ممكن تقعد في كافيه بره، أو تاخد كورس رياضة في مكان مفتوح زي اليوجا.",
            "لو الخروج صعب، هات الطبيعة عندك. النباتات المنزلية بتنقي الهوا وبتحسن المزاج جدًا.",
            "افتح الستاير والشبابيك ودخل ضوء الشمس الطبيعي بيتك. ده بيحسن المزاج وبيساعد على النوم بالليل."
        ],
        "video_intro": "ده فيديو بسيط بيوضحلك إزاي قلة الخروج بتأثر علينا:",
        "videos": ["https://youtu.be/R3aRB-alkOE"]
    },
    "Changes_Habits": {
        "problem_name": "تغير العادات (الأكل، النوم، التسويف)",
        "descriptions": [
            "العادات هي ببساطة سلوكيات إنت كررتها كتير لدرجة إنها بقت أوتوماتيكية ومحفورة في مساراتك العصبية.",
            "المشكلة بتبدأ لما العادات دي تتغير للأسوأ، وده غالبًا بيحصل وقت الضغط النفسي."
        ],
        "symptoms": [
            "أشهر عرض هو الأكل العاطفي. بتلاقي نفسك بتاكل مش عشان جعان، لكن عشان متضايق، أو زهقان، أو قلقان.",
            "عرض تاني هو لخبطة النوم. التفكير الزايد والقلق بيخلوك مش عارف تنام (أرق)، أو العكس، بتهرب من مشاكلك بالنوم الكتير.",
            "بتلاقي نفسك بتسوف المهام المهمة وتهرب في حاجات بتدي مكافأة سريعة وسهلة، زي إنك تقضي ساعات على الموبايل."
        ],
        "solutions": [
            "لازم تحدد المُنبه. راقب نفسك واسأل: إيه اللي بيشغل العادة دي؟ هل هو التوتر؟ الملل؟",
            "متغلطش غلطة إنك تحاول تغير كل حاجة مرة واحدة. الحل: اختار عادة واحدة بس تكون هي Keystone Habit.",
            "ابدأ بحاجة سهلة جدًا لدرجة متقدرش تقول لأ. لو عايز تتمرن، ابدأ بـ 5 دقايق بس.",
            "الاستبدال أنجح من التوقيف. حافظ على المُنبه والمكافأة، لكن غير الروتين اللي في النص.",
            "هيئ بيئة تساعدك على العادة الجديدة. لو عايز تذاكر، ابعد الموبايل. لو عايز تتمرن الصبح، حضر لبس التمرين من بالليل."
        ],
        "video_intro": "الموضوع ده العادات مهم جدًا، شوف السلسلة دي لأنها من أمتع الفيديوهات اللي فعلاً هتغير حياتك:",
        "videos": ["https://youtu.be/9gr7UUUk5Q0"],
        "podcast_intro": "وده بودكاست بيناقش الموضوع ده بعمق أكتر:",
        "podcasts": ["https://youtu.be/JvNjrrZr9zI"]
    },
    "Mood_Swings": {
        "problem_name": "تقلبات المزاج",
        "descriptions": [
            "تقلبات المزاج هي ببساطة تغييرات مفاجئة في إحساسك (مودك). أحيانًا إنت بتبقى عارف إيه السبب، وأحيانًا تانية بتبقى مش عارف.",
            "الأبحاث بتقول إن كيميا المخ (Neurotransmitters) هي اللي بتحدد إحساسك. أي حاجة بتحصل في حياتك بتأثر على الكيميا دي."
        ],
        "symptoms": [
            "تقلبات المزاج ممكن تكون عرض لمشكلة صحية تانية زي لخبطة الغدة الدرقية أو لخبطة سكر الدم.",
            "قلة النوم أو النوم المتقطع من أهم الأسباب. لما مبتنمش كفاية، مخك بيفقد قدرته على معالجة المشاعر بشكل سليم.",
            "أحيانًا التقلبات دي بتكون جزء من حالة نفسية أكبر، زي القلق، الاكتئاب، أو اضطراب ما بعد الصدمة."
        ],
        "solutions": [
            "الحل دايمًا بيبدأ من الجسم. الرياضة المنتظمة بتطلع كيماويات بتحسن المزاج (زي الإندورفين) وبتساعد على النوم.",
            "الخروج في الطبيعة بيقلل التوتر وبيحسن المزاج جدًا. لو إنت في الشتا ومفيش شمس، العلاج بالضوء ممكن يزود السيروتونين.",
            "لما تحس إن المود هيقلب وإنك هتنفجر، الحل الفوري هو التنفس العميق. التنفس بيدي لمخك وقفة إيجبارية.",
            "العلاج النفسي زي CBT أو DBT مش مجرد فضفضة، هو بيعلمك مهارات عملية زي إزاي تنظم مشاعرك."
        ],
        "video_intro": "ده فيديو مقترح فيه نصايح عملية وتمارين تساعدك تتحكم في تقلبات المزاج:",
        "videos": ["https://youtu.be/LwWZ-S2Hy-o", "https://youtu.be/Ms0gQfxX_8A"],
        "podcast_intro": "وده بودكاست بيناقش الموضوع ده بعمق أكتر:",
        "podcasts": ["https://youtu.be/U9UCYEBQCvU"]
    },
    "Coping_Struggles": {
        "problem_name": "صعوبات المواجهة",
        "descriptions": [
            "مهارات التأقلم (Coping) هي ببساطة الطريقة اللي بنتأقلم بيها مع الأحداث أو الواقع السلبي.",
            "صعوبة المواجهة بتحصل لما بنتعرض لتغييرات كتير جدًا في وقت قليل، وده بيخلق عندنا إحساس إننا فقدنا السيطرة."
        ],
        "symptoms": [
            "أشهر علامة على الحلول السلبية هي الهروب، زي النوم الكتير أو الأكل العاطفي عشان تسكت مشاعرك.",
            "اللجوء للكحوليات أو المخدرات عشان تخدّر الألم، دي حلول ممكن تريحك لحظيًا لكنها بتزود المشاكل على المدى الطويل."
        ],
        "solutions": [
            "ابدأ بـ التقبل. اقبل حقيقة إننا عايشين في عالم مش مثالي وإن فيه حاجات كتير خارج سيطرتك.",
            "حاول تعيد صياغة المشكلة. بدل ما تبص للموقف الصعب كـ كارثة، بص له كـ فرصة للتعلم أو تحدي.",
            "لو المشكلة ينفع تتحل، قسمها. اعمل خطة عمل بخطوات صغيرة. مجرد كتابة الخطوات دي هيديك إحساس بالسيطرة.",
            "اعترف بإحساسك. سمي مشاعرك من غير ما تحكم عليها. مجرد الاعتراف بالإحساس بيقلل من قوته.",
            "اتحرك! الرياضة أو المشي أو الرقص بيفرغ الطاقة السلبية وبيطلع إندورفينز.",
            "أهم استراتيجية على الإطلاق هي العلاقات الداعمة. اطلب المساعدة ومتتكفش. اتصل بصديق أو فضفض لحد بتثق فيه."
        ],
        "video_intro": "ده فيديو مقترح فيه نصايح سريعة وعملية للمواجهة:",
        "videos": ["https://youtu.be/9XjueebiqMY", "https://youtu.be/yDFWoz2nTmo"],
        "podcast_intro": "وده بودكاست بيناقش الموضوع ده بعمق أكتر:",
        "podcasts": ["https://youtu.be/3iXkcpzjIlk"]
    },
    "final_summary": {
        "messages": [
            "أنا عارف إن الموضوع صعب يا صديقي، بس خلي عندك أمل دايمًا. 🫂",
            "وافتكر دايمًا إنك لما تكون جنب ربنا وتلتزم بصلاتك، ده أهم من أي حاجة في الدنيا.",
            "**وافتكر قول الله تعالى: ﴿ لَقَدْ خَلَقْنَا الْإِنسَانَ فِي كَبَدٍ ﴾**",
            "أنا معاك دايْمًا. لو عاوز تبدأ تاني، بس قولي إيه شعورك. 🤖"
        ]
    }
};

let chatState = {
    mode: 'greeting',
    currentQuestionIndex: 0,
    collectedData: {},
    // Solutions state
    solutionsState: {
        problems: [],           // List of detected problems
        currentProblemIndex: -1, // Current problem
        currentSolutionIndex: 0, // Current solution
        currentResourceIndex: 0  // Current video/podcast
    }
};

let currentIntroStep = 0;
let isDarkMode = false;
let currentSection = 'chat';


// ============================================
// Helper Functions
// ============================================

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function scrollToBottom() {
    const container = document.getElementById('messages-container');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

function parseMarkdown(text) {
    if (typeof text !== 'string') return '';

    // Convert bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert URLs to beautiful buttons
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
    text = text.replace(urlRegex, function (url) {
        const href = url.startsWith('www.') ? 'https://' + url : url;

        // Determine button text based on link type
        let buttonText = '🔗 افتح الرابط';
        let buttonColor = 'bg-blue-600 hover:bg-blue-700';

        if (url.includes('youtu')) {
            buttonText = '🎥 شاهد الفيديو';
            buttonColor = 'bg-red-600 hover:bg-red-700';
        } else if (url.includes('podcast')) {
            buttonText = '🎧 استمع للبودكاست';
            buttonColor = 'bg-purple-600 hover:bg-purple-700';
        }

        return `<a href="${href}" target="_blank" rel="noopener noreferrer" 
                   class="inline-block ${buttonColor} text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 my-2">
                   ${buttonText}
                </a>`;
    });

    // Convert line breaks
    text = text.replace(/\n/g, '<br>');

    return text;
}

// Translate answers to standardized keys
function getStoredKey(userMessage, questionConfig) {
    const userTextLower = userMessage.toLowerCase();
    const repliesConfig = questionConfig.answer_replies || {};

    for (const [stdKey, data] of Object.entries(repliesConfig)) {
        if (stdKey !== "Other") {
            for (const keyword of data.keywords || []) {
                if (userTextLower.includes(keyword.toLowerCase())) {
                    return { reply: data.bot_reply[0], storedKey: stdKey };
                }
            }
        }
    }

    if (repliesConfig.Other) {
        const reply = repliesConfig.Other.bot_reply[0];
        if (questionConfig.field === "Country") {
            return { reply: reply, storedKey: userMessage };
        }
        return { reply: reply, storedKey: 'Other' };
    }

    return { reply: RESPONSES_DATA.unclear_responses[0], storedKey: userMessage };
}

// ============================================
// Chat Interface Functions
// ============================================

function addUserMessage(message) {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex justify-end message-pop';
    messageDiv.innerHTML = `
        <div class="user-message bg-blue-600 text-white rounded-2xl p-6 max-w-md shadow-xl">
            <p class="leading-relaxed text-lg">${message}</p>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}
function addBotMessage(message) {
    const container = document.getElementById('messages-container');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'flex items-start space-x-4 my-4';

    // ✅ السطر السحري: لو الرسالة فيها كود زرار (<a>) اعرضها زي ما هي
    const content = message.includes('<a') ? message : parseMarkdown(message);

    div.innerHTML = `
        <img src="image/download-removebg-preview.png" class="w-10 h-10 rounded-full shadow-lg">
        <div class="bot-message rounded-2xl p-6 shadow-xl bg-white text-gray-800">
            ${content}
        </div>
    `;
    container.appendChild(div);
    scrollToBottom();
}

async function askGemini(message) {
    // ✅ تأكد إن الرابط ده هو الجديد اللي جربناه واشتغل (Adhamelmalhy)
    const GEMINI_ROUTE = 'https://adhamelmalhy-chatbot.hf.space/ask_gemini';
    
    showTypingIndicator(); 

    try {
        const response = await fetch(GEMINI_ROUTE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message }),
        });

        const result = await response.json();
        
        // بنخفي علامة التحميل بمجرد وصول الرد
        removeTypingIndicator();

        if (response.ok && result.reply) {
            addBotMessage(result.reply); 
        } else {
            addBotMessage("معلش، حصلت مشكلة بسيطة في الاتصال بذكائي الاصطناعي.. قولي حاسس بإيه؟");
        }
    } catch (error) {
        removeTypingIndicator();
        console.error('Gemini Error:', error);
        // رسالة احتواء ذكية لو السيرفر وقع
        addBotMessage("أنا معاك وسامعك.. كمل حكيك.");
    }
}



function showTypingIndicator() {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;
    removeTypingIndicator();

    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex items-start space-x-4';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <img src="image/download-removebg-preview.png" alt="MoodMate Avatar"
            class="w-12 h-12 rounded-full flex-shrink-0 shadow-lg object-cover">
        <div class="bot-message rounded-2xl p-6 shadow-xl">
            <div class="flex space-x-2">
                <div class="w-3 h-3 bg-gray-400 rounded-full typing-dots"></div>
                <div class="w-3 h-3 bg-gray-400 rounded-full typing-dots"></div>
                <div class="w-3 h-3 bg-gray-400 rounded-full typing-dots"></div>
            </div>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.remove();
}

// ============================================
// API Communication and Problem Display
// ============================================
async function sendDataToAPI(collectedData) {
    showTypingIndicator();
    await delay(1500);

    try {
        const payload = {
            Gender: collectedData.Gender || 'Male',
            Country: collectedData.Country || 'Other',
            Occupation: collectedData.Occupation || 'Other',
            Growing_Stress: collectedData.Growing_Stress || 'No',
            Changes_Habits: collectedData.Changes_Habits || 'No',
            Days_Indoors: collectedData.Days_Indoors || 'Moderate',
            Mood_Swings: collectedData.Mood_Swings || 'Medium',
            Coping_Struggles: collectedData.Coping_Struggles || 'No',
            Work_Interest: collectedData.Work_Interest || 'Yes',
            Social_Weakness: collectedData.Social_Weakness || 'No',
            Mental_Health_History: collectedData.Mental_Health_History || 'No',
            family_history: collectedData.family_history || 'No',
            care_options: collectedData.care_options || 'No',
            mental_health_interview: collectedData.mental_health_interview || 'No'
        };

        console.log('📤 Sending data to API:', payload);

        // تأكد أن PREDICT_ROUTE معرفة في أعلى الملف كـ:
        // const PREDICT_ROUTE = "https://adhamelmalhy-chatbot.hf.space/predict_health";
        const response = await fetch(PREDICT_ROUTE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        removeTypingIndicator();

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('📥 Received result from API:', result);

        if (result.status === 'success') {
            // ✅ التعديل هنا: حماية ضد الـ undefined والـ toFixed
            const stability = (result.stability_percentage !== undefined && result.stability_percentage !== null) 
                             ? Number(result.stability_percentage) 
                             : 0;

            // Display stability percentage
            let predictionMessage = `بناءً على تحليل إجاباتك، نسبة **الصحة النفسية المناسبة** لديك: **${stability.toFixed(2)}%**\n\n`;
            predictionMessage += result.final_advice || "شكراً لمشاركتك بياناتك معنا.";

            addBotMessage(predictionMessage);
            await delay(2000);

            // Save problems and show menu
            if (result.solutions_report && result.solutions_report.problems && result.solutions_report.problems.length > 0) {
                chatState.solutionsState.problems = result.solutions_report.problems;
                await showProblemsMenu();
            } else {
                addBotMessage("✅ لم نجد أي تحديات رئيسية تحتاج لحلول فورية!");
                await delay(1500);
                await showFarewellMessages();
            }

        } else {
            addBotMessage(`❌ خطأ: ${result.detail || 'حدث خطأ غير متوقع في البيانات'}`);
        }

    } catch (error) {
        removeTypingIndicator();
        console.error('❌ Network Error:', error);
        // التعديل هنا: رسالة أوضح للمستخدم
        addBotMessage(`❌ فشل الاتصال بالخادم. تأكد أن الـ Space الخاص بك في حالة Running على Hugging Face.`);
    }
}

// ============================================
// Problem and Solution Display Functions
// ============================================

async function showProblemsMenu() {
    const problems = chatState.solutionsState.problems;

    let menuMessage = "**المشاكل التي تم اكتشافها:**\n\n";
    problems.forEach((problem, index) => {
        menuMessage += `**${index + 1}.** ${problem.name}\n`;
    });
    menuMessage += "\n**اختر رقم المشكلة اللي عايز تعرف حلولها:**";

    addBotMessage(menuMessage);
    chatState.mode = 'selecting_problem';
}
async function showProblemSolutions(problemIndex) {
    // 1. استخراج بيانات المشكلة من حالة المحادثة
    const problem = chatState.solutionsState.problems[problemIndex];

    console.log('🔍 Displaying problem solutions:', problem);

    // 2. عرض اسم المشكلة والوصف
    await delay(500);
    addBotMessage(`**${problem.name}**\n\n${problem.description}`);

    await delay(1500);
    addBotMessage("**الحلول المقترحة:**");

    // 3. عرض الحل الأول والثاني (هذه الأجزاء سليمة)
    if (problem.selected_solutions && problem.selected_solutions[0]) {
        await delay(1000);
        addBotMessage(problem.selected_solutions[0]);
    }

    if (problem.selected_solutions && problem.selected_solutions[1]) {
        await delay(1500);
        addBotMessage(problem.selected_solutions[1]);
    }

    // 🚨 4. عرض الفيديو (الاعتماد على الرابط المباشر المرسل من الـ API)
    if (problem.video_link) {
        await delay(1500);
        // نرسل رسالة توضيحية ونعتمد على parseMarkdown لعرض الرابط كزر
        addBotMessage("**🎥 فيديو مفيد:**");

        await delay(1000);
        addBotMessage(problem.video_link);
    }

    // 🚨 5. عرض البودكاست (الاعتماد على البيانات المرسلة من الـ API)
    // نعتمد على أن الـ API أرسل رابط البودكاست إذا كان موجوداً
    if (problem.podcast_link) { 
        await delay(1500);
        addBotMessage("**🎧 بودكاست مفيد:**");

        await delay(1000);
        addBotMessage(problem.podcast_link);
    }

    // 6. سؤال المتابعة
    await delay(1500);
    addBotMessage("**عايز تشوف حلول لمشكلة تانية؟** (اكتب: نعم / لا)");
    chatState.mode = 'after_problem_solutions';

    console.log('✅ All solutions displayed successfully');
}

async function showNextSolution() {
    // This function is no longer used
}

async function showResources() {
    // This function is no longer used
}

async function showFarewellMessages() {
    console.log('🔍 Starting farewell message display...');

    // Farewell message is in solutions.json under final_summary
    if (SOLUTIONS_DATA && SOLUTIONS_DATA.final_summary && SOLUTIONS_DATA.final_summary.messages) {
        console.log('✅ Farewell message found:', SOLUTIONS_DATA.final_summary.messages);

        for (const msg of SOLUTIONS_DATA.final_summary.messages) {
            await delay(1500);
            addBotMessage(msg);
        }

        console.log('✅ All farewell messages displayed');
    } else {
        console.error('❌ final_summary not found in solutions.json!');
        console.log('SOLUTIONS_DATA:', SOLUTIONS_DATA);

        // Error message for user
        addBotMessage("⚠️ حدث خطأ في تحميل رسالة النهاية. تأكد من وجود ملف solutions.json");
    }

    chatState.mode = 'finished';
}

// ============================================
// Main Initialization
// ============================================

document.addEventListener('DOMContentLoaded', async function () {



    // Select elements
    const authSection = document.getElementById('auth-section');
    const signupForm = document.getElementById('signup-form');
    const signinForm = document.getElementById('signin-form');
    const otpModal = document.getElementById('otp-modal');
    const introSection = document.getElementById('intro-section');
    const mainInterface = document.getElementById('main-interface');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const messageInput = document.getElementById('message-input');
    const messageForm = document.getElementById('message-form');

    // UI helper functions
    function showSection(sectionId) {
        document.querySelectorAll('#app > div').forEach(section => {
            section.classList.add('hidden');
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) targetSection.classList.remove('hidden');
    }

    function showMainSection(sectionId) {
        document.querySelectorAll('[id$="-section"]:not(#auth-section):not(#intro-section)').forEach(section => {
            section.classList.add('hidden');
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) targetSection.classList.remove('hidden');
        currentSection = sectionId.replace('-section', '');
    }

    function showError(errorId, formId) {
        const errorDiv = document.getElementById(errorId);
        const form = document.getElementById(formId);
        if (errorDiv) errorDiv.classList.remove('hidden');
        if (form) form.classList.add('shake');
        setTimeout(() => {
            if (form) form.classList.remove('shake');
            if (errorDiv) errorDiv.classList.add('hidden');
        }, 3000);
    }

    // Authentication handlers
    const showSigninBtn = document.getElementById('show-signin');
    if (showSigninBtn) {
        showSigninBtn.addEventListener('click', () => {
            if (signupForm) signupForm.classList.add('hidden');
            if (signinForm) signinForm.classList.remove('hidden');
            const signinEmail = document.getElementById('signin-email');
            if (signinEmail) signinEmail.focus();
        });
    }

    const showSignupBtn = document.getElementById('show-signup');
    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', () => {
            if (signinForm) signinForm.classList.add('hidden');
            if (signupForm) signupForm.classList.remove('hidden');
            const signupEmail = document.getElementById('signup-email');
            if (signupEmail) signupEmail.focus();
        });
    }

    const signupSubmit = document.getElementById('signup-submit');
    if (signupSubmit) {
        signupSubmit.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('signup-email')?.value;
            const password = document.getElementById('signup-password')?.value;

            if (!email || !password || password.length < 6) {
                showError('signup-error', 'signup-submit');
                return;
            }
            if (otpModal) otpModal.classList.remove('hidden');
            const otpInput = document.querySelector('.otp-input');
            if (otpInput) otpInput.focus();
        });
    }

    const signinSubmit = document.getElementById('signin-submit');
    if (signinSubmit) {
        signinSubmit.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('signin-email')?.value;
            const password = document.getElementById('signin-password')?.value;

            if (!email || !password) {
                showError('signin-error', 'signin-submit');
                return;
            }
            showSection('intro-section');
        });
    }

    const googleSignup = document.getElementById('google-signup');
    if (googleSignup) {
        googleSignup.addEventListener('click', () => {
            showSection('intro-section');
        });
    }

    // OTP verification
    const verifyOtp = document.getElementById('verify-otp');
    if (verifyOtp) {
        verifyOtp.addEventListener('click', function () {
            const otpInputs = document.querySelectorAll('.otp-input');
            const otpValue = Array.from(otpInputs).map(input => input.value).join('');

            if (otpValue.length === 6) {
                if (otpModal) otpModal.classList.add('hidden');
                showSection('intro-section');
            } else {
                alert("Please enter all 6 digits.");
            }
        });
    }

    // Intro section
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('next-intro')) {
            currentIntroStep++;
            const currentStep = document.querySelector(`[data-step="${currentIntroStep - 1}"]`);
            const nextStep = document.querySelector(`[data-step="${currentIntroStep}"]`);
            if (currentStep) currentStep.classList.add('hidden');
            if (nextStep) nextStep.classList.remove('hidden');
        }
    });

    const startChat = document.getElementById('start-chat');
    if (startChat) {
        startChat.addEventListener('click', function () {
            showSection('main-interface');
            showMainSection('chat-section');
            if (messageInput) messageInput.focus();
        });
    }

    // Sidebar
    function toggleSidebar() {
        if (sidebar) sidebar.classList.toggle('-translate-x-full');
        if (sidebarOverlay) sidebarOverlay.classList.toggle('hidden');
    }

    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);

    const closeSidebar = document.getElementById('close-sidebar');
    if (closeSidebar) closeSidebar.addEventListener('click', toggleSidebar);

    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

    // Navigation
    const navButtons = {
        'nav-chat': 'chat-section',
        'nav-profile': 'profile-section',
        'nav-settings': 'settings-section',
        'nav-support': 'support-section'
    };

    Object.entries(navButtons).forEach(([btnId, sectionId]) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', function () {
                Object.values(navButtons).forEach(id => {
                    const section = document.getElementById(id);
                    if (section) section.classList.add('hidden');
                });
                const targetSection = document.getElementById(sectionId);
                if (targetSection) targetSection.classList.remove('hidden');
                toggleSidebar();
            });
        }
    });

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('Are you sure you want to logout?')) {
                chatState = { mode: 'greeting', currentQuestionIndex: 0, collectedData: {} };
                location.reload();
            }
        });
    }

    // ============================================
    // Main Chat Logic
    // ============================================

    if (messageForm) {
        messageForm.addEventListener('submit', async function (e) {
            e.preventDefault();


            const userMessage = messageInput.value.trim();
            if (!userMessage) return;

            addUserMessage(userMessage);
            messageInput.value = '';

            // Check for farewell
            if (RESPONSES_DATA.farewell_keywords.some(k => userMessage.toLowerCase().includes(k))) {
                await delay(500);
                const farewell = RESPONSES_DATA.farewells[Math.floor(Math.random() * RESPONSES_DATA.farewells.length)];
                addBotMessage(farewell);
                return;
            }

            // State: selecting problem
            if (chatState.mode === 'selecting_problem') {
                const problemNumber = parseInt(userMessage);
                const problems = chatState.solutionsState.problems;

                if (problemNumber >= 1 && problemNumber <= problems.length) {
                    await showProblemSolutions(problemNumber - 1);
                } else {
                    addBotMessage("❌ رقم غير صحيح. اختر رقم من القائمة.");
                }
                return;
            }

            // State: after showing problem solutions
            if (chatState.mode === 'after_problem_solutions') {
                const wantsToContinue = ['نعم', 'آه', 'yes', 'أكيد', 'اه', 'يلا', 'اه'].some(k =>
                    userMessage.toLowerCase().includes(k)
                );

                if (wantsToContinue) {
                    // Return to problems menu
                    await showProblemsMenu();
                } else {
                    // Show farewell message
                    await showFarewellMessages();
                }
                return;
            }

            // State: in interview
            if (chatState.mode === 'in_interview') {
                const currentQuestion = RESPONSES_DATA.interview_questions[chatState.currentQuestionIndex];

                const { reply, storedKey } = getStoredKey(userMessage, currentQuestion);
                chatState.collectedData[currentQuestion.field] = storedKey;

                await delay(500);
                addBotMessage(reply);

                chatState.currentQuestionIndex++;

                if (chatState.currentQuestionIndex < RESPONSES_DATA.interview_questions.length) {
                    const nextQuestion = RESPONSES_DATA.interview_questions[chatState.currentQuestionIndex];
                    await delay(1000);
                    addBotMessage(nextQuestion.question);
                } else {
                    await delay(1000);
                    addBotMessage(RESPONSES_DATA.interview_end);

                    await sendDataToAPI(chatState.collectedData);
                }
            }
            // State: awaiting confirmation
            else if (chatState.mode === 'awaiting_confirmation') {
                const isConfirmed = RESPONSES_DATA.interview_intro.confirmation_keywords.some(k =>
                    userMessage.toLowerCase().includes(k)
                );

                if (isConfirmed) {
                    chatState.mode = 'in_interview';
                    chatState.currentQuestionIndex = 0;
                    await delay(500);
                    addBotMessage(RESPONSES_DATA.interview_questions[0].question);
                } else {
                    chatState.mode = 'greeting';
                    await delay(500);
                    addBotMessage("تمام، براحتك. 😊 لو احتجت حاجة أنا هنا.");
                }
            }
else if (chatState.mode === 'greeting') {
                // 1. التحقق من السلام (Greetings)
                let isGreeting = false;
                for (const [type, keywords] of Object.entries(RESPONSES_DATA.greetings_keywords)) {
                    if (keywords.some(k => userMessage.toLowerCase().includes(k))) {
                        const greetings = RESPONSES_DATA.greetings[type];
                        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
                        await delay(500);
                        addBotMessage(greeting);
                        isGreeting = true;
                        break;
                    }
                }

                if (isGreeting) return;

                // 2. التحقق من المشاعر السلبية (باستخدام mood_keywords)
                // هنجمع كل الكلمات السلبية من الـ JSON بتاعك
                const negativeKeywords = [
                    ...RESPONSES_DATA.mood_keywords.تعبان,
                    ...RESPONSES_DATA.mood_keywords.وحش,
                    ...RESPONSES_DATA.mood_keywords.مبضون
                ];

                const isNegative = negativeKeywords.some(k => userMessage.toLowerCase().includes(k));
                
                if (isNegative) {
                    await delay(500);
                    // ✅ التعديل هنا: المسار الصحيح في الـ JSON بتاعك هو interview_intro.speech
                    addBotMessage(RESPONSES_DATA.interview_intro.speech);
                    chatState.mode = 'awaiting_confirmation';
                } 
                else {
                    // 3. لو مش سلام ومش حزن، اسأل Gemini
                    await askGemini(userMessage); 
                }
            }
            // State: finished
            else if (chatState.mode === 'finished') {
                await delay(500);
                addBotMessage("المقابلة انتهت بالفعل. لو عايز تبدأ من جديد، قول 'تعبان' أو 'مش كويس'.");
                chatState.mode = 'greeting';
                chatState.collectedData = {};
                chatState.currentQuestionIndex = 0;
                chatState.solutionsState = {
                    problems: [],
                    currentProblemIndex: -1,
                    currentSolutionIndex: 0,
                    currentResourceIndex: 0
                };
            }
        });
    }

    // Initialize app
    showSection('auth-section');
    const signupEmail = document.getElementById('signup-email');
    if (signupEmail) signupEmail.focus();
});
