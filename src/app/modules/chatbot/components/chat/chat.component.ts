import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  aiResponse: any = `<div class="markdown prose w-full break-words dark:prose-invert light"><p>Sure! Here’s a more concise and formatted version with bullets and an ordered list:</p><hr><h3>Overview of Renewable Energy</h3><p>Renewable energy refers to energy sourced from natural processes that are constantly replenished, such as sunlight, wind, and water. It’s vital for reducing greenhouse gas emissions and mitigating climate change.</p><h3>Key Points:</h3><ul><li><strong>Types of Renewable Energy</strong>: Solar, wind, hydropower, biomass, and geothermal.</li><li><strong>Benefits</strong>: Reduces environmental pollution, sustainable, low operational costs.</li></ul><h3>Historical Background</h3><ul><li><strong>Early Use</strong>: Windmills and water wheels used for centuries.</li><li><strong>Modern Movement</strong>: Gained momentum in the 1970s due to oil crises and environmental concerns.</li></ul><h3>Key Developments and Trends:</h3><ol><li><strong>Technological Advancements</strong>: Solar and wind energy costs have dropped significantly.</li><li><strong>Global Adoption</strong>: Leading countries like Germany, China, and the U.S. are major players.</li><li><strong>Emerging Trends</strong>: Energy storage solutions and smart grids.</li></ol><h3>Challenges and Debates</h3><ul><li><strong>Intermittency</strong>: Renewable sources depend on weather, requiring better storage.</li><li><strong>Environmental Impact</strong>: Manufacturing and disposal of tech (e.g., batteries) raises concerns.</li><li><strong>Land Use</strong>: Expanding renewable energy infrastructure needs space, potentially impacting ecosystems.</li></ul><h3>Notable Examples</h3><ul><li><strong>Solar</strong>: Noor Solar Complex, Morocco.</li><li><strong>Wind</strong>: Hornsea Project, UK.</li><li><strong>Hydropower</strong>: Three Gorges Dam, China.</li></ul><hr><p>This format is more concise, using bullets and an ordered list for easy reference while keeping a professional and structured appearance. Let me know if you'd like to adjust anything further!</p></div>`;

  adjustTextareaHeight(event: any): void {
    const textarea = event.target;
    const lineHeight = 24;
    const maxLines = 5;
    const maxHeight = lineHeight * maxLines;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = newHeight + 'px';
  }
}
