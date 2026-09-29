# KhetiConnect - Presentation Content (Transferred into Silver Oak University PPT 2 Template)

---

## **Slide 1: Title Slide**

* **Course Name:** Dept. of CSE | Project Based Learning - I (PBL 1)
* **Course Code:** 1010043319
* **Project Title:** KHETICONNECT: Smart Agritech Direct Farmer-to-Consumer & Real-Time Crop Bidding Platform

| Field | Details |
|---|---|
| **Group ID** | `PBL-CE-2026-42` |
| **Enrollment No** | `2502031830037`, `2502031830005`, `2502031830040`, `2502031830048`, `2502031830017` |
| **Name** | Jeet Ranpariya, Kushwaha Ankitkumar, Het Nakrani, Yash Makwana, Rajdipsinh Chauhan |
| **Branch** | Computer Science & Engineering (CSE) |
| **Guide Name** | Prof. `<Guide Name>` |

---

## **Slide 2: Index**

* **Introduction**
* **Background and Motivation**
* **Relevance and Importance**
* **Literature Survey**
* **Objectives**
* **UML Diagram**
* **Work carried out till date (Table format)**
* **Timeline Chart**
* **References**

---

## **Slide 3: Introduction**

* **Research Area & Domain:** Agriculture Technology (Agritech), Web Engineering & E-Commerce.
* **Core Product Overview:** **KhetiConnect** is an integrated web-based platform designed to bridge the gap between farmers, wholesale buyers, and end consumers.
* **Key Features:**
  * **Direct Marketplace:** Eliminates middlemen and commission agents.
  * **Real-Time Mandi Rates:** Live ticker across APMC Mandis for price transparency.
  * **Dual Selling Modes:** Fixed-price direct retail and dynamic auction bidding for wholesale harvests.
  * **Farmer Community & Trust Portal:** Knowledge-sharing forum with peer-to-peer QA and verified trust scores.

---

## **Slide 4: Background and Motivation**

* **Background:**
  * Agriculture sustains over 50% of India's workforce, but farmers receive less than 30% of the end-consumer price due to commission agents and fragmented supply chains.
  * Information asymmetry about real-time market rates further limits farmers' bargaining power and financial viability.
* **Motivation:**
  * **Empower Farmers:** Facilitate dynamic price discovery and fair profit retention.
  * **Modern Tech Adoption:** Leverage web technologies (React, Vite, Node.js) for a fast, responsive UI optimized for low-bandwidth rural networks.
  * **Transparent Transactions:** Enable trackable trades supplemented with peer community support.

---

## **Slide 5: Relevance and Importance**

* **New Insights & Technical Contributions:**
  * **Hybrid E-Commerce:** Combines instant retail checkout (Cart/Drawer) with real-time wholesale auction bidding.
  * **Dynamic Pricing:** Market demand determines values above seller-defined reserve prices.
  * **Trust System:** Badge-verified profiles, quality ratings, and harvest date metadata.
* **Stakeholders Value:**
  * **Farmers & FPOs:** Direct market access and better price visibility.
  * **Wholesale Traders & Retail Buyers:** Verified supply, transparent pricing, and quality assurance.
* **Societal & Economic Value:** Digital inclusion for agricultural market participation, reduced post-harvest food loss, and stabilized farm income.

---

## **Slide 6: Literature Survey**

| Platform / Literature | Approach / Capabilities | Identified Limitations | KhetiConnect Advantage |
|---|---|---|---|
| **e-NAM (Govt of India)** | National APMC network for market access and price discovery. | Complex onboarding and poor UI limit ease of use for rural farmers. | Simplified, farmer-friendly access with highly optimized UX. |
| **Agribazaar / DeHaat** | B2B procurement and large-scale agri-commerce support. | B2B-heavy workflows and rigid pricing reduce flexibility. | Combines dynamic wholesale bidding with retail purchasing. |
| **Traditional E-Grocery (Amazon Fresh, BigBasket)** | Urban delivery and consumer-focused ordering. | Low farm-gate prices and zero direct farmer interaction. | Connects farmers & buyers directly for transparent market participation. |

> **Key Inference:** No existing platform combines real-time bidding with instant retail purchasing. KhetiConnect integrates Mandi Analytics, Live Bidding, Direct Retail Cart, and Community Q&A in one system.

---

## **Slide 7: Objectives**

* **Primary Objective:** Design and implement KhetiConnect, a full-stack agritech web portal for direct agricultural trade and dynamic crop bidding.
* **Specific Sub-Objectives:**
  1. Build a responsive frontend UI using **React, Vite, and TailwindCSS**.
  2. Implement a live **Mandi rate ticker** for real-time crop market prices.
  3. Develop a **dynamic bidding engine** with real-time incremental bids.
  4. Create an integrated **shopping cart and checkout flow** with mock payment.
  5. Build a **farmer community portal** for discussions, disease solutions, and expert advice.
  6. Establish robust authentication with **role-based access control (Farmer/Buyer)**.

---

## **Slide 8: UML Diagram**

### **1) Use Case Diagram (Actors & System Actions)**
* **Farmer:** Register/Login, Add Crop Listing (Fixed/Auction), Monitor Bids, Accept Bid, Post Q&A.
* **Buyer:** Search Crops, View Mandi Rates, Place Bid, Add to Cart & Checkout, Write Reviews.
* **Admin:** Verify Profiles, Manage Categories, Monitor System Transactions.

### **2) Class Diagram (Core Entities & Relationships)**
* **User (abstract):** `userId`, `name`, `email`, `phone`, `role` &rarr; `Farmer` (`isVerified`, `rating`) & `Buyer` (`cartItems`, `activeBids`).
* **Product / Crop:** `cropId`, `title`, `category`, `price`, `quantity`, `listingType`, `currentHighestBid`, `auctionEndsAt`.
* **Bid & Order:** `bidId`, `amount`, `timestamp`, `buyerId`, `orderStatus`, `totalAmount`.

### **3) Sequence Diagram (Crop Auction Bidding Flow)**
* **Initiation:** Buyer selects active auction crop on Marketplace.
* **Submission:** Buyer submits bid via `BiddingModal`.
* **Validation:** `KhetiContext` validates minimum bid increment against current highest bid.
* **State Update:** Auction state dynamically updates highest bid and history timeline.
* **Confirmation:** Real-time toast notification confirms bid placement.

---

## **Slide 9: Work Carried Out Till Date (Table Format)**

| Module / Component Name | Description & Key Functionality | Technologies Used | Status |
|---|---|---|---|
| **Authentication System** | Login modal, role selector (Farmer/Buyer), authentication context. | React Context, LocalStorage | **100%** |
| **Header & Navigation** | Tabs, cart drawer trigger, user profile badge. | React, Lucide Icons, TailwindCSS | **100%** |
| **Live Mandi Ticker** | Scrolling prices across APMC Mandis. | React State, Tailwind Animations | **100%** |
| **Marketplace & Bidding** | Product grid, search, live modal, bid history. | React Hooks, Context API | **100%** |
| **Cart & Payment** | Drawer, price calc, payment modal with confetti animations. | React, Canvas-Confetti | **100%** |
| **Community & Dashboard** | Forum, Q&A, active bids, won auctions. | React State, Custom Modals | **90%** |

---

## **Slide 10: Timeline Chart**

* **Phase 1 (Month 1):** Problem Formulation, SRS Document & Domain Literature Review.
* **Phase 2 (Month 2):** System Architecture, Database Schema & UML Modeling (Use Case, Class, Sequence).
* **Phase 3 (Month 3):** Frontend Layout Setup, Design System, Header/Footer & Mandi Ticker.
* **Phase 4 (Month 4):** Core Marketplace Grid, Bidding Engine Modal & Cart Drawer Development.
* **Phase 5 (Month 5):** Auth Flow, Community Forum, Dashboard Analytics & Simulated Payments.
* **Phase 6 (Month 6):** Integration Testing, Optimization, Code Verification & Final PPT Documentation.

---

## **Slide 11: References**

* **[1]** Department of Agriculture & Farmers Welfare, Govt of India. *"e-National Agriculture Market (eNAM) Implementation Guidelines."* 2023.
* **[2]** IEEE Transactions on Agricultural Engineering. *"Blockchain and IoT-based Transparent Agricultural Supply Chain and Price Discovery Systems."* IEEE Access, Vol. 11, pp. 45210–45222, 2023.
* **[3]** S. Patel and R. Kumar. *"Impact of Direct Farmer-to-Consumer Digital Marketplaces on Rural Economy."* Journal of Agricultural Systems and Web Engineering, 2024.
* **[4]** React Documentation & Design Standards. *"Building Scalable Component Architectures with React 18 & Vite."* https://react.dev/
* **[5]** Tailwind Labs. *"Modern Utility-First CSS Principles for Web Applications."* https://tailwindcss.com/
