/**********************************************
 * STARTER CODE - Shuffle Function
 **********************************************/
function shuffle(src) {
  const copy = [...src];
  const length = copy.length;
  for (let i = 0; i < length; i++) {
    const x = copy[i];
    const y = Math.floor(Math.random() * length);
    const z = copy[y];
    copy[i] = z;
    copy[y] = x;
  }
  return typeof src === "string" ? copy.join("") : copy;
}

/**********************************************
 * SCRAMBLE GAME
 **********************************************/

function ScrambleGame() {
  const wordList = [
    "bridge", "castle", "orange", "treasure", "goblin", 
    "voyage", "shadow", "puzzle", "victory", "lantern", "dagger", "vortex", "zeppelin", "gargoyle", "sentinel", "crimson", "runestone", "catapult", "sanctuary",
    "flabbergasted", "questing", "quixotic", "cipher", "furnace", "ranger", "pinnacle", "fabled", "anvil", "phoenix", "glisten", "captain", "summit", "scepter"
  ];


  // Load saved game state or initialize a new one
  const initialState = JSON.parse(localStorage.getItem("scrambleGame")) || {
    words: shuffle([...wordList]),
    currentWord: "",
    correctWord: "",
    score: 0,
    strikes: 0,
    passes: 3,
    gameOver: false,
  };

  const [words, setWords] = React.useState(initialState.words);
  const [currentWord, setCurrentWord] = React.useState(initialState.currentWord);
  const [correctWord, setCorrectWord] = React.useState(initialState.correctWord);
  const [score, setScore] = React.useState(initialState.score);
  const [strikes, setStrikes] = React.useState(initialState.strikes);
  const [passes, setPasses] = React.useState(initialState.passes);
  const [gameOver, setGameOver] = React.useState(initialState.gameOver);
  const [userInput, setUserInput] = React.useState("");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (words.length > 0) {
      const word = words[0];
      setCorrectWord(word);
      setCurrentWord(shuffle(word));
    } else {
      setGameOver(true);
    }
  }, [words]);

  React.useEffect(() => {
    localStorage.setItem("scrambleGame", JSON.stringify({
      words, currentWord, correctWord, score, strikes, passes, gameOver
    }));
  }, [words, currentWord, correctWord, score, strikes, passes, gameOver]);

  function handleGuess(event) {
    event.preventDefault();
    if (userInput.toLowerCase() === correctWord) {
      setMessage("Correct!");
      setScore(score + 1);
      setWords(words.slice(1));
    } else {
      setMessage("Incorrect!");
      setStrikes(strikes + 1);
      if (strikes + 1 >= 3) {
        setGameOver(true);
      }
    }
    setUserInput("");
  }

  function handlePass() {
    if (passes > 0) {
      setPasses(passes - 1);
      setWords(words.slice(1));
      setMessage("Word Skipped!");
    }
  }

  function restartGame() {
    setWords(shuffle([...wordList]));
    setScore(0);
    setStrikes(0);
    setPasses(3);
    setGameOver(false);
    setMessage("");
    setUserInput("");
    localStorage.removeItem("scrambleGame");
  }

  return (
    <div className="container">
      <h1>Scramble Game</h1>
      {gameOver ? (
        <div>
          <p className="game-over">Game Over!</p>
          <p>Final Score: {score}</p>
          <button className="restart-button" onClick={restartGame}>Play Again</button>
        </div>
      ) : (
        <div>
          <p>Score: {score} | Strikes: {strikes}/3 | Passes: {passes}</p>
          <p className="scrambled-word">{currentWord}</p>
          <form onSubmit={handleGuess}>
            <input 
              type="text" 
              value={userInput} 
              onChange={(e) => setUserInput(e.target.value)} 
              disabled={gameOver}
              required 
            />
            <button type="submit">Guess</button>
          </form>
          <button className="pass-button" onClick={handlePass} disabled={passes === 0}>Pass</button>
          <p className={message === "Correct!" ? "correct" : "incorrect"}>{message}</p>
        </div>
      )}
    </div>
  );
}

// Render the React App
ReactDOM.createRoot(document.getElementById("root")).render(<ScrambleGame />);
