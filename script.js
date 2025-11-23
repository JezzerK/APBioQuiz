// AP Biology Unit 2 Quiz Game - Main JavaScript File

// Game state management
const gameState = {
    currentUnit: 2, // Default to Unit 2
    currentSection: null,
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    timer: null,
    timeRemaining: 0,
    questions: [],
    sectionProgress: {},
    selectedAnswer: null,
    questionStartTime: null,
    sectionSkills: {} // Skill levels per section
};

// Track recently asked questions to avoid immediate repeats
const recentQuestions = {}; // Format: { section: [questionIndices...] }

// Configuration
const CONFIG = {
    DEFAULT_TIME_MULTIPLE_CHOICE: 45, // seconds
    DEFAULT_TIME_CHI_SQUARED: 90, // seconds
    TIMER_WARNING_THRESHOLD: 10, // seconds - show warning when below this
    QUESTIONS_PER_RUN: 5, // Number of questions per quiz session
    SKILL_INCREASE_THRESHOLD: 0.80, // 80% accuracy to increase skill
    SKILL_DECREASE_THRESHOLD: 0.60, // Below 60% accuracy decreases skill
    SKILL_INCREASE_AMOUNT: 0.05, // 5% increase per good session
    SKILL_DECREASE_AMOUNT: 0.03 // 3% decrease per poor session
};

// Question Banks for each section

const questionBanks = {
    transport: [
        {
            question: "What happens to a cell placed in a hypotonic solution?",
            options: [
                "A) The cell swells and may burst",
                "B) The cell shrinks",
                "C) No net movement of water occurs",
                "D) The cell remains the same size"
            ],
            correct: 0,
            difficulty: "easy",
            explanation: "In a hypotonic solution, the solute concentration is lower outside the cell than inside the cell. This creates a concentration gradient that drives the movement of water molecules through osmosis. Water will flow from the area of higher water potential (the hypotonic solution) into the area of lower water potential (the cell's cytoplasm), where solute concentration is higher. As water enters the cell, the cell volume increases, causing the cell to swell. Animal cells, which lack a rigid cell wall, can eventually burst (lyse) if too much water enters. Plant cells, with their rigid cell walls, become turgid but are protected from bursting.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Water potential (Ψ) is highest in which of the following?",
            options: [
                "A) Pure water at atmospheric pressure",
                "B) A solution with high solute concentration",
                "C) A plant cell in a hypertonic solution",
                "D) A solution under high pressure"
            ],
            correct: 0,
            difficulty: "easy",
            explanation: "Pure water at atmospheric pressure has the highest water potential, defined as Ψ = 0 MPa (megapascals). Water potential measures the tendency of water to move from one location to another, and pure water serves as the reference point. When solutes are dissolved in water, they reduce the water potential (making it more negative) because the solutes interfere with the free movement of water molecules. Similarly, in a hypertonic solution, the high solute concentration lowers water potential. While pressure can increase water potential (making it positive), pure water at atmospheric pressure represents the maximum standard state before any modifications. This is why water always moves from pure water toward solutions with lower water potential.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The formula for water potential is Ψ = Ψs + Ψp. What does Ψs represent?",
            options: [
                "A) Pressure potential",
                "B) Solute potential (osmotic potential)",
                "C) Volume potential",
                "D) Temperature potential"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Ψs represents solute potential, also known as osmotic potential. This component of water potential is always negative or zero, never positive. The solute potential depends directly on the concentration of solutes dissolved in the solution: as solute concentration increases, Ψs becomes more negative. This occurs because dissolved solutes interfere with the free movement of water molecules, reducing their kinetic energy and therefore their tendency to move. The solute potential is a critical factor in osmosis, as it drives water movement across semi-permeable membranes from regions of higher water potential (less negative Ψs) to regions of lower water potential (more negative Ψs). In contrast, Ψp represents pressure potential, which can be positive (in turgid plant cells) or zero (in open systems).",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "In osmoregulation, marine fish maintain water balance by:",
            options: [
                "A) Drinking large amounts of water and excreting concentrated urine",
                "B) Drinking large amounts of water and excreting dilute urine",
                "C) Not drinking water and excreting concentrated urine",
                "D) Absorbing water through their gills"
            ],
            correct: 0,
            difficulty: "medium",
            explanation: "Marine fish live in a hypertonic environment where the seawater has a much higher solute concentration than their body fluids. This creates a continuous osmotic gradient that causes water to be lost from the fish's body across their gills and other permeable surfaces. To compensate for this water loss, marine fish must actively drink seawater. However, drinking seawater also introduces large amounts of salts, particularly sodium chloride, into their bodies. The fish's kidneys play a crucial role in osmoregulation by producing small volumes of highly concentrated urine that efficiently removes excess salts while conserving water. Additionally, specialized cells in the gills actively transport salts out of the body against the concentration gradient. This combination of drinking seawater, producing concentrated urine, and active salt excretion allows marine fish to maintain osmotic balance despite living in such a challenging hypertonic environment.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "What is the water potential of a plant cell that is fully turgid?",
            options: [
                "A) Ψ = 0",
                "B) Ψ < 0",
                "C) Ψ > 0",
                "D) Cannot be determined"
            ],
            correct: 0,
            difficulty: "medium",
            explanation: "A plant cell at full turgor reaches equilibrium with its environment, meaning the water potential inside the cell equals the water potential outside the cell. When a plant cell is placed in pure water, water initially flows into the cell by osmosis because the cell has a negative solute potential (Ψs < 0). As water enters, the cell expands and pushes against the rigid cell wall, creating positive pressure potential (Ψp > 0). At full turgor, the positive pressure potential exactly balances the negative solute potential (Ψp = -Ψs), resulting in a total water potential of zero inside the cell. Since the external environment is typically pure water with Ψ = 0, equilibrium is reached when the internal water potential also equals zero. At this point, there is no net movement of water, and the cell is maximally swollen but protected from bursting by its cell wall.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which process does NOT require energy input?",
            options: [
                "A) Active transport",
                "B) Osmosis",
                "C) Endocytosis",
                "D) Proton pump"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "Osmosis is a passive transport process that does not require energy input from the cell. It occurs spontaneously when there is a water potential gradient across a semi-permeable membrane. Water molecules move from regions of higher water potential (lower solute concentration) to regions of lower water potential (higher solute concentration) down their concentration gradient. This movement is driven solely by the kinetic energy of water molecules and does not require ATP hydrolysis or any cellular energy expenditure. In contrast, active transport requires ATP to move substances against their concentration gradient. Endocytosis also requires energy for membrane deformation and vesicle formation. Proton pumps are a type of active transport that use ATP to pump protons against their electrochemical gradient. The passive nature of osmosis is fundamental to many biological processes, including water uptake in plant roots and kidney function.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "A red blood cell placed in pure water will:",
            options: [
                "A) Shrink due to water loss",
                "B) Swell and potentially lyse",
                "C) Remain the same size",
                "D) Become crenated"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "Pure water is hypotonic relative to red blood cell cytoplasm because it has a higher water potential (Ψ = 0) compared to the cell's interior, which contains dissolved solutes that create a negative solute potential. When a red blood cell is placed in pure water, water will rush into the cell by osmosis, following the water potential gradient. Red blood cells, like all animal cells, lack a rigid cell wall, so they are vulnerable to osmotic swelling. As water enters, the cell membrane expands, and the cell volume increases. Since the membrane can only stretch so far, excessive water entry will cause the cell to rupture, a process called hemolysis or lysis. This is why medical solutions for intravenous administration must be isotonic (having the same solute concentration as blood) to prevent damage to red blood cells. The cell becoming crenated (shriveled) occurs in hypertonic solutions, not hypotonic ones.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The pressure potential (Ψp) in plant cells is typically:",
            options: [
                "A) Always negative",
                "B) Always positive",
                "C) Zero at equilibrium",
                "D) Negative when turgid"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "In plant cells, pressure potential (Ψp) is typically positive when the cell is turgid. This positive pressure potential results from the rigid cell wall exerting pressure on the cell contents as water enters by osmosis. When a plant cell is placed in a hypotonic solution, water enters the cell, causing it to expand. However, unlike animal cells, plant cells are constrained by a rigid cell wall composed primarily of cellulose. As the cell expands and pushes against this wall, the wall pushes back, creating turgor pressure. This turgor pressure contributes a positive value to the total water potential equation (Ψ = Ψs + Ψp). The positive pressure potential can offset the negative solute potential, allowing plant cells to maintain structural rigidity. When a plant cell loses water and becomes plasmolyzed, pressure potential can become zero, and in extreme cases of water loss, it might become slightly negative, but under normal conditions in a turgid state, Ψp is positive.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which solution has the lowest water potential?",
            options: [
                "A) 0.1 M sucrose solution",
                "B) 0.5 M sucrose solution",
                "C) 1.0 M sucrose solution",
                "D) Pure water"
            ],
            correct: 2,
            difficulty: "medium",
            explanation: "Water potential decreases (becomes more negative) as solute concentration increases. This occurs because dissolved solutes reduce the free energy of water molecules, making them less likely to move. In the formula Ψ = Ψs + Ψp, solute potential (Ψs) becomes increasingly negative with higher solute concentration. For non-electrolytes like sucrose, Ψs ≈ -iCRT, where i is the ionization constant, C is molar concentration, R is the gas constant, and T is temperature. A 1.0 M sucrose solution has approximately -2.5 MPa solute potential, compared to -0.24 MPa for 0.1 M and -1.2 MPa for 0.5 M. Pure water has Ψs = 0 MPa. Since pressure potential (Ψp) is zero in open solutions, the total water potential equals the solute potential, making the most concentrated solution (1.0 M sucrose) have the lowest (most negative) water potential.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Plasmolysis occurs when a plant cell is placed in:",
            options: [
                "A) A hypotonic solution",
                "B) A hypertonic solution",
                "C) An isotonic solution",
                "D) Pure water"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "Plasmolysis is a specific phenomenon that occurs when plant cells are placed in a hypertonic solution. In a hypertonic environment, the solute concentration outside the cell is higher than inside the cell, creating a water potential gradient that causes water to flow out of the cell by osmosis. As water leaves, the cell loses turgor pressure, and the cytoplasm shrinks. However, because plant cells have a rigid cell wall that does not shrink, the plasma membrane pulls away from the cell wall, creating a gap filled with the hypertonic solution. This visible separation between the plasma membrane and cell wall is called plasmolysis. In contrast, when placed in hypotonic solutions or pure water, plant cells become turgid as water enters. In isotonic solutions, there is no net water movement, so plasmolysis does not occur. Plasmolysis demonstrates the protective role of the cell wall, as animal cells in hypertonic solutions simply shrivel (crenation) without the membrane-wall separation.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Osmoregulation in freshwater fish involves:",
            options: [
                "A) Drinking large amounts of water",
                "B) Producing large volumes of dilute urine",
                "C) Excreting concentrated urine",
                "D) Absorbing salts through gills"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Freshwater fish live in a hypotonic environment where the solute concentration of the surrounding water is much lower than their body fluids. This creates a constant osmotic gradient that causes water to continuously enter the fish's body through the gills, skin, and other permeable surfaces. To prevent their cells from swelling and to maintain osmotic balance, freshwater fish must constantly excrete excess water. Their kidneys are adapted for this function, producing large volumes of very dilute urine—up to 30% of their body weight per day—which efficiently removes water while conserving valuable salts. Additionally, freshwater fish actively take in salts (particularly Na+ and Cl-) through specialized cells in their gills, since they lose salts both through diffusion and in the dilute urine. This active salt uptake requires energy but is essential for maintaining proper internal solute concentrations. The combination of high urine production and active salt uptake allows freshwater fish to thrive in environments that would otherwise cause osmotic stress.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which factor does NOT affect the rate of osmosis?",
            options: [
                "A) Surface area of the membrane",
                "B) Water potential gradient",
                "C) Membrane thickness",
                "D) Temperature of the solution"
            ],
            correct: 3,
            difficulty: "hard",
            explanation: "While temperature can affect the rate of diffusion for small molecules, it has relatively little direct effect on the rate of osmosis. Osmosis is primarily driven by the water potential gradient (the difference in water potential between two solutions), which is the fundamental driving force. The rate of osmosis is directly proportional to this gradient—the steeper the gradient, the faster water moves. Surface area of the membrane is also critical: larger surface area provides more pathways for water molecules to cross, increasing the total flux rate (Fick's law of diffusion applies: flux ∝ surface area × gradient / distance). Membrane thickness affects the rate because water must travel through the membrane; thicker membranes provide more resistance, slowing osmosis. However, temperature's effect on osmosis is minimal because the membrane itself, not just the water molecules, is the rate-limiting factor. Temperature increases the kinetic energy of water molecules, which could theoretically increase osmosis slightly, but this effect is negligible compared to the primary drivers of water potential gradient, surface area, and membrane permeability properties.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "If a plant cell with Ψ = -0.5 MPa is placed in a solution with Ψ = -0.3 MPa, water will:",
            options: [
                "A) Enter the cell",
                "B) Leave the cell",
                "C) Not move at all",
                "D) Move in both directions equally"
            ],
            correct: 0,
            difficulty: "hard",
            explanation: "Water moves from regions of higher water potential to regions of lower water potential, following the water potential gradient. In this case, the solution has a water potential of -0.3 MPa, while the plant cell has a water potential of -0.5 MPa. Since -0.3 MPa is greater (less negative) than -0.5 MPa, water will flow from the solution into the cell. The total water potential is calculated as Ψ = Ψs + Ψp, where negative values indicate lower water potential. As water enters the cell, the cell's water potential will increase, moving toward equilibrium with the solution. This demonstrates the fundamental principle of osmosis: water always moves from areas of higher water potential (lower solute concentration or higher pressure) to areas of lower water potential (higher solute concentration or lower pressure).",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The solute potential of a 0.1 M sucrose solution is approximately:",
            options: [
                "A) -0.24 MPa",
                "B) 0 MPa",
                "C) +0.24 MPa",
                "D) -0.1 MPa"
            ],
            correct: 0,
            difficulty: "hard",
            explanation: "Solute potential is calculated using the formula Ψs = -iCRT, where i is the ionization constant (also called the van't Hoff factor), C is the molar concentration, R is the gas constant (0.00831 L·MPa·mol⁻¹·K⁻¹), and T is the absolute temperature in Kelvin. For sucrose, a non-electrolyte that does not dissociate in solution, i = 1. At standard room temperature (approximately 298 K or 25°C), a 0.1 M sucrose solution has a solute potential of approximately -0.24 MPa. This calculation assumes ideal behavior, though real solutions may show slight deviations. The negative sign indicates that dissolved solutes reduce the free energy of water molecules, making the solution less likely to lose water than pure water. This mathematical relationship is fundamental to understanding osmotic phenomena in biological systems.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Turgor pressure in plant cells is maintained by:",
            options: [
                "A) The cell wall resisting expansion",
                "B) Active transport of water out",
                "C) Passive diffusion of solutes",
                "D) The absence of a vacuole"
            ],
            correct: 0,
            difficulty: "medium",
            explanation: "Turgor pressure is maintained through a dynamic interaction between osmotic water entry and the rigid cell wall's resistance to expansion. When a plant cell is placed in a hypotonic solution, water enters by osmosis due to the concentration gradient. As water enters, the cell begins to expand, but the rigid cell wall—composed primarily of cellulose microfibrils—provides structural resistance that prevents unlimited expansion. This resistance from the cell wall creates a counter-pressure that pushes back against the expanding protoplast, resulting in turgor pressure. The cell wall's rigidity is essential: without it, plant cells would burst like animal cells in hypotonic solutions. The large central vacuole contributes to turgor pressure by occupying most of the cell volume and accumulating solutes, which creates the osmotic gradient necessary for water entry. Turgor pressure provides structural support to non-woody plant tissues and is critical for processes like cell elongation, stomatal opening, and overall plant rigidity.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "A cell that loses water and shrinks is placed in what type of solution?",
            options: [
                "A) Hypotonic",
                "B) Hypertonic",
                "C) Isotonic",
                "D) Hypotonic or isotonic"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "A cell that loses water and shrinks must be in a hypertonic solution, where the solute concentration outside the cell is higher than inside the cell. This creates a water potential gradient that drives water out of the cell by osmosis. In a hypertonic environment, water molecules move from the area of higher water potential (inside the cell, where solute concentration is lower) to the area of lower water potential (the hypertonic solution, where solute concentration is higher). As water leaves, the cell volume decreases, causing it to shrink. In animal cells, this process is called crenation, resulting in a wrinkled appearance. In plant cells, water loss leads to plasmolysis, where the plasma membrane pulls away from the cell wall. This is in contrast to hypotonic solutions, where cells swell as water enters, or isotonic solutions, where there is no net water movement and cells maintain their size. Hypertonic environments are challenging for cells and require osmoregulatory mechanisms to prevent dehydration.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Contractile vacuoles in freshwater protists function to:",
            options: [
                "A) Store excess nutrients",
                "B) Expel excess water",
                "C) Generate energy",
                "D) Aid in reproduction"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Contractile vacuoles are osmoregulatory organelles found in freshwater protists like Paramecium and Amoeba that function to expel excess water from the cell. Freshwater environments are hypotonic relative to the protist's cytoplasm, meaning water continuously enters the cell by osmosis across the plasma membrane. Without a mechanism to remove this excess water, the cell would swell and potentially lyse. Contractile vacuoles solve this problem by actively collecting excess water from the cytoplasm and then contracting to expel it through a pore to the external environment. This process requires ATP and involves the fusion of vesicles containing excess water with the contractile vacuole. The vacuole fills with water (diastole), then contracts rhythmically (systole) to expel the water, working continuously to maintain osmotic balance. Some protists have multiple contractile vacuoles with complex radial canals that collect water from different regions of the cytoplasm. This is an excellent example of active osmoregulation in single-celled organisms that lack the sophisticated kidney systems of multicellular animals.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which would have the most negative solute potential?",
            options: [
                "A) Pure water",
                "B) 0.1 M NaCl solution",
                "C) 0.5 M glucose solution",
                "D) 1.0 M NaCl solution"
            ],
            correct: 3,
            difficulty: "hard",
            explanation: "Solute potential becomes increasingly negative as solute concentration increases, following the relationship Ψs = -iCRT. The most concentrated solution with the highest number of particles will have the most negative solute potential. A 1.0 M NaCl solution has the most negative solute potential because NaCl is an electrolyte that dissociates completely in water into Na⁺ and Cl⁻ ions, giving it an ionization constant (i) of 2. This means each mole of NaCl produces 2 moles of dissolved particles. At 1.0 M concentration with i=2, the effective osmotic concentration is 2.0 osmoles, resulting in approximately -4.96 MPa at 25°C (using Ψs = -iCRT with R = 0.00831). In contrast, 0.5 M glucose (non-electrolyte, i=1) has only -1.24 MPa, and 0.1 M NaCl has approximately -0.496 MPa. Pure water has Ψs = 0 MPa by definition. The dissociation of electrolytes is crucial in biological systems, as it explains why even low concentrations of salts can significantly affect water potential and osmotic behavior.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "In an isotonic solution, animal cells will:",
            options: [
                "A) Shrink",
                "B) Swell",
                "C) Maintain their size",
                "D) Lyse"
            ],
            correct: 2,
            difficulty: "easy",
            explanation: "In an isotonic solution, the solute concentration outside the cell equals the solute concentration inside the cell, creating equilibrium conditions. This means the water potential inside and outside the cell are equal (Ψinside = Ψoutside), so there is no water potential gradient to drive net water movement. Water molecules are still moving across the membrane in both directions by diffusion, but the rates of entry and exit are equal, resulting in no net water movement. Therefore, the cell maintains its normal size and shape. This is why isotonic solutions, such as 0.9% NaCl (physiological saline), are used in medical applications like intravenous fluids—they maintain cell volume without causing swelling or shrinkage. In contrast, hypotonic solutions cause cells to swell as water enters, potentially leading to lysis in animal cells. Hypertonic solutions cause cells to shrink (crenation) as water exits. The ability to maintain osmotic balance is critical for cell function, as changes in cell volume can disrupt cellular processes and membrane integrity.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The movement of water through aquaporins is an example of:",
            options: [
                "A) Simple diffusion",
                "B) Facilitated diffusion",
                "C) Active transport",
                "D) Bulk transport"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Aquaporins are specialized channel proteins that facilitate the passive diffusion of water molecules across biological membranes, making this a clear example of facilitated diffusion. While water can diffuse slowly through the lipid bilayer by simple diffusion, aquaporins dramatically increase the rate of water transport by providing hydrophilic channels through the hydrophobic membrane interior. These channel proteins, discovered by Peter Agre (who won the 2003 Nobel Prize in Chemistry for this work), form tetrameric structures with each subunit containing a narrow pore that allows rapid passage of water molecules in single file. The movement through aquaporins is passive—it does not require ATP and follows the water potential gradient, just like simple diffusion. However, because it requires specific protein channels and shows selective permeability (allowing water but excluding ions and other solutes), it is classified as facilitated diffusion rather than simple diffusion. Aquaporins are found in many cell types and are particularly important in cells that need rapid water transport, such as kidney cells, plant root cells, and red blood cells.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which organism would require the most sophisticated osmoregulation system?",
            options: [
                "A) Marine fish",
                "B) Freshwater fish",
                "C) Terrestrial mammal",
                "D) Marine mammal"
            ],
            correct: 2,
            difficulty: "hard",
            explanation: "Terrestrial mammals require the most sophisticated osmoregulation systems because they face the greatest challenges in maintaining water and salt balance. Unlike aquatic organisms that live in relatively stable osmotic environments, terrestrial mammals constantly lose water through multiple routes: evaporation from the respiratory system during breathing, sweating for thermoregulation, and urine production. Additionally, they gain salts through their diet and can lose both water and salts through feces. Terrestrial mammals have evolved highly complex kidneys with multiple regulatory mechanisms, including the ability to produce urine that ranges from highly dilute to extremely concentrated (up to 4-5 times more concentrated than plasma in some species). They also have sophisticated hormonal control systems (antidiuretic hormone, aldosterone, atrial natriuretic peptide) that fine-tune water and salt balance. Behavioral adaptations, such as seeking water sources, avoiding heat, and dietary preferences, also play crucial roles. Marine fish face salt accumulation challenges, freshwater fish face water gain, and marine mammals (which evolved from terrestrial ancestors) have retained sophisticated kidney function, but terrestrial mammals' ability to survive in environments ranging from deserts to humid tropics demonstrates their remarkable osmoregulatory sophistication.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "When calculating water potential, what is the relationship between Ψs and Ψp?",
            options: [
                "A) They are always equal",
                "B) They are independent and additive",
                "C) Ψp is always greater than Ψs",
                "D) Ψs is always greater than Ψp"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Solute potential (Ψs) and pressure potential (Ψp) are independent components of water potential that are algebraically additive, meaning the total water potential is the sum of these two components: Ψ = Ψs + Ψp. These components are physically independent—solute potential depends on the concentration of dissolved solutes, while pressure potential depends on physical pressure applied to the system. They can vary independently: a solution can have any combination of Ψs and Ψp values. For example, a cell could have Ψs = -0.8 MPa and Ψp = +0.5 MPa, resulting in Ψ = -0.3 MPa. This independence is crucial for understanding plant water relations. In plant cells, negative solute potential (from dissolved solutes) creates an osmotic gradient that draws in water, while positive pressure potential (from turgor pressure against the cell wall) can offset this, allowing cells to maintain water potential equilibrium. In open systems like beakers, Ψp = 0, so Ψ = Ψs. The additive nature of these components allows plants to balance osmotic forces with mechanical forces, maintaining structural integrity while still allowing water movement.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "A wilted plant cell has:",
            options: [
                "A) High turgor pressure and positive pressure potential",
                "B) Low turgor pressure and negative pressure potential",
                "C) High turgor pressure and negative pressure potential",
                "D) Low turgor pressure and positive pressure potential"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "A wilted plant cell has lost water through transpiration or exposure to a hypertonic environment, resulting in low turgor pressure. When a plant cell loses water, the protoplast shrinks and pulls away from the cell wall (in severe cases, this is plasmolysis). As water exits, the volume of the cell contents decreases, reducing the pressure exerted against the cell wall. Consequently, turgor pressure drops, and pressure potential (Ψp) decreases. In a fully wilted cell, pressure potential can become zero or even slightly negative if the cell wall is under tension. The negative pressure potential in severely wilted cells can actually help draw water back into the cell when it becomes available, as water will move from higher water potential (the soil or solution) to lower water potential (the cell with negative Ψp). This is why wilting is reversible when plants are rewatered—the negative pressure potential helps restore turgor. In contrast, a turgid cell has high turgor pressure and positive pressure potential, which provides structural support to the plant but reduces the driving force for additional water uptake.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which process allows Paramecium to survive in freshwater?",
            options: [
                "A) Active transport of water in",
                "B) Contractile vacuole expelling water",
                "C) Increased solute concentration inside",
                "D) Impermeable membrane to water"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Paramecium survives in freshwater through the action of contractile vacuoles that actively expel excess water. Freshwater is hypotonic relative to Paramecium's cytoplasm, creating a constant osmotic gradient that causes water to continuously enter the cell by osmosis. Without a mechanism to remove this water, the cell would swell and burst (lyse). Contractile vacuoles solve this problem by collecting excess water from the cytoplasm and then contracting rhythmically to expel it through a pore to the external environment. This process requires ATP hydrolysis to actively pump water out against the osmotic gradient, making it an energy-demanding but essential process. The contractile vacuole system in Paramecium is quite sophisticated, with radial canals that collect water from different regions of the cytoplasm and feed it into the central vacuole. The vacuole fills (diastole), then contracts (systole) to expel water, repeating this cycle continuously to maintain osmotic balance. Some Paramecium species have multiple contractile vacuoles positioned at specific locations within the cell. This active osmoregulation is critical for single-celled freshwater protists that lack the complex organ systems of multicellular organisms.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The water potential equation Ψ = Ψs + Ψp applies to:",
            options: [
                "A) Only plant cells",
                "B) Only animal cells",
                "C) All cells",
                "D) Only cells in solutions"
            ],
            correct: 0,
            difficulty: "hard",
            explanation: "The complete water potential equation Ψ = Ψs + Ψp is primarily applicable to plant cells because they are the only cells that develop significant pressure potential under normal physiological conditions. Plant cells have rigid cell walls composed of cellulose and other structural polysaccharides that can resist expansion and generate turgor pressure. When water enters a plant cell by osmosis, the cell expands against the cell wall, and the wall pushes back, creating positive pressure potential (Ψp > 0). This pressure potential is a measurable and significant component of plant water potential. Animal cells, in contrast, lack cell walls and are much more flexible. While animal cells can experience slight internal pressure, this pressure is not significant enough to affect water potential calculations under normal conditions. In most animal cell situations, Ψp ≈ 0, so water potential is essentially equal to solute potential (Ψ ≈ Ψs). The equation can theoretically apply to any system where pressure develops, such as closed containers or specific animal structures like bladders, but in practice, it is most relevant and commonly used for plant cells where both components significantly contribute to total water potential and where the balance between Ψs and Ψp is crucial for understanding water movement in plants.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "In a root hair cell, water moves from soil to cytoplasm primarily by:",
            options: [
                "A) Active transport",
                "B) Osmosis",
                "C) Facilitated diffusion",
                "D) Bulk flow"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Water moves from soil into root hair cells primarily by osmosis, driven by the water potential gradient. Soil water typically has a high water potential (close to 0 MPa for pure water, or slightly negative if dissolved solutes are present), while the root hair cell cytoplasm contains dissolved solutes that create a negative solute potential. This gradient causes water to flow passively into the cell by osmosis across the selectively permeable plasma membrane. Root hair cells are specialized extensions of epidermal cells that dramatically increase the surface area for water and nutrient uptake. The initial entry of water into root hairs is purely osmotic—no energy is directly expended for water movement itself. However, plants indirectly invest energy in maintaining the solute concentration within root cells that creates the osmotic gradient. Once inside root cells, water can move through the plant by both osmosis (between cells) and bulk flow (through xylem vessels), but the initial entry from soil is osmotic. This process is essential for plant water uptake and ultimately drives transpiration, where water is pulled through the plant from roots to leaves.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which scenario would result in the fastest rate of osmosis?",
            options: [
                "A) Large water potential gradient, small surface area",
                "B) Small water potential gradient, large surface area",
                "C) Large water potential gradient, large surface area",
                "D) Small water potential gradient, small surface area"
            ],
            correct: 2,
            difficulty: "hard",
            explanation: "The rate of osmosis is maximized when both the water potential gradient and surface area are large. According to Fick's law of diffusion (which applies to osmosis), the flux (rate of movement) is directly proportional to both the concentration gradient (or in this case, water potential gradient) and the surface area available for diffusion: Flux = -D × A × (ΔC/Δx), where D is the diffusion coefficient, A is surface area, and ΔC/Δx is the concentration gradient. A large water potential gradient provides a strong driving force, pushing more water molecules per unit time across the membrane. Simultaneously, a large surface area provides more pathways for water molecules to cross, increasing the total number of molecules that can move simultaneously. These factors are multiplicative, not additive, so doubling both the gradient and surface area quadruples the flux rate. This principle explains why plants have evolved structures like root hairs (increasing surface area) and why maintaining steep water potential gradients (through active solute accumulation) is crucial for efficient water uptake. In contrast, a small gradient or small surface area limits the rate, and having both small creates the slowest possible rate.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "A plant cell placed in distilled water will initially:",
            options: [
                "A) Lose water and plasmolyze",
                "B) Gain water and become turgid",
                "C) Remain unchanged",
                "D) Explode immediately"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "A plant cell placed in distilled water will gain water and become turgid. Distilled water has the highest possible water potential (Ψ = 0 MPa) since it contains no dissolved solutes. The plant cell, however, has dissolved solutes in its cytoplasm and vacuole that create a negative solute potential (Ψs < 0). This water potential gradient drives water into the cell by osmosis. As water enters, the cell expands and the protoplast pushes against the rigid cell wall. The cell wall resists unlimited expansion and pushes back, creating turgor pressure and positive pressure potential (Ψp > 0). The cell will continue to take in water until equilibrium is reached, when the positive pressure potential balances the negative solute potential, resulting in full turgor with Ψ = 0 MPa inside the cell. At this point, the cell is maximally swollen but protected from bursting by its cell wall. This is in contrast to animal cells in distilled water, which would swell and lyse due to the absence of a cell wall. The ability of plant cells to become turgid provides structural support to non-woody plant tissues and is essential for many plant functions, including cell elongation and stomatal opening.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The ability of an animal cell to maintain its shape depends on:",
            options: [
                "A) Cell wall",
                "B) Turgor pressure",
                "C) Osmotic balance with environment",
                "D) Active transport only"
            ],
            correct: 2,
            difficulty: "medium",
            explanation: "Animal cells maintain their shape primarily through osmotic balance with their environment, since they lack the rigid cell walls that provide structural support in plant cells. Animal cells must exist in isotonic or near-isotonic environments to maintain normal volume and shape. When placed in isotonic solutions, there is no net water movement, and cells maintain their size. The cytoskeleton (composed of microfilaments, intermediate filaments, and microtubules) provides internal structural support, but osmotic balance is fundamental—without it, cells will either shrink or swell, disrupting their shape and potentially causing cell death. Animal cells actively regulate their internal solute concentrations through ion pumps and channels to maintain osmotic balance. In tissues, cells are bathed in extracellular fluid that must be isotonic to prevent osmotic stress. This is why medical solutions like Ringer's solution or physiological saline (0.9% NaCl) are used—they match the osmolarity of body fluids to prevent cell shape changes. Some animals have developed adaptations like the contractile vacuoles in freshwater protists or sophisticated kidney systems in vertebrates to maintain this critical balance. In contrast, plant cells rely on both turgor pressure (from osmotic water uptake) and cell walls for shape maintenance.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "What happens to solute potential as solute concentration increases?",
            options: [
                "A) It becomes more positive",
                "B) It becomes more negative",
                "C) It stays the same",
                "D) It becomes zero"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Solute potential (Ψs), also known as osmotic potential, becomes increasingly negative as solute concentration increases. This relationship is described by the formula Ψs = -iCRT, where i is the ionization constant, C is concentration, R is the gas constant, and T is temperature. The negative sign in the equation ensures that solute potential is always zero or negative—pure water has Ψs = 0, and any dissolved solute makes Ψs negative. As more solutes are added, the value becomes more negative because dissolved solutes reduce the free energy of water molecules by interfering with their movement and decreasing their tendency to move to other locations. This is why concentrated solutions have lower water potential than dilute solutions, and why water always flows from areas of higher water potential (less negative) to lower water potential (more negative) during osmosis. The relationship is linear for ideal solutions, meaning doubling the concentration approximately doubles the magnitude of the negative solute potential. This principle is fundamental to understanding osmotic phenomena: cells with high internal solute concentrations have more negative solute potentials, creating gradients that drive water entry, while placing cells in solutions with higher solute concentrations (more negative Ψs) causes water to exit.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which adaptation helps desert plants conserve water?",
            options: [
                "A) Large surface area leaves",
                "B) Stomata always open",
                "C) Thick waxy cuticle",
                "D) High transpiration rates"
            ],
            correct: 2,
            difficulty: "medium",
            explanation: "Desert plants have evolved thick waxy cuticles on their leaves and stems as a key adaptation to conserve water in arid environments. The cuticle is a waterproof layer composed of cutin (a polyester polymer) and waxes (long-chain fatty acids) that covers the outer surface of leaves and stems, forming a barrier that prevents water loss through evaporation. This waxy layer is particularly important because most water loss in plants occurs through transpiration from the leaf surface. Desert plants often have cuticles that are several times thicker than those of mesophytic (moderate water) plants, dramatically reducing water loss. Additionally, desert plants often have other water-conserving features that work together with thick cuticles: reduced leaf surface area (smaller leaves or spines), CAM or C4 photosynthesis that reduces water loss during gas exchange, deep root systems to access groundwater, and the ability to close stomata during the hottest parts of the day. Large surface area leaves would increase water loss, always-open stomata would allow excessive transpiration, and high transpiration rates would be detrimental in water-scarce environments. The thick cuticle is just one component of a suite of adaptations that enable desert plants to thrive in environments where water availability is the primary limiting factor.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "In the kidney, the loop of Henle creates a concentration gradient by:",
            options: [
                "A) Active transport of water",
                "B) Countercurrent multiplication",
                "C) Simple diffusion only",
                "D) Endocytosis"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "The loop of Henle creates a concentration gradient in the kidney medulla through a sophisticated process called countercurrent multiplication. This mechanism involves the descending and ascending limbs of the loop of Henle working together to establish and maintain an osmotic gradient that increases from the cortex to the inner medulla. In the thick ascending limb, NaCl is actively transported out of the tubular fluid (using the Na⁺-K⁺-2Cl⁻ cotransporter powered by the Na⁺-K⁺ ATPase), making the surrounding medullary interstitial fluid hypertonic. This active transport does not directly move water—water cannot be actively transported. Instead, the removal of solutes from the ascending limb (which is impermeable to water) creates a concentration gradient. The descending limb is highly permeable to water but not to solutes, so as filtrate flows down the descending limb, water exits by osmosis into the hypertonic medulla, concentrating the filtrate. When this concentrated filtrate reaches the ascending limb, more salt is actively removed, further concentrating the medullary interstitium. This countercurrent flow (descending and ascending flow in opposite directions) multiplies the gradient, allowing the medulla to become extremely hypertonic—up to 1200 mOsm/L in humans. This gradient is essential for the collecting duct to produce concentrated urine, allowing mammals to conserve water by excreting wastes in minimal water volume.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "If Ψs = -0.8 MPa and Ψp = +0.3 MPa, the total water potential (Ψ) is:",
            options: [
                "A) -1.1 MPa",
                "B) -0.5 MPa",
                "C) +0.5 MPa",
                "D) +1.1 MPa"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Water potential is calculated using the formula Ψ = Ψs + Ψp, where the components are algebraically added. In this case, Ψ = -0.8 MPa + 0.3 MPa = -0.5 MPa. It's important to note that we add these values, not subtract them, and we must pay attention to the signs. Solute potential (Ψs) is negative (-0.8 MPa) because dissolved solutes reduce water's free energy. Pressure potential (Ψp) is positive (+0.3 MPa) in this case, likely representing turgor pressure in a plant cell. When added together, the positive pressure potential partially offsets the negative solute potential, resulting in a total water potential of -0.5 MPa, which is less negative (higher) than the solute potential alone. This demonstrates how turgor pressure can help plant cells maintain higher water potential, reducing the driving force for water entry and helping to achieve equilibrium. If pressure potential were zero (as in open systems), the water potential would be -0.8 MPa. The ability to have positive pressure potential is unique to plant cells with rigid cell walls and is crucial for maintaining cell structure while still allowing some water potential gradient for water movement when needed.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Water potential is measured in:",
            options: [
                "A) Pascals",
                "B) Megapascals (MPa)",
                "C) Joules",
                "D) Liters"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "Water potential is measured in units of pressure, and in plant physiology, it is most commonly expressed in megapascals (MPa), though it can also be measured in bars (1 bar = 0.1 MPa) or pascals (1 MPa = 1,000,000 Pa). A megapascal equals one million pascals, where a pascal is defined as one newton of force per square meter. The pressure units reflect that water potential is essentially a measure of the potential energy of water, which can be expressed as pressure. Water potential has dimensions of energy per volume, which simplifies to units of pressure (force per area). In biological systems, water potential values typically range from 0 MPa (pure water at atmospheric pressure) to approximately -2.5 MPa (very concentrated solutions). Plant physiologists prefer MPa over smaller units because typical water potential values in plants are on the order of megapascals—for example, a moderately drought-stressed leaf might have Ψ = -1.5 MPa, which is more convenient than expressing it as -1,500,000 Pa. Joules are units of energy, not pressure, and liters are units of volume, so neither is appropriate for measuring water potential.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        }
    ],

    diffusion: [
        {
            question: "What type of membrane protein is involved in facilitated diffusion?",
            options: [
                "A) Peripheral proteins",
                "B) Integral channel or carrier proteins",
                "C) Glycoproteins",
                "D) Enzymatic proteins"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Facilitated diffusion relies on integral membrane proteins—specifically channel proteins or carrier proteins—that span the lipid bilayer to transport substances across membranes. Channel proteins form hydrophilic pores through which molecules can diffuse rapidly down their concentration gradient, while carrier proteins bind to specific substrates and undergo conformational changes to transport them across. Both types are integral proteins, meaning they are embedded within the hydrophobic core of the membrane with hydrophilic regions exposed on both sides. Unlike peripheral proteins that attach to the membrane surface, integral proteins have hydrophobic regions that anchor them within the bilayer. These transport proteins enable substances that cannot diffuse directly through the hydrophobic lipid bilayer—such as polar molecules, ions, and large molecules—to cross membranes efficiently. The key feature is that facilitated diffusion, like simple diffusion, is passive and does not require ATP; it simply provides a pathway for molecules to move down their concentration gradient more quickly or efficiently than they could through simple diffusion.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Facilitated diffusion differs from simple diffusion because it:",
            options: [
                "A) Requires energy",
                "B) Moves substances against their concentration gradient",
                "C) Uses transport proteins",
                "D) Only works for nonpolar molecules"
            ],
            correct: 2,
            difficulty: "easy",
            explanation: "Facilitated diffusion differs from simple diffusion primarily in that it uses specific transport proteins (channels or carriers) to assist polar or charged molecules in crossing the membrane. Simple diffusion occurs directly through the lipid bilayer for small nonpolar molecules like oxygen and carbon dioxide, which can dissolve in the hydrophobic membrane interior. However, polar molecules (like glucose, amino acids, and water) and charged ions (like Na⁺, K⁺, Cl⁻) cannot pass through the hydrophobic lipid bilayer easily because they are hydrophilic and repelled by the nonpolar fatty acid tails. Facilitated diffusion solves this problem by providing hydrophilic pathways (channel proteins) or binding sites (carrier proteins) that allow these molecules to cross. Despite using proteins, facilitated diffusion is still passive—it does not require energy and molecules move down their concentration gradient, just like simple diffusion. The proteins simply facilitate (make easier) the movement by providing an alternative route. This distinction is important because it separates passive facilitated diffusion from active transport, which uses proteins AND requires energy to move substances against gradients.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which molecule would most likely use facilitated diffusion to enter a cell?",
            options: [
                "A) Oxygen",
                "B) Carbon dioxide",
                "C) Glucose",
                "D) Small lipid-soluble molecules"
            ],
            correct: 2,
            difficulty: "easy",
            explanation: "Glucose is a large, polar molecule that requires facilitated diffusion through carrier proteins to enter cells efficiently. Glucose cannot diffuse directly through the lipid bilayer because it is hydrophilic—its hydroxyl (-OH) groups form hydrogen bonds with water, making it polar. The plasma membrane's hydrophobic interior (composed of fatty acid tails) repels polar molecules like glucose, creating a significant barrier to simple diffusion. Cells have evolved glucose transporters (GLUT proteins) that are carrier proteins specialized for glucose transport. These proteins bind glucose on one side of the membrane, undergo a conformational change, and release glucose on the other side, greatly increasing the rate of glucose entry compared to what would occur by simple diffusion. In contrast, oxygen (O₂) and carbon dioxide (CO₂) are small, nonpolar molecules that can diffuse directly through the lipid bilayer without assistance—they dissolve in the hydrophobic membrane interior and pass through easily. Small lipid-soluble molecules also diffuse directly through membranes. Glucose transport via facilitated diffusion is essential for cellular metabolism, as glucose is a primary energy source for many cells.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Membrane permeability is highest for:",
            options: [
                "A) Large polar molecules",
                "B) Small nonpolar molecules",
                "C) Ions",
                "D) Large charged molecules"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "Membrane permeability is highest for small nonpolar molecules because they can diffuse directly through the lipid bilayer without requiring transport proteins or energy expenditure. The lipid bilayer's hydrophobic core (composed of fatty acid tails) is readily permeable to nonpolar substances, which can dissolve in this hydrophobic environment. Small size is also important—smaller molecules diffuse more rapidly than larger ones through membranes. Molecules like oxygen (O₂), carbon dioxide (CO₂), and nitrogen (N₂) are small, nonpolar, and highly permeable. Lipid-soluble molecules like steroid hormones and some drugs are also highly permeable because their nonpolar nature allows them to dissolve in and pass through the membrane interior. In contrast, large polar molecules cannot pass through the hydrophobic core because their hydrophilic regions are repelled by the nonpolar fatty acid tails. Ions are charged and thus hydrophilic, making them impermeable to the lipid bilayer—they require channel or carrier proteins. Large charged molecules are even less permeable due to both size and charge barriers. This permeability gradient explains why cells need specialized transport mechanisms for polar and charged substances while small nonpolar molecules can enter and exit freely.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "A gated channel protein opens in response to:",
            options: [
                "A) Changes in membrane potential",
                "B) Binding of specific molecules",
                "C) Mechanical stress",
                "D) All of the above"
            ],
            correct: 3,
            difficulty: "medium",
            explanation: "Gated channel proteins can open in response to multiple types of stimuli, allowing cells to regulate ion and molecule flow across membranes in response to different signals. Voltage-gated channels respond to changes in membrane potential (electrical signals)—when the membrane potential reaches a threshold, the channel opens, allowing ions to flow. These are crucial for nerve impulses and muscle contraction. Ligand-gated channels open when specific signaling molecules (ligands) bind to receptor sites on the channel protein, such as neurotransmitters binding to postsynaptic receptors. Mechanical-gated channels open in response to physical forces like pressure, stretch, or tension—these are important in sensory systems (hearing, touch, balance) and in responding to pressure changes. Some channels are gated by multiple mechanisms. The ability to gate channels provides precise control over membrane permeability, allowing cells to respond to electrical, chemical, and mechanical signals. In contrast, leak channels (or non-gated channels) are always open and allow continuous passive movement of ions. Gating is a sophisticated mechanism that enables rapid, reversible changes in membrane permeability essential for cellular communication, excitability, and sensory transduction.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The rate of facilitated diffusion reaches a maximum (saturates) because:",
            options: [
                "A) The concentration gradient reverses",
                "B) All transport proteins are in use",
                "C) The membrane becomes impermeable",
                "D) Energy is depleted"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Facilitated diffusion shows saturation kinetics, meaning the transport rate reaches a maximum (plateaus) at high substrate concentrations because all available transport proteins become occupied. Unlike simple diffusion, where rate increases linearly with concentration gradient, facilitated diffusion exhibits Michaelis-Menten kinetics similar to enzyme catalysis. At low substrate concentrations, transport rate increases with concentration because more proteins bind substrate and transport occurs. However, as concentration increases, more and more carrier proteins become bound to substrate molecules. Once all transport proteins are simultaneously bound to substrate and engaged in transport, the system reaches maximum capacity—every available protein is working at full speed. Further increases in substrate concentration cannot increase the transport rate because there are no additional unbound transport proteins available. This saturation point is called Vmax (maximum velocity). The concentration at which transport rate is half-maximal is called Km. This behavior distinguishes facilitated diffusion from simple diffusion, which has no maximum rate and continues to increase linearly with concentration gradient. Saturation kinetics is a hallmark of carrier-mediated transport and is important for cellular regulation, as it provides a maximum rate that cannot be exceeded even with very high substrate concentrations.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Aquaporins are channel proteins that specifically transport:",
            options: [
                "A) Ions",
                "B) Glucose",
                "C) Water",
                "D) Amino acids"
            ],
            correct: 2,
            difficulty: "easy",
            explanation: "Aquaporins are highly specialized channel proteins that selectively transport water molecules across membranes, dramatically increasing the rate of water transport compared to simple diffusion through the lipid bilayer. Discovered by Peter Agre (Nobel Prize in Chemistry, 2003), aquaporins form tetrameric structures with each subunit containing a narrow pore that allows rapid passage of water molecules in single file. These channels are remarkably selective—they allow water molecules to pass but exclude ions and other solutes. This selectivity is achieved by the precise size and charge characteristics of the pore, which is narrow enough (about 2.8 Å) to accommodate water but not larger molecules, and lined with amino acid residues that repel charged particles. Aquaporins are found in many cell types where rapid water movement is essential: kidney cells (for urine concentration), plant root cells (for water uptake), red blood cells, and lung cells. They can increase membrane permeability to water by 10 to 100-fold compared to membranes without aquaporins. The discovery of aquaporins solved the puzzle of how cells could move water so rapidly when simple diffusion through lipid bilayers is relatively slow. Some aquaporins are regulated by hormones (like antidiuretic hormone) that control their insertion into membranes, allowing cells to modulate water permeability in response to physiological needs.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which statement about membrane transport is correct?",
            options: [
                "A) All passive transport requires ATP",
                "B) Active transport moves substances down their gradient",
                "C) Facilitated diffusion is a type of passive transport",
                "D) Simple diffusion requires carrier proteins"
            ],
            correct: 2,
            difficulty: "medium",
            explanation: "Facilitated diffusion is indeed a type of passive transport because it moves substances down their concentration gradient without requiring ATP or other energy sources. Passive transport includes both simple diffusion (through the lipid bilayer) and facilitated diffusion (through transport proteins), and both occur spontaneously when there is a concentration gradient, driven solely by the kinetic energy of molecules. The key distinction is that facilitated diffusion uses proteins to assist the process, but the driving force is still the concentration gradient—molecules move from high concentration to low concentration. In contrast, active transport uses ATP or other energy sources to move substances against their concentration gradient (from low to high concentration), which requires energy input. Simple diffusion does not require carrier proteins; it occurs directly through the lipid bilayer for small nonpolar molecules. Facilitated diffusion uses carrier or channel proteins, but this does not make it active transport—it simply provides a pathway for passive movement. This classification is important for understanding cellular energetics and how cells can move substances efficiently while conserving energy when gradients exist, versus when they must expend energy to create gradients.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Ion channels differ from carrier proteins in that they:",
            options: [
                "A) Use energy to transport ions",
                "B) Move ions much faster",
                "C) Can only move ions against their gradient",
                "D) Are always open"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Ion channels transport ions much faster than carrier proteins because they provide an open pore through which ions can flow rapidly down their electrochemical gradient, rather than requiring binding and conformational changes. When an ion channel is open, it forms a continuous hydrophilic pathway that allows millions of ions to pass per second, following the concentration and electrical gradients. This rapid flow occurs because ions simply move through the open pore by diffusion—there's no binding step or shape change required. In contrast, carrier proteins must bind each substrate molecule, undergo a conformational change to move the substrate across the membrane, and then release it on the other side. This process is much slower, typically transporting hundreds to thousands of molecules per second. Both channel and carrier transport can be passive (facilitated diffusion) or active (using energy), but channels can achieve much higher transport rates. Some channels are always open (leak channels), while others are gated (voltage-gated, ligand-gated, or mechanically-gated). Carrier proteins can move substances in either direction depending on the gradient, not just against it. The speed advantage of channels is crucial for rapid cellular processes like nerve impulses, where millisecond-scale changes in ion flow are essential.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Membrane permeability to a particular solute depends on:",
            options: [
                "A) Size of the solute",
                "B) Polarity/charge of the solute",
                "C) Presence of appropriate transport proteins",
                "D) All of the above"
            ],
            correct: 3,
            difficulty: "easy",
            explanation: "Membrane permeability to a solute depends on multiple factors that determine whether and how readily a substance can cross the membrane. The size of the solute matters because larger molecules have more difficulty passing through membranes, even if they are nonpolar. Small nonpolar molecules like O₂ can diffuse rapidly, while large nonpolar molecules diffuse more slowly. Polarity and charge are critical—nonpolar molecules can dissolve in the hydrophobic lipid bilayer and diffuse through, while polar and charged molecules are repelled by the hydrophobic interior and cannot pass easily. Ions, in particular, are completely impermeable to the lipid bilayer due to their charge, even though they may be small. The presence of appropriate transport proteins dramatically affects permeability: even large, polar, or charged molecules can cross efficiently if specific channel or carrier proteins exist for them. For example, glucose is polar and would have very low permeability through the lipid bilayer alone, but GLUT carrier proteins make glucose highly permeable to cells. The permeability equation reflects these factors: P = (permeability coefficient) × (surface area) × (concentration gradient), where the permeability coefficient depends on the solute's size, polarity, charge, and the availability of transport proteins. Understanding these factors helps explain why different substances require different transport mechanisms.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "A carrier protein that transports glucose into a cell would be expected to:",
            options: [
                "A) Transport glucose in both directions equally",
                "B) Transport glucose only from high to low concentration",
                "C) Use ATP to transport glucose",
                "D) Change shape when binding glucose"
            ],
            correct: 3,
            difficulty: "medium",
            explanation: "Carrier proteins undergo conformational (shape) changes when they bind their substrate, which is the fundamental mechanism by which they transport molecules across membranes. When glucose binds to a GLUT carrier protein on one side of the membrane, the protein changes from an open-to-outside conformation to a closed conformation, then to an open-to-inside conformation, allowing glucose to be released into the cytoplasm. This shape change is powered by the binding energy of glucose itself—no ATP is required for this facilitated diffusion process. The conformational change is analogous to an enzyme-substrate complex formation and provides a way to move glucose through the hydrophobic membrane interior without exposing it directly to the lipids. Carrier proteins can transport in either direction depending on the concentration gradient, so they will transport glucose from high to low concentration (following the gradient), not against it. While some glucose transporters can move glucose in both directions, they always move it down the gradient—they don't transport equally in both directions unless the concentrations are equal. If a cell needs to transport glucose against a gradient (from low to high concentration), it would require a different type of transporter that uses ATP, such as the Na⁺-glucose symporter in intestinal cells that couples glucose uptake to sodium movement. The shape change mechanism is universal to all carrier proteins, whether they are passive or active transporters.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Saturation kinetics in facilitated diffusion occurs when:",
            options: [
                "A) The substrate concentration is very low",
                "B) All carrier proteins are occupied",
                "C) The membrane is impermeable",
                "D) Energy is unavailable"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Saturation kinetics in facilitated diffusion occurs when all available carrier proteins become simultaneously occupied with substrate molecules, causing the transport rate to reach its maximum (Vmax) and plateau. At low substrate concentrations, transport rate increases linearly with concentration because most carrier proteins are unbound and available. However, as substrate concentration rises, more and more carrier proteins bind substrate. Once every available carrier protein is bound and engaged in transport, the system reaches maximum capacity. Further increases in substrate concentration cannot increase transport rate because there are no additional unbound proteins available—they're all already working at full capacity. This creates a hyperbolic saturation curve similar to enzyme kinetics, described by the Michaelis-Menten equation: V = Vmax × [S] / (Km + [S]). This saturation behavior is a hallmark of carrier-mediated transport and distinguishes it from simple diffusion, which shows linear kinetics with no maximum rate. The number of transport proteins in the membrane determines Vmax, while the binding affinity between carrier and substrate determines Km (the substrate concentration at half-maximal velocity). This saturation mechanism provides cells with a maximum transport rate that cannot be exceeded, which is important for cellular regulation.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which type of transport protein shows Michaelis-Menten kinetics?",
            options: [
                "A) Channel proteins",
                "B) Carrier proteins",
                "C) Aquaporins",
                "D) Voltage-gated channels"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Carrier proteins exhibit Michaelis-Menten kinetics, showing saturation behavior with a hyperbolic relationship between substrate concentration and transport rate, similar to enzyme-catalyzed reactions. This occurs because carrier proteins have specific binding sites that must bind substrate before transport can occur, creating a rate-limiting step. At low concentrations, rate increases with concentration, but as concentration increases, more binding sites become occupied. When all binding sites are saturated, rate reaches Vmax and plateaus. The Michaelis-Menten equation (V = Vmax × [S] / (Km + [S])) describes this behavior, where Km represents the substrate concentration at half-maximal velocity and reflects binding affinity. In contrast, channel proteins (including aquaporins and voltage-gated channels) show linear kinetics—their transport rate increases linearly with concentration gradient without saturation, because channels don't require binding; ions simply flow through open pores. This kinetic difference reflects the fundamental mechanistic difference: carriers must bind and change shape (rate-limited by binding), while channels provide open pores (rate-limited only by diffusion). This distinction is important for understanding how cells regulate transport and why different mechanisms are used for different physiological needs.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "A ligand-gated channel opens when:",
            options: [
                "A) Voltage changes",
                "B) A specific molecule binds",
                "C) Mechanical pressure is applied",
                "D) ATP is hydrolyzed"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Ligand-gated channels open when a specific signaling molecule (called a ligand) binds to a receptor site on the channel protein, causing a conformational change that opens the pore. These channels are crucial for cellular communication, particularly in the nervous system. When a neurotransmitter (the ligand) binds to its receptor on the channel, it induces a structural change in the channel protein that transitions it from a closed to an open state, allowing ions to flow through. This ion flow creates an electrical signal (changes in membrane potential) that can trigger action potentials or other cellular responses. Different ligands bind to specific receptors—for example, acetylcholine binds to nicotinic receptors, glutamate binds to NMDA or AMPA receptors, and GABA binds to GABA receptors. The binding is reversible, so when the ligand dissociates, the channel typically closes. This gating mechanism allows precise temporal control over ion flow: channels open only when specific signals are present. Voltage-gated channels respond to membrane potential changes, mechanically-gated channels respond to physical forces, and ATP-gated channels use ATP hydrolysis for gating, but ligand-gated channels respond to chemical signals. This mechanism is fundamental to synaptic transmission, where neurotransmitters released from one neuron bind to ligand-gated channels on the postsynaptic neuron, allowing ion entry that can trigger an action potential.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which molecule can diffuse directly through the lipid bilayer?",
            options: [
                "A) Glucose",
                "B) Na+ ions",
                "C) O₂",
                "D) Amino acids"
            ],
            correct: 2,
            difficulty: "easy",
            explanation: "Oxygen (O₂) is a small, nonpolar molecule that can diffuse directly through the hydrophobic interior of the lipid bilayer without requiring any transport proteins or energy expenditure. The lipid bilayer's core is composed of fatty acid tails that create a hydrophobic environment, which readily dissolves nonpolar substances. Small size is also crucial—smaller molecules diffuse more rapidly than larger ones. Oxygen molecules are nonpolar because their electrons are shared equally between the two oxygen atoms, making the molecule hydrophobic. This allows O₂ to dissolve in the lipid bilayer and pass through by simple diffusion, following its concentration gradient from high concentration (lungs or water) to low concentration (cells using oxygen for cellular respiration). The same principle applies to other small nonpolar molecules like carbon dioxide (CO₂) and nitrogen (N₂). In contrast, glucose is large and polar, Na⁺ ions are charged and hydrophilic, and amino acids are polar with charged groups—all of these are repelled by the hydrophobic membrane interior and require facilitated diffusion or active transport. The ability of O₂ to diffuse directly through membranes is essential for cellular respiration, as cells constantly need oxygen that must cross multiple membranes (plasma membrane, mitochondrial membranes) to reach the electron transport chain where it serves as the final electron acceptor.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The sodium-potassium pump is an example of:",
            options: [
                "A) Facilitated diffusion",
                "B) Simple diffusion",
                "C) Active transport",
                "D) Osmosis"
            ],
            correct: 2,
            difficulty: "easy",
            explanation: "The sodium-potassium pump (Na⁺-K⁺ ATPase) is a classic example of active transport because it uses ATP to move Na⁺ and K⁺ ions against their concentration gradients. This pump maintains the concentration gradients essential for cellular function: it pumps three Na⁺ ions out of the cell and two K⁺ ions into the cell for each ATP molecule hydrolyzed. Both ions are moved against their gradients—Na⁺ is actively transported from low concentration (inside) to high concentration (outside), and K⁺ is actively transported from low concentration (outside) to high concentration (inside). The pump undergoes a series of conformational changes: it binds three Na⁺ ions and ATP, then ATP hydrolysis provides energy to change shape and release Na⁺ outside, bind two K⁺ ions outside, then change shape again to release K⁺ inside. This active transport is crucial for maintaining the resting membrane potential (about -70 mV in neurons), which is essential for nerve impulses and muscle contraction. It also helps regulate cell volume by maintaining osmotic balance. The Na⁺-K⁺ pump consumes approximately 25-30% of a cell's ATP in resting neurons, demonstrating the energetic cost of active transport. Unlike facilitated diffusion or simple diffusion, which move substances down gradients, active transport requires energy input to create and maintain gradients that would otherwise dissipate by passive diffusion.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Uniport carriers transport:",
            options: [
                "A) Two substances in opposite directions",
                "B) Two substances in the same direction",
                "C) One substance in one direction",
                "D) Multiple substances simultaneously"
            ],
            correct: 2,
            difficulty: "medium",
            explanation: "Uniport carriers transport a single substance in one direction across the membrane, moving that substance from one side to the other without coupling to the movement of another substance. This is the simplest type of carrier-mediated transport. Uniporters bind one substrate molecule on one side of the membrane, undergo a conformational change, and release the substrate on the other side, following the concentration gradient for passive uniporters (like GLUT glucose transporters) or against the gradient for active uniporters (requiring ATP). The GLUT family of glucose transporters is a well-studied example—they transport only glucose, moving it down its concentration gradient from high to low concentration. In contrast, symport carriers (cotransporters) move two substances in the same direction simultaneously, such as the Na⁺-glucose symporter in intestinal cells that couples glucose uptake to sodium movement. Antiport carriers (exchangers) move two substances in opposite directions, like the Na⁺-Ca²⁺ exchanger that moves Na⁺ in while moving Ca²⁺ out. Uniporters provide simple, dedicated transport pathways for specific molecules without the complexity of coupling mechanisms, while symporters and antiporters can use the energy stored in one gradient to drive transport against another gradient.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The difference between facilitated diffusion and active transport is:",
            options: [
                "A) Facilitated diffusion uses proteins, active transport does not",
                "B) Active transport requires energy, facilitated diffusion does not",
                "C) Facilitated diffusion moves against gradient, active transport moves with gradient",
                "D) There is no difference"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "The fundamental difference between facilitated diffusion and active transport is that active transport requires energy (typically ATP hydrolysis) to move substances against their concentration gradient, while facilitated diffusion is passive and moves substances down their concentration gradient without energy input. Both processes use transport proteins—channels or carriers—but only active transport uses energy. In facilitated diffusion, the transport protein simply provides a pathway for a molecule to move from high concentration to low concentration, driven solely by the concentration gradient and the kinetic energy of molecules. Examples include GLUT glucose transporters moving glucose down its gradient, or ion channels allowing ions to flow down electrochemical gradients. Active transport, however, uses energy to pump substances from low concentration to high concentration, creating and maintaining concentration gradients that would otherwise dissipate. The Na⁺-K⁺ pump, for example, uses ATP to maintain high Na⁺ outside and high K⁺ inside, against their natural diffusion tendency. Active transport can be direct (using ATP directly, like Na⁺-K⁺ ATPase) or indirect (using the energy stored in one gradient to drive another, like Na⁺-glucose symporters). This energetic distinction is crucial: facilitated diffusion is spontaneous and decreases free energy, while active transport increases free energy and requires energy input. Both can use proteins, both can be selective, but only active transport requires energy to move against gradients.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which would show the fastest rate of transport across a membrane?",
            options: [
                "A) Large polar molecule via simple diffusion",
                "B) Small nonpolar molecule via simple diffusion",
                "C) Glucose via facilitated diffusion",
                "D) Na+ via simple diffusion"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Small nonpolar molecules like O₂, CO₂, or N₂ show the fastest transport rates via simple diffusion because they can diffuse directly through the lipid bilayer without requiring transport proteins, and their small size allows rapid movement. When molecules can dissolve in the hydrophobic membrane interior, they can diffuse through quickly. Small nonpolar molecules have optimal properties: they're small enough to move rapidly, nonpolar enough to dissolve in lipids, and don't require the time-consuming steps of binding to proteins or conformational changes. Oxygen, for example, can cross membranes at rates of thousands of molecules per second per cell. Large polar molecules cannot pass through the hydrophobic bilayer due to size and polarity barriers. Glucose via facilitated diffusion is slower because it requires binding to carrier proteins and conformational changes, limiting transport to hundreds of molecules per second. Na⁺ cannot diffuse through the lipid bilayer at all due to its charge—it's completely impermeable to the hydrophobic interior and would require channels for any movement. The speed advantage of simple diffusion for small nonpolar molecules is why cells rely on it for essential gases (O₂, CO₂) while using slower but necessary facilitated diffusion or active transport for polar and charged molecules that cannot pass through membranes otherwise.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "A symport carrier moves:",
            options: [
                "A) One substance in one direction",
                "B) Two substances in opposite directions",
                "C) Two substances in the same direction",
                "D) One substance in both directions"
            ],
            correct: 2,
            difficulty: "medium",
            explanation: "Symport carriers (also called cotransporters) move two different substances in the same direction across the membrane simultaneously, coupling the movement of one substance to the other. This coupling mechanism allows the energy stored in one gradient (usually an electrochemical gradient) to drive the transport of another substance against its gradient. A classic example is the Na⁺-glucose symporter in intestinal epithelial cells: as Na⁺ flows down its electrochemical gradient (from high concentration outside to low concentration inside), it provides the energy to drive glucose transport against its concentration gradient (from low concentration in the intestine to higher concentration inside the cell). Both Na⁺ and glucose bind to the symporter, and the conformational change that moves Na⁺ down its gradient simultaneously moves glucose up its gradient. This is an example of secondary active transport—the glucose transport is 'active' (against gradient) but powered indirectly by the Na⁺ gradient, which was established by primary active transport (Na⁺-K⁺ pump). Other examples include the Na⁺-amino acid symporters and the H⁺-sucrose symporter in plant phloem cells. Symport is contrasted with antiport (exchangers), which move two substances in opposite directions, and uniport, which moves only one substance. The coupling mechanism allows cells to efficiently use the energy stored in ion gradients to drive the uptake of essential nutrients.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The rate of simple diffusion is directly proportional to:",
            options: [
                "A) Concentration gradient",
                "B) Size of molecule",
                "C) Polarity of molecule",
                "D) Number of transport proteins"
            ],
            correct: 0,
            difficulty: "medium",
            explanation: "The rate of simple diffusion is directly proportional to the concentration gradient according to Fick's law of diffusion, which states that flux (rate of movement) is proportional to the concentration difference divided by the distance over which diffusion occurs. The mathematical relationship is: J = -D × (ΔC/Δx), where J is flux, D is the diffusion coefficient, ΔC is the concentration difference (gradient), and Δx is distance. This means that doubling the concentration gradient doubles the rate of diffusion, creating a linear relationship. A steep concentration gradient (large difference in concentration) creates a strong driving force, pushing more molecules per unit time from high to low concentration. This linear relationship continues indefinitely—there's no maximum rate for simple diffusion, unlike facilitated diffusion which shows saturation. While molecular size and polarity affect the diffusion coefficient (D)—smaller and less polar molecules diffuse faster—they don't change the proportionality to gradient. Larger molecules have smaller diffusion coefficients and diffuse more slowly, but their rate is still directly proportional to gradient. Nonpolar molecules have higher permeability than polar molecules, but again, rate remains proportional to gradient. Transport proteins are not involved in simple diffusion at all. This linear relationship is fundamental to understanding how substances move across membranes by simple diffusion.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Potassium channels are selective because they:",
            options: [
                "A) Only allow K+ through due to size",
                "B) Have specific binding sites for K+",
                "C) Exclude all other ions",
                "D) Require ATP to function"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Potassium channels are highly selective because they have specific binding sites (called the selectivity filter) that perfectly accommodate K⁺ ions while excluding other ions, particularly the smaller Na⁺ ion. The selectivity filter is a narrow region of the channel pore lined with carbonyl oxygen atoms that form coordination sites matching the size and hydration shell of K⁺ ions. When a K⁺ ion enters, it sheds its hydration shell and coordinates with the carbonyl oxygens, allowing it to pass through. Na⁺ ions, although smaller, cannot pass because they are too small to interact optimally with the binding sites—their smaller size means they cannot efficiently coordinate with the filter, creating an energetic barrier. This size-exclusion mechanism is remarkable because K⁺ and Na⁺ are chemically similar (both monovalent cations) and differ only slightly in size (K⁺ ~1.33 Å vs Na⁺ ~0.95 Å), yet potassium channels can select for K⁺ with about 10,000-fold preference over Na⁺. The selectivity filter structure was elucidated through X-ray crystallography by Roderick MacKinnon (Nobel Prize in Chemistry, 2003), revealing how precise molecular architecture achieves this remarkable selectivity. This selectivity is crucial for maintaining the resting membrane potential, as K⁺ leak channels allow K⁺ to exit down its gradient, making the inside negative relative to outside. The channels do not require ATP—they are passive and allow K⁺ to flow down its electrochemical gradient.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which factor does NOT affect facilitated diffusion?",
            options: [
                "A) Number of transport proteins",
                "B) Concentration gradient",
                "C) ATP availability",
                "D) Temperature"
            ],
            correct: 2,
            difficulty: "hard",
            explanation: "ATP availability does not affect facilitated diffusion because facilitated diffusion is a passive process that moves substances down their concentration gradient without requiring energy input. The rate of facilitated diffusion depends on the concentration gradient (the driving force), the number of transport proteins in the membrane (which determines Vmax), and temperature (which affects molecular movement and protein conformational changes). At higher concentrations, more substrates bind to carriers, increasing rate until saturation. More transport proteins increase Vmax. Higher temperatures increase kinetic energy, accelerating both binding and conformational changes. However, ATP is not involved in facilitated diffusion—no ATP is hydrolyzed, and the process occurs spontaneously following concentration gradients. This is in contrast to active transport, which absolutely requires ATP to move substances against gradients. If ATP levels drop in a cell, facilitated diffusion continues normally, while active transport stops. This distinction is important for understanding cellular energetics: facilitated diffusion is energy-efficient, using only the free energy stored in concentration gradients, while active transport consumes ATP to create and maintain those gradients. Temperature can slightly affect facilitated diffusion rates through its effects on molecular motion and protein dynamics, but ATP availability has no role in this passive process.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "An antiport carrier moves:",
            options: [
                "A) Two substances in the same direction",
                "B) Two substances in opposite directions",
                "C) One substance in one direction",
                "D) Multiple substances randomly"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Antiport carriers (also called exchangers) are cotransporters that move two different substances in opposite directions across the membrane simultaneously, coupling the movement of one substance to the counter-movement of another. This mechanism is particularly important for maintaining electrochemical gradients and homeostasis. A classic example is the Na⁺-Ca²⁺ exchanger found in many cells: as Na⁺ flows down its electrochemical gradient into the cell, it provides energy to pump Ca²⁺ out of the cell against its concentration gradient. This is a form of secondary active transport where the energy stored in the Na⁺ gradient (established by the Na⁺-K⁺ pump) is used to drive Ca²⁺ removal. Another example is the Cl⁻-HCO₃⁻ exchanger (anion exchanger) in red blood cells that exchanges chloride ions for bicarbonate ions, helping to regulate pH and CO₂ transport. Antiporters allow cells to maintain ionic balance—for instance, removing excess Ca²⁺ while simultaneously bringing in Na⁺, both important for cellular function. This is contrasted with symport carriers, which move two substances in the same direction, and uniport carriers, which move only one substance. The coupling mechanism in antiporters is essential for maintaining gradients and preventing toxic buildup of ions within cells.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The glucose transporter (GLUT) is an example of:",
            options: [
                "A) Active transport",
                "B) Facilitated diffusion",
                "C) Simple diffusion",
                "D) Bulk transport"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "GLUT (glucose transporter) proteins are carrier proteins that facilitate the passive diffusion of glucose down its concentration gradient, making them clear examples of facilitated diffusion. GLUT proteins do not require ATP or any energy source—they simply provide a hydrophilic pathway through which glucose molecules can move from high concentration (like the bloodstream) to low concentration (inside cells). When glucose binds to a GLUT protein on the extracellular side, the carrier undergoes a conformational change, exposing the binding site to the intracellular side, where glucose is released due to the lower concentration. This process repeats as glucose molecules move down their gradient. There are multiple GLUT isoforms (GLUT1, GLUT2, GLUT3, GLUT4, etc.) expressed in different tissues, each adapted for specific functions. For example, GLUT4 in muscle and fat cells is insulin-sensitive and can be inserted into membranes in response to insulin signaling. Unlike active glucose transporters (like the Na⁺-glucose symporter in intestinal cells that couples glucose uptake to sodium movement and requires ATP indirectly), GLUT proteins are passive and rely solely on concentration gradients. This allows cells to efficiently take up glucose when it's abundant without expending energy.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "When a carrier protein binds its substrate, it undergoes:",
            options: [
                "A) No change",
                "B) A conformational change",
                "C) ATP hydrolysis",
                "D) Phosphorylation"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Carrier proteins undergo conformational (shape) changes when they bind their substrate, which is the fundamental mechanism by which they transport molecules across membranes. This conformational change is essential because the carrier must expose the substrate binding site to one side of the membrane at a time. When substrate binds to the carrier on one side (for example, the extracellular side), the binding energy triggers a conformational change that closes the binding site to that side and opens it to the other side (intracellular side). This allows the substrate to be released into the lower concentration environment. The conformational change is reversible: after releasing substrate, the carrier returns to its original conformation, ready to bind another substrate molecule. This mechanism is powered solely by binding energy—no ATP is required for facilitated diffusion carriers (though active transport carriers may also undergo conformational changes powered by ATP hydrolysis). The conformational change is analogous to enzyme-substrate interactions, where binding induces structural changes that facilitate the reaction. This mechanism allows carriers to transport substrates through the hydrophobic membrane interior without exposing them directly to lipids, solving the problem of how polar and charged molecules can cross lipid bilayers. The specificity of binding ensures that only appropriate substrates are transported, providing selectivity for different molecules.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The selectivity filter in ion channels:",
            options: [
                "A) Determines which ions can pass",
                "B) Requires ATP",
                "C) Only exists in active transport",
                "D) Is found in all membrane proteins"
            ],
            correct: 0,
            difficulty: "hard",
            explanation: "The selectivity filter is a specialized region of ion channel proteins that determines which specific ions can pass through the channel based on precise molecular interactions involving size, charge, and coordination chemistry. This filter is a narrow region of the channel pore, typically only a few amino acids long, that creates an energetic barrier that allows some ions through while excluding others. The most well-studied example is the selectivity filter in potassium channels, which contains a sequence of amino acids (typically TVGYG in voltage-gated K⁺ channels) that form carbonyl oxygen atoms that coordinate with K⁺ ions. The filter's dimensions and chemical properties are precisely tuned—K⁺ ions fit perfectly, can shed their hydration shell, and coordinate with the filter, allowing passage, while smaller Na⁺ ions cannot interact optimally with the filter due to size mismatch, creating an energy barrier that excludes them. This allows potassium channels to be 10,000-fold more selective for K⁺ over Na⁺ despite their chemical similarity. The selectivity filter does not require ATP—it works through passive interactions. Selectivity filters exist in passive channels used for facilitated diffusion, not just active transport. The structure of selectivity filters was elucidated by X-ray crystallography (work that earned Roderick MacKinnon the 2003 Nobel Prize in Chemistry), revealing how precise protein architecture achieves remarkable ion selectivity that is essential for maintaining membrane potentials and cellular function.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Compared to simple diffusion, facilitated diffusion:",
            options: [
                "A) Is faster for all molecules",
                "B) Allows polar molecules to cross membranes",
                "C) Requires energy",
                "D) Works against concentration gradients"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Facilitated diffusion enables polar and charged molecules that cannot diffuse through the hydrophobic lipid bilayer to cross membranes with the help of transport proteins. This is the primary advantage and purpose of facilitated diffusion. The lipid bilayer's hydrophobic core (composed of fatty acid tails) is impermeable to polar molecules like glucose, amino acids, and water, and completely impermeable to charged ions like Na⁺, K⁺, and Cl⁻. These molecules are hydrophilic and are repelled by the nonpolar membrane interior. Facilitated diffusion solves this problem by providing hydrophilic pathways—either channel proteins that form water-filled pores, or carrier proteins that bind polar substrates and shield them from the hydrophobic interior during transport. This allows essential polar nutrients and molecules to enter cells, and allows ions to move for cellular signaling and homeostasis. In contrast, small nonpolar molecules like O₂ and CO₂ can diffuse directly through membranes and don't need facilitated diffusion. Facilitated diffusion is not necessarily faster than simple diffusion for all molecules—small nonpolar molecules diffuse very rapidly directly through lipids. Facilitated diffusion is still passive (requires no energy) and moves down gradients (not against them), but it provides an essential pathway for molecules that would otherwise be unable to cross membranes at physiologically relevant rates.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The maximum transport rate (Vmax) in facilitated diffusion is determined by:",
            options: [
                "A) Substrate concentration",
                "B) Number of transport proteins",
                "C) Membrane thickness",
                "D) ATP availability"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Vmax (maximum transport velocity) in facilitated diffusion is determined by the total number of functional transport proteins in the membrane. When all carrier proteins are simultaneously bound to substrate and engaged in transport, the system reaches maximum capacity, and this maximum rate is directly proportional to the number of proteins. Mathematically, Vmax = k × [protein], where k is the turnover number (how many molecules each protein can transport per second) and [protein] is the concentration of transport proteins in the membrane. More transport proteins mean more binding sites available, allowing more simultaneous transport events, thus higher Vmax. This is similar to enzyme kinetics, where Vmax depends on enzyme concentration. Substrate concentration determines how close the rate is to Vmax (rate = Vmax × [S] / (Km + [S])), but Vmax itself is independent of substrate concentration—once all proteins are saturated, further increases in substrate cannot increase rate. Membrane thickness affects simple diffusion (Fick's law: flux ∝ 1/thickness) but has minimal effect on facilitated diffusion, as the transport proteins span the entire membrane. ATP availability is irrelevant because facilitated diffusion is passive and doesn't use ATP. Cells can regulate Vmax by controlling the number of transport proteins in the membrane—for example, insulin signaling increases GLUT4 insertion into membranes, increasing glucose uptake capacity.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which statement about channel proteins is FALSE?",
            options: [
                "A) They can be gated",
                "B) They transport faster than carriers",
                "C) They require substrate binding",
                "D) They form aqueous pores"
            ],
            correct: 2,
            difficulty: "hard",
            explanation: "Channel proteins do NOT require substrate binding like carrier proteins—this statement is false. Channel proteins form continuous aqueous pores through which ions or molecules can flow directly when the channel is open. When a channel opens (either through gating mechanisms or by being always open in the case of leak channels), substrates flow through by diffusion, following their concentration or electrochemical gradient. There is no binding step or conformational change required for each molecule—millions of ions can flow through an open channel per second. In contrast, carrier proteins must bind each substrate molecule individually, undergo a conformational change, and release the substrate, which is much slower (hundreds to thousands of molecules per second). Channels can indeed be gated (voltage-gated, ligand-gated, or mechanically-gated), and they do transport much faster than carriers due to the absence of binding requirements. Channels form hydrophilic pores lined with polar amino acids that allow rapid ion flow. The lack of binding is what makes channels so fast—it's a direct diffusion pathway, while carriers require time-consuming binding and conformational changes for each transport event. This distinction explains why channels are used when rapid ion flow is needed (like in nerve impulses), while carriers are used when slower, controlled transport is appropriate or when precise regulation is needed.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "In facilitated diffusion, transport rate increases with concentration until:",
            options: [
                "A) The gradient reverses",
                "B) Saturation is reached",
                "C) ATP is depleted",
                "D) The membrane dissolves"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "In facilitated diffusion, transport rate increases with substrate concentration until saturation is reached, when all available transport proteins become simultaneously occupied with substrate molecules and transport rate plateaus at Vmax (maximum velocity). At low concentrations, rate increases linearly with concentration because most transport proteins are unbound and available. As concentration increases, more and more proteins bind substrate, so more simultaneous transport events occur, increasing the overall rate. However, once every transport protein is bound and actively transporting, the system reaches maximum capacity—there are no additional unbound proteins available to increase transport further. This creates a hyperbolic saturation curve described by the Michaelis-Menten equation: V = Vmax × [S] / (Km + [S]), where V is velocity, [S] is substrate concentration, Vmax is maximum velocity (when all proteins are saturated), and Km is the substrate concentration at half-maximal velocity. At saturation, increasing substrate concentration has no effect on rate—the curve plateaus. This is fundamentally different from simple diffusion, which shows linear kinetics with no saturation point. The gradient does not reverse at saturation—it may still exist, but rate cannot increase further. ATP is not involved in facilitated diffusion, and membranes remain intact throughout the process.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which is NOT a characteristic of facilitated diffusion?",
            options: [
                "A) Uses transport proteins",
                "B) Moves down concentration gradient",
                "C) Requires energy",
                "D) Shows saturation kinetics"
            ],
            correct: 2,
            difficulty: "easy",
            explanation: "Facilitated diffusion is passive transport that does NOT require energy—this is a defining characteristic. Facilitated diffusion uses transport proteins (channels or carriers) to assist molecules in crossing membranes, but the movement is driven solely by concentration gradients and occurs spontaneously without ATP hydrolysis or any energy input. Molecules move down their concentration gradient from high to low concentration, just like in simple diffusion, but the proteins provide a pathway for molecules that cannot cross the lipid bilayer directly. Facilitated diffusion shows saturation kinetics (rate plateaus at high concentrations when all proteins are occupied), which is a hallmark of carrier-mediated transport. The absence of energy requirement is what distinguishes facilitated diffusion from active transport, which requires energy to move substances against gradients. This passive nature makes facilitated diffusion energy-efficient—cells can transport essential nutrients and ions without consuming ATP, relying on the free energy stored in concentration gradients that may be established by active transport in other parts of the cell or organism. The requirement for energy would make it active transport, not facilitated diffusion.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        }
    ],

    membranes: [
        {
            question: "The fluid mosaic model describes the plasma membrane as:",
            options: [
                "A) A rigid structure with fixed proteins",
                "B) A fluid lipid bilayer with embedded proteins",
                "C) A single layer of phospholipids",
                "D) A protein matrix with embedded lipids"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "The fluid mosaic model, proposed by Singer and Nicolson in 1972, describes biological membranes as a fluid bilayer of phospholipids with various proteins embedded or attached, able to move laterally within the plane of the membrane. The 'fluid' aspect refers to the fact that phospholipids and many proteins can move laterally (side to side) within the membrane due to the fluid nature of the lipid bilayer at physiological temperatures. This fluidity is crucial for membrane function—it allows proteins to interact, permits membrane fusion and fission, and enables cellular processes like endocytosis and exocytosis. The 'mosaic' aspect refers to the diverse array of proteins scattered throughout the membrane, creating a mosaic pattern. These proteins can be integral (embedded in or spanning the bilayer) or peripheral (attached to the membrane surface). The model has been refined over time to include additional components like cholesterol, glycolipids, and glycoproteins, but its core principles—fluidity and protein diversity—remain fundamental to understanding membrane structure and function. This model replaced earlier static models and explains how membranes can be both stable and dynamic, maintaining structure while allowing necessary molecular movement.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "What is the primary function of cholesterol in the plasma membrane?",
            options: [
                "A) To provide energy",
                "B) To maintain membrane fluidity",
                "C) To transport molecules",
                "D) To provide structural support"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Cholesterol's primary function in the plasma membrane is to maintain membrane fluidity across a wide range of temperatures, acting as a fluidity buffer or modulator. At low temperatures, phospholipids tend to pack tightly together, making the membrane too rigid and less fluid. Cholesterol molecules interspersed between phospholipids prevent this tight packing by inserting between fatty acid tails and disrupting their ordered arrangement, maintaining membrane fluidity. At high temperatures, phospholipids become too fluid and mobile, potentially compromising membrane integrity. Cholesterol also helps prevent excessive fluidity by restricting phospholipid movement and providing structural stability. This dual role—preventing both too much rigidity and too much fluidity—allows membranes to maintain optimal fluidity over a wide temperature range, which is essential for membrane protein function, cellular processes, and survival in varying environmental conditions. Cholesterol does not provide energy (it's a structural component), does not directly transport molecules (proteins do that), and while it does provide some structural support, its primary role is fluidity modulation. The amount of cholesterol varies between cell types—animal cells typically have cholesterol, while plant cells have phytosterols, and bacterial membranes generally lack sterols.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Phospholipids in the plasma membrane have:",
            options: [
                "A) Hydrophobic heads and hydrophilic tails",
                "B) Hydrophilic heads and hydrophobic tails",
                "C) Both hydrophilic regions",
                "D) Both hydrophobic regions"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "Phospholipids are amphipathic molecules with hydrophilic (water-attracting) phosphate heads and hydrophobic (water-repelling) fatty acid tails. The hydrophilic head consists of a phosphate group and often an attached polar group (like choline, ethanolamine, serine, or inositol), which can form hydrogen bonds with water molecules. This polar, charged head group is hydrophilic because it interacts favorably with water. In contrast, the hydrophobic tail consists of two long fatty acid chains (typically 16-18 carbons long) composed of hydrocarbon chains that are nonpolar and cannot form hydrogen bonds with water. This amphipathic nature is crucial for membrane formation—when phospholipids are placed in water, they spontaneously organize into bilayers with hydrophilic heads facing outward (toward the aqueous environment on both sides) and hydrophobic tails facing inward (away from water), creating a barrier that separates aqueous compartments. This arrangement is thermodynamically favorable because it minimizes unfavorable interactions between hydrophobic tails and water. The bilayer structure is stable and self-sealing, forming closed vesicles. This fundamental structure explains how membranes can be both stable barriers and dynamic structures that can fuse, bend, and undergo various cellular processes.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which component is NOT typically found in the plasma membrane?",
            options: [
                "A) Phospholipids",
                "B) Proteins",
                "C) Nucleic acids",
                "D) Cholesterol"
            ],
            correct: 2,
            difficulty: "easy",
            explanation: "Nucleic acids (DNA and RNA) are not found in the plasma membrane. The plasma membrane is composed primarily of phospholipids that form the structural bilayer foundation, proteins that perform various functions (transport, signaling, adhesion, enzymatic activity), cholesterol (in animal cells) that modulates fluidity, and carbohydrates attached to lipids (glycolipids) or proteins (glycoproteins) that serve in cell recognition and communication. Nucleic acids are found in the nucleus (DNA and RNA), cytoplasm (RNA), and organelles (mitochondria and chloroplasts contain DNA and RNA), but they are not components of the plasma membrane structure. DNA contains genetic information and is too large and polar to be incorporated into membranes, while RNA is involved in protein synthesis and gene regulation. The membrane's role is to separate cellular contents from the external environment and to regulate what enters and exits, which doesn't require nucleic acids. The components that are found in membranes—lipids, proteins, and carbohydrates—are specifically adapted for their roles in barrier function, transport, and cell communication, none of which involve nucleic acid functions.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Integral membrane proteins are:",
            options: [
                "A) Loosely attached to the membrane surface",
                "B) Embedded in the lipid bilayer",
                "C) Only found on the extracellular side",
                "D) Not essential for membrane function"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Integral membrane proteins are embedded within the lipid bilayer, spanning all or part of the membrane, with hydrophobic regions that interact with the hydrophobic interior of the membrane. These proteins are firmly anchored in the membrane—they cannot be removed without disrupting the bilayer structure (requiring detergents or organic solvents). Integral proteins have one or more hydrophobic regions (typically α-helical or β-barrel structures) that span the membrane, interacting with the fatty acid tails of phospholipids. Many integral proteins are transmembrane proteins, meaning they span the entire membrane with regions exposed on both the extracellular and cytoplasmic sides. These exposed regions are hydrophilic and can interact with the aqueous environments on both sides of the membrane. Integral proteins are essential for many membrane functions: they serve as channels and carriers for transport, as receptors for signaling, as enzymes, and as adhesion molecules. In contrast, peripheral proteins are loosely attached to the membrane surface, typically bound to integral proteins or phospholipid heads through ionic interactions or hydrogen bonds, and can be removed with mild treatments like high salt concentrations. Both types are found throughout the membrane and can be on either side. Integral proteins are absolutely essential for most membrane functions, including selective permeability and cellular communication.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The selective permeability of membranes is primarily due to:",
            options: [
                "A) The presence of cholesterol",
                "B) The hydrophobic interior of the lipid bilayer",
                "C) The phosphate groups",
                "D) The carbohydrate chains"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "The selective permeability of membranes is primarily due to the hydrophobic interior of the phospholipid bilayer, which creates a barrier that prevents most hydrophilic molecules and ions from passing through freely. The hydrophobic core is composed of fatty acid tails that are nonpolar and cannot form hydrogen bonds or interact favorably with polar or charged molecules. This hydrophobic barrier is impermeable to ions (like Na⁺, K⁺, Cl⁻), polar molecules (like glucose, amino acids), and large molecules—these substances cannot dissolve in or pass through the hydrophobic interior. Only small, nonpolar molecules (like O₂, CO₂, N₂) can diffuse directly through the bilayer. This selective barrier is the basis for cellular compartmentalization—it prevents unwanted substances from entering while allowing essential processes to occur inside cells. While cholesterol does modulate membrane fluidity and can slightly affect permeability, it's not the primary cause of selective permeability. The phosphate groups on phospholipids are part of the hydrophilic heads that face outward, not the barrier. Carbohydrate chains are on the membrane surface and don't contribute to the permeability barrier—they serve in cell recognition instead. The hydrophobic interior is the fundamental barrier that makes membranes selectively permeable, and cells use transport proteins to allow specific substances to cross this barrier when needed.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Glycoproteins in the membrane serve functions such as:",
            options: [
                "A) Cell recognition and communication",
                "B) Energy storage",
                "C) Structural support",
                "D) Waste removal"
            ],
            correct: 0,
            difficulty: "medium",
            explanation: "Glycoproteins are proteins that have carbohydrate chains covalently attached to them, typically through asparagine (N-linked) or serine/threonine (O-linked) residues. These carbohydrate modifications are added in the endoplasmic reticulum and Golgi apparatus during protein processing. Glycoproteins are extremely important for cell-cell recognition, which is essential for processes like fertilization, embryonic development, tissue formation, and immune system function. The carbohydrate chains on glycoproteins create a unique molecular identity for each cell type, allowing cells to recognize and interact with specific other cells. They are crucial for immune responses—for example, major histocompatibility complex (MHC) proteins are glycoproteins that display antigens to immune cells. Glycoproteins also play key roles in cell adhesion, helping cells stick together in tissues and organs. In blood groups (A, B, O), the differences are due to specific carbohydrate additions to glycoproteins on red blood cell surfaces. Additionally, glycoproteins serve as receptors for hormones and other signaling molecules, enabling cellular communication. The glycocalyx, the carbohydrate-rich layer on cell surfaces, is composed largely of glycoproteins and glycolipids, creating a protective coating that also mediates many cellular interactions.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Membrane fluidity is influenced by:",
            options: [
                "A) Temperature",
                "B) Fatty acid composition",
                "C) Cholesterol content",
                "D) All of the above"
            ],
            correct: 3,
            difficulty: "medium",
            explanation: "Membrane fluidity is influenced by multiple factors working together: temperature, the saturation/unsaturation of fatty acids, and cholesterol content. Temperature has a direct effect—higher temperatures increase molecular motion, making the membrane more fluid, while lower temperatures reduce motion, making it more rigid. Unsaturated fatty acids have kinks (double bonds) in their hydrocarbon chains that prevent tight packing, increasing fluidity, while saturated fatty acids pack tightly together, decreasing fluidity. Cholesterol modulates fluidity in both directions: at low temperatures, it prevents phospholipids from packing too tightly (maintaining fluidity), while at high temperatures, it restricts phospholipid movement (reducing excessive fluidity). This makes cholesterol a fluidity buffer that helps maintain optimal membrane fluidity over a wide temperature range. Cells can adjust their membrane composition in response to environmental changes—for example, organisms living in cold environments often have more unsaturated fatty acids in their membranes to maintain fluidity. The combined effects of these factors allow cells to maintain membrane fluidity appropriate for their needs and environmental conditions.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Peripheral membrane proteins are:",
            options: [
                "A) Embedded in the bilayer",
                "B) Attached to the membrane surface",
                "C) Spanning the entire membrane",
                "D) Only found in the cytoplasm"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Peripheral membrane proteins are loosely bound to the membrane surface, typically attached through weak interactions like ionic bonds, hydrogen bonds, or interactions with the hydrophilic heads of phospholipids or with integral membrane proteins. Unlike integral proteins that are embedded in the hydrophobic lipid bilayer, peripheral proteins are associated with the membrane surface on either the cytoplasmic or extracellular side. They can often be removed relatively easily without disrupting the membrane structure—for example, by treatments like high salt concentrations, changes in pH, or chelating agents that disrupt ionic interactions. In contrast, integral proteins require detergents or organic solvents to extract because they have hydrophobic regions embedded in the bilayer. Peripheral proteins often play roles in signaling, structural support, or as enzymes. For example, many peripheral proteins on the cytoplasmic side of the membrane are involved in signal transduction pathways, while some extracellular peripheral proteins (though less common) may be associated with the extracellular matrix. The loose association allows peripheral proteins to be more dynamic and responsive to cellular conditions, enabling rapid assembly and disassembly of protein complexes at membrane surfaces.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The asymmetric distribution of membrane components means:",
            options: [
                "A) The membrane is identical on both sides",
                "B) The inner and outer leaflets have different compositions",
                "C) Proteins cannot move laterally",
                "D) Only lipids are asymmetrical"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Membranes exhibit asymmetry with different phospholipid and protein compositions on the inner and outer leaflets, contributing to specialized functions.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Saturated fatty acids in phospholipids make membranes:",
            options: [
                "A) More fluid",
                "B) Less fluid",
                "C) More permeable",
                "D) Thicker"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Saturated fatty acids pack tightly together, reducing membrane fluidity compared to unsaturated fatty acids, which have kinks that prevent tight packing.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The lipid bilayer is held together primarily by:",
            options: [
                "A) Covalent bonds",
                "B) Hydrogen bonds",
                "C) Hydrophobic interactions",
                "D) Ionic bonds"
            ],
            correct: 2,
            difficulty: "medium",
            explanation: "The lipid bilayer is held together by hydrophobic interactions - the hydrophobic tails cluster together to exclude water, while the hydrophilic heads interact with aqueous environments.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which lipid helps maintain membrane fluidity in animals?",
            options: [
                "A) Phosphatidylcholine",
                "B) Cholesterol",
                "C) Glycolipids",
                "D) Triglycerides"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "Cholesterol helps maintain membrane fluidity in animal cells by preventing phospholipids from packing too tightly at low temperatures and reducing fluidity at high temperatures.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The head group of a phospholipid is:",
            options: [
                "A) Hydrophobic",
                "B) Hydrophilic",
                "C) Nonpolar",
                "D) Uncharged"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "The head group of a phospholipid contains phosphate and other polar groups, making it hydrophilic (water-attracting) and allowing it to interact with aqueous environments.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Lipid rafts in membranes are:",
            options: [
                "A) Regions with less fluidity",
                "B) Composed primarily of cholesterol and sphingolipids",
                "C) Found only in plant cells",
                "D) Non-functional membrane regions"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Lipid rafts are specialized membrane microdomains enriched in cholesterol and sphingolipids that serve as platforms for protein organization and signaling.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which factor would DECREASE membrane fluidity?",
            options: [
                "A) Higher temperature",
                "B) More unsaturated fatty acids",
                "C) More saturated fatty acids",
                "D) Less cholesterol"
            ],
            correct: 2,
            difficulty: "medium",
            explanation: "Saturated fatty acids pack tightly together, reducing membrane fluidity. Unsaturated fatty acids, higher temperature, and cholesterol increase fluidity.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The extracellular side of the membrane typically has more:",
            options: [
                "A) Phosphatidylethanolamine",
                "B) Glycolipids and glycoproteins",
                "C) Negatively charged phospholipids",
                "D) Integral proteins"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "The extracellular side of membranes typically has more glycolipids and glycoproteins, which are important for cell recognition and communication with the external environment.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "A transmembrane protein spans:",
            options: [
                "A) Only the outer leaflet",
                "B) Only the inner leaflet",
                "C) The entire lipid bilayer",
                "D) The glycocalyx"
            ],
            correct: 2,
            difficulty: "medium",
            explanation: "Transmembrane proteins span the entire lipid bilayer, with regions extending into both the extracellular and intracellular environments.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Freeze-fracture electron microscopy reveals:",
            options: [
                "A) Only proteins",
                "B) The interior of the membrane",
                "C) Only lipids",
                "D) The glycocalyx"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Freeze-fracture microscopy splits the membrane along the hydrophobic interior, revealing the internal structure and distribution of proteins within the lipid bilayer.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which is TRUE about membrane proteins?",
            options: [
                "A) They cannot move laterally",
                "B) They can move laterally but not flip-flop",
                "C) They flip-flop frequently",
                "D) They are static structures"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Membrane proteins can move laterally within the lipid bilayer but rarely flip-flop between leaflets, as this would require moving their hydrophilic regions through the hydrophobic interior.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The glycocalyx is composed of:",
            options: [
                "A) Only proteins",
                "B) Carbohydrates attached to lipids and proteins",
                "C) Only lipids",
                "D) Nucleic acids"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "The glycocalyx is a carbohydrate-rich coating on the extracellular surface of membranes, composed of glycolipids and glycoproteins with attached carbohydrate chains.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which statement about membrane asymmetry is FALSE?",
            options: [
                "A) Inner and outer leaflets have different lipid compositions",
                "B) Proteins have specific orientations",
                "C) The membrane is identical on both sides",
                "D) Carbohydrates are found primarily on the exterior"
            ],
            correct: 2,
            difficulty: "hard",
            explanation: "Membrane asymmetry means the membrane is NOT identical on both sides - the inner and outer leaflets have different compositions of lipids, proteins, and carbohydrates.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Membrane fluidity is important for:",
            options: [
                "A) Only cell shape",
                "B) Protein function and membrane trafficking",
                "C) Only temperature resistance",
                "D) Preventing all transport"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Membrane fluidity is crucial for proper protein function, membrane fusion during vesicle trafficking, cell division, and maintaining membrane integrity.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "A phospholipid is amphipathic because it:",
            options: [
                "A) Has only hydrophobic regions",
                "B) Has both hydrophilic and hydrophobic regions",
                "C) Has only hydrophilic regions",
                "D) Is charged"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "Phospholipids are amphipathic molecules with both hydrophilic (polar head) and hydrophobic (nonpolar tails) regions, allowing them to form bilayers in aqueous environments.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which would increase membrane permeability?",
            options: [
                "A) More saturated fatty acids",
                "B) Less cholesterol",
                "C) More cholesterol",
                "D) Lower temperature"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Less cholesterol and more unsaturated fatty acids increase membrane fluidity, which generally increases permeability. However, cholesterol reduces permeability by filling gaps between phospholipids.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The thickness of a typical plasma membrane is approximately:",
            options: [
                "A) 1 nm",
                "B) 5 nm",
                "C) 10 nm",
                "D) 50 nm"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "A typical plasma membrane is approximately 5-10 nm thick, with the lipid bilayer itself being about 5 nm and total membrane thickness including proteins ranging from 7-10 nm.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Membrane proteins that span the bilayer are called:",
            options: [
                "A) Peripheral proteins",
                "B) Integral proteins",
                "C) Glycoproteins only",
                "D) Only receptors"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "Proteins that span the entire membrane (transmembrane proteins) are a type of integral protein, anchored within the lipid bilayer with hydrophobic regions.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which statement about phospholipid movement is TRUE?",
            options: [
                "A) They flip-flop frequently",
                "B) They can move laterally but rarely flip-flop",
                "C) They cannot move at all",
                "D) They only move in one direction"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Phospholipids can move laterally within their leaflet relatively easily, but flip-flopping (moving between leaflets) is rare because it requires moving the hydrophilic head through the hydrophobic interior.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The membrane potential is maintained by:",
            options: [
                "A) Lipid composition only",
                "B) Active transport of ions",
                "C) Passive diffusion only",
                "D) Glycoproteins"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "The membrane potential (electrical gradient across the membrane) is maintained primarily by active transport pumps, such as the sodium-potassium pump, which create and maintain ion gradients.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which lipid is most abundant in plasma membranes?",
            options: [
                "A) Cholesterol",
                "B) Triglycerides",
                "C) Phospholipids",
                "D) Glycolipids"
            ],
            correct: 2,
            difficulty: "easy",
            explanation: "Phospholipids are the most abundant lipids in plasma membranes, forming the bilayer structure that serves as the membrane's foundation.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Membrane fusion during exocytosis requires:",
            options: [
                "A) Only proteins",
                "B) Membrane fluidity",
                "C) Rigid membranes",
                "D) No energy"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Membrane fusion during processes like exocytosis requires membrane fluidity to allow the vesicle membrane to merge with the plasma membrane, facilitated by specific fusion proteins.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The hydrophobic core of the membrane excludes:",
            options: [
                "A) Nonpolar molecules",
                "B) Polar molecules and ions",
                "C) Only large molecules",
                "D) Nothing"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "The hydrophobic core of the membrane excludes polar molecules and ions, which cannot dissolve in the nonpolar lipid interior. Small nonpolar molecules can pass through.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "A cell at low temperature would benefit from:",
            options: [
                "A) More saturated fatty acids",
                "B) More unsaturated fatty acids",
                "C) Less cholesterol",
                "D) Fewer proteins"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "At low temperatures, membranes become more rigid. More unsaturated fatty acids introduce kinks that prevent tight packing, maintaining membrane fluidity at lower temperatures.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The inner leaflet of the plasma membrane typically has more:",
            options: [
                "A) Glycolipids",
                "B) Phosphatidylserine",
                "C) Cholesterol",
                "D) Glycoproteins"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "The inner (cytoplasmic) leaflet typically has more phosphatidylserine and phosphatidylethanolamine, while the outer leaflet has more phosphatidylcholine and glycolipids.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        }
    ],

    structures: [
        {
            question: "Which organelle is responsible for protein synthesis?",
            options: [
                "A) Golgi apparatus",
                "B) Ribosomes",
                "C) Endoplasmic reticulum",
                "D) Mitochondria"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "Ribosomes are the sites of protein synthesis, where mRNA is translated into polypeptide chains.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The rough endoplasmic reticulum is characterized by:",
            options: [
                "A) Storage of lipids",
                "B) Attachment of ribosomes",
                "C) ATP production",
                "D) Waste breakdown"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "The rough ER has ribosomes attached to its surface and is involved in protein synthesis and modification.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which structure is NOT found in plant cells?",
            options: [
                "A) Cell wall",
                "B) Chloroplasts",
                "C) Large central vacuole",
                "D) Centrioles"
            ],
            correct: 3,
            difficulty: "easy",
            explanation: "Centrioles are found in animal cells and help organize microtubules, but are absent in most plant cells.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The primary function of the mitochondria is:",
            options: [
                "A) Protein synthesis",
                "B) Lipid synthesis",
                "C) ATP production through cellular respiration",
                "D) DNA replication"
            ],
            correct: 2,
            difficulty: "easy",
            explanation: "Mitochondria are the powerhouses of the cell, producing ATP through aerobic cellular respiration.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Lysosomes contain:",
            options: [
                "A) DNA",
                "B) Digestive enzymes",
                "C) Chlorophyll",
                "D) Ribosomes"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "Lysosomes are membrane-bound organelles that contain a wide array of hydrolytic enzymes capable of breaking down virtually all types of macromolecules including proteins, nucleic acids, carbohydrates, and lipids. These enzymes work optimally at acidic pH (around 4.5-5.0), which is maintained by proton pumps in the lysosomal membrane. Lysosomes function as the cell's digestive system, breaking down materials taken in by endocytosis, worn-out organelles (autophagy), and cellular waste. They fuse with phagosomes (containing material from phagocytosis) and endosomes to digest their contents, then release the breakdown products (amino acids, nucleotides, sugars, fatty acids) back into the cytoplasm for reuse. Lysosomes are particularly important in cells that engage in extensive phagocytosis, such as white blood cells and macrophages. Defects in lysosomal enzymes can lead to storage diseases like Tay-Sachs or Gaucher disease, where undigested materials accumulate and cause cellular dysfunction. The membrane surrounding lysosomes prevents these powerful digestive enzymes from leaking into the cytoplasm, where they would damage cellular components.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The Golgi apparatus functions in:",
            options: [
                "A) Protein modification and packaging",
                "B) DNA replication",
                "C) Lipid synthesis",
                "D) Waste breakdown"
            ],
            correct: 0,
            difficulty: "easy",
            explanation: "The Golgi apparatus is a membrane-bound organelle that functions as the cell's post office, modifying, sorting, and packaging proteins and lipids for transport to their final destinations. Proteins arrive at the Golgi from the rough endoplasmic reticulum in vesicles, entering at the cis face (receiving side). As they move through the Golgi stacks (cis, medial, and trans compartments), they undergo various modifications: addition of carbohydrates (glycosylation), addition of phosphate groups (phosphorylation), addition of sulfate groups (sulfation), and proteolytic cleavage. The Golgi also synthesizes certain complex carbohydrates and modifies lipids. These modifications can determine the protein's final destination, function, or stability. At the trans face (shipping side), proteins are sorted and packaged into vesicles for delivery to different destinations: some go to the plasma membrane for secretion (exocytosis), others go to lysosomes (via vesicles that fuse with endosomes), and others are sent to other organelles. The Golgi also plays a role in forming lysosomes and in the synthesis of cell wall materials in plant cells. This organelle is essential for protein trafficking and cellular organization.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Chloroplasts are the site of:",
            options: [
                "A) Cellular respiration",
                "B) Photosynthesis",
                "C) Protein synthesis",
                "D) DNA replication"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "Chloroplasts are specialized organelles found in plant cells and some protists that are the primary sites of photosynthesis—the process by which light energy is converted into chemical energy in the form of glucose and other organic molecules. Chloroplasts contain chlorophyll, the green pigment that captures light energy, as well as other photosynthetic pigments. The chloroplast has a double membrane and contains an internal membrane system of thylakoids (stacked into grana) where the light-dependent reactions of photosynthesis occur. The light reactions capture light energy and use it to generate ATP and NADPH, splitting water molecules and releasing oxygen as a byproduct. The stroma, the fluid-filled space surrounding the thylakoids, contains the enzymes for the light-independent (Calvin cycle) reactions, where CO₂ is fixed and converted into glucose using the ATP and NADPH generated in the light reactions. Chloroplasts also contain their own DNA and ribosomes, suggesting an endosymbiotic origin from ancient cyanobacteria. These organelles are essential for life on Earth, as photosynthesis produces oxygen and organic compounds that sustain most living organisms.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The nucleus contains:",
            options: [
                "A) Only DNA",
                "B) DNA and RNA",
                "C) Only proteins",
                "D) Only ribosomes"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "The nucleus contains both DNA and RNA, making it the control center of eukaryotic cells. The DNA is organized into chromosomes and contains the cell's genetic information—genes that encode proteins and regulatory sequences that control gene expression. The nucleus also contains RNA in various forms: ribosomal RNA (rRNA) is transcribed in the nucleolus (a specialized region within the nucleus), where it combines with proteins imported from the cytoplasm to form ribosomal subunits. These ribosomal subunits are then exported to the cytoplasm for final assembly into functional ribosomes. Additionally, the nucleus contains messenger RNA (mRNA) during transcription and processing, transfer RNA (tRNA) that is transcribed in the nucleus, and various small nuclear RNAs (snRNAs) involved in RNA processing. The nucleus is surrounded by a double membrane called the nuclear envelope, which is perforated by nuclear pores that allow selective passage of molecules between the nucleus and cytoplasm. The nuclear envelope protects the DNA from cytoplasmic enzymes and allows for spatial separation of transcription (nucleus) and translation (cytoplasm) in eukaryotic cells. Proteins are present in the nucleus—histones that package DNA, transcription factors, enzymes for DNA replication and repair, and structural proteins of the nuclear envelope—but DNA and RNA are the defining informational molecules.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Cilia and flagella are composed of:",
            options: [
                "A) Actin filaments",
                "B) Microtubules arranged in a 9+2 pattern",
                "C) Intermediate filaments",
                "D) Phospholipids"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Cilia and flagella have a core structure of microtubules arranged in a distinctive 9+2 pattern, consisting of nine outer doublet microtubules arranged in a circle around a central pair of singlet microtubules. This arrangement is called an axoneme and is enclosed by an extension of the plasma membrane. The outer doublets are connected to each other by nexin links and to the central pair by radial spokes. Motor proteins called dyneins are attached to the outer doublets and generate movement by walking along adjacent microtubules, causing the microtubules to slide past each other and creating bending motion. This sliding mechanism, powered by ATP hydrolysis, propels the cilium or flagellum. Cilia are typically shorter and more numerous (e.g., on cells lining the respiratory tract or fallopian tubes), while flagella are longer and fewer (e.g., sperm cells have one flagellum). Both structures enable cellular movement or movement of fluid over the cell surface. This 9+2 arrangement is highly conserved in eukaryotic cells, found in organisms from protists to humans, though bacterial flagella have a completely different structure (composed of flagellin protein, not microtubules). The basal body at the base of cilia and flagella has a 9+0 arrangement (9 triplets, no central pair) and anchors the structure to the cell.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The cytoskeleton is involved in:",
            options: [
                "A) Cell shape maintenance",
                "B) Cell movement",
                "C) Intracellular transport",
                "D) All of the above"
            ],
            correct: 3,
            difficulty: "medium",
            explanation: "The cytoskeleton is a dynamic network of protein filaments that performs all of these functions and more. It consists of three main types of filaments: microfilaments (actin filaments), intermediate filaments, and microtubules. Microfilaments are the thinnest filaments, composed of actin, and are involved in maintaining cell shape, cell division (forming the contractile ring), muscle contraction, and cell movement (e.g., pseudopodia in amoeboid cells, cell crawling). They also anchor membrane proteins and provide structural support in microvilli. Intermediate filaments are the most stable filaments and provide mechanical strength, anchoring organelles, and maintaining cell shape—they're particularly important in cells that experience mechanical stress. Microtubules are the thickest filaments, made of tubulin, and serve as tracks for motor proteins (kinesins and dyneins) that transport vesicles, organelles, and other cargo throughout the cell. Microtubules also form the mitotic spindle during cell division, separating chromosomes, and are the structural foundation of cilia and flagella. The cytoskeleton is not static—filaments constantly assemble and disassemble, allowing cells to change shape, divide, move, and reorganize their internal contents. This dynamic nature is essential for cellular processes ranging from endocytosis and exocytosis to cell migration during development and wound healing.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Peroxisomes are responsible for:",
            options: [
                "A) Protein synthesis",
                "B) Breakdown of fatty acids and detoxification",
                "C) ATP production",
                "D) DNA replication"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Peroxisomes are small, membrane-bound organelles that specialize in the breakdown of fatty acids (through β-oxidation) and the detoxification of harmful substances, particularly those that generate hydrogen peroxide. These organelles contain enzymes like catalase, which breaks down hydrogen peroxide (H₂O₂) into water and oxygen, and various oxidase enzymes that produce H₂O₂ during their reactions. In liver cells, peroxisomes are especially important for detoxifying alcohol and other toxins. They also play roles in breaking down very long chain fatty acids (those longer than 22 carbons) that mitochondria cannot process. Peroxisomes are particularly abundant in cells that metabolize fats heavily, such as liver and kidney cells. In plant cells, peroxisomes are involved in photorespiration and converting stored fats into sugars during seed germination (glyoxysomes are specialized peroxisomes in germinating seeds). Unlike lysosomes, which have acidic interiors, peroxisomes have neutral pH. They are not involved in protein synthesis (ribosomes do that), ATP production (mitochondria do that), or DNA replication (nucleus does that). Peroxisomes can form by budding from the endoplasmic reticulum or by division of existing peroxisomes, and defects in peroxisomal function can lead to serious diseases like Zellweger syndrome.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The smooth endoplasmic reticulum is involved in:",
            options: [
                "A) Protein synthesis",
                "B) Lipid synthesis and detoxification",
                "C) ATP production",
                "D) DNA replication"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "The smooth endoplasmic reticulum (ER) is a network of membrane-bound tubules and vesicles that performs several critical functions distinct from the rough ER. It synthesizes lipids including phospholipids, cholesterol, and steroid hormones (like estrogen and testosterone in reproductive organs). The smooth ER is particularly abundant in cells that produce large amounts of lipids, such as liver cells and cells in the adrenal glands and ovaries. It also plays a crucial role in detoxification—liver cells contain extensive smooth ER with enzymes that break down drugs, poisons, and metabolic wastes, making them more water-soluble for excretion. The smooth ER metabolizes carbohydrates by storing glycogen and converting it to glucose when needed. Additionally, it serves as a calcium ion storage site in muscle cells, releasing Ca²⁺ to trigger muscle contraction when stimulated. In plant cells, smooth ER is involved in synthesizing lipids for plasma membranes and organelles. Unlike the rough ER, which is studded with ribosomes and synthesizes proteins, the smooth ER lacks ribosomes and focuses on lipid synthesis, detoxification, and calcium storage, making it essential for cellular metabolism and homeostasis.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which organelle has its own DNA?",
            options: [
                "A) Only the nucleus",
                "B) Nucleus, mitochondria, and chloroplasts",
                "C) Only mitochondria",
                "D) All organelles"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "The nucleus, mitochondria, and chloroplasts all contain their own DNA, which provides strong evidence for the endosymbiotic theory explaining the origin of mitochondria and chloroplasts. The nucleus contains the majority of a cell's genetic information, organized into chromosomes. However, mitochondria and chloroplasts have their own small circular DNA molecules (similar to bacterial DNA), which encode some of their own proteins and RNAs. This is remarkable because these organelles also have their own ribosomes (similar in size to bacterial ribosomes), can replicate independently through binary fission (like bacteria), and are surrounded by double membranes (consistent with being engulfed by another cell). According to the endosymbiotic theory, mitochondria evolved from an alpha-proteobacterium that was engulfed by an ancestral eukaryotic cell about 2 billion years ago, while chloroplasts evolved from a cyanobacterium that was engulfed by an ancestral plant/algal cell. Over evolutionary time, most genes from these endosymbionts were transferred to the host nucleus, but these organelles retained some genes necessary for their function. This explains why mitochondria and chloroplasts have their own DNA, ribosomes, and can divide independently, characteristics that suggest they were once free-living prokaryotic cells. The nuclear DNA, in contrast, evolved through different mechanisms and contains the bulk of the cell's genetic information.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The nucleolus is the site of:",
            options: [
                "A) DNA replication",
                "B) Ribosome assembly",
                "C) Protein synthesis",
                "D) ATP production"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "The nucleolus is a specialized region within the nucleus that serves as the site of ribosome biogenesis—the assembly of ribosomal subunits. This is where ribosomal RNA (rRNA) genes are transcribed to produce the RNA components of ribosomes. The nucleolus appears as a dense, non-membrane-bound region under a microscope, often appearing as one or more dark spots within the nucleus. It contains multiple copies of rRNA genes (ribosomal DNA), transcription machinery, and various proteins required for ribosome assembly. After rRNA is transcribed, it combines with ribosomal proteins (imported from the cytoplasm) to form the small and large ribosomal subunits. These partially assembled subunits are then exported through nuclear pores to the cytoplasm, where final assembly into functional ribosomes occurs. The nucleolus is particularly large and prominent in cells that are actively synthesizing proteins and need many ribosomes, such as rapidly dividing cells or cells secreting large amounts of protein. The size and number of nucleoli can vary depending on the cell's metabolic activity—actively growing cells have larger nucleoli with more ribosome production. The nucleolus disappears during cell division when the nuclear envelope breaks down and reforms as the nucleus reassembles after division.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which organelle is involved in protein sorting and export?",
            options: [
                "A) Mitochondria",
                "B) Golgi apparatus",
                "C) Peroxisomes",
                "D) Lysosomes"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "The Golgi apparatus modifies, sorts, and packages proteins for export to their final destinations, including the plasma membrane, lysosomes, or secretion from the cell.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Ribosomes are composed of:",
            options: [
                "A) Only proteins",
                "B) Only RNA",
                "C) Proteins and RNA",
                "D) DNA and proteins"
            ],
            correct: 2,
            difficulty: "medium",
            explanation: "Ribosomes are composed of ribosomal RNA (rRNA) and proteins, forming the structural and functional components necessary for protein synthesis.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which organelle is responsible for breaking down damaged organelles?",
            options: [
                "A) Peroxisomes",
                "B) Lysosomes",
                "C) Golgi apparatus",
                "D) Endoplasmic reticulum"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Lysosomes contain hydrolytic enzymes that digest damaged organelles, macromolecules, and cellular waste in a process called autophagy.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The cristae in mitochondria:",
            options: [
                "A) Store DNA",
                "B) Increase surface area for ATP production",
                "C) Contain chlorophyll",
                "D) Synthesize proteins"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "The cristae are folds in the inner mitochondrial membrane that greatly increase surface area, allowing more space for ATP synthase and the electron transport chain.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which structure helps maintain cell shape and provides mechanical support?",
            options: [
                "A) Only microfilaments",
                "B) Only microtubules",
                "C) The cytoskeleton",
                "D) Only intermediate filaments"
            ],
            correct: 2,
            difficulty: "easy",
            explanation: "The cytoskeleton (composed of microfilaments, intermediate filaments, and microtubules) provides mechanical support and helps maintain cell shape.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Vacuoles in plant cells:",
            options: [
                "A) Are absent",
                "B) Store water, ions, and waste",
                "C) Produce ATP",
                "D) Synthesize proteins"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "Plant cells have large central vacuoles that store water, ions, nutrients, and waste products, helping maintain turgor pressure and cell size.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which organelle is the site of the electron transport chain?",
            options: [
                "A) Chloroplasts only",
                "B) Mitochondria only",
                "C) Both mitochondria and chloroplasts",
                "D) Endoplasmic reticulum"
            ],
            correct: 2,
            difficulty: "hard",
            explanation: "Both mitochondria and chloroplasts contain electron transport chains: mitochondria use it for cellular respiration, chloroplasts use it for photosynthesis.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The thylakoids in chloroplasts are the site of:",
            options: [
                "A) The Calvin cycle",
                "B) The light-dependent reactions",
                "C) Cellular respiration",
                "D) Protein synthesis"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "The thylakoids are membrane-bound compartments within chloroplasts where the light-dependent reactions of photosynthesis occur, including the electron transport chain.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which statement about mitochondria is TRUE?",
            options: [
                "A) They have a single membrane",
                "B) They have double membranes",
                "C) They lack DNA",
                "D) They are only in plant cells"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Mitochondria have double membranes: an outer membrane and a highly folded inner membrane (cristae), supporting the endosymbiotic theory.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The stroma in chloroplasts is the site of:",
            options: [
                "A) Light-dependent reactions",
                "B) The Calvin cycle",
                "C) Electron transport",
                "D) ATP hydrolysis"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "The stroma is the fluid-filled space inside chloroplasts where the Calvin cycle (light-independent reactions) of photosynthesis occurs.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which cytoskeletal element is involved in cell division?",
            options: [
                "A) Only microfilaments",
                "B) Only microtubules",
                "C) Both microfilaments and microtubules",
                "D) Only intermediate filaments"
            ],
            correct: 2,
            difficulty: "hard",
            explanation: "Both microfilaments (form the contractile ring in cytokinesis) and microtubules (form the mitotic spindle) are involved in cell division.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Ribosomes can be found in:",
            options: [
                "A) Only the cytoplasm",
                "B) Only the rough ER",
                "C) The cytoplasm and attached to the rough ER",
                "D) Only the nucleus"
            ],
            correct: 2,
            difficulty: "medium",
            explanation: "Ribosomes exist as free ribosomes in the cytoplasm and as bound ribosomes attached to the rough ER, with each producing different types of proteins.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which organelle is most abundant in liver cells?",
            options: [
                "A) Chloroplasts",
                "B) Smooth ER",
                "C) Lysosomes",
                "D) Mitochondria"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Liver cells have abundant smooth ER because it detoxifies drugs and poisons, metabolizes carbohydrates, and synthesizes lipids - all important liver functions.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The nuclear envelope is continuous with:",
            options: [
                "A) The Golgi apparatus",
                "B) The endoplasmic reticulum",
                "C) The plasma membrane",
                "D) Mitochondria"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "The nuclear envelope is continuous with the endoplasmic reticulum, with the outer nuclear membrane connecting directly to the rough ER membrane.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which organelle produces hydrogen peroxide as a byproduct?",
            options: [
                "A) Mitochondria",
                "B) Peroxisomes",
                "C) Lysosomes",
                "D) Golgi apparatus"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Peroxisomes produce hydrogen peroxide (H₂O₂) as a byproduct when breaking down fatty acids and detoxifying harmful substances, which is then converted to water.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The cell wall in plants is composed primarily of:",
            options: [
                "A) Cellulose",
                "B) Chitin",
                "C) Peptidoglycan",
                "D) Proteins"
            ],
            correct: 0,
            difficulty: "easy",
            explanation: "Plant cell walls are primarily composed of cellulose, a polysaccharide made of glucose units that provides structural support and protection.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which statement about microfilaments is TRUE?",
            options: [
                "A) They are made of tubulin",
                "B) They are made of actin",
                "C) They are the thickest cytoskeletal element",
                "D) They form cilia and flagella"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Microfilaments are made of actin proteins and are the thinnest cytoskeletal elements, involved in cell movement, shape, and division.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The intermediate filaments:",
            options: [
                "A) Are the thinnest cytoskeletal element",
                "B) Provide permanent structural support",
                "C) Are involved in cell movement",
                "D) Form the mitotic spindle"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Intermediate filaments are permanent structural elements that provide mechanical strength and help anchor organelles, forming a durable scaffold in cells.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which organelle contains hydrolytic enzymes at acidic pH?",
            options: [
                "A) Peroxisomes",
                "B) Lysosomes",
                "C) Mitochondria",
                "D) Endoplasmic reticulum"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Lysosomes contain hydrolytic enzymes that function best at acidic pH (around 5), which helps prevent damage if lysosomes leak into the neutral cytoplasm.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The centrosome contains:",
            options: [
                "A) Only centrioles",
                "B) Centrioles and microtubule organizing centers",
                "C) Only microtubules",
                "D) Only actin"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "The centrosome contains a pair of centrioles surrounded by pericentriolar material that serves as a microtubule organizing center, crucial for spindle formation during cell division.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which organelle is NOT surrounded by a double membrane?",
            options: [
                "A) Nucleus",
                "B) Mitochondria",
                "C) Chloroplasts",
                "D) Endoplasmic reticulum"
            ],
            correct: 3,
            difficulty: "medium",
            explanation: "The endoplasmic reticulum has a single membrane, while the nucleus, mitochondria, and chloroplasts all have double membranes supporting endosymbiotic origins.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The contractile vacuole in freshwater protists functions to:",
            options: [
                "A) Store nutrients",
                "B) Expel excess water",
                "C) Produce ATP",
                "D) Synthesize proteins"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Contractile vacuoles actively pump out excess water that enters freshwater protists by osmosis, preventing cell lysis in hypotonic environments.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which structure is unique to plant cells?",
            options: [
                "A) Mitochondria",
                "B) Chloroplasts",
                "C) Ribosomes",
                "D) Endoplasmic reticulum"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "Chloroplasts are unique to plant cells (and some algae), containing chlorophyll for photosynthesis, while other organelles listed are found in both plant and animal cells.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The endomembrane system includes:",
            options: [
                "A) Only the nucleus",
                "B) Nucleus, ER, Golgi, lysosomes, and plasma membrane",
                "C) Only mitochondria",
                "D) Only chloroplasts"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "The endomembrane system includes the nuclear envelope, ER, Golgi apparatus, lysosomes, vesicles, and plasma membrane - all connected by membrane flow or continuity.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which organelle has its own ribosomes?",
            options: [
                "A) Only the nucleus",
                "B) Mitochondria and chloroplasts",
                "C) Only the ER",
                "D) All organelles"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Mitochondria and chloroplasts have their own ribosomes (similar to bacterial ribosomes), supporting the endosymbiotic theory of their evolution from prokaryotic ancestors.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        }
    ],

    compartmentalization: [
        {
            question: "Cell compartmentalization allows cells to:",
            options: [
                "A) Increase surface area",
                "B) Separate incompatible chemical reactions",
                "C) Reduce the need for membranes",
                "D) Eliminate the need for enzymes"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "Compartmentalization allows cells to carry out incompatible reactions simultaneously by separating them into different membrane-bound compartments.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The endosymbiotic theory explains the origin of:",
            options: [
                "A) The nucleus",
                "B) Mitochondria and chloroplasts",
                "C) The endoplasmic reticulum",
                "D) The Golgi apparatus"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "The endosymbiotic theory proposes that mitochondria and chloroplasts evolved from free-living prokaryotic cells that were engulfed by ancestral eukaryotic cells.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Evidence supporting the endosymbiotic theory includes:",
            options: [
                "A) Mitochondria have their own DNA",
                "B) Mitochondria have double membranes",
                "C) Mitochondria reproduce independently",
                "D) All of the above"
            ],
            correct: 3,
            difficulty: "medium",
            explanation: "Mitochondria have circular DNA, double membranes, can reproduce independently, and have ribosomes similar to bacteria, supporting endosymbiotic origin.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which structure is NOT thought to have evolved via endosymbiosis?",
            options: [
                "A) Mitochondria",
                "B) Chloroplasts",
                "C) Nucleus",
                "D) None of the above (all evolved via endosymbiosis)"
            ],
            correct: 2,
            difficulty: "medium",
            explanation: "The nucleus is thought to have evolved from invagination of the plasma membrane, not from endosymbiosis like mitochondria and chloroplasts.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Compartmentalization is advantageous because it:",
            options: [
                "A) Increases metabolic efficiency",
                "B) Allows concentration of enzymes and substrates",
                "C) Maintains optimal pH for different reactions",
                "D) All of the above"
            ],
            correct: 3,
            difficulty: "medium",
            explanation: "Compartmentalization is a fundamental feature of eukaryotic cells that provides numerous advantages by separating cellular processes into distinct membrane-bound organelles. This organization increases metabolic efficiency by concentrating enzymes and their substrates in specific locations, increasing the likelihood of reactions occurring and allowing for higher local concentrations of reactants. Different compartments can maintain optimal conditions for specific reactions—for example, lysosomes maintain acidic pH (around 4.5-5.0) optimal for their hydrolytic enzymes, while the cytoplasm maintains neutral pH (around 7.0-7.4) suitable for most enzymatic reactions. This allows incompatible processes to occur simultaneously: for instance, cellular respiration (which consumes O₂ and produces CO₂) occurs in mitochondria, while photosynthesis (which consumes CO₂ and produces O₂) occurs in chloroplasts, and they don't interfere with each other. Compartmentalization also allows cells to regulate processes independently—for example, protein synthesis occurs in the rough ER and cytoplasm, while protein degradation occurs in lysosomes. Additionally, harmful substances can be isolated (like reactive oxygen species in peroxisomes) or stored in specialized compartments (like waste in vacuoles). This spatial organization is essential for the complexity of eukaryotic cells and allows for sophisticated regulation and coordination of cellular processes.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The nuclear envelope is derived from:",
            options: [
                "A) The endoplasmic reticulum",
                "B) Invagination of the plasma membrane",
                "C) Endosymbiotic events",
                "D) The Golgi apparatus"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "The nuclear envelope likely evolved through invagination of the plasma membrane, creating a separate compartment for the genetic material.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Primary endosymbiosis refers to:",
            options: [
                "A) A prokaryote engulfing another prokaryote",
                "B) A eukaryote engulfing a prokaryote",
                "C) A eukaryote engulfing another eukaryote",
                "D) Formation of the nucleus"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Primary endosymbiosis occurs when a eukaryotic cell engulfs a prokaryotic cell (e.g., ancestral eukaryote engulfing the mitochondrion ancestor).",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Chloroplasts likely originated from:",
            options: [
                "A) Cyanobacteria",
                "B) Purple bacteria",
                "C) Archaea",
                "D) Viruses"
            ],
            correct: 0,
            difficulty: "medium",
            explanation: "Chloroplasts are thought to have originated from cyanobacteria that were engulfed by ancestral eukaryotic cells in a primary endosymbiotic event.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which statement about membrane-bound organelles is true?",
            options: [
                "A) All eukaryotic cells have the same organelles",
                "B) Organelle structure is identical across all species",
                "C) Organelles allow specialization of function",
                "D) Prokaryotes have more organelles than eukaryotes"
            ],
            correct: 2,
            difficulty: "easy",
            explanation: "Membrane-bound organelles allow eukaryotic cells to specialize different regions for specific functions, increasing complexity and efficiency.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Secondary endosymbiosis can explain:",
            options: [
                "A) The origin of mitochondria",
                "B) The origin of chloroplasts in some algae",
                "C) The origin of the nucleus",
                "D) The origin of ribosomes"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Secondary endosymbiosis (a eukaryote engulfing another eukaryote) explains how some algal groups acquired chloroplasts.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The advantage of compartmentalizing metabolic reactions is:",
            options: [
                "A) Reactions can occur at incompatible pH levels",
                "B) Enzymes and substrates can be concentrated",
                "C) Competing reactions are separated",
                "D) All of the above"
            ],
            correct: 3,
            difficulty: "medium",
            explanation: "Compartmentalization allows different pH levels, concentrates reactants, and separates incompatible reactions, all contributing to metabolic efficiency.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which evidence supports mitochondria having bacterial ancestry?",
            options: [
                "A) Circular DNA",
                "B) 70S ribosomes",
                "C) Binary fission",
                "D) All of the above"
            ],
            correct: 3,
            difficulty: "hard",
            explanation: "Mitochondria have circular DNA (like bacteria), 70S ribosomes (similar to bacterial ribosomes), and reproduce by binary fission - all characteristics of bacteria supporting endosymbiotic origin.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The inner membrane of mitochondria likely evolved from:",
            options: [
                "A) The nuclear envelope",
                "B) The plasma membrane of an engulfed bacterium",
                "C) The ER membrane",
                "D) The Golgi membrane"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "The inner mitochondrial membrane likely evolved from the plasma membrane of an engulfed α-proteobacterium, while the outer membrane came from the host's membrane during engulfment.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Why is compartmentalization important for cellular respiration?",
            options: [
                "A) It prevents ATP production",
                "B) It separates glycolysis from the Krebs cycle",
                "C) It allows reactions to occur at optimal pH",
                "D) It inhibits electron transport"
            ],
            correct: 2,
            difficulty: "hard",
            explanation: "Compartmentalization allows different stages of cellular respiration to occur in different locations (glycolysis in cytosol, Krebs cycle in mitochondrial matrix) at optimal pH and with appropriate enzymes.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The evolution of eukaryotic cells likely involved:",
            options: [
                "A) Only endosymbiosis",
                "B) Membrane invagination and endosymbiosis",
                "C) Only membrane invagination",
                "D) Spontaneous generation"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "The evolution of eukaryotic cells likely involved both membrane invagination (forming ER, nuclear envelope) and endosymbiotic events (acquiring mitochondria and chloroplasts).",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which structure demonstrates compartmentalization?",
            options: [
                "A) The cell wall",
                "B) The plasma membrane",
                "C) Membrane-bound organelles",
                "D) The cytoskeleton"
            ],
            correct: 2,
            difficulty: "easy",
            explanation: "Membrane-bound organelles like mitochondria, chloroplasts, and the ER demonstrate compartmentalization by creating separate spaces for different cellular functions.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The matrix of mitochondria is:",
            options: [
                "A) The space between the two membranes",
                "B) The fluid-filled interior compartment",
                "C) The outer membrane",
                "D) The cristae"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "The mitochondrial matrix is the fluid-filled space enclosed by the inner membrane, where the Krebs cycle occurs and containing mitochondrial DNA and ribosomes.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which organelle contains its own ribosomes similar to bacteria?",
            options: [
                "A) Only the nucleus",
                "B) Mitochondria and chloroplasts",
                "C) Only the ER",
                "D) All organelles"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Mitochondria and chloroplasts contain 70S ribosomes (similar to bacterial ribosomes), supporting the endosymbiotic theory, while eukaryotic cells have 80S ribosomes.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The outer membrane of mitochondria likely came from:",
            options: [
                "A) The engulfed bacterium",
                "B) The host cell's membrane",
                "C) The ER",
                "D) The Golgi"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "During endosymbiosis, the outer mitochondrial membrane likely derived from the host cell's membrane that surrounded the engulfed bacterium during the endocytosis-like process.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Compartmentalization allows eukaryotic cells to:",
            options: [
                "A) Be smaller than prokaryotes",
                "B) Carry out more complex processes",
                "C) Have fewer enzymes",
                "D) Reduce metabolic efficiency"
            ],
            correct: 1,
            difficulty: "easy",
            explanation: "Compartmentalization allows eukaryotic cells to carry out more complex processes by separating incompatible reactions and creating specialized environments for different functions.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The endosymbiotic event that gave rise to mitochondria occurred:",
            options: [
                "A) Before chloroplasts",
                "B) After chloroplasts",
                "C) Simultaneously with chloroplasts",
                "D) Only in plant cells"
            ],
            correct: 0,
            difficulty: "hard",
            explanation: "The endosymbiotic event that gave rise to mitochondria occurred first (in the ancestor of all eukaryotes), while chloroplasts came later in an independent endosymbiotic event in plant ancestors.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Why do mitochondria and chloroplasts have their own DNA?",
            options: [
                "A) They evolved from free-living organisms",
                "B) They need extra genetic material",
                "C) The nucleus cannot hold all DNA",
                "D) It's a coincidence"
            ],
            correct: 0,
            difficulty: "medium",
            explanation: "Mitochondria and chloroplasts have their own DNA because they evolved from free-living prokaryotic organisms that were engulfed but retained some of their genetic material.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The intermembrane space in mitochondria is:",
            options: [
                "A) Inside the inner membrane",
                "B) Between the two membranes",
                "C) Outside the outer membrane",
                "D) Part of the cytosol"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "The intermembrane space is the narrow region between the inner and outer mitochondrial membranes, where protons accumulate during electron transport.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which characteristic of mitochondria suggests bacterial ancestry?",
            options: [
                "A) Linear DNA",
                "B) Circular DNA",
                "C) No DNA",
                "D) Only RNA"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Mitochondria have circular DNA, similar to bacterial chromosomes, which is strong evidence supporting their bacterial ancestry through endosymbiosis.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The evolution of compartmentalization allowed cells to:",
            options: [
                "A) Become smaller",
                "B) Increase complexity without increasing size proportionally",
                "C) Eliminate membranes",
                "D) Reduce surface area"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Compartmentalization allowed eukaryotic cells to increase complexity and specialization without proportionally increasing cell size, as reactions could be organized in membrane-bound compartments.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which process occurs in the mitochondrial matrix?",
            options: [
                "A) Glycolysis",
                "B) The Krebs cycle",
                "C) Electron transport",
                "D) Fermentation"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "The Krebs cycle (citric acid cycle) occurs in the mitochondrial matrix, while electron transport occurs in the inner membrane and glycolysis occurs in the cytosol.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The origin of chloroplasts in different algal groups can be traced to:",
            options: [
                "A) Only primary endosymbiosis",
                "B) Primary and secondary endosymbiosis",
                "C) Only membrane invagination",
                "D) Spontaneous formation"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Chloroplasts in different algal groups have diverse origins: some from primary endosymbiosis (green and red algae), others from secondary endosymbiosis (euglenids, dinoflagellates).",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Compartmentalization increases efficiency by:",
            options: [
                "A) Slowing reactions down",
                "B) Concentrating reactants and maintaining optimal conditions",
                "C) Preventing all reactions",
                "D) Isolating all processes"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Compartmentalization increases efficiency by concentrating enzymes and substrates in specific locations and maintaining optimal pH and other conditions for each reaction.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The nuclear pores allow:",
            options: [
                "A) DNA to exit the nucleus",
                "B) RNA and proteins to move between nucleus and cytoplasm",
                "C) Only small molecules through",
                "D) Nothing through"
            ],
            correct: 1,
            difficulty: "medium",
            explanation: "Nuclear pores allow selective transport of RNA and proteins between the nucleus and cytoplasm, while preventing DNA from leaving the nucleus.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which statement about organelle evolution is FALSE?",
            options: [
                "A) All organelles evolved via endosymbiosis",
                "B) Some organelles evolved via membrane invagination",
                "C) Mitochondria likely evolved from bacteria",
                "D) The ER likely evolved via membrane invagination"
            ],
            correct: 0,
            difficulty: "hard",
            explanation: "Not all organelles evolved via endosymbiosis. The ER, Golgi, and nuclear envelope likely evolved via membrane invagination, while mitochondria and chloroplasts evolved via endosymbiosis.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The advantage of having membrane-bound organelles includes:",
            options: [
                "A) Separating incompatible reactions",
                "B) Creating optimal environments for different processes",
                "C) Increasing surface area for reactions",
                "D) All of the above"
            ],
            correct: 3,
            difficulty: "medium",
            explanation: "Membrane-bound organelles provide multiple advantages: separating incompatible reactions, creating optimal conditions, and increasing surface area through internal membranes like cristae.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Why do chloroplasts have three membranes in some algae?",
            options: [
                "A) They evolved via primary endosymbiosis",
                "B) They evolved via secondary endosymbiosis",
                "C) They are defective",
                "D) They need extra protection"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Chloroplasts with three membranes in some algal groups (like euglenids) resulted from secondary endosymbiosis, where a eukaryotic cell engulfed another eukaryote that already had chloroplasts.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The evolution of the endomembrane system likely involved:",
            options: [
                "A) Only endosymbiosis",
                "B) Membrane invagination and budding",
                "C) Only budding",
                "D) Spontaneous formation"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "The endomembrane system (ER, Golgi, vesicles, lysosomes) likely evolved through membrane invagination of the plasma membrane and subsequent budding and fusion events.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which characteristic supports the endosymbiotic origin of chloroplasts?",
            options: [
                "A) Circular DNA",
                "B) 70S ribosomes",
                "C) Binary fission",
                "D) All of the above"
            ],
            correct: 3,
            difficulty: "hard",
            explanation: "Chloroplasts have circular DNA, 70S ribosomes, and reproduce by binary fission - all characteristics of cyanobacteria supporting their endosymbiotic origin.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "The separation of metabolic processes into organelles allows:",
            options: [
                "A) More efficient regulation",
                "B) Optimization of conditions for each process",
                "C) Prevention of interference between reactions",
                "D) All of the above"
            ],
            correct: 3,
            difficulty: "medium",
            explanation: "Organelle compartmentalization allows more efficient regulation, optimal conditions for each process, and prevents competing or incompatible reactions from interfering with each other.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        },
        {
            question: "Which structure is thought to have evolved first in eukaryotic cells?",
            options: [
                "A) Chloroplasts",
                "B) Mitochondria",
                "C) The nucleus",
                "D) The Golgi"
            ],
            correct: 1,
            difficulty: "hard",
            explanation: "Mitochondria are thought to have evolved first in eukaryotic cells, as all eukaryotes have mitochondria (or mitochondrial remnants), while chloroplasts and other organelles came later.",
            timeLimit: CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE
        }
    ],

    "chi-squared": [
        {
            type: "chi-squared",
            question: "A genetics student is testing whether observed phenotypic ratios match expected Mendelian ratios. Calculate the chi-squared value and degrees of freedom for this data:",
            data: {
                observed: [75, 25],
                expected: [75, 25],
                categories: ["Dominant", "Recessive"]
            },
            correctChiSquared: 0.00,
            correctDF: 1,
            tolerance: 0.01,
            difficulty: "easy",
            explanation: "χ² = Σ((O-E)²/E) = (75-75)²/75 + (25-25)²/25 = 0 + 0 = 0.00. Degrees of freedom = number of categories - 1 = 2 - 1 = 1.",
            timeLimit: CONFIG.DEFAULT_TIME_CHI_SQUARED
        },
        {
            type: "chi-squared",
            question: "In a dihybrid cross, you observe the following phenotypes. Calculate χ² and df:",
            data: {
                observed: [315, 108, 101, 32],
                expected: [281.25, 93.75, 93.75, 31.25],
                categories: ["Round Yellow", "Round Green", "Wrinkled Yellow", "Wrinkled Green"]
            },
            correctChiSquared: 4.47,
            correctDF: 3,
            tolerance: 0.1,
            difficulty: "medium",
            explanation: "χ² = (315-281.25)²/281.25 + (108-93.75)²/93.75 + (101-93.75)²/93.75 + (32-31.25)²/31.25 ≈ 4.47. df = 4 - 1 = 3.",
            timeLimit: CONFIG.DEFAULT_TIME_CHI_SQUARED
        },
        {
            type: "chi-squared",
            question: "A researcher is testing if observed genotype frequencies match Hardy-Weinberg expectations. Calculate χ² and degrees of freedom:",
            data: {
                observed: [45, 30, 25],
                expected: [40, 40, 20],
                categories: ["AA", "Aa", "aa"]
            },
            correctChiSquared: 3.125,
            correctDF: 2,
            tolerance: 0.1,
            difficulty: "medium",
            explanation: "χ² = (45-40)²/40 + (30-40)²/40 + (25-20)²/20 = 0.625 + 2.5 + 1.25 = 3.125. df = 3 - 1 = 2.",
            timeLimit: CONFIG.DEFAULT_TIME_CHI_SQUARED
        },
        {
            type: "chi-squared",
            question: "You're testing whether plant height follows a normal distribution. Calculate χ² and df for this data:",
            data: {
                observed: [10, 20, 30, 25, 15],
                expected: [12, 22, 32, 22, 12],
                categories: ["Very Short", "Short", "Medium", "Tall", "Very Tall"]
            },
            correctChiSquared: 1.85,
            correctDF: 4,
            tolerance: 0.1,
            difficulty: "hard",
            explanation: "χ² = (10-12)²/12 + (20-22)²/22 + (30-32)²/32 + (25-22)²/22 + (15-12)²/12 ≈ 0.33 + 0.18 + 0.125 + 0.41 + 0.75 ≈ 1.85. df = 5 - 1 = 4.",
            timeLimit: CONFIG.DEFAULT_TIME_CHI_SQUARED
        },
        {
            type: "chi-squared",
            question: "Testing genetic linkage with observed vs expected ratios. Calculate χ² and degrees of freedom:",
            data: {
                observed: [120, 40, 38, 2],
                expected: [100, 50, 50, 0],
                categories: ["Parental 1", "Recombinant 1", "Recombinant 2", "Parental 2"]
            },
            correctChiSquared: 42.0,
            correctDF: 3,
            tolerance: 1.0,
            difficulty: "hard",
            explanation: "χ² = (120-100)²/100 + (40-50)²/50 + (38-50)²/50 + (2-0)²/0.1 ≈ 4 + 2 + 2.88 + 40 ≈ 42.0. df = 4 - 1 = 3. (Note: Expected value of 0 requires adjustment)",
            timeLimit: CONFIG.DEFAULT_TIME_CHI_SQUARED
        }
    ]
};

// Section names for display
const sectionNames = {
    transport: "Mechanisms of Transport",
    diffusion: "Facilitated Diffusion",
    membranes: "Plasma Membranes",
    structures: "Cell Structures and Functions",
    compartmentalization: "Cell Compartmentalization",
    "chi-squared": "Chi-squared Tests"
};

// Utility Functions

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function calculateChiSquared(observed, expected) {
    let chiSquared = 0;
    for (let i = 0; i < observed.length; i++) {
        const diff = observed[i] - expected[i];
        chiSquared += (diff * diff) / expected[i];
    }
    return chiSquared;
}

// Skill Management Functions

function getSkillLevel(section) {
    // Load from localStorage
    try {
        const saved = localStorage.getItem(`skill_${section}`);
        if (saved) {
            const skill = parseFloat(saved);
            return Math.max(0, Math.min(100, skill)); // Clamp between 0-100
        }
    } catch (e) {
        console.error('Error loading skill:', e);
    }
    return 0; // Default to 0 (beginner)
}

function saveSkillLevel(section, skill) {
    try {
        localStorage.setItem(`skill_${section}`, String(skill));
    } catch (e) {
        console.error('Error saving skill:', e);
    }
}

function calculateSkillChange(currentAccuracy, currentSkill) {
    // Calculate skill change based on accuracy
    let change = 0;
    
    // If perfect score (5/5 = 100%), advance to next level
    if (currentAccuracy === 1.0) {
        // Level thresholds: 1->2: 40, 2->3: 60, 3->4: 75, 4->5: 85
        let nextThreshold = 40;
        if (currentSkill >= 85) {
            // Already at max level, no change needed
            return 0;
        } else if (currentSkill >= 75) {
            nextThreshold = 85; // Level 4 -> 5
        } else if (currentSkill >= 60) {
            nextThreshold = 75; // Level 3 -> 4
        } else if (currentSkill >= 40) {
            nextThreshold = 60; // Level 2 -> 3
        } else {
            nextThreshold = 40; // Level 1 -> 2
        }
        // Calculate change needed to reach next threshold
        change = nextThreshold - currentSkill;
    } else if (currentAccuracy >= CONFIG.SKILL_INCREASE_THRESHOLD) {
        // Increase skill - more increase for higher accuracy
        const excessAccuracy = currentAccuracy - CONFIG.SKILL_INCREASE_THRESHOLD;
        change = CONFIG.SKILL_INCREASE_AMOUNT * 100 * (1 + excessAccuracy * 2); // Scale by excess accuracy
    } else if (currentAccuracy < CONFIG.SKILL_DECREASE_THRESHOLD) {
        // Decrease skill - more decrease for lower accuracy
        const deficitAccuracy = CONFIG.SKILL_DECREASE_THRESHOLD - currentAccuracy;
        change = -CONFIG.SKILL_DECREASE_AMOUNT * 100 * (1 + deficitAccuracy * 2); // Scale by deficit
    }
    
    return change;
}

function updateSkillLevel(section, sessionAccuracy) {
    const currentSkill = getSkillLevel(section);
    const change = calculateSkillChange(sessionAccuracy, currentSkill);
    const newSkill = Math.max(0, Math.min(100, currentSkill + change));
    
    saveSkillLevel(section, newSkill);
    return newSkill;
}

function getSkillLevelName(skill) {
    // Convert 0-100 skill to 1-5 level
    if (skill >= 85) return { level: 5, name: "Expert", color: "green" };
    if (skill >= 75) return { level: 4, name: "Advanced", color: "green" };
    if (skill >= 60) return { level: 3, name: "Intermediate", color: "yellow" };
    if (skill >= 40) return { level: 2, name: "Novice", color: "yellow" };
    return { level: 1, name: "Beginner", color: "red" };
}

function getUnlockedDifficulties(skill) {
    // Return array of unlocked difficulty levels based on skill
    const skillInfo = getSkillLevelName(skill);
    const difficulties = [];
    
    if (skillInfo.level >= 1) difficulties.push('easy');
    if (skillInfo.level >= 3) difficulties.push('medium');
    if (skillInfo.level >= 4) difficulties.push('hard');
    
    return difficulties;
}

function getQuestionIndexInBank(question, allQuestions) {
    // Find the index of a question in the original bank
    return allQuestions.findIndex(q => 
        q.question === question.question && 
        q.correct === question.correct &&
        JSON.stringify(q.options) === JSON.stringify(question.options)
    );
}

function selectQuestionsBySkill(allQuestions, section, count = CONFIG.QUESTIONS_PER_RUN) {
    const skill = getSkillLevel(section);
    const unlockedDifficulties = getUnlockedDifficulties(skill);
    const skillInfo = getSkillLevelName(skill);
    
    // Initialize recent questions tracking for this section if needed
    if (!recentQuestions[section]) {
        recentQuestions[section] = [];
    }
    
    // Filter questions by unlocked difficulties
    let availableQuestions = allQuestions.filter((q, index) => 
        unlockedDifficulties.includes(q.difficulty || 'easy')
    ).map((q, idx) => ({ ...q, originalIndex: allQuestions.findIndex(q2 => q2 === q) }));
    
    // If no unlocked questions, use easy questions
    if (availableQuestions.length === 0) {
        availableQuestions = allQuestions.filter((q, index) => 
            (q.difficulty || 'easy') === 'easy'
        ).map((q, idx) => ({ ...q, originalIndex: allQuestions.findIndex(q2 => q2 === q) }));
    }
    
    // Separate questions by difficulty
    const easyQuestions = availableQuestions.filter(q => (q.difficulty || 'easy') === 'easy');
    const mediumQuestions = availableQuestions.filter(q => q.difficulty === 'medium');
    const hardQuestions = availableQuestions.filter(q => q.difficulty === 'hard');
    
    // Determine difficulty distribution based on skill level
    let easyCount, mediumCount, hardCount;
    
    if (skillInfo.level <= 1) {
        // Beginner: mostly easy
        easyCount = Math.min(count - 1, Math.floor(count * 0.8));
        mediumCount = count - easyCount;
        hardCount = 0;
    } else if (skillInfo.level <= 2) {
        // Novice: mostly easy, some medium
        easyCount = Math.floor(count * 0.6);
        mediumCount = count - easyCount;
        hardCount = 0;
    } else if (skillInfo.level <= 3) {
        // Intermediate: mix of easy and medium
        easyCount = Math.floor(count * 0.4);
        mediumCount = count - easyCount;
        hardCount = 0;
    } else if (skillInfo.level <= 4) {
        // Advanced: mostly medium, some hard
        easyCount = Math.floor(count * 0.2);
        mediumCount = Math.floor(count * 0.6);
        hardCount = count - easyCount - mediumCount;
    } else {
        // Expert: mostly medium and hard
        easyCount = Math.floor(count * 0.2);
        hardCount = Math.floor(count * 0.5);
        mediumCount = count - easyCount - hardCount;
    }
    
    // Function to select questions avoiding recent ones
    function selectVariedQuestions(questionPool, needed, recentIndices) {
        if (questionPool.length === 0) return [];
        
        // Separate into recent and not recent
        const notRecent = questionPool.filter(q => !recentIndices.includes(q.originalIndex));
        const recent = questionPool.filter(q => recentIndices.includes(q.originalIndex));
        
        // Prioritize non-recent questions, but include some recent ones if needed for variety
        let selected = [];
        
        // First, try to fill from non-recent questions
        const shuffledNotRecent = shuffleArray(notRecent);
        selected.push(...shuffledNotRecent.slice(0, needed));
        
        // If we need more and have recent questions available, add some for variety
        // But avoid the MOST recent ones (last 2-3 sessions)
        if (selected.length < needed && recent.length > 0) {
            const lessRecent = recent.filter((q, idx) => {
                const recency = recentIndices.length - recentIndices.indexOf(q.originalIndex);
                return recency > 3; // Not in the last 3 questions
            });
            const shuffledLessRecent = shuffleArray(lessRecent);
            const remaining = needed - selected.length;
            selected.push(...shuffledLessRecent.slice(0, remaining));
        }
        
        // Final fallback: if still not enough, use any available (shuffled for variety)
        if (selected.length < needed) {
            const allShuffled = shuffleArray(questionPool);
            const alreadySelectedIndices = new Set(selected.map(q => q.originalIndex));
            const remaining = allShuffled.filter(q => !alreadySelectedIndices.has(q.originalIndex));
            selected.push(...remaining.slice(0, needed - selected.length));
        }
        
        return selected.slice(0, needed);
    }
    
    // Select questions from each difficulty pool with variety
    const selectedEasy = selectVariedQuestions(easyQuestions, easyCount, recentQuestions[section]);
    const selectedMedium = selectVariedQuestions(mediumQuestions, mediumCount, recentQuestions[section]);
    const selectedHard = selectVariedQuestions(hardQuestions, hardCount, recentQuestions[section]);
    
    // Combine all selections
    let finalSelection = [...selectedEasy, ...selectedMedium, ...selectedHard];
    
    // Shuffle the final selection for more variety in presentation order
    finalSelection = shuffleArray(finalSelection);
    
    // Ensure we have exactly 'count' questions
    if (finalSelection.length < count) {
        // Fill from any available questions we haven't selected yet
        const selectedIndices = new Set(finalSelection.map(q => q.originalIndex));
        const remaining = availableQuestions.filter(q => !selectedIndices.has(q.originalIndex));
        const shuffledRemaining = shuffleArray(remaining);
        finalSelection.push(...shuffledRemaining.slice(0, count - finalSelection.length));
    } else {
        finalSelection = finalSelection.slice(0, count);
    }
    
    // Update recent questions tracking (keep last 10-15 questions asked)
    const selectedIndices = finalSelection.map(q => q.originalIndex);
    recentQuestions[section] = [...recentQuestions[section], ...selectedIndices];
    // Keep only the last 15 questions to avoid repeats
    if (recentQuestions[section].length > 15) {
        recentQuestions[section] = recentQuestions[section].slice(-15);
    }
    
    // Remove the originalIndex property before returning
    return finalSelection.map(({ originalIndex, ...q }) => q);
}

// Game Functions

function initializeGame(section) {
    gameState.currentSection = section;
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.totalQuestions = 0;
    gameState.correctAnswers = 0;
    gameState.selectedAnswer = null;
    
    // Select questions based on skill level (~5 questions)
    const allQuestions = questionBanks[section];
    gameState.questions = selectQuestionsBySkill(allQuestions, section, CONFIG.QUESTIONS_PER_RUN);
    
    // Show game interface
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-interface').classList.remove('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    
    updateScoreDisplay();
    loadQuestion();
}

function loadQuestion() {
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        endSection();
        return;
    }
    
    const question = gameState.questions[gameState.currentQuestionIndex];
    gameState.selectedAnswer = null;
    
    // Update question counter
    document.getElementById('question-progress').textContent = 
        `Question ${gameState.currentQuestionIndex + 1} of ${gameState.questions.length}`;
    
    // Update section name
    document.getElementById('current-section-name').textContent = sectionNames[gameState.currentSection];
    
    // Clear feedback
    const feedbackEl = document.getElementById('feedback');
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    
    // Show/hide buttons appropriately
    const checkBtn = document.getElementById('check-answer-btn');
    const checkChiBtn = document.getElementById('check-chi-squared-btn');
    const nextBtn = document.getElementById('next-question-btn');
    
    if (nextBtn) nextBtn.classList.add('hidden');
    
    // Handle Chi-squared questions differently
    if (question.type === 'chi-squared') {
        displayChiSquaredQuestion(question);
        if (checkChiBtn) checkChiBtn.classList.remove('hidden');
        if (checkBtn) checkBtn.classList.add('hidden');
    } else {
        displayMultipleChoiceQuestion(question);
        if (checkBtn) checkBtn.classList.remove('hidden');
        if (checkChiBtn) checkChiBtn.classList.add('hidden');
    }
    
    // Start timer
    startTimer(question.timeLimit || CONFIG.DEFAULT_TIME_MULTIPLE_CHOICE);
}

function nextQuestion() {
    gameState.currentQuestionIndex++;
    
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        endSection();
    } else {
        loadQuestion();
    }
}

function displayMultipleChoiceQuestion(question) {
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('answer-options');
    optionsContainer.innerHTML = '';
    optionsContainer.classList.remove('hidden');
    
    question.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'answer-option';
        optionEl.textContent = option;
        optionEl.onclick = () => selectAnswer(optionEl, index);
        optionEl.style.pointerEvents = 'auto'; // Re-enable clicking
        optionsContainer.appendChild(optionEl);
    });
    
    // Hide Chi-squared container
    document.getElementById('chi-squared-input').classList.add('hidden');
    document.getElementById('check-answer-btn').classList.remove('hidden');
}

function displayChiSquaredQuestion(question) {
    document.getElementById('question-text').textContent = question.question;
    
    // Hide multiple choice options
    document.getElementById('answer-options').classList.add('hidden');
    document.getElementById('check-answer-btn').classList.add('hidden');
    
    // Show Chi-squared container
    const chiContainer = document.getElementById('chi-squared-input');
    chiContainer.classList.remove('hidden');
    
    // Populate table
    const tableContainer = document.getElementById('chi-squared-table');
    tableContainer.innerHTML = `
        <table class="chi-squared-table">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Observed</th>
                    <th>Expected</th>
                </tr>
            </thead>
            <tbody id="chi-squared-tbody">
            </tbody>
        </table>
    `;
    
    const tbody = document.getElementById('chi-squared-tbody');
    tbody.innerHTML = '';
    
    question.data.categories.forEach((category, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category}</td>
            <td>${question.data.observed[index]}</td>
            <td>${question.data.expected[index]}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Clear and re-enable input fields
    const chiValueInput = document.getElementById('chi-squared-value');
    const dfInput = document.getElementById('degrees-freedom');
    chiValueInput.value = '';
    dfInput.value = '';
    chiValueInput.disabled = false;
    dfInput.disabled = false;
}

function selectAnswer(element, value) {
    // Remove previous selection
    document.querySelectorAll('.answer-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Select current option
    element.classList.add('selected');
    gameState.selectedAnswer = value;
}

function startTimer(seconds) {
    // Clear existing timer
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    gameState.timeRemaining = seconds;
    updateTimerDisplay();
    
    gameState.timer = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();
        
        if (gameState.timeRemaining <= 0) {
            clearInterval(gameState.timer);
            // Auto-submit wrong answer
            submitAnswer(true);
        }
    }, 1000);
    
    gameState.questionStartTime = Date.now();
}

function updateTimerDisplay() {
    const timerEl = document.getElementById('timer-display');
    timerEl.textContent = formatTime(gameState.timeRemaining);
    
    // Add warning class when time is low
    if (gameState.timeRemaining <= CONFIG.TIMER_WARNING_THRESHOLD) {
        timerEl.classList.add('timer-warning');
    } else {
        timerEl.classList.remove('timer-warning');
    }
}

function stopTimer() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
}

function submitAnswer(timeout = false) {
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    
    if (!timeout) {
        // Check if answer is selected/entered
        if (currentQuestion.type === 'chi-squared') {
            const chiValue = parseFloat(document.getElementById('chi-squared-value').value);
            const df = parseInt(document.getElementById('degrees-freedom').value);
            
            if (isNaN(chiValue) || isNaN(df)) {
                alert('Please enter both χ² value and degrees of freedom');
                return;
            }
        } else {
            if (gameState.selectedAnswer === null) {
                alert('Please select an answer');
                return;
            }
        }
    }
    
    stopTimer();
    const feedbackEl = document.getElementById('feedback');
    let isCorrect = false;
    
    gameState.totalQuestions++;
    
    // Check answer
    if (currentQuestion.type === 'chi-squared') {
        const chiValue = parseFloat(document.getElementById('chi-squared-value').value) || 0;
        const df = parseInt(document.getElementById('degrees-freedom').value) || 0;
        
        const chiCorrect = Math.abs(chiValue - currentQuestion.correctChiSquared) <= currentQuestion.tolerance;
        const dfCorrect = df === currentQuestion.correctDF;
        isCorrect = chiCorrect && dfCorrect;
        
        if (!isCorrect) {
            // Enhanced detailed feedback for Chi-squared
            let chiFeedback = '';
            let dfFeedback = '';
            
            if (!chiCorrect) {
                chiFeedback = `Your χ² value of ${chiValue.toFixed(2)} is incorrect. `;
            }
            if (!dfCorrect) {
                dfFeedback = `Your degrees of freedom of ${df} is incorrect. `;
            }
            
            feedbackEl.innerHTML = `
                <strong>Incorrect</strong><br><br>
                <strong>Your answer:</strong> χ² = ${chiValue.toFixed(2)}, df = ${df}<br><br>
                <strong>Correct answer:</strong> χ² = ${currentQuestion.correctChiSquared.toFixed(2)}, df = ${currentQuestion.correctDF}<br><br>
                ${chiFeedback}${dfFeedback}<strong>Explanation:</strong> ${currentQuestion.explanation}
            `;
            feedbackEl.className = 'feedback incorrect';
        } else {
            feedbackEl.innerHTML = '<strong>Correct!</strong><br><br>' + currentQuestion.explanation;
            feedbackEl.className = 'feedback correct';
        }
    } else {
        // Multiple choice
        if (timeout) {
            isCorrect = false;
        } else {
            isCorrect = gameState.selectedAnswer === currentQuestion.correct;
        }
        
        if (isCorrect) {
            feedbackEl.innerHTML = '<strong>Correct!</strong><br>' + currentQuestion.explanation;
            feedbackEl.className = 'feedback correct';
            gameState.correctAnswers++;
            gameState.score += 10;
        } else {
            const correctOption = currentQuestion.options[currentQuestion.correct];
            let selectedOption = '';
            
            if (timeout) {
                selectedOption = 'No answer was selected (time expired)';
            } else {
                selectedOption = currentQuestion.options[gameState.selectedAnswer] || 'Unknown answer';
            }
            
            // Enhanced detailed feedback
            feedbackEl.innerHTML = `
                <strong>Incorrect</strong><br><br>
                <strong>Your answer:</strong> ${selectedOption}<br><br>
                <strong>Correct answer:</strong> ${correctOption}<br><br>
                <strong>Explanation:</strong> ${currentQuestion.explanation}
            `;
            feedbackEl.className = 'feedback incorrect';
        }
    }
    
    if (isCorrect && currentQuestion.type !== 'chi-squared') {
        // Already incremented above
    } else if (isCorrect && currentQuestion.type === 'chi-squared') {
        gameState.correctAnswers++;
        gameState.score += 10;
    }
    
    updateScoreDisplay();
    
    // Hide check answer button, show next question button
    const checkBtn = document.getElementById('check-answer-btn');
    const checkChiBtn = document.getElementById('check-chi-squared-btn');
    const nextBtn = document.getElementById('next-question-btn');
    
    if (checkBtn) checkBtn.classList.add('hidden');
    if (checkChiBtn) checkChiBtn.classList.add('hidden');
    if (nextBtn) nextBtn.classList.remove('hidden');
    
    // Disable answer options after submission
    const options = document.querySelectorAll('.answer-option');
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Disable chi-squared inputs
    const chiInputs = document.querySelectorAll('#chi-squared-value, #degrees-freedom');
    chiInputs.forEach(input => {
        input.disabled = true;
    });
}

function nextQuestion() {
    gameState.currentQuestionIndex++;
    
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        endSection();
    } else {
        loadQuestion();
    }
}


function updateScoreDisplay() {
    document.getElementById('score-display').textContent = gameState.score;
}

function endSection() {
    stopTimer();
    
    // Hide game interface
    document.getElementById('game-interface').classList.add('hidden');
    
    // Show results screen
    document.getElementById('results-screen').classList.remove('hidden');
    
    // Calculate and display results
    const accuracy = gameState.totalQuestions > 0 
        ? (gameState.correctAnswers / gameState.totalQuestions) 
        : 0;
    const accuracyPercent = Math.round(accuracy * 100);
    
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('final-correct').textContent = `${gameState.correctAnswers}/${gameState.totalQuestions}`;
    document.getElementById('final-accuracy').textContent = accuracyPercent + '%';
    
    // Update skill level based on session performance
    if (gameState.currentSection) {
        const newSkill = updateSkillLevel(gameState.currentSection, accuracy);
        // Update skill display on main menu
        updateSkillBars();
    }
    
    // Save progress
    saveProgress();
}


function returnToMenu() {
    stopTimer();
    
    document.getElementById('game-interface').classList.add('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    
    updateMainMenuProgress(); // This now includes updateSkillBars()
}

function retrySection() {
    if (gameState.currentSection) {
        initializeGame(gameState.currentSection);
    }
}

// Progress Management

function saveProgress() {
    const section = gameState.currentSection;
    if (!section) return;
    
    const accuracy = gameState.totalQuestions > 0 
        ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) 
        : 0;
    
    // Load existing progress
    let progress = {};
    try {
        const saved = localStorage.getItem('apBioProgress');
        if (saved) {
            progress = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Error loading progress:', e);
    }
    
    // Update section progress
    if (!progress[section]) {
        progress[section] = {
            completed: false,
            bestAccuracy: 0,
            bestScore: 0,
            timesPlayed: 0
        };
    }
    
    const sectionProgress = progress[section];
    
    // Check if section was completed (all questions answered)
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        sectionProgress.completed = true;
    }
    
    // Update best scores
    if (accuracy > sectionProgress.bestAccuracy) {
        sectionProgress.bestAccuracy = accuracy;
    }
    if (gameState.score > sectionProgress.bestScore) {
        sectionProgress.bestScore = gameState.score;
    }
    
    sectionProgress.timesPlayed++;
    
    // Save to localStorage
    try {
        localStorage.setItem('apBioProgress', JSON.stringify(progress));
        
        // Update overall stats
        let overallStats = { totalQuestions: 0, totalCorrect: 0 };
        try {
            const saved = localStorage.getItem('apBioOverallStats');
            if (saved) {
                overallStats = JSON.parse(saved);
            }
        } catch (e) {}
        
        overallStats.totalQuestions += gameState.totalQuestions;
        overallStats.totalCorrect += gameState.correctAnswers;
        localStorage.setItem('apBioOverallStats', JSON.stringify(overallStats));
    } catch (e) {
        console.error('Error saving progress:', e);
    }
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('apBioProgress');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error('Error loading progress:', e);
    }
    return {};
}

function updateSkillBars() {
    // Update skill bars for all sections
    Object.keys(sectionNames).forEach(section => {
        const skill = getSkillLevel(section);
        const skillInfo = getSkillLevelName(skill);
        
        const skillFill = document.getElementById(`skill-fill-${section}`);
        const skillPercent = document.getElementById(`skill-percent-${section}`);
        const skillName = document.getElementById(`skill-name-${section}`);
        
        if (skillFill && skillPercent && skillName) {
            skillFill.style.width = skill + '%';
            skillPercent.textContent = Math.round(skill) + '%';
            skillName.textContent = skillInfo.name;
            
            // Update color based on skill level
            skillFill.className = `skill-bar-fill skill-${skillInfo.color}`;
        }
    });
}

function updateMainMenuProgress() {
    const progress = loadProgress();
    
    // Update skill bars
    updateSkillBars();
    
    // Update overall stats
    let totalQuestions = 0;
    let totalCorrect = 0;
    let sectionsCompleted = 0;
    
    Object.values(sectionNames).forEach((name, index) => {
        const section = Object.keys(sectionNames)[index];
        if (progress[section]) {
            if (progress[section].completed) sectionsCompleted++;
        }
    });
    
    if (progress.total) {
        totalQuestions = progress.total.questionsAnswered || 0;
        // Calculate overall accuracy from all sections
        let totalAttempts = 0;
        let totalCorrectAnswers = 0;
        Object.values(progress).forEach(section => {
            if (section && typeof section === 'object' && section.bestAccuracy !== undefined) {
                // Estimate from best accuracy (approximation)
                totalAttempts++;
            }
        });
    }
    
    document.getElementById('sections-completed').textContent = `${sectionsCompleted}/6`;
    
    // Calculate overall stats from localStorage
    let overallQuestions = 0;
    let overallCorrect = 0;
    
    try {
        const saved = localStorage.getItem('apBioOverallStats');
        if (saved) {
            const stats = JSON.parse(saved);
            overallQuestions = stats.totalQuestions || 0;
            overallCorrect = stats.totalCorrect || 0;
        }
    } catch (e) {}
    
    document.getElementById('total-questions').textContent = overallQuestions;
    document.getElementById('correct-answers').textContent = overallCorrect;
    const accuracy = overallQuestions > 0 ? Math.round((overallCorrect / overallQuestions) * 100) : 0;
    document.getElementById('accuracy').textContent = accuracy + '%';
}

// Unit Selection Functions

function showUnitSelection() {
    document.getElementById('unit-selection').classList.remove('hidden');
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-interface').classList.add('hidden');
    document.getElementById('results-screen').classList.add('hidden');
}

function showMainMenu(unitNumber) {
    // Check if unit is available
    const availableUnits = [2]; // Currently only Unit 2 is available
    
    if (!availableUnits.includes(unitNumber)) {
        alert('This unit is coming soon!');
        return;
    }
    
    // Update header based on unit
    const unitTitles = {
        1: 'Unit 1: Chemistry of Life',
        2: 'Unit 2: Cell Structure and Function',
        3: 'Unit 3: Cellular Energetics',
        4: 'Unit 4: Cell Communication and Cell Cycle',
        5: 'Unit 5: Heredity',
        6: 'Unit 6: Gene Expression and Regulation',
        7: 'Unit 7: Natural Selection',
        8: 'Unit 8: Ecology'
    };
    
    document.querySelector('#main-menu header h1').textContent = unitTitles[unitNumber] || `Unit ${unitNumber}`;
    
    // Show main menu, hide unit selection
    document.getElementById('unit-selection').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    
    // Store current unit
    gameState.currentUnit = unitNumber;
    
    // Update progress display
    updateMainMenuProgress();
}

// Event Listeners

document.addEventListener('DOMContentLoaded', function() {
    // Unit card clicks
    document.querySelectorAll('.unit-card').forEach(card => {
        card.addEventListener('click', function() {
            const unitNumber = parseInt(this.getAttribute('data-unit'));
            if (!this.classList.contains('disabled')) {
                showMainMenu(unitNumber);
            }
        });
    });
    
    // Back to units button
    document.getElementById('back-to-units-btn').addEventListener('click', showUnitSelection);
    
    // Section card clicks
    document.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            initializeGame(section);
        });
    });
    
    // Submit answer buttons
    document.getElementById('check-answer-btn').addEventListener('click', () => submitAnswer(false));
    document.getElementById('check-chi-squared-btn').addEventListener('click', () => submitAnswer(false));
    
    // Next question button
    document.getElementById('next-question-btn').addEventListener('click', nextQuestion);
    
    // Exit game button
    document.getElementById('exit-game-btn').addEventListener('click', returnToMenu);
    
    // Enter key for Chi-squared inputs
    document.getElementById('chi-squared-value').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') submitAnswer(false);
    });
    document.getElementById('degrees-freedom').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') submitAnswer(false);
    });
    
    // Results screen buttons
    document.getElementById('retry-btn').addEventListener('click', retrySection);
    document.getElementById('menu-btn').addEventListener('click', returnToMenu);
    
    // Initialize: Show unit selection by default
    showUnitSelection();
    
    // Load and display progress (will be called when a unit is selected)
    // Also update skill bars when main menu loads
    updateSkillBars();
});

