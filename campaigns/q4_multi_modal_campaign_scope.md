# ETERNAL VALLEY — Q4 Multi-Modal Campaign Scope Lock

## 1. Goal
Architect, generate, and deploy a zero-defect, multi-modal marketing campaign for Eternal Valley. Leverage Veo for cinematic video assets (boutique studio quality) and Omni for high-fidelity audio/vision reasoning. The campaign must look expensive, drive high conversions ("prints money"), and dominate the target market.

## 2. Constraints & Anti-Slop Requirements
- **Zero Slop**: No stock-photo energy, no floating blobs, no "reimagine the future" copy.
- **Visuals (Veo)**: Must look like it was shot by a high-end boutique studio. No generic AI tells.
- **Interactions (Omni)**: Razor-sharp reasoning and voice/audio output.
- **No Fabricated Proof**: Do not invent stats, testimonials, or logos. Use placeholders labeled `NEED-PROOF` if necessary.
- **Aesthetic**: Neo-grotesk commerce / quiet luxury / editorial brutalism (to be defined by strategy). 

## 3. Swarm Architecture
The orchestrator will dispatch subagents following the Zero-Defect Delivery Protocol:
1. **Strategy & Creative (`unhinged-max-expert`)**: Define the campaign offer, visual aesthetic, brand voice, and specific Veo / Omni prompt sequences.
2. **Implementation (`worker` / `self`)**: Code the necessary UI/UX surfaces (landing pages, video players, Omni integration) into the Eternal Valley repository.
3. **Review & QC Gauntlet (`clinical` mode)**:
   - **Reviewer**: Check for requirements coverage and code quality.
   - **Critic**: Find edge cases, test responsiveness, and ensure no template-slop slipped in.
   - **Auditor**: Verify the build, check the final assets, and ensure zero defects before final sign-off.

## 4. Work Phases
1. **Scope Lock**: (Current Phase) Establish constraints and Swarm map.
2. **Strategy & Asset Generation**: Dispatch creative subagents to write Veo scripts, Omni logic, and campaign copy.
3. **Implementation**: Integrate assets into the web platform (new `/campaigns` routes or landing pages).
4. **QC Gauntlet**: Dispatch clinical auditors to review all surfaces.
5. **Delivery**: Present final pathways to user for approval.

## 5. Definition of Done
- Multi-modal campaign is fully staged in the repo.
- Veo video assets and Omni pathways are implemented and documented.
- The clinical auditor subagent signs off with zero defects.
- The user explicitly approves the final aesthetic and conversion pathways.
