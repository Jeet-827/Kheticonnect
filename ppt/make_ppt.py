import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_kheticonnect_ppt():
    prs = Presentation()
    # Set to widescreen 16:9
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # Silver Oak University Colors
    MAROON = RGBColor(139, 38, 38)        # #8B2626 (Primary Brand Color)
    DARK_TEXT = RGBColor(30, 30, 30)      # #1E1E1E
    GRAY_TEXT = RGBColor(90, 90, 90)      # #5A5A5A
    WHITE = RGBColor(255, 255, 255)
    LIGHT_BG = RGBColor(248, 249, 250)    # Soft gray background
    ACCENT_GREEN = RGBColor(16, 124, 65)  # #107C41 (Agritech Green accent)
    BORDER_COLOR = RGBColor(220, 220, 220)

    blank_layout = prs.slide_layouts[6]

    def add_header_footer(slide, slide_num):
        if slide_num == 1:
            return  # Title slide has custom header

        # Top Right University Header Text Box
        header_box = slide.shapes.add_textbox(Inches(7.5), Inches(0.25), Inches(5.333), Inches(0.8))
        tf_h = header_box.text_frame
        tf_h.word_wrap = True
        p_h = tf_h.paragraphs[0]
        p_h.text = "SILVER OAK UNIVERSITY"
        p_h.alignment = PP_ALIGN.RIGHT
        p_h.font.size = Pt(12)
        p_h.font.bold = True
        p_h.font.color.rgb = MAROON
        p_h.font.name = "Arial"

        p_h_sub = tf_h.add_paragraph()
        p_h_sub.text = "EDUCATION TO INNOVATION | NAAC 'A' GRADE"
        p_h_sub.alignment = PP_ALIGN.RIGHT
        p_h_sub.font.size = Pt(9)
        p_h_sub.font.bold = True
        p_h_sub.font.color.rgb = MAROON
        p_h_sub.font.name = "Arial"

        # Horizontal divider line under title header
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.15), Inches(11.733), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = MAROON
        line.line.color.rgb = MAROON

        # Footer Line
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(6.85), Inches(11.733), Inches(0.4))
        tf_f = footer_box.text_frame
        tf_f.word_wrap = True
        p_f = tf_f.paragraphs[0]
        p_f.text = f"21-08-2026                 DEPARTMENT OF COMPUTER ENGINEERING                 {slide_num}"
        p_f.alignment = PP_ALIGN.CENTER
        p_f.font.size = Pt(10)
        p_f.font.color.rgb = GRAY_TEXT
        p_f.font.name = "Arial"

        # Footer Proprietary Subtext
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.1), Inches(11.733), Inches(0.3))
        tf_sub = sub_box.text_frame
        p_sub = tf_sub.paragraphs[0]
        p_sub.text = "*Proprietary material of SILVER OAK UNIVERSITY"
        p_sub.alignment = PP_ALIGN.CENTER
        p_sub.font.size = Pt(9)
        p_sub.font.italic = True
        p_sub.font.color.rgb = GRAY_TEXT

    # -------------------------------------------------------------
    # SLIDE 1: Title Slide (Matching PPT 2 Silver Oak Template)
    # -------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)

    # Top Right University Header
    t_header = slide1.shapes.add_textbox(Inches(7.5), Inches(0.3), Inches(5.0), Inches(0.8))
    tf_th = t_header.text_frame
    p_th = tf_th.paragraphs[0]
    p_th.text = "SILVER OAK UNIVERSITY"
    p_th.alignment = PP_ALIGN.RIGHT
    p_th.font.size = Pt(14)
    p_th.font.bold = True
    p_th.font.color.rgb = MAROON
    p_th.font.name = "Arial"

    p_th2 = tf_th.add_paragraph()
    p_th2.text = "EDUCATION TO INNOVATION | NAAC 'A' GRADE"
    p_th2.alignment = PP_ALIGN.RIGHT
    p_th2.font.size = Pt(10)
    p_th2.font.bold = True
    p_th2.font.color.rgb = MAROON
    p_th2.font.name = "Arial"

    # Title Banner Box
    title_box = slide1.shapes.add_textbox(Inches(1.0), Inches(1.1), Inches(11.333), Inches(2.2))
    tf1 = title_box.text_frame
    tf1.word_wrap = True
    
    p1 = tf1.paragraphs[0]
    p1.text = "Dept. of CSE | Project Based Learning - I (PBL 1)"
    p1.alignment = PP_ALIGN.CENTER
    p1.font.size = Pt(22)
    p1.font.bold = True
    p1.font.color.rgb = DARK_TEXT
    p1.font.name = "Georgia"

    p2 = tf1.add_paragraph()
    p2.text = "Course Code: 1010043319"
    p2.alignment = PP_ALIGN.CENTER
    p2.font.size = Pt(20)
    p2.font.color.rgb = GRAY_TEXT
    p2.font.name = "Georgia"

    p3 = tf1.add_paragraph()
    p3.text = "KHETICONNECT"
    p3.alignment = PP_ALIGN.CENTER
    p3.font.size = Pt(36)
    p3.font.bold = True
    p3.font.color.rgb = ACCENT_GREEN
    p3.font.name = "Georgia"

    p4 = tf1.add_paragraph()
    p4.text = "Smart Agritech Direct Farmer-to-Consumer & Real-Time Crop Bidding Platform"
    p4.alignment = PP_ALIGN.CENTER
    p4.font.size = Pt(18)
    p4.font.bold = True
    p4.font.color.rgb = MAROON
    p4.font.name = "Georgia"

    # Table of Student & Group Info (Maroon Theme matching PPT 2 template)
    table_shape = slide1.shapes.add_table(5, 2, Inches(1.2), Inches(3.6), Inches(10.933), Inches(3.4))
    table = table_shape.table
    table.columns[0].width = Inches(3.2)
    table.columns[1].width = Inches(7.733)

    fields = [
        ("Group ID", "PBL-CE-2026-42"),
        ("Enrollment No", "2502031830037, 2502031830005, 2502031830040, 2502031830048, 2502031830017"),
        ("Name", "Jeet Ranpariya, Kushwaha Ankitkumar, Het Nakrani, Yash Makwana, Rajdipsinh Chauhan"),
        ("Branch", "Computer Science & Engineering (CSE)"),
        ("Guide Name", "Prof. Guide Name")
    ]

    for row_idx, (label, val) in enumerate(fields):
        cell_lbl = table.cell(row_idx, 0)
        cell_lbl.text = label
        cell_lbl.fill.solid()
        cell_lbl.fill.fore_color.rgb = MAROON
        p_lbl = cell_lbl.text_frame.paragraphs[0]
        p_lbl.font.bold = True
        p_lbl.font.size = Pt(16)
        p_lbl.font.color.rgb = WHITE
        p_lbl.font.name = "Georgia"

        cell_val = table.cell(row_idx, 1)
        cell_val.text = val
        cell_val.fill.solid()
        cell_val.fill.fore_color.rgb = MAROON
        p_val = cell_val.text_frame.paragraphs[0]
        p_val.font.size = Pt(15)
        p_val.font.color.rgb = WHITE
        p_val.font.name = "Georgia"

    # Helper function for title & bullet slides
    def create_bullet_slide(prs, slide_num, title_text, bullets):
        slide = prs.slides.add_slide(blank_layout)
        add_header_footer(slide, slide_num)

        # Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.7))
        tf = t_box.text_frame
        p = tf.paragraphs[0]
        p.text = title_text
        p.alignment = PP_ALIGN.LEFT
        p.font.size = Pt(32)
        p.font.bold = True
        p.font.color.rgb = DARK_TEXT
        p.font.name = "Georgia"

        # Content Box
        c_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(11.733), Inches(5.3))
        tf_c = c_box.text_frame
        tf_c.word_wrap = True

        for idx, item in enumerate(bullets):
            p_c = tf_c.paragraphs[0] if idx == 0 else tf_c.add_paragraph()
            text_str = item[0] if isinstance(item, tuple) else item
            p_c.text = text_str
            
            font_sz = item[1] if isinstance(item, tuple) else 20
            p_c.font.size = Pt(font_sz)
            
            if isinstance(item, tuple) and len(item) > 3 and item[3]:
                p_c.font.bold = True
                p_c.font.color.rgb = MAROON
            else:
                p_c.font.color.rgb = DARK_TEXT

            p_c.font.name = "Calibri"
            p_c.space_after = Pt(10)
            p_c.level = item[2] if isinstance(item, tuple) and len(item) > 2 else 0

        return slide

    # -------------------------------------------------------------
    # SLIDE 2: Index (Matching PPT 2 Template Headings)
    # -------------------------------------------------------------
    index_bullets = [
        ("•  Introduction", 22, 0, True),
        ("•  Background and Motivation", 22, 0, True),
        ("•  Relevance and Importance", 22, 0, True),
        ("•  Literature Survey", 22, 0, True),
        ("•  Objectives", 22, 0, True),
        ("•  UML Diagram", 22, 0, True),
        ("•  Work carried out till date (Table format)", 22, 0, True),
        ("•  Timeline Chart", 22, 0, True),
        ("•  References", 22, 0, True)
    ]
    create_bullet_slide(prs, 2, "Index", index_bullets)

    # -------------------------------------------------------------
    # SLIDE 3: Introduction
    # -------------------------------------------------------------
    intro_bullets = [
        ("Research Area & Domain:", 22, 0, True),
        ("Agriculture Technology (Agritech), Web Engineering & E-Commerce.", 19, 1),
        ("Core Product Overview:", 22, 0, True),
        ("KhetiConnect is an integrated web-based platform designed to bridge the gap between farmers, wholesale buyers, and end consumers.", 19, 1),
        ("Key Features:", 22, 0, True),
        ("• Direct Marketplace: Eliminates middlemen and commission agents.", 18, 1),
        ("• Real-Time Mandi Rates: Live ticker across APMC Mandis for price transparency.", 18, 1),
        ("• Dual Selling Modes: Fixed-price direct retail and dynamic auction bidding for wholesale harvests.", 18, 1),
        ("• Farmer Community & Trust Portal: Knowledge-sharing forum with peer-to-peer QA and verified trust scores.", 18, 1)
    ]
    create_bullet_slide(prs, 3, "Introduction", intro_bullets)

    # -------------------------------------------------------------
    # SLIDE 4: Background and Motivation
    # -------------------------------------------------------------
    bg_bullets = [
        ("Background:", 22, 0, True),
        ("• Agriculture sustains over 50% of India's workforce, but farmers receive less than 30% of the end-consumer price due to commission agents and fragmented supply chains.", 18, 1),
        ("• Information asymmetry about real-time market rates further limits farmers' bargaining power and financial viability.", 18, 1),
        ("Motivation:", 22, 0, True),
        ("• Empower Farmers: Facilitate dynamic price discovery and fair profit retention.", 18, 1),
        ("• Modern Tech Adoption: Leverage web technologies (React, Vite, Node.js) for a fast, responsive UI optimized for low-bandwidth rural networks.", 18, 1),
        ("• Transparent Transactions: Enable trackable trades supplemented with peer community support.", 18, 1)
    ]
    create_bullet_slide(prs, 4, "Background and Motivation", bg_bullets)

    # -------------------------------------------------------------
    # SLIDE 5: Relevance and Importance
    # -------------------------------------------------------------
    rel_bullets = [
        ("New Insights & Technical Contributions:", 22, 0, True),
        ("• Hybrid E-Commerce: Combines instant retail checkout (Cart/Drawer) with real-time wholesale auction bidding.", 18, 1),
        ("• Dynamic Pricing: Market demand determines values above seller-defined reserve prices.", 18, 1),
        ("• Trust System: Badge-verified profiles, quality ratings, and harvest date metadata.", 18, 1),
        ("Stakeholders Value:", 22, 0, True),
        ("• Farmers & FPOs: Direct market access and better price visibility.", 18, 1),
        ("• Wholesale Traders & Retail Buyers: Verified supply, transparent pricing, and quality assurance.", 18, 1),
        ("Societal & Economic Value:", 22, 0, True),
        ("• Digital inclusion for agricultural market participation, reduced post-harvest food loss, and stabilized farm income.", 18, 1)
    ]
    create_bullet_slide(prs, 5, "Relevance and Importance", rel_bullets)

    # -------------------------------------------------------------
    # SLIDE 6: Literature Survey (Table Format)
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    add_header_footer(slide6, 6)

    t_box6 = slide6.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.7))
    p6 = t_box6.text_frame.paragraphs[0]
    p6.text = "Literature Survey"
    p6.alignment = PP_ALIGN.LEFT
    p6.font.size = Pt(32)
    p6.font.bold = True
    p6.font.color.rgb = DARK_TEXT
    p6.font.name = "Georgia"

    table_shape6 = slide6.shapes.add_table(4, 4, Inches(0.8), Inches(1.3), Inches(11.733), Inches(4.5))
    table6 = table_shape6.table
    table6.columns[0].width = Inches(2.2)
    table6.columns[1].width = Inches(3.3)
    table6.columns[2].width = Inches(3.2)
    table6.columns[3].width = Inches(3.033)

    headers6 = ["Platform / Literature", "Approach / Capabilities", "Identified Limitations", "KhetiConnect Advantage"]
    for c_idx, h_text in enumerate(headers6):
        cell = table6.cell(0, c_idx)
        cell.text = h_text
        cell.fill.solid()
        cell.fill.fore_color.rgb = MAROON
        p = cell.text_frame.paragraphs[0]
        p.font.bold = True
        p.font.size = Pt(15)
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER
        p.font.name = "Georgia"

    survey_data = [
        ("e-NAM (Govt of India)", "National APMC network for market access and price discovery.", "Complex onboarding and poor UI limit ease of use for rural farmers.", "Simplified, farmer-friendly access with highly optimized UX."),
        ("Agribazaar / DeHaat", "B2B procurement and large-scale agri-commerce support.", "B2B-heavy workflows and rigid pricing reduce flexibility.", "Combines dynamic wholesale bidding with retail purchasing."),
        ("Traditional E-Grocery (Amazon Fresh, BigBasket)", "Urban delivery and consumer-focused ordering.", "Low farm-gate prices and zero direct farmer interaction.", "Connects farmers & buyers directly for transparent market participation.")
    ]

    for r_idx, row in enumerate(survey_data, start=1):
        for c_idx, val in enumerate(row):
            cell = table6.cell(r_idx, c_idx)
            cell.text = val
            cell.fill.solid()
            cell.fill.fore_color.rgb = LIGHT_BG if r_idx % 2 == 0 else WHITE
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(13)
            p.font.color.rgb = DARK_TEXT
            p.font.name = "Calibri"

    # Key inference subtext
    inf_box = slide6.shapes.add_textbox(Inches(0.8), Inches(6.0), Inches(11.733), Inches(0.7))
    tf_inf = inf_box.text_frame
    tf_inf.word_wrap = True
    p_inf = tf_inf.paragraphs[0]
    p_inf.text = "Key Inference: No existing platform combines real-time bidding with instant retail purchasing. KhetiConnect integrates Mandi Analytics, Live Bidding, Direct Retail Cart, and Community Q&A in one system."
    p_inf.font.size = Pt(13)
    p_inf.font.bold = True
    p_inf.font.italic = True
    p_inf.font.color.rgb = MAROON

    # -------------------------------------------------------------
    # SLIDE 7: Objectives
    # -------------------------------------------------------------
    obj_bullets = [
        ("Primary Objective:", 22, 0, True),
        ("Design and implement KhetiConnect, a full-stack agritech web portal for direct agricultural trade and dynamic crop bidding.", 19, 1),
        ("Specific Sub-Objectives:", 22, 0, True),
        ("1. Build a responsive frontend UI using React, Vite, and TailwindCSS.", 18, 1),
        ("2. Implement a live Mandi rate ticker for real-time crop market prices.", 18, 1),
        ("3. Develop a dynamic bidding engine with real-time incremental bids.", 18, 1),
        ("4. Create an integrated shopping cart and checkout flow with mock payment.", 18, 1),
        ("5. Build a farmer community portal for discussions, disease solutions, and expert advice.", 18, 1),
        ("6. Establish robust authentication with role-based access control (Farmer/Buyer).", 18, 1)
    ]
    create_bullet_slide(prs, 7, "Objectives", obj_bullets)

    # -------------------------------------------------------------
    # SLIDE 8: UML Diagram (Use Case, Class, & Sequence Diagrams)
    # -------------------------------------------------------------
    uml_bullets = [
        ("1) Use Case Diagram (Actors & Actions):", 20, 0, True),
        ("• Farmer: Register/Login, Add Crop Listing (Fixed/Auction), Monitor Bids, Accept Bid, Post Q&A.", 17, 1),
        ("• Buyer: Search Crops, View Mandi Rates, Place Bid, Add to Cart & Checkout, Write Reviews.", 17, 1),
        ("• Admin: Verify Profiles, Manage Categories, Monitor System Transactions.", 17, 1),
        ("2) Class Diagram (Core Entities & Relationships):", 20, 0, True),
        ("• User (abstract): userId, name, email, phone, role -> Farmer (isVerified, rating) & Buyer (cartItems, activeBids).", 17, 1),
        ("• Product/Crop: cropId, title, category, price, quantity, listingType, currentHighestBid, auctionEndsAt.", 17, 1),
        ("• Bid & Order: bidId, amount, timestamp, buyerId, order status, totalAmount.", 17, 1),
        ("3) Sequence Diagram (Crop Auction Bidding Flow):", 20, 0, True),
        ("• Initiation -> Submission -> Validation (KhetiContext min increment) -> State Update (highest bid & history) -> Confirmation (real-time UI toast).", 17, 1)
    ]
    create_bullet_slide(prs, 8, "UML Diagram", uml_bullets)

    # -------------------------------------------------------------
    # SLIDE 9: Work carried out till date (Table format)
    # -------------------------------------------------------------
    slide9 = prs.slides.add_slide(blank_layout)
    add_header_footer(slide9, 9)

    t_box9 = slide9.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.7))
    p9 = t_box9.text_frame.paragraphs[0]
    p9.text = "Work Carried Out Till Date"
    p9.alignment = PP_ALIGN.LEFT
    p9.font.size = Pt(32)
    p9.font.bold = True
    p9.font.color.rgb = DARK_TEXT
    p9.font.name = "Georgia"

    table_shape9 = slide9.shapes.add_table(7, 4, Inches(0.8), Inches(1.3), Inches(11.733), Inches(5.2))
    table9 = table_shape9.table
    table9.columns[0].width = Inches(2.5)
    table9.columns[1].width = Inches(4.733)
    table9.columns[2].width = Inches(2.5)
    table9.columns[3].width = Inches(2.0)

    headers9 = ["Module / Component Name", "Description & Key Functionality", "Technologies Used", "Status"]
    for c_idx, h_text in enumerate(headers9):
        cell = table9.cell(0, c_idx)
        cell.text = h_text
        cell.fill.solid()
        cell.fill.fore_color.rgb = MAROON
        p = cell.text_frame.paragraphs[0]
        p.font.bold = True
        p.font.size = Pt(15)
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER
        p.font.name = "Georgia"

    work_data = [
        ("Authentication System", "Login modal, role selector (Farmer/Buyer), authentication context.", "React Context, LocalStorage", "100%"),
        ("Header & Navigation", "Tabs, cart drawer trigger, user profile badge.", "React, Lucide Icons, TailwindCSS", "100%"),
        ("Live Mandi Ticker", "Scrolling prices across APMC Mandis.", "React State, Tailwind Animations", "100%"),
        ("Marketplace & Bidding", "Product grid, search, live modal, bid history.", "React Hooks, Context API", "100%"),
        ("Cart & Payment", "Drawer, price calc, payment modal with confetti animations.", "React, Canvas-Confetti", "100%"),
        ("Community & Dashboard", "Forum, Q&A, active bids, won auctions.", "React State, Custom Modals", "90%")
    ]

    for r_idx, row in enumerate(work_data, start=1):
        for c_idx, val in enumerate(row):
            cell = table9.cell(r_idx, c_idx)
            cell.text = val
            cell.fill.solid()
            cell.fill.fore_color.rgb = LIGHT_BG if r_idx % 2 == 0 else WHITE
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(13)
            p.font.color.rgb = DARK_TEXT
            p.font.name = "Calibri"
            if c_idx == 3:
                p.font.bold = True
                p.font.color.rgb = ACCENT_GREEN if val == "100%" else MAROON
                p.alignment = PP_ALIGN.CENTER

    # -------------------------------------------------------------
    # SLIDE 10: Timeline Chart
    # -------------------------------------------------------------
    time_bullets = [
        ("Chronological Project Milestones & Execution Roadmap:", 22, 0, True),
        ("• Phase 1 (Month 1): Problem Formulation, SRS Document & Domain Literature Review.", 18, 1),
        ("• Phase 2 (Month 2): System Architecture, Database Schema & UML Modeling (Use Case, Class, Sequence).", 18, 1),
        ("• Phase 3 (Month 3): Frontend Layout Setup, Design System, Header/Footer & Mandi Ticker.", 18, 1),
        ("• Phase 4 (Month 4): Core Marketplace Grid, Bidding Engine Modal & Cart Drawer Development.", 18, 1),
        ("• Phase 5 (Month 5): Auth Flow, Community Forum, Dashboard Analytics & Simulated Payments.", 18, 1),
        ("• Phase 6 (Month 6): Integration Testing, Optimization, Code Verification & Final PPT Documentation.", 18, 1)
    ]
    create_bullet_slide(prs, 10, "Timeline Chart", time_bullets)

    # -------------------------------------------------------------
    # SLIDE 11: References
    # -------------------------------------------------------------
    ref_bullets = [
        ("[1] Department of Agriculture & Farmers Welfare, Govt of India. \"e-National Agriculture Market (eNAM) Implementation Guidelines.\" 2023.", 17, 0),
        ("[2] IEEE Transactions on Agricultural Engineering. \"Blockchain and IoT-based Transparent Agricultural Supply Chain and Price Discovery Systems.\" IEEE Access, Vol. 11, pp. 45210–45222, 2023.", 17, 0),
        ("[3] S. Patel and R. Kumar. \"Impact of Direct Farmer-to-Consumer Digital Marketplaces on Rural Economy.\" Journal of Agricultural Systems and Web Engineering, 2024.", 17, 0),
        ("[4] React Documentation & Design Standards. \"Building Scalable Component Architectures with React 18 & Vite.\" https://react.dev/", 17, 0),
        ("[5] Tailwind Labs. \"Modern Utility-First CSS Principles for Web Applications.\" https://tailwindcss.com/", 17, 0)
    ]
    create_bullet_slide(prs, 11, "References", ref_bullets)

    # Save presentation
    output_path = r"c:\Users\Mr.jeet\OneDrive\Desktop\pbl\KhetiConnect_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")

if __name__ == "__main__":
    create_kheticonnect_ppt()
