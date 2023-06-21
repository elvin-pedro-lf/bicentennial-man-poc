export const NewClientContent = {
  totalNumberOfPages: 5,
  1: [
    {
      id: "clientAge",
      prompt: "Your Age:",
      skip: true,
      required: true,
      response: {
        component: "number",
        min: 18,
        max: 100,
      },
    },
    {
      id: "clientSexAtBirth",
      prompt: "Your Sex At Birth",
      skip: true,
      required: true,
      response: {
        component: "buttonGroup",
        type: "radio",
        choices: ["Male", "Female"],
      },
    },
    {
      id: "programLengthInWeeks",
      prompt: "How Many Weeks Of Block Of Training Do You Want To Receive?",
      skip: true,
      required: true,
      response: {
        component: "number",
        min: 1,
        max: 8,
        defaultValue: 8,
      },
    },
  ],
  2: [
    {
      id: "primaryFitnessGoal",
      prompt: "What Is Your Primary Fitness Goal?",
      required: true,
      response: {
        component: "buttonGroup",
        type: "radio",
        choices: [
          "Athletic Performance",
          "Build Muscle",
          "Health",
          "Wellness",
          "Weight Loss",
        ],
      },
      ChatGPTAPIPrompt: (selection, pronounHeShe) =>
        `${pronounHeShe === "She" ? "Her" : "His"} overall fitness goal is ${
          selection === "Build Muscle" || selection === "Weight Loss"
            ? "to "
            : "to improve "
        } ${
          selection === "Weight Loss" ? "lose weight" : selection.toLowerCase()
        }. `,
    },
    {
      id: "currentFitnessLevel",
      prompt: "What Is Your Current Fitness Level?",
      required: true,
      response: {
        component: "buttonGroup",
        type: "radio",
        choices: ["Beginner", "Intermediate", "Advanced"],
      },
      ChatGPTAPIPrompt: (selection, pronounHeShe) =>
        `${
          pronounHeShe === "She" ? "Her" : "His"
        } current fitness level is ${selection}, `,
    },
    {
      id: "experienceWorkingWithAPersonalTrainer",
      prompt: "Do You Have Any Experience Working With A Personal Trainer?",
      required: true,
      response: {
        component: "buttonGroup",
        type: "radio",
        choices: ["Yes", "No"],
      },
      ChatGPTAPIPrompt: (selection) =>
        `and has ${
          selection === "No" ? "NO" : ""
        } experience working with a personal trainer. `,
    },
  ],
  3: [
    {
      id: "daysPerWeek",
      prompt: "How Many Days Per Week Would You Like To Workout?",
      required: true,
      response: {
        component: "buttonGroup",
        type: "radio",
        choices: ["1 to 2 Times", "3 to 4 Times", "4+ Times"],
      },
      ChatGPTAPIPrompt: (selection, pronounHeShe) =>
        `${pronounHeShe} wants to workout ${selection.toLowerCase()} per week `,
    },
    {
      id: "timePerSession",
      prompt: "How Much Time Per Session Is Comfortable For You?",
      required: true,
      response: {
        component: "buttonGroup",
        type: "radio",
        choices: ["30 Minutes", "45 Minutes", "60+ Minutes"],
      },
      ChatGPTAPIPrompt: (selection) =>
        ` with every workout lasting upto ${selection.toLowerCase()} ONLY. `,
    },
    {
      id: "physicalLimitationsInjuriesMedicalConditions",
      prompt:
        "Do you have any physical limitations, injuries, or medical conditions that I should be aware of?",
      required: true,
      response: {
        component: "textArea",
      },
      ChatGPTAPIPrompt: (selection, pronounHeShe) => {
        if (
          ["none", "nothing", "not applicable", "n/a"].includes(
            selection.trim().toLowerCase()
          )
        ) {
          return "";
        } else {
          return `${
            pronounHeShe === "She" ? "Her" : "His"
          } physical limitations, injuries and medical conditions include ${selection}. `;
        }
      },
    },
  ],
  4: [
    {
      id: "typesOfExerciseLike",
      prompt: "What Types Of Exercise Or Physical Activities Do You Enjoy?",
      required: true,
      response: {
        component: "buttonGroup",
        type: "checkbox",
        choices: [
          "Strength Training",
          "Cardio",
          "HIIT",
          "Barre",
          "Yoga",
          "Swimming",
        ],
      },
      ChatGPTAPIPrompt: (selection, pronounHeShe) =>
        `Types of exercise or physical activities ${pronounHeShe.toLowerCase()} enjoys are ${
          selection !== "HIIT" ? selection.toLowerCase() : selection
        }. `,
    },
    {
      id: "typesOfExerciseDislike",
      prompt: "What Types Of Exercise Or Physical Activities Do You Dislike?",
      required: false,
      response: {
        component: "buttonGroup",
        type: "checkbox",
        choices: [
          "Strength Training",
          "Cardio",
          "HIIT",
          "Barre",
          "Yoga",
          "Swimming",
        ],
      },
      ChatGPTAPIPrompt: (selection, pronounHeShe) =>
        `Types of exercise or physical activities ${pronounHeShe.toLowerCase()} DOES NOT LIKE VERY MUCH are ${
          selection !== "HIIT" ? selection.toLowerCase() : selection
        }. `,
    },
    {
      id: "motivationAccountability",
      prompt: "What Motivates You And Keeps You Accountable?",
      required: true,
      response: {
        component: "buttonGroup",
        type: "radio",
        choices: [
          "Setting Goals",
          "Improving Performance",
          "Competition",
          "Looking Good",
        ],
      },
      ChatGPTAPIPrompt: (selection, pronounHeShe) =>
        `${selection.toUpperCase()} is what motivates ${
          pronounHeShe === "She" ? "her" : "him"
        } and keeps ${pronounHeShe === "She" ? "her" : "him"} accountable. `,
    },
  ],
  5: [
    {
      id: "typeOfEquipment",
      prompt: "What Type Of Equipment Do You Have?",
      required: false,
      response: {
        component: "multipleButtonGroup",
        groups: [
          {
            name: "Cardio",
            type: "checkbox",
            choices: [
              "Body Weight",
              "Treadmill",
              "Bike",
              "Elliptical",
              "Stair Climber",
              "Rower",
            ],
            ChatGPTAPIPrompt: (selection, pronounHeShe) =>
              `For cardio, ${pronounHeShe.toLowerCase()} has these equipments: ${selection.toLowerCase()}. `,
          },
          {
            name: "Strength Training",
            type: "checkbox",
            choices: [
              "Cables/Pulleys",
              "Barbell",
              "Dumbbells",
              "Kettlebells",
              "Nautilus",
              "Plate Loaded",
            ],
            ChatGPTAPIPrompt: (selection, pronounHeShe) =>
              `For strength training, ${pronounHeShe.toLowerCase()} uses these equipments and machines: ${selection.toLowerCase()}. `,
          },
          {
            name: "Areas",
            type: "checkbox",
            choices: [
              "Astro Turf",
              "Pool",
              "Basketball Court",
              "Tennis Court",
              "Pickleball Court",
            ],
            ChatGPTAPIPrompt: (selection, pronounHeShe) =>
              `${pronounHeShe} has access to ${selection.toLowerCase()}. `,
          },
          {
            name: "Studios",
            type: "checkbox",
            choices: ["Indoor Cycling", "Yoga", "Dance"],
            ChatGPTAPIPrompt: (selection, pronounHeShe) =>
              `${pronounHeShe} goes to the gym or a studio for ${selection.toLowerCase()}. `,
          },
        ],
      },
      end: true,
    },
  ],
  ChatGPTAPIPromptStart:
    "Pretend you are a health and fitness trainer with 30 years of experience. ",
  ChatGPTAPIPromptProfile: (client) =>
    `You received the following information from a new client who is a ${client.age} year old ${client.gender}: `,
  ChatGPTAPIPromptClosing: (length) =>
    `Your task is to generate a very detailed and elaborate ${length}-week block of training with specific days of the week assigned to each workout, provide as much detailed information as possible in each workout, list out the exercises, repetition, and sets for every week of the program block. Also include speed and inclination for cardio exercises, and equipments for strength training. `,
  ChatGPTAPIPromptRequestStartingDate: (__day__) =>
    `Set the first workout date to next ${__day__} from ${new Date()}. `,
  ChatGPTAPIPromptRequestFormat:
    'DO NOT INCLUDE rest days. Format content in JSON data using week, day, and workout as keys, and each day must include a "Completed" property set to false initially.\nDesired JSON format:###{Week 1: {Monday: {Workout:"", Date: <MMM DD YYYY>, Completed: false}}}###\nReturn the JSON data only. ',
  ChatGPTAPIAdjustmentRequestFormat:
    "Format content in natural language ONLY in bullet points using HTML. ",
  ChatGPTAPIPromptNoCommentary: "DO NOT ADD ANY COMMENTARY.",
  ChatGPTAPIAdjustYourPlanDisplayPrompt:
    "<center>Finalize my adjusted plan...</center>",
  ChatGPTAPIAdjustYourPlanPrompt:
    "Apply these adjustments to the previously generated block of training. Return in exactly the same JSON format ONLY.",
  ClientPronoun: (g) => {
    return g === "Male" ? "He" : "She";
  },
};
