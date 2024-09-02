const courseCodes = {
  "IMA 211": "Probability, Statistics and Random Processes",
  "ICS 211": "Design and Analysis of Algorithms",
  "ICS 212": "Operating Systems",
  "ICS 213": "Database Management Systems",
  "ICS 214": "IT Workshop III",
  "ISC 211": "Introduction to Bioinformatics",
  "ICS 215": "Data Structures II",
  "IPT 211": "Physical Training II",
  "ISC 212": "Quantum Computing and Security",
  "ISC 213": "Introduction to Cognitive Science",
  "IEC 211": "Control Systems",
  "IEC 212": "Analog Electronics",
  "IEC 213": "Microprocessors and Microcontrollers",
  "IEC 214": "Principles of Communication",
  "IEC 215": "Linear Integrated Circuits",
};

export default function getCourseName(courseCode: string) {
  if (courseCode in courseCodes) {
    return courseCodes[courseCode as keyof typeof courseCodes];
  } else {
    return "Unknown Course";
  }
}
