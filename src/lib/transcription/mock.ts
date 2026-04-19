import type { TranscriptionProvider, TranscriptionResult } from "./index";

const MOCK_TRANSCRIPT = `
Good morning, everyone. Today we're going to explore photosynthesis — one of the most
fundamental processes in biology. Photosynthesis is the process by which plants, algae, and
certain bacteria convert light energy, usually from the sun, into chemical energy stored in
glucose. This happens primarily in the chloroplasts of plant cells.

There are two main stages: the light-dependent reactions and the light-independent reactions,
also called the Calvin Cycle. In the light-dependent stage, sunlight is absorbed by chlorophyll
and other pigments. This energy is used to split water molecules — a process called
photolysis — releasing oxygen as a byproduct. The energy is then captured in ATP and NADPH.

In the Calvin Cycle, which takes place in the stroma, the plant uses ATP and NADPH to fix
carbon dioxide into organic molecules. The enzyme RuBisCO catalyzes the first step, combining
CO2 with a five-carbon molecule called RuBP to form two three-carbon molecules. These are
eventually used to produce glucose, which the plant uses for energy and building materials.

There are also different photosynthetic pathways — C3, C4, and CAM plants — that have evolved
to handle different environmental conditions, particularly different amounts of water and light.
C4 plants like corn and sugarcane are more efficient at high temperatures.

The key takeaway is that photosynthesis uses carbon dioxide, water, and light energy to produce
glucose and oxygen. It is the foundation for almost all food chains on Earth.
`.trim();

export class MockTranscriptionProvider implements TranscriptionProvider {
  name = "Mock (no API key)";

  async transcribe(_file: File): Promise<TranscriptionResult> {
    // Simulate a realistic processing delay
    await new Promise((r) => setTimeout(r, 1200));
    return {
      transcript: MOCK_TRANSCRIPT,
      language: "en",
    };
  }
}
