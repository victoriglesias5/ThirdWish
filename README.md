# Browser Automation Task – WIPO Fee Calculator

## Overview

This repository contains three different implementations of **browser automation** aimed at interacting with the **Madrid WIPO Fee Calculator**.  
The purpose of this project is to evaluate and compare several automation frameworks by performing fee calculations based on predefined input parameters.

The goal is to determine the **total transaction fee** given:
- Transaction type (Application, Renewal, etc.)
- Date
- Office of origin
- Number of classes
- Contracting party

These solutions aim to **automate** the data extraction and calculation process, handling the **complex and frequently changing fee structures** of the WIPO system.

---

## Project Structure

In this repository, you will find the following three browser automation approaches:

### 1. Reasoning Browsing Agent (AllHands.Dev)
- **Repository**: [`option1-reasoner-agent`](./option1-reasoner-agent)
- **Description**: A reasoning-based agent that autonomously interacts with web applications.
- **Pros**: Advanced reasoning, flexible.
- **Cons**: Potential instability, requires fine-tuning and testing.

### 2. Open Operator (Browserbase)
- **Repository**: [`option2-open-operator`](./option2-open-operator)
- **Description**: A browser automation operator that can perform actions based on predefined workflows.
- **Pros**: Open-source, adaptable.
- **Cons**: Still in development, occasional instability.

### 3. UI-TARS (Bytedance)
- **Repository**: [`option3-ui-tars`](./option3-ui-tars)
- **Description**: A browser automation framework with reinforcement learning capabilities.
- **Pros**: Supports training, adaptive to UI changes.
- **Cons**: Requires significant setup, potential for unstable behavior.

---

## How to Use

Each option folder includes:
- Installation instructions.
- How to configure and run the automation scripts.
- Test cases with predefined input parameters.
- Logs and performance results.

### Basic Requirements
- Python 3.8+
- OpenAI API Key
- Node.js

---

## Evaluation Criteria

Each approach was tested under the following conditions:
- Multiple transaction types and dates.
- Different offices of origin and contracting parties.
- Success rate, execution time, and error handling were measured.
- System behavior during potential changes in the WIPO calculator interface was observed.

---

## Results and Analysis

A complete summary of the tests, results, and comparisons can be found in the `results` folder and the accompanying **project documentation PDF**.

---

## Documentation & Resources
- [WIPO Madrid Fee Calculator](https://madrid.wipo.int/feecalcapp/)
- Links to relevant repositories and resources are included in each folder’s README.

---

## Author
*Víctor Iglesias González*  
*10/03/2025*


