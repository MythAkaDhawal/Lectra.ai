import type { LLMProvider, GeneratedNotes } from "./index";

const MOCK_RESPONSE: GeneratedNotes = {
  title: "Introduction to Photosynthesis",
  notes: [
    {
      heading: "What is Photosynthesis?",
      bullets: [
        "Process by which plants, algae, and bacteria convert light energy into chemical energy",
        "Occurs primarily in chloroplasts of plant cells",
        "Produces glucose stored as chemical energy",
      ],
    },
    {
      heading: "Light-Dependent Reactions",
      bullets: [
        "Take place in the thylakoid membranes",
        "Chlorophyll absorbs sunlight to drive photolysis (splitting of water)",
        "Oxygen is released as a byproduct",
        "ATP and NADPH are produced for use in the Calvin Cycle",
      ],
    },
    {
      heading: "The Calvin Cycle (Light-Independent Reactions)",
      bullets: [
        "Occurs in the stroma of the chloroplast",
        "RuBisCO enzyme fixes CO₂ with RuBP (5-carbon molecule)",
        "ATP and NADPH are consumed to produce glucose",
      ],
    },
    {
      heading: "Photosynthetic Pathways",
      bullets: [
        "C3 plants: standard pathway, most common",
        "C4 plants (corn, sugarcane): more efficient at high temperatures",
        "CAM plants: adapted for arid environments, fix CO₂ at night",
      ],
    },
  ],
  summary:
    "Photosynthesis is the biological process by which plants and other autotrophs convert light energy into chemical energy stored as glucose. It consists of two main stages: the light-dependent reactions (which produce ATP, NADPH, and O₂) and the Calvin Cycle (which uses these to fix CO₂ into sugar). Different plant types have evolved distinct photosynthetic strategies to adapt to varying environmental conditions.",
  keyTakeaways: [
    "Photosynthesis is fundamental to almost all food chains on Earth",
    "Light reactions occur in thylakoids; Calvin Cycle in the stroma",
    "Oxygen released by photosynthesis comes from the splitting of water",
    "C4 and CAM plants are more efficient in hot or dry climates",
    "RuBisCO is the key enzyme that fixes atmospheric CO₂ into organic compounds",
  ],
  mermaid: `flowchart LR
    A[Sunlight] --> B[Light Reactions]
    C[Water H2O] --> B
    B --> D[ATP + NADPH]
    B --> E[O2 Released]
    D --> F[Calvin Cycle]
    G[CO2] --> F
    F --> H[Glucose]
    H --> I[Plant Energy]`,
};

export class MockLLMProvider implements LLMProvider {
  name = "Mock (no API key)";

  async generateNotes(_transcript: string, _topic?: string): Promise<GeneratedNotes> {
    // Simulate realistic generation time
    await new Promise((r) => setTimeout(r, 1800));
    return MOCK_RESPONSE;
  }
}
