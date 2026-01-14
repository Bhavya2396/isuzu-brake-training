import { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    scenario: 'After completing the brake pad installation, you start the vehicle and press the brake pedal. It feels soft and goes almost to the floor.',
    question: 'What should you do next?',
    options: [
      'Re-check pad seating',
      'Inspect caliper installation',
      'Bleed the brakes',
      'All of the above'
    ],
    correctIndex: 3,
    explanation: 'A soft pedal after brake work can indicate several issues. You should check pad seating, verify caliper installation, and consider bleeding the brakes if air entered the system. Always start by pumping the pedal to seat the pads.'
  },
  {
    id: 2,
    scenario: 'While inspecting the old brake pads, you notice that the inner pad is worn significantly more than the outer pad.',
    question: 'What does this uneven wear pattern typically indicate?',
    options: [
      'Normal brake pad wear',
      'High-quality brake pads wearing correctly',
      'Stuck caliper pins or piston issues',
      'The pads were installed incorrectly'
    ],
    correctIndex: 2,
    explanation: 'Uneven brake pad wear usually indicates a mechanical issue. When the inner pad wears faster, it often means the caliper piston isn\'t retracting properly or the slide pins are stuck, preventing even pressure distribution.'
  },
  {
    id: 3,
    scenario: 'During caliper removal, a colleague suggests letting the caliper hang by the brake hose to keep it out of the way.',
    question: 'Why is this a dangerous practice?',
    options: [
      'It looks unprofessional',
      'It can damage the brake hose internally',
      'The caliper might get dirty',
      'It makes reinstallation harder'
    ],
    correctIndex: 1,
    explanation: 'The weight of the caliper can damage the internal structure of the brake hose, potentially causing brake failure. The hose may look fine externally but have internal damage that restricts fluid flow or causes leaks under pressure.'
  },
  {
    id: 4,
    scenario: 'You\'ve just reinstalled the wheel after a brake pad replacement. Before driving, a customer is eager to leave quickly.',
    question: 'What critical step must be performed before moving the vehicle?',
    options: [
      'Check tire pressure',
      'Adjust the mirrors',
      'Pump the brake pedal several times',
      'Turn on the headlights'
    ],
    correctIndex: 2,
    explanation: 'The caliper piston was pushed back during installation to make room for new, thicker pads. Pumping the pedal moves the piston back out to contact the new pads. Without this step, the first brake application will have NO braking until the piston extends!'
  },
  {
    id: 5,
    scenario: 'After installing new brake pads, the customer reports a squealing noise during the first few days of driving.',
    question: 'What is the most likely cause and appropriate response?',
    options: [
      'Defective brake pads - replace immediately',
      'Normal break-in period - advise customer it should diminish',
      'Wrong pad type installed - start over',
      'Rotor damage - resurface required'
    ],
    correctIndex: 1,
    explanation: 'New brake pads often require a break-in (bedding) period where they may produce some noise. This is normal and should diminish within 100-200 miles of normal driving. Advise the customer but follow up if noise persists.'
  }
];

export const getQuizQuestion = (id: number): QuizQuestion | undefined => {
  return quizQuestions.find(q => q.id === id);
};

export const getTotalQuestions = (): number => {
  return quizQuestions.length;
};

export const calculateScore = (answers: { questionId: number; selectedIndex: number }[]): number => {
  let correct = 0;
  answers.forEach(answer => {
    const question = getQuizQuestion(answer.questionId);
    if (question && question.correctIndex === answer.selectedIndex) {
      correct++;
    }
  });
  return Math.round((correct / quizQuestions.length) * 100);
};
