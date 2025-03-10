# Midscene.js - Puppeteer Integration

This repository is an implementation of [Midscene.js](https://github.com/web-infra-dev/midscene) integrated with **Puppeteer** and configured to work with **Azure OpenAI**.

---

## 📄 Original Repository

Please refer to the official repository for full documentation and examples:  
👉 [https://github.com/web-infra-dev/midscene](https://github.com/web-infra-dev/midscene)

---

## 🤖 What is Midscene.js?

Midscene.js lets AI be your browser operator.  
Just describe what you want to do in **natural language**, and it will help you:
- Operate web pages  
- Validate content  
- Extract data  

Whether you want a quick experience or deep development, you can get started easily!

---

## 🧰 Our Implementation with Puppeteer

We integrated **Midscene.js** with **Puppeteer**, a Node.js library that provides a high-level API to control Chrome or Firefox over the DevTools Protocol or WebDriver BiDi.  
By default, Puppeteer runs in **headless mode** (no visible UI), but you can configure it to run in **headful mode** if needed.

---

## 🚀 Quick Start

### Step 1. Install Dependencies
```bash
npm install @midscene/web puppeteer tsx --save-dev
```

### Step 2. Set Required API Keys
The used credentials are available at [credentials.txt](../credentials.txt)
```bash
set OPENAI_API_KEY=sk-dummy
set MIDSCENE_USE_AZURE_OPENAI=1
set AZURE_OPENAI_ENDPOINT=***
set AZURE_OPENAI_KEY=***
set AZURE_OPENAI_API_VERSION=2024-08-01-preview
set AZURE_OPENAI_DEPLOYMENT=gpt-4o
```

## ⚠️ Important Note
Even if your Azure credentials specify API version `2024-05-01`, you **must** change it to `2024-08-01-preview` to avoid compatibility issues.

---

## Step 3. Modify `demo.ts` or `demo2.ts`

This repository includes **two different demo files** for running tasks with Midscene.js:

### `demo.ts`
- Executes each instruction **step by step**.
- Waits a set amount of time between each step.
- Recommended if you need fine control over the execution timing or debugging each action individually.

### `demo2.ts`
- Provides the **entire process as a single instruction**.
- Assigns a **total processing time** for the AI agent to complete all tasks at once.
- Recommended for more autonomous execution with minimal step management.

---

You can modify either file to define the task you want your AI agent to perform, such as:
- Navigating to a web page  
- Extracting data  
- Filling out forms  
- Validating page content

---

## Step 4. Run Your Agent

Execute your custom AI-powered browser automation task using Midscene.js + Puppeteer with Azure OpenAI support:

```bash
npx tsx demo.ts
```
In your bash, when the task has been completed, you will see the total cost of the fee calculator.

