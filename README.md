# Hungry Tree Friends 🌲🐼🎵

A small **rhythm clicker game** made with **HTML, JavaScript and WebGL**, was made for [**20 Second Game Jam 2025**](https://itch.io/jam/20-second-game-jam-2025) and published on itch.io.

🎮 Click or tap **in rhythm** to help forest animals eat incoming food.  
⚠️ Some items are dangerous — timing and attention matter!

---

## 🎮 Try it out
▶ **Itch.io:**  
https://ololx.itch.io/hungry-tree-friends

Runs directly in the browser (desktop & mobile).

---

## Jam Info
Created for **20 Second Game Jam 2025**  
https://itch.io/jam/20-second-game-jam-2025

---

## Gameplay
**Hungry Tree Friends** is a short-session rhythm game.

- Food flies towards the character in rhythm
- Click or tap **at the right moment** to eat it
- Build combos by keeping the rhythm
- **Red items are dangerous** — do NOT eat them

### Controls
- 🖱 **Left Mouse Click** — eat food  
- 📱 **Tap** — eat food  
- ⏭ **Do nothing** — skip food  

---

## Tech Stack
- **HTML5**
- **JavaScript (ES6 modules)**
- **WebGL**
- **Custom 2D game framework: Shiitake v0.0.1**

---

## Project Structure

```text
.
├─ game/                        # Game entry & assets
│  ├─ assets/                   # Game assets
│  │  ├─ audio/
│  │  ├─ fonts/
│  │  └─ img/
|  ├─ src/                      # Game logic
│     ├─ cfg/
│     └─ ecs/
│  ├─ index.html
│  └─ main.js                   # Game initialization
├─ shiitake/                    # Custom 2D game framework (Shiitake v0.0.1)
│
├─ run_on_local_server.sh
├─ run_on_local_server.ps1
└─ README.md
```

---

## Run this game
▶ **Itch.io:**  
https://ololx.itch.io/hungry-tree-friends

## Local Run

> ⚠️ The game must be run via a local HTTP server.  
> Opening `index.html` via `file://` may break asset or audio loading.

### Option A — Provided Scripts (Recommended)

**macOS / Linux**
```bash
./run_on_local_server.sh
```

**Windows (PowerShell)**
```powershell
./run_on_local_server.ps1
```

Open in browser:
```
http://localhost:8080/game
```

---

### Option B — Python
```bash
python -m http.server 8080
```

Then open:
```
http://localhost:8080/game/
```

---

### Option C — Any Static Server
Any local static server will work (VS Code Live Server, Node.js, etc.).

---

## Credits
- Drum loops from [Soundpacks](https://soundpacks.com/free-sound-packs)
- Sound-effects from [Pixabay](https://pixabay.com/) and [Kenney voice pack](https://kenney.nl/assets/category:Audio?sort=update)
- Fonts  from [Fonts Online](https://fonts-online.ru/use/free)

---

## ©️ Authors

* **Alexander A. Kropotin** - [ololx](https://github.com/ololx).

## 🔏 License

This project is licensed under the MIT license - see the [lisence](LICENSE) document for details.

