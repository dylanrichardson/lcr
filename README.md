# LCR Markov Chain Visualizer

An interactive visualization tool for exploring the Left Center Right (LCR) dice game as a Markov chain. Watch the game play out in real-time while seeing the complete state space and probability transitions.

🎮 **[Live Demo](https://dylanrichardson.github.io/lcr/)** (Update this URL after deployment)

![LCR Markov Chain Visualization](screenshot.png) *(Add a screenshot after deploying)*

## What is LCR?

Left Center Right (LCR) is a simple dice game where:
- Players start with chips and take turns rolling up to 3 dice
- **L** = pass chip to player on the left
- **R** = pass chip to player on the right
- **C** = put chip in the center pot
- **• (dot)** = keep the chip
- Last player with chips wins

Despite its simplicity, the game has surprisingly complex probability dynamics!

## Features

### 🎲 Interactive Game Simulation
- Play the game turn-by-turn or auto-play
- Adjustable animation speed
- Visual chip movements and dice rolls
- Complete game log with state transitions

### 📊 Complete Markov Chain Visualization
- **Circular group layout**: Nodes grouped by total chips remaining
- **Color-coded states**:
  - 🔵 Blue = current game state
  - 🟢 Green = winning states (terminal)
  - ⚪ Gray = other reachable states
  - 🟢🔵 Blue/Green = current winning state
- **Edge coloring**:
  - 🟡 Yellow arrows = possible transitions from current state
  - 🔴 Red arrows = path taken through the game (persists)
- **Animated transitions**: Red marker flies along edges as moves happen

### 📈 Probability Analysis
- Real-time transitions table showing:
  - All possible next states
  - Dice roll combinations (e.g., "LCD", "RDD")
  - Transition probabilities
- Hover over edges to see:
  - Specific dice roll that leads to that state
  - Probability percentage
- Complete state space exploration (BFS algorithm)

### 🎯 Smart Layout
- **Left-to-right flow**: States organized by chip count (most → least)
- **Circular groups**: Nodes arranged in circles within each chip-count group
- **Winning states separated**: Terminal states grouped at bottom
- **Prevents backward flow**: Transitions only move right (chips can't return)

## How to Use

### Basic Controls
1. **New Game**: Set number of players (2-6) and starting chips (1-10)
2. **Next Turn**: Advance one turn and see the state transition
3. **Auto Play**: Watch the game play automatically
4. **Stop**: Pause auto-play at any time

### Graph Interaction
- **Pan**: Click and drag the background
- **Zoom**: Mouse wheel or pinch on trackpad
- **Hover over nodes**: See state details
- **Hover over edges**: See dice roll and probability
- **Click edges/nodes**: Select and highlight them

### Understanding the Visualization

#### State Format
States are shown as: `3,2,1 | P2`
- `3,2,1` = chip counts for each player
- `P2` = whose turn it is

#### Reading the Graph
- **Vertical columns** = groups of states with same total chips
- **Circles within columns** = states with equal chip count
- **Yellow arrows** = possible moves from current state (with probabilities)
- **Red arrows** = actual path your game took

#### Transitions Table
Shows all possible next states from current position:
- **Next State**: Resulting chip distribution
- **Dice**: Roll combinations that lead there (e.g., "LCD, LDC, CLD")
- **Prob**: Probability of that transition

## Technical Details

### State Space Exploration
- Uses Breadth-First Search (BFS) to explore all reachable states
- Calculates exact probabilities using multinomial distribution
- Handles state merging (multiple rolls → same state)
- Warning at 5000 states (recommend reducing players/chips)

### Probability Calculation
Probabilities calculated using the multinomial distribution:

```
P(L=l, R=r, C=c, D=d) = (n! / (l! × r! × c! × d!)) × (1/6)^(l+r+c) × (1/2)^d
```

where:
- `n` = number of dice rolled
- `l, r, c` = count of L, R, C
- `d` = count of dots (keep chips)
- Each L/R/C face has probability 1/6
- Three dot faces give probability 1/2 for dots

### Canonical Roll Notation
Rolls are shown in canonical form: `L's, R's, C's, D's`
- Example: `L:2, R:0, C:1` → **"LLC"**
- Example: `L:0, R:1, C:0` (3 dice) → **"RDD"**

### Technology Stack
- **Cytoscape.js**: Graph visualization and interaction
- **Vanilla JavaScript**: Game logic and state management
- **HTML5 Canvas**: Dice roll animations and visual effects
- **Single HTML file**: No build process required

## Project Structure

```
lcr/
├── index.html                 # Main application (self-contained)
├── README.md                  # This file
├── VISUALIZATION_IDEAS.md     # Future enhancement ideas
└── screenshot.png            # (Add after deploying)
```

## Installation & Deployment

### Run Locally
Simply open `index.html` in a modern web browser. No server required!

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/lcr.git
cd lcr

# Open in browser
open index.html  # macOS
# or
start index.html  # Windows
# or
xdg-open index.html  # Linux
```

### Deploy to GitHub Pages

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Click Save

3. **Access your site**:
   - URL will be: `https://YOUR_USERNAME.github.io/lcr/`
   - Takes a few minutes to deploy

## Browser Compatibility

Works in all modern browsers:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

**Note**: Requires JavaScript enabled.

## Configuration Options

Adjustable parameters in the game:
- **Number of Players**: 2-6 (default: 2)
- **Starting Chips**: 1-10 per player (default: 1)
- **Animation Speed**: 50ms-500ms (default: 200ms)

**Performance tip**: Keep players × chips ≤ 6 for best performance
- 2 players × 3 chips = fast
- 3 players × 3 chips = moderate
- 4 players × 2 chips = moderate
- 4 players × 3 chips = slow (1000+ states)

## Future Enhancements

See [VISUALIZATION_IDEAS.md](VISUALIZATION_IDEAS.md) for detailed ideas including:

- 📊 Sankey diagram view for probability flow
- 🎯 Radial/sunburst layout
- 🌳 Tree of most probable paths
- 📈 Matrix/heatmap view
- 🎬 Time-based animation replay
- 📱 Mobile optimization
- ♿ Accessibility improvements
- 🔌 Plugin system for custom visualizations

**Contributions welcome!** Open an issue to discuss new features.

## Educational Use

This tool is great for:
- **Probability Theory**: Understanding Markov chains and state spaces
- **Game Theory**: Analyzing zero-sum games and terminal states
- **Computer Science**: Graph algorithms, BFS, state space search
- **Mathematics**: Discrete probability distributions
- **Data Visualization**: Interactive graph rendering techniques

## Use Cases

- **Teaching**: Demonstrate Markov chains with a fun, tangible example
- **Analysis**: Understand LCR strategy and winning probabilities
- **Research**: Explore state space growth and complexity
- **Visualization**: Learn graph layout algorithms
- **Game Design**: Analyze dice game mechanics

## Performance Notes

### State Space Size
State space grows combinatorially with players and chips:

| Players × Chips | Approximate States |
|-----------------|-------------------|
| 2 × 1 | ~10 |
| 2 × 2 | ~40 |
| 2 × 3 | ~100 |
| 3 × 2 | ~150 |
| 3 × 3 | ~700 |
| 4 × 2 | ~500 |
| 4 × 3 | ~5,000 |

**Warning**: 4+ players with 3+ chips may exceed browser limits.

### Optimization Techniques
- Efficient state hashing using string keys
- BFS with early termination at state limit
- CSS-based highlighting (no graph rebuild)
- Preset layout for deterministic positioning

## Known Limitations

- Maximum ~5000 states (browser memory limit)
- Large graphs may be slow to render
- No mobile-optimized layout yet
- Single-page app (no routing/state preservation)
- English only

## Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/your-idea`
3. **Make changes** and test thoroughly
4. **Commit**: `git commit -m "Add your feature"`
5. **Push**: `git push origin feature/your-idea`
6. **Open a Pull Request** with description

### Areas for Contribution
- 🐛 Bug fixes
- 📱 Mobile optimization
- ♿ Accessibility improvements
- 🌍 Internationalization
- 📊 New visualization modes
- 🎨 UI/UX improvements
- 📚 Documentation
- 🧪 Test coverage

## License

MIT License - feel free to use, modify, and distribute!

See [LICENSE](LICENSE) file for details.

## Credits

**Created by**: Dylan Richardson

**Built with**:
- [Cytoscape.js](https://js.cytoscape.org/) - Graph visualization library
- [Claude](https://claude.ai) - AI assistant for development

**Inspired by**: The classic LCR dice game and the desire to understand its probability mechanics through visualization.

## Changelog

### v1.0.0 (Current)
- ✨ Interactive game simulation with animations
- 📊 Complete Markov chain state space visualization
- 🎯 Circular group layout organized by chip count
- 🔴 Path tracking showing moves taken through state space
- 📈 Real-time probability transitions table
- 🎨 Color-coded states and animated transitions
- 📝 Canonical dice roll notation (e.g., "LCD", "RDD")
- ⚡ Performance warning for large state spaces

## FAQ

**Q: What's a Markov chain?**
A: A mathematical model where future states depend only on the current state, not the history. LCR is a perfect example - your next roll's outcome depends only on current chip counts, not how you got there.

**Q: Why do some edges show "Multiple" rolls?**
A: They no longer do! We now show all possible rolls (e.g., "LCD, LDC, DLC") that lead to the same state. Hover to see them.

**Q: Can I see only high-probability paths?**
A: Not yet, but this is a planned feature! See [VISUALIZATION_IDEAS.md](VISUALIZATION_IDEAS.md).

**Q: Why does my game not match the graph?**
A: Make sure you start a new game after changing players/chips. The graph rebuilds only when configuration changes.

**Q: Can I export the graph?**
A: Not currently, but planned! For now, you can screenshot it.

**Q: How accurate are the probabilities?**
A: Exact! We calculate probabilities mathematically using the multinomial distribution, not simulation.

**Q: Can I use this for other dice games?**
A: The current code is LCR-specific, but the framework could be adapted. See "Future Research Directions" in [VISUALIZATION_IDEAS.md](VISUALIZATION_IDEAS.md).

## Support

- 🐛 **Bug Reports**: [Open an issue](https://github.com/YOUR_USERNAME/lcr/issues)
- 💡 **Feature Requests**: [Open an issue](https://github.com/YOUR_USERNAME/lcr/issues)
- 📧 **Contact**: dylan.richardson@example.com (Update with your contact)
- ⭐ **Star this repo** if you find it useful!

## Acknowledgments

Thanks to:
- Everyone who's played LCR and wondered "what are the odds?"
- The Cytoscape.js team for an excellent graph library
- The open source community for inspiration and tools

---

**Made with ❤️ and a lot of dice rolls**

[⬆ Back to top](#lcr-markov-chain-visualizer)
