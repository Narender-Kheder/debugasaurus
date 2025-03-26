# Debugasaurus VS Code Extension

![Debugasaurus Logo](features/chat/views/images/debugasourus.png)

## Overview
Debugasaurus is a powerful and intuitive VS Code extension designed to supercharge your coding experience. With intelligent code generation, an interactive chat interface, and Git integration, Debugasaurus is your go-to tool for efficient and effective development.

## About the Project
Debugasaurus is a collaborative project developed as part of the Electrical and Computer Engineering Capstone program at the University of Toronto during the 2024-25 academic year. This extension reflects the innovative application of Large Language Models (LLMs) to empower developers with smarter tools for code assistance and version control management. Debugasaurus aims to make coding more accessible, efficient, and enjoyable for developers of all skill levels.

The project was designed and built by:
- **Narender Kheder**
- **Peixuan Li**
- **Abhishek Arora**

## Features

### 1. Code Generation
Debugasaurus simplifies and accelerates the coding process with smart code generation features:

#### 1.1 One-Line Code Completion
- **Shortcut:** `Command-Shift-A`  
- Quickly generate a single line of code directly in your editor, eliminating repetitive typing and potential errors.
- Place the cursor where you need the code, trigger the shortcut, and watch as Debugasaurus provides contextually accurate suggestions.
- Ideal for small tasks like creating variable declarations, function calls, or completing partial lines of code.

#### 1.2 Code Generation from Prompt
- **Shortcut:** `Command-Shift-A` (when placed on a comment containing a prompt).
- Transform your ideas written as comments into actionable code. 
- Simply write a comment describing your intent, such as "Create a function to calculate the factorial of a number," and Debugasaurus will generate the corresponding code snippet to match your request.
- **Flexible Language Support:** Debugasaurus supports a variety of programming languages, adapting to the syntax and conventions of each language to provide accurate and efficient code suggestions.
- **Context Awareness:** The extension understands the context of your project, ensuring that the generated code integrates seamlessly with the surrounding codebase.
- **Use Cases:**
  - Automatically create utility functions such as sorting algorithms, data parsers, or mathematical calculations.
  - Quickly scaffold boilerplate code for new components, classes, or modules.
  - Enhance productivity during prototyping by instantly generating implementation details from high-level ideas.
- Debugasaurus goes beyond simple text generation, providing intelligently crafted code that reduces debugging time and increases productivity.

---

### 2. Chat Interface (Chatasaurus)
The Chatasaurus feature provides two distinct capabilities to enhance your workflow:

#### 2.1 Code Clarification
- **Interactive Explanations:** Struggling to understand a complex piece of code? Chatasaurus can break it down into simple, digestible parts, explaining its functionality step by step.
- **Context-Aware Assistance:** The chat interface integrates seamlessly with your project, leveraging your codebase’s context to deliver precise and relevant guidance.
- **Code Suggestions and Improvements:** Ask Chatasaurus for alternative implementations, optimizations, or additional features, and it will generate the necessary code.

#### 2.2 Git Helper
- **Git Insights:** Navigate your Git repository with ease. Chatasaurus can answer questions about the current branch, pending changes, commit history, and more.
- **Command Generation:** Skip the hassle of memorizing complex Git commands. Describe your desired action, such as "stage all changes and commit with a message," and Chatasaurus will generate and execute the command for you.
- **Streamlined Git Workflows:** From resolving merge conflicts to creating branches, Chatasaurus simplifies Git operations, helping you focus on development instead of version control.

---

#### 3. Code Refactor Feature
- **Seamless Integration:**  
  Initiate code refactoring directly from the Debugasaurus side menu. This feature is designed to help you improve your code’s structure without altering its external behavior, making it easier to maintain and extend.
- **Interactive Suggestions:**  
  Upon selecting a portion of your code, Debugasaurus analyzes it and provides intelligent refactoring suggestions. These suggestions are presented in a new, adjacent code editor, giving you a side-by-side view of your original code and the proposed improvements.
- **User-Controlled Application:**  
  With the refactoring suggestions in place, you can choose to either apply the changes or dismiss them. The Refactor-asourus menu in the status bar offers clear options, ensuring that you maintain full control over how and when your code is modified.

---

### 4. Code Optimize Feature
- **Smart Optimization:**  
  This feature works similarly to the refactoring tool but focuses on enhancing your code’s performance and readability. By selecting a segment of code, you receive tailored optimization recommendations that can lead to more efficient execution.
- **Side-by-Side Preview:**  
  Optimization suggestions are displayed in a dedicated side window, allowing you to compare the original code with the optimized version. This clear layout helps you understand the changes and their impact on your code’s performance.
- **Effortless Decision-Making:**  
  The Optimize-asourus menu in the status bar provides simple, actionable choices—apply the optimization or reject it—so you can seamlessly integrate performance improvements without disrupting your workflow.

---

### 5. Code Comment Feature
- **Automated Comment Generation:**  
  Debugasaurus simplifies the task of documentation by automatically generating descriptive comments for your code. Whether you select a block of code or run the command on a single line, the tool crafts contextually appropriate comments to explain what the code does.
- **Context-Aware Insertion:**  
  The generated comment is inserted directly above the targeted code, ensuring that the explanation is both visible and relevant. This placement enhances the clarity of your code without interrupting its flow.
- **Easy Access via Side Panel:**  
  Trigger the Code Comment feature effortlessly from the Debugasaurus side panel, making it convenient to add meaningful commentary as you code.

---

### 6. Code Review Feature
- **Thorough Analysis:**  
  Receive an in-depth review of your code by running the Code Review feature from the Debugasaurus side menu. The tool examines your code for potential issues, stylistic inconsistencies, and areas for improvement, ensuring adherence to best practices.
- **Dedicated Review Display:**  
  When the review command is executed, a new display area opens on the side of your editor. Here, Debugasaurus presents its detailed analysis, highlighting potential problems and suggesting refinements in an organized and easy-to-read format.
- **Actionable Feedback:**  
  The review not only identifies issues but also offers concrete, actionable recommendations for enhancing your code. This comprehensive feedback enables you to systematically improve code quality and maintain consistency throughout your project.

---

Thank you for using Debugasaurus! We hope it becomes an indispensable part of your development workflow. Feedback and contributions are welcome to help us improve further!

