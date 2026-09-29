/**
 * Shiva Das Portfolio — Core Orchestrator
 */

import { SceneManager } from './three-scene.js';
import { AnimationManager } from './animations.js';
import { InteractionManager } from './interactions.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize visual systems
  const sceneManager = new SceneManager();
  const animationManager = new AnimationManager();
  const interactionManager = new InteractionManager();

  // Expose to window for debugging or extensions
  window.portfolioApp = {
    scenes: sceneManager,
    animations: animationManager,
    interactions: interactionManager
  };
});
