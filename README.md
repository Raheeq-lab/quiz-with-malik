
# Math with Malik

## Overview
Math with Malik is an interactive web application designed for schoolchildren in grades 3-10 to take math quizzes and participate in Olympiad contests. The platform features a teacher-focused management system that allows educators to create custom quizzes and monitor student performance.

## Features

### For Teachers
- **Account Creation**: Teachers can sign up and log in to access the dashboard
- **Quiz Management**: Create custom multiple-choice quizzes with one correct answer out of four options
- **Grade Level Assignment**: Assign quizzes to specific grade levels (3-10)
- **Access Control**: Generate unique quiz codes for student access
- **Performance Tracking**: View student results and analyze performance data
- **AI Question Generator**: Generate math questions automatically based on grade level and topic

### For Students
- **No Sign-up Required**: Students can access quizzes by simply entering the provided code
- **Interactive Quiz Experience**: 
  - One question displayed at a time
  - Live countdown timer
  - Automatic grading upon submission
  - Final score display
- **Leaderboard**: View top student scores sorted by score and completion time

## Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Local storage (currently)
- **Responsive Design**: Mobile and desktop friendly interface

## Getting Started

### Prerequisites
- Node.js and npm installed

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/math-with-malik.git
cd math-with-malik
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Teacher Flow
1. Sign up as a teacher
2. Create a quiz by selecting grade level and adding questions
3. Share the generated access code with students

### Student Flow
1. Enter the quiz code provided by the teacher
2. Complete the quiz by answering all questions within the time limit
3. View your score and position on the leaderboard

## Future Enhancements
- Firebase integration for authentication and data storage
- Enhanced analytics for teacher dashboard
- Additional question types beyond multiple choice
- Custom timer settings per question
- Ability to save and resume quizzes

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
